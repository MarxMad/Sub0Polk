// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IHyperbridge.sol";

/**
 * @title DotGoUSDC
 * @dev Student portfolio platform with USDC payments and Hyperbridge cross-chain integration
 * @notice Pay-to-unlock model: $30 USDC to unlock portfolios, students get $25 USDC
 */
contract DotGoUSDC is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ==================== STATE VARIABLES ====================

    IERC20 public immutable usdc;
    IHyperbridge public hyperbridge;
    bytes32 public destinationChainId;
    bool public crossChainEnabled;

    uint256 public constant UNLOCK_PRICE = 5 * 10**6; // $5 USDC (6 decimals)
    uint256 public constant STUDENT_SHARE = 4 * 10**6; // $4 USDC
    uint256 public constant PLATFORM_FEE = 1 * 10**6; // $1 USDC

    address public platformTreasury;

    // Project counter
    uint64 private projectCounter;

    // Cross-chain message types
    bytes1 constant MSG_PROJECT_CREATED = 0x01;
    bytes1 constant MSG_PROJECT_UNLOCKED = 0x02;
    bytes1 constant MSG_REVIEW_SUBMITTED = 0x03;

    // ==================== STRUCTS ====================

    struct Project {
        uint64 id;
        address student;
        string title;
        string description;
        string githubUrl;
        string demoUrl;
        string skills;
        uint256 createdAt;
        uint256 totalUnlocks;
        uint256 totalEarnings;
        bool exists;
    }

    struct Review {
        uint64 id;
        uint64 projectId;
        address reviewer;
        uint8 rating;
        string comment;
        uint256 createdAt;
    }

    // ==================== STORAGE ====================

    mapping(uint64 => Project) public projects;
    mapping(uint64 => Review[]) public projectReviews;
    mapping(uint64 => mapping(address => bool)) public hasUnlocked;
    mapping(address => uint64[]) public studentProjects;

    // ==================== EVENTS ====================

    event ProjectCreated(
        uint64 indexed projectId,
        address indexed student,
        string title,
        uint256 timestamp
    );

    event ProjectUnlocked(
        uint64 indexed projectId,
        address indexed reviewer,
        uint256 amount,
        uint256 timestamp
    );

    event ReviewSubmitted(
        uint64 indexed projectId,
        address indexed reviewer,
        uint8 rating,
        uint256 timestamp
    );

    event CrossChainMessageSent(
        bytes32 indexed messageId,
        bytes1 msgType,
        uint64 projectId
    );

    event TreasuryUpdated(address indexed newTreasury);
    event HyperbridgeUpdated(address indexed newHyperbridge);

    // ==================== ERRORS ====================

    error InvalidTitle();
    error InvalidGithubUrl();
    error InvalidRating();
    error ProjectNotFound();
    error AlreadyUnlocked();
    error NotUnlocked();
    error InsufficientAllowance();
    error CrossChainDisabled();

    // ==================== CONSTRUCTOR ====================

    constructor(
        address _usdc,
        address _platformTreasury,
        address _hyperbridge,
        bytes32 _destinationChainId
    ) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_platformTreasury != address(0), "Invalid treasury");

        usdc = IERC20(_usdc);
        platformTreasury = _platformTreasury;
        hyperbridge = IHyperbridge(_hyperbridge);
        destinationChainId = _destinationChainId;
        crossChainEnabled = _hyperbridge != address(0);
    }

    // ==================== CORE FUNCTIONS ====================

    /**
     * @notice Create a new project portfolio
     */
    function createProject(
        string memory title,
        string memory description,
        string memory githubUrl,
        string memory demoUrl,
        string memory skills
    ) external returns (uint64 projectId) {
        if (bytes(title).length == 0) revert InvalidTitle();
        if (bytes(githubUrl).length == 0) revert InvalidGithubUrl();

        projectId = ++projectCounter;

        projects[projectId] = Project({
            id: projectId,
            student: msg.sender,
            title: title,
            description: description,
            githubUrl: githubUrl,
            demoUrl: demoUrl,
            skills: skills,
            createdAt: block.timestamp,
            totalUnlocks: 0,
            totalEarnings: 0,
            exists: true
        });

        studentProjects[msg.sender].push(projectId);

        emit ProjectCreated(projectId, msg.sender, title, block.timestamp);

        // Cross-chain sync
        if (crossChainEnabled) {
            _syncProjectCreated(projectId);
        }

        return projectId;
    }

    /**
     * @notice Unlock a project by paying $30 USDC
     */
    function unlockProject(uint64 projectId) external nonReentrant {
        Project storage project = projects[projectId];
        if (!project.exists) revert ProjectNotFound();
        if (hasUnlocked[projectId][msg.sender]) revert AlreadyUnlocked();

        // Check USDC allowance
        if (usdc.allowance(msg.sender, address(this)) < UNLOCK_PRICE) {
            revert InsufficientAllowance();
        }

        // Transfer USDC from reviewer
        usdc.safeTransferFrom(msg.sender, address(this), UNLOCK_PRICE);

        // Pay student $25 USDC
        usdc.safeTransfer(project.student, STUDENT_SHARE);

        // Pay platform fee $5 USDC
        usdc.safeTransfer(platformTreasury, PLATFORM_FEE);

        // Update state
        hasUnlocked[projectId][msg.sender] = true;
        project.totalUnlocks++;
        project.totalEarnings += STUDENT_SHARE;

        emit ProjectUnlocked(projectId, msg.sender, UNLOCK_PRICE, block.timestamp);

        // Cross-chain sync
        if (crossChainEnabled) {
            _syncProjectUnlocked(projectId, msg.sender);
        }
    }

    /**
     * @notice Submit a review for an unlocked project
     */
    function submitReview(
        uint64 projectId,
        uint8 rating,
        string memory comment
    ) external {
        Project storage project = projects[projectId];
        if (!project.exists) revert ProjectNotFound();
        if (!hasUnlocked[projectId][msg.sender]) revert NotUnlocked();
        if (rating < 1 || rating > 5) revert InvalidRating();

        Review memory review = Review({
            id: uint64(projectReviews[projectId].length),
            projectId: projectId,
            reviewer: msg.sender,
            rating: rating,
            comment: comment,
            createdAt: block.timestamp
        });

        projectReviews[projectId].push(review);

        emit ReviewSubmitted(projectId, msg.sender, rating, block.timestamp);

        // Cross-chain sync
        if (crossChainEnabled) {
            _syncReviewSubmitted(projectId, rating);
        }
    }

    // ==================== CROSS-CHAIN FUNCTIONS ====================

    function _syncProjectCreated(uint64 projectId) internal {
        Project memory project = projects[projectId];
        bytes memory data = abi.encode(
            MSG_PROJECT_CREATED,
            projectId,
            project.student,
            project.title,
            project.createdAt
        );

        bytes32 messageId = hyperbridge.sendMessage(destinationChainId, data);
        emit CrossChainMessageSent(messageId, MSG_PROJECT_CREATED, projectId);
    }

    function _syncProjectUnlocked(uint64 projectId, address reviewer) internal {
        bytes memory data = abi.encode(
            MSG_PROJECT_UNLOCKED,
            projectId,
            reviewer,
            UNLOCK_PRICE,
            block.timestamp
        );

        bytes32 messageId = hyperbridge.sendMessage(destinationChainId, data);
        emit CrossChainMessageSent(messageId, MSG_PROJECT_UNLOCKED, projectId);
    }

    function _syncReviewSubmitted(uint64 projectId, uint8 rating) internal {
        bytes memory data = abi.encode(
            MSG_REVIEW_SUBMITTED,
            projectId,
            msg.sender,
            rating,
            block.timestamp
        );

        bytes32 messageId = hyperbridge.sendMessage(destinationChainId, data);
        emit CrossChainMessageSent(messageId, MSG_REVIEW_SUBMITTED, projectId);
    }

    // ==================== VIEW FUNCTIONS ====================

    function getProject(uint64 projectId) external view returns (Project memory) {
        return projects[projectId];
    }

    function getProjectReviews(uint64 projectId) external view returns (Review[] memory) {
        return projectReviews[projectId];
    }

    function getStudentProjects(address student) external view returns (uint64[] memory) {
        return studentProjects[student];
    }

    function hasUserUnlocked(uint64 projectId, address user) external view returns (bool) {
        return hasUnlocked[projectId][user];
    }

    function getTotalProjects() external view returns (uint64) {
        return projectCounter;
    }

    // ==================== ADMIN FUNCTIONS ====================

    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        platformTreasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function updateHyperbridge(address newHyperbridge) external onlyOwner {
        hyperbridge = IHyperbridge(newHyperbridge);
        emit HyperbridgeUpdated(newHyperbridge);
    }

    function toggleCrossChain(bool enabled) external onlyOwner {
        crossChainEnabled = enabled;
    }
}
