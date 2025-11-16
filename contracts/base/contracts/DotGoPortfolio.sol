// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DotGoPortfolio
 * @dev Student portfolio platform with pay-to-unlock mechanism on Base
 * @notice This contract mirrors the Polkadot ink! contract functionality
 */
contract DotGoPortfolio is Ownable, ReentrancyGuard {
    // ==================== DATA STRUCTURES ====================

    struct Project {
        uint64 id;
        address student;
        string title;
        string description;
        string githubUrl;
        string demoUrl;
        string[] skills;
        uint256 createdAt;
        uint32 unlockCount;
        uint8 avgRating;
    }

    struct Review {
        address reviewer;
        uint8 rating;
        string comment;
        uint256 timestamp;
    }

    // ==================== STATE VARIABLES ====================

    uint64 private nextProjectId;
    address public platformTreasury;

    // Pricing in wei (Base native token)
    // Note: Will be converted from DOT pricing to ETH equivalent
    uint256 public unlockPrice = 0.001 ether; // Adjustable for Base network
    uint256 public studentShare = 0.000833 ether; // ~83.3% to student
    uint256 public platformShare = 0.000167 ether; // ~16.7% to platform

    // Storage mappings
    mapping(uint64 => Project) public projects;
    mapping(address => uint64[]) public studentProjects;
    mapping(uint64 => mapping(address => bool)) public unlocked;
    mapping(uint64 => Review[]) public reviews;

    // ==================== EVENTS ====================

    event ProjectCreated(
        uint64 indexed projectId,
        address indexed student,
        string title
    );

    event ProjectUnlocked(
        uint64 indexed projectId,
        address indexed reviewer,
        uint256 amountPaid
    );

    event ReviewSubmitted(
        uint64 indexed projectId,
        address indexed reviewer,
        uint8 rating
    );

    event PricingUpdated(
        uint256 newUnlockPrice,
        uint256 newStudentShare,
        uint256 newPlatformShare
    );

    // ==================== ERRORS ====================

    error ProjectNotFound();
    error NotUnlocked();
    error AlreadyUnlocked();
    error InsufficientPayment();
    error CannotReviewOwnProject();
    error InvalidRating();
    error TransferFailed();
    error InvalidPricing();

    // ==================== CONSTRUCTOR ====================

    constructor(address _platformTreasury) Ownable(msg.sender) {
        require(_platformTreasury != address(0), "Invalid treasury address");
        platformTreasury = _platformTreasury;
        nextProjectId = 0;
    }

    // ==================== CORE FUNCTIONS ====================

    /**
     * @dev Create a new portfolio project
     * @param title Project title
     * @param description Project description
     * @param githubUrl GitHub repository URL
     * @param demoUrl Live demo URL
     * @param skills Array of skill tags
     * @return projectId The ID of the created project
     */
    function createProject(
        string memory title,
        string memory description,
        string memory githubUrl,
        string memory demoUrl,
        string[] memory skills
    ) external returns (uint64 projectId) {
        projectId = nextProjectId;

        Project storage project = projects[projectId];
        project.id = projectId;
        project.student = msg.sender;
        project.title = title;
        project.description = description;
        project.githubUrl = githubUrl;
        project.demoUrl = demoUrl;
        project.skills = skills;
        project.createdAt = block.timestamp;
        project.unlockCount = 0;
        project.avgRating = 0;

        studentProjects[msg.sender].push(projectId);
        nextProjectId++;

        emit ProjectCreated(projectId, msg.sender, title);
    }

    /**
     * @dev Unlock a project by paying the unlock fee
     * @param projectId The ID of the project to unlock
     */
    function unlockProject(uint64 projectId) external payable nonReentrant {
        Project storage project = projects[projectId];

        if (project.student == address(0)) revert ProjectNotFound();
        if (project.student == msg.sender) revert CannotReviewOwnProject();
        if (unlocked[projectId][msg.sender]) revert AlreadyUnlocked();
        if (msg.value < unlockPrice) revert InsufficientPayment();

        // Transfer student share
        (bool studentSuccess, ) = project.student.call{value: studentShare}("");
        if (!studentSuccess) revert TransferFailed();

        // Transfer platform share
        (bool platformSuccess, ) = platformTreasury.call{value: platformShare}("");
        if (!platformSuccess) revert TransferFailed();

        // Mark as unlocked and update unlock count
        unlocked[projectId][msg.sender] = true;
        project.unlockCount++;

        emit ProjectUnlocked(projectId, msg.sender, msg.value);

        // Refund excess payment
        if (msg.value > unlockPrice) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - unlockPrice}("");
            if (!refundSuccess) revert TransferFailed();
        }
    }

    /**
     * @dev Submit a review for an unlocked project
     * @param projectId The ID of the project to review
     * @param rating Rating from 1-5
     * @param comment Review comment
     */
    function submitReview(
        uint64 projectId,
        uint8 rating,
        string memory comment
    ) external {
        if (!unlocked[projectId][msg.sender]) revert NotUnlocked();
        if (rating == 0 || rating > 5) revert InvalidRating();

        Review memory review = Review({
            reviewer: msg.sender,
            rating: rating,
            comment: comment,
            timestamp: block.timestamp
        });

        reviews[projectId].push(review);

        // Update average rating
        Project storage project = projects[projectId];
        if (project.student == address(0)) revert ProjectNotFound();

        uint256 totalRating = 0;
        uint256 reviewCount = reviews[projectId].length;

        for (uint256 i = 0; i < reviewCount; i++) {
            totalRating += reviews[projectId][i].rating;
        }

        project.avgRating = uint8(totalRating / reviewCount);

        emit ReviewSubmitted(projectId, msg.sender, rating);
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @dev Get project details
     * @param projectId The ID of the project
     * @return project The project struct
     */
    function getProject(uint64 projectId) external view returns (Project memory) {
        if (projects[projectId].student == address(0)) revert ProjectNotFound();
        return projects[projectId];
    }

    /**
     * @dev Get all projects created by a student
     * @param student The student's address
     * @return projectIds Array of project IDs
     */
    function getStudentProjects(address student) external view returns (uint64[] memory) {
        return studentProjects[student];
    }

    /**
     * @dev Get all reviews for a project
     * @param projectId The ID of the project
     * @return reviewList Array of reviews
     */
    function getReviews(uint64 projectId) external view returns (Review[] memory) {
        return reviews[projectId];
    }

    /**
     * @dev Check if a project is unlocked for a reviewer
     * @param projectId The ID of the project
     * @param reviewer The reviewer's address
     * @return isUnlocked True if unlocked
     */
    function isUnlocked(uint64 projectId, address reviewer) external view returns (bool) {
        return unlocked[projectId][reviewer];
    }

    /**
     * @dev Get current unlock pricing
     * @return price Current unlock price
     */
    function getUnlockPrice() external view returns (uint256) {
        return unlockPrice;
    }

    /**
     * @dev Get total number of projects
     * @return count Total project count
     */
    function getTotalProjects() external view returns (uint64) {
        return nextProjectId;
    }

    // ==================== ADMIN FUNCTIONS ====================

    /**
     * @dev Update unlock pricing (owner only)
     * @param _unlockPrice New unlock price
     * @param _studentShare New student share
     * @param _platformShare New platform share
     */
    function updatePricing(
        uint256 _unlockPrice,
        uint256 _studentShare,
        uint256 _platformShare
    ) external onlyOwner {
        if (_studentShare + _platformShare != _unlockPrice) revert InvalidPricing();

        unlockPrice = _unlockPrice;
        studentShare = _studentShare;
        platformShare = _platformShare;

        emit PricingUpdated(_unlockPrice, _studentShare, _platformShare);
    }

    /**
     * @dev Update platform treasury address (owner only)
     * @param _newTreasury New treasury address
     */
    function updateTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid treasury address");
        platformTreasury = _newTreasury;
    }

    /**
     * @dev Withdraw any stuck funds (emergency only)
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        if (!success) revert TransferFailed();
    }

    // ==================== FALLBACK ====================

    receive() external payable {}
}
