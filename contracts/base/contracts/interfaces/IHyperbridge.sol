// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IHyperbridge
 * @dev Interface for Hyperbridge cross-chain messaging
 * @notice Minimal interface for cross-chain communication between Base and Polkadot
 */
interface IHyperbridge {
    /**
     * @dev Cross-chain message structure
     */
    struct Message {
        bytes32 sourceChain;
        bytes32 destChain;
        uint64 nonce;
        bytes data;
        uint256 fee;
    }

    /**
     * @dev Send a cross-chain message
     * @param destChain Destination chain identifier
     * @param data Encoded message data
     * @return messageId Unique message identifier
     */
    function sendMessage(
        bytes32 destChain,
        bytes memory data
    ) external payable returns (bytes32 messageId);

    /**
     * @dev Verify and execute a received cross-chain message
     * @param message The cross-chain message
     * @param proof Merkle proof for message verification
     */
    function receiveMessage(
        Message calldata message,
        bytes calldata proof
    ) external;

    /**
     * @dev Get the fee required for sending a message
     * @param destChain Destination chain identifier
     * @param dataLength Length of the message data
     * @return fee Required fee in wei
     */
    function estimateFee(
        bytes32 destChain,
        uint256 dataLength
    ) external view returns (uint256 fee);

    /**
     * @dev Event emitted when a message is sent
     */
    event MessageSent(
        bytes32 indexed messageId,
        bytes32 indexed destChain,
        bytes data,
        uint256 fee
    );

    /**
     * @dev Event emitted when a message is received
     */
    event MessageReceived(
        bytes32 indexed messageId,
        bytes32 indexed sourceChain,
        bytes data
    );
}
