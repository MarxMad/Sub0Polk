// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DotGoPortfolio.sol";
import "./interfaces/IHyperbridge.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DotGoCrossChain
 * @dev Extended DotGo contract with Hyperbridge cross-chain integration
 * @notice Enables syncing portfolio data between Base and Polkadot chains
 */
contract DotGoCrossChain is DotGoPortfolio {
    // ==================== STATE VARIABLES ====================

    IHyperbridge public hyperbridge;
    bytes32 public polkadotChainId;
    bool public crossChainEnabled;

    // Message type identifiers
    bytes1 constant MSG_PROJECT_CREATED = 0x01;
    bytes1 constant MSG_PROJECT_UNLOCKED = 0x02;
    bytes1 constant MSG_REVIEW_SUBMITTED = 0x03;

    // Cross-chain message nonce
    uint64 private messageNonce;

    // ==================== EVENTS ====================

    event CrossChainMessageSent(
        bytes32 indexed messageId,
        bytes1 msgType,
        uint64 projectId
    );

    event CrossChainMessageReceived(
        bytes32 indexed messageId,
        bytes1 msgType,
        uint64 projectId
    );

    event HyperbridgeUpdated(address indexed newHyperbridge);
    event CrossChainToggled(bool enabled);

    // ==================== ERRORS ====================

    error CrossChainDisabled();
    error InvalidMessageType();
    error UnauthorizedCaller();
    error InvalidHyperbridgeAddress();

    // ==================== CONSTRUCTOR ====================

    constructor(
        address _platformTreasury,
        address _hyperbridge,
        bytes32 _polkadotChainId
    ) DotGoPortfolio(_platformTreasury) {
        if (_hyperbridge != address(0)) {
            hyperbridge = IHyperbridge(_hyperbridge);
            polkadotChainId = _polkadotChainId;
            crossChainEnabled = true;
        } else {
            crossChainEnabled = false;
        }
        messageNonce = 0;
    }

    // ==================== CROSS-CHAIN FUNCTIONS ====================

    /**
     * @dev Send project creation event to Polkadot chain
     * @param projectId The ID of the created project
     */
    function syncProjectCreated(uint64 projectId) internal {
        if (!crossChainEnabled) return;

        Project memory project = projects[projectId];

        bytes memory data = abi.encode(
            MSG_PROJECT_CREATED,
            projectId,
            project.student,
            project.title,
            project.createdAt
        );

        try hyperbridge.sendMessage{value: msg.value}(polkadotChainId, data) returns (bytes32 messageId) {
            emit CrossChainMessageSent(messageId, MSG_PROJECT_CREATED, projectId);
        } catch {
            // Silently fail if cross-chain sync fails
            // Local state remains consistent
        }

        messageNonce++;
    }

    /**
     * @dev Send project unlock event to Polkadot chain
     * @param projectId The ID of the unlocked project
     * @param reviewer The reviewer's address
     */
    function syncProjectUnlocked(uint64 projectId, address reviewer) internal {
        if (!crossChainEnabled) return;

        bytes memory data = abi.encode(
            MSG_PROJECT_UNLOCKED,
            projectId,
            reviewer,
            block.timestamp
        );

        try hyperbridge.sendMessage{value: 0}(polkadotChainId, data) returns (bytes32 messageId) {
            emit CrossChainMessageSent(messageId, MSG_PROJECT_UNLOCKED, projectId);
        } catch {
            // Silently fail if cross-chain sync fails
        }

        messageNonce++;
    }

    /**
     * @dev Send review submission event to Polkadot chain
     * @param projectId The ID of the reviewed project
     * @param reviewer The reviewer's address
     * @param rating The rating given
     */
    function syncReviewSubmitted(
        uint64 projectId,
        address reviewer,
        uint8 rating
    ) internal {
        if (!crossChainEnabled) return;

        bytes memory data = abi.encode(
            MSG_REVIEW_SUBMITTED,
            projectId,
            reviewer,
            rating,
            block.timestamp
        );

        try hyperbridge.sendMessage{value: 0}(polkadotChainId, data) returns (bytes32 messageId) {
            emit CrossChainMessageSent(messageId, MSG_REVIEW_SUBMITTED, projectId);
        } catch {
            // Silently fail if cross-chain sync fails
        }

        messageNonce++;
    }

    /**
     * @dev Handle incoming cross-chain messages from Polkadot
     * @param message The cross-chain message
     * @param proof Merkle proof for verification
     */
    function handleCrossChainMessage(
        IHyperbridge.Message calldata message,
        bytes calldata proof
    ) external {
        if (!crossChainEnabled) revert CrossChainDisabled();
        if (msg.sender != address(hyperbridge)) revert UnauthorizedCaller();

        // Verify the message through Hyperbridge
        hyperbridge.receiveMessage(message, proof);

        // Decode and process the message
        (bytes1 msgType, bytes memory payload) = abi.decode(message.data, (bytes1, bytes));

        if (msgType == MSG_PROJECT_CREATED) {
            _handleProjectCreated(payload);
        } else if (msgType == MSG_PROJECT_UNLOCKED) {
            _handleProjectUnlocked(payload);
        } else if (msgType == MSG_REVIEW_SUBMITTED) {
            _handleReviewSubmitted(payload);
        } else {
            revert InvalidMessageType();
        }
    }

    // ==================== INTERNAL MESSAGE HANDLERS ====================

    function _handleProjectCreated(bytes memory payload) internal {
        (uint64 projectId, address student, string memory title, uint256 createdAt) =
            abi.decode(payload, (uint64, address, string, uint256));

        // Update local state to reflect Polkadot chain project
        // This is a read-only sync - actual project creation happens on origin chain
        emit CrossChainMessageReceived(bytes32(uint256(projectId)), MSG_PROJECT_CREATED, projectId);
    }

    function _handleProjectUnlocked(bytes memory payload) internal {
        (uint64 projectId, address reviewer, uint256 timestamp) =
            abi.decode(payload, (uint64, address, uint256));

        // Sync unlock status from Polkadot
        emit CrossChainMessageReceived(bytes32(uint256(projectId)), MSG_PROJECT_UNLOCKED, projectId);
    }

    function _handleReviewSubmitted(bytes memory payload) internal {
        (uint64 projectId, address reviewer, uint8 rating, uint256 timestamp) =
            abi.decode(payload, (uint64, address, uint8, uint256));

        // Sync review from Polkadot
        emit CrossChainMessageReceived(bytes32(uint256(projectId)), MSG_REVIEW_SUBMITTED, projectId);
    }

    // ==================== ADMIN FUNCTIONS ====================

    /**
     * @dev Update Hyperbridge contract address
     * @param _newHyperbridge New Hyperbridge address
     */
    function updateHyperbridge(address _newHyperbridge) external onlyOwner {
        if (_newHyperbridge == address(0)) revert InvalidHyperbridgeAddress();
        hyperbridge = IHyperbridge(_newHyperbridge);
        emit HyperbridgeUpdated(_newHyperbridge);
    }

    /**
     * @dev Toggle cross-chain functionality
     * @param _enabled Enable or disable cross-chain
     */
    function toggleCrossChain(bool _enabled) external onlyOwner {
        crossChainEnabled = _enabled;
        emit CrossChainToggled(_enabled);
    }

    /**
     * @dev Update Polkadot chain ID
     * @param _polkadotChainId New chain ID
     */
    function updatePolkadotChainId(bytes32 _polkadotChainId) external onlyOwner {
        polkadotChainId = _polkadotChainId;
    }

    // ==================== OVERRIDDEN FUNCTIONS WITH CROSS-CHAIN SYNC ====================

    /**
     * @dev Create project with cross-chain sync
     */
    function createProjectWithSync(
        string memory title,
        string memory description,
        string memory githubUrl,
        string memory demoUrl,
        string[] memory skills
    ) external payable returns (uint64 projectId) {
        projectId = this.createProject(title, description, githubUrl, demoUrl, skills);
        syncProjectCreated(projectId);
    }

    /**
     * @dev Unlock project with cross-chain sync
     */
    function unlockProjectWithSync(uint64 projectId) external payable {
        this.unlockProject{value: msg.value}(projectId);
        syncProjectUnlocked(projectId, msg.sender);
    }

    /**
     * @dev Submit review with cross-chain sync
     */
    function submitReviewWithSync(
        uint64 projectId,
        uint8 rating,
        string memory comment
    ) external {
        this.submitReview(projectId, rating, comment);
        syncReviewSubmitted(projectId, msg.sender, rating);
    }
}
