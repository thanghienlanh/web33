// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AIModelNFT.sol";

/**
 * @title Marketplace
 * @dev Marketplace contract for buying and selling AI Models
 */
contract Marketplace is Ownable, ReentrancyGuard {
    AIModelNFT public aiModelNFT;
    
    // Marketplace fee percentage (e.g., 250 = 2.5%)
    uint256 public marketplaceFeePercentage = 250;
    
    // Struct for listing
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }
    
    // Mapping from token ID to listing
    mapping(uint256 => Listing) public listings;
    
    // Events
    event ModelListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    
    event ModelSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );
    
    event ListingCancelled(uint256 indexed tokenId);
    
    constructor(address _aiModelNFT) Ownable(msg.sender) {
        aiModelNFT = AIModelNFT(_aiModelNFT);
    }
    
    /**
     * @dev List an AI Model for sale
     */
    function listModel(uint256 tokenId, uint256 price) public nonReentrant {
        require(aiModelNFT.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        require(!listings[tokenId].isActive, "Already listed");
        
        // Transfer NFT to marketplace (or use approval pattern)
        aiModelNFT.transferFrom(msg.sender, address(this), tokenId);
        
        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true
        });
        
        emit ModelListed(tokenId, msg.sender, price);
    }
    
    /**
     * @dev Buy an AI Model
     */
    function buyModel(uint256 tokenId) public payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "Model not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        
        AIModelNFT.AIModel memory model = aiModelNFT.getAIModel(tokenId);
        
        // Calculate fees
        uint256 marketplaceFee = (listing.price * marketplaceFeePercentage) / 10000;
        uint256 royalty = (listing.price * model.royaltyPercentage) / 10000;
        uint256 sellerAmount = listing.price - marketplaceFee - royalty;
        
        // Transfer NFT to buyer
        aiModelNFT.transferFrom(address(this), msg.sender, tokenId);
        
        // Distribute payments
        payable(listing.seller).transfer(sellerAmount);
        if (royalty > 0) {
            payable(model.creator).transfer(royalty);
        }
        payable(owner()).transfer(marketplaceFee);
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        // Remove listing
        delete listings[tokenId];
        
        emit ModelSold(tokenId, listing.seller, msg.sender, listing.price);
    }
    
    /**
     * @dev Cancel a listing
     */
    function cancelListing(uint256 tokenId) public nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "Not listed");
        require(listing.seller == msg.sender, "Not the seller");
        
        // Transfer NFT back to seller
        aiModelNFT.transferFrom(address(this), msg.sender, tokenId);
        
        delete listings[tokenId];
        
        emit ListingCancelled(tokenId);
    }
    
    /**
     * @dev Set marketplace fee percentage
     */
    function setMarketplaceFee(uint256 _feePercentage) public onlyOwner {
        require(_feePercentage <= 1000, "Fee cannot exceed 10%");
        marketplaceFeePercentage = _feePercentage;
    }
    
    /**
     * @dev Get listing details
     */
    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return listings[tokenId];
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

