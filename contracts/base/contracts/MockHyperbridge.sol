// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IHyperbridge.sol";

/**
 * @title MockHyperbridge
 * @dev Mock implementation of Hyperbridge for hackathon demo
 * @notice This allows demonstrating cross-chain functionality without actual Hyperbridge deployment
 */
contract MockHyperbridge is IHyperbridge {
    // Message tracking
    uint256 private nextMessageId;
    mapping(bytes32 => bool) public processedMessages;

    // Events
    event MessageSentMock(
        bytes32 indexed messageId,
        bytes32 indexed destChain,
        bytes data,
        uint256 fee
    );

    event MessageReceivedMock(
        bytes32 indexed messageId,
        bytes32 indexed sourceChain,
        bytes data
    );

    /**
     * @dev Send a cross-chain message (mock implementation)
     * @param destChain Destination chain identifier
     * @param data Encoded message data
     * @return messageId Unique message identifier
     */
    function sendMessage(
        bytes32 destChain,
        bytes memory data
    ) external payable override returns (bytes32 messageId) {
        // Generate unique message ID
        messageId = keccak256(abi.encodePacked(
            block.chainid,
            destChain,
            msg.sender,
            nextMessageId,
            block.timestamp
        ));

        nextMessageId++;

        // Emit event to demonstrate message sent
        emit MessageSent(messageId, destChain, data, msg.value);
        emit MessageSentMock(messageId, destChain, data, msg.value);

        return messageId;
    }

    /**
     * @dev Verify and execute a received cross-chain message (mock implementation)
     * @param message The cross-chain message
     * @param proof Merkle proof for message verification
     */
    function receiveMessage(
        Message calldata message,
        bytes calldata proof
    ) external override {
        bytes32 messageId = keccak256(abi.encodePacked(
            message.sourceChain,
            message.destChain,
            message.nonce,
            message.data
        ));

        require(!processedMessages[messageId], "Message already processed");

        processedMessages[messageId] = true;

        // Emit events to demonstrate message received
        emit MessageReceived(messageId, message.sourceChain, message.data);
        emit MessageReceivedMock(messageId, message.sourceChain, message.data);
    }

    /**
     * @dev Get the fee required for sending a message (mock returns 0)
     * @param destChain Destination chain identifier
     * @param dataLength Length of the message data
     * @return fee Required fee in wei (0 for mock)
     */
    function estimateFee(
        bytes32 destChain,
        uint256 dataLength
    ) external pure override returns (uint256 fee) {
        // Mock implementation returns minimal fee
        return 0.0001 ether;
    }

    /**
     * @dev Check if message was processed
     * @param messageId Message ID to check
     * @return processed True if message was processed
     */
    function isMessageProcessed(bytes32 messageId) external view returns (bool) {
        return processedMessages[messageId];
    }
}
