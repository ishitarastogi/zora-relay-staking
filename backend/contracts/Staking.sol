// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import {ERC2771Context} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";
import "./Token.sol";

/// @title Staking contract
/// @notice This contract is used to stake the NFTs and mint the reward tokens
/// @dev This contract is used to stake the NFTs and mint the reward tokens. The reward tokens are minted using the BuidlToken contract, and the NFTs are transferred using the IERC721 interface.

contract Staking is ERC721Holder, ERC2771Context {
    /// @notice NFT contract
    IERC721 public buidlNFT;

    /// @notice Token contract
    BuidlToken public buidlToken;

    /// @dev owner of the contract
    address owner;

    /// @notice Emission rate per second
    uint256 public EMISSION_RATE = ((10 ** 18) / (uint256(1 days)));

    /// @notice Staking start time
    mapping(address => uint256) public tokenStakedAt;

    /// @notice Token ID of the staked NFT
    mapping(address => uint256) public stakeTokenId;

    /// @notice Constructor
    /// @param nft  NFT contract address
    /// @param token Token contract address
    constructor(
        address nft,
        address token,
        address trustedForwarder
    ) ERC2771Context(trustedForwarder) {
        buidlNFT = IERC721(nft);
        buidlToken = BuidlToken(token);
    }

    /// Function to stake the NFT
    /// This will transfer the NFT to the contract, and start the staking timer for the user.
    /// @param tokenId Token ID of the NFT to stake
    function stakeNFT(uint256 tokenId) external {
        require(buidlNFT.ownerOf(tokenId) == _msgSender(), "ERR:NO");
        buidlNFT.safeTransferFrom(_msgSender(), address(this), tokenId);
        tokenStakedAt[_msgSender()] = block.timestamp;
        stakeTokenId[_msgSender()] = tokenId;
    }

    /// Function to calculate the reward for the staker
    /// @param staker Address of the staker
    function calculateReward(address staker) public view returns (uint256) {
        require(tokenStakedAt[staker] != 0, "ERR:NS");
        uint256 time = block.timestamp - tokenStakedAt[staker];
        return (time * EMISSION_RATE);
    }

    /// Function to unstake the NFT
    /// This will transfer the NFT back to the user, and mint the reward for the user.
    /// @param tokenId Token ID of the NFT to unstake
    function unStakeNFT(uint256 tokenId) external {
        require(stakeTokenId[_msgSender()] == tokenId, "ERR:NY");
        uint256 rewardAmount = calculateReward(_msgSender());

        buidlNFT.safeTransferFrom(address(this), _msgSender(), tokenId);

        buidlToken.mintToken(_msgSender(), rewardAmount);

        delete stakeTokenId[_msgSender()];
        delete tokenStakedAt[_msgSender()];
    }
}
