// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AIModelNFT
 * @dev NFT contract for AI Models on the marketplace
 */
contract AIModelNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    
    // Struct to store AI Model metadata
    struct AIModel {
        uint256 tokenId;
        address creator;
        string modelName;
        string description;
        string modelType; // e.g., "image-generation", "text-classification"
        string ipfsHash; // IPFS hash for model file
        uint256 price;
        bool isListed;
        uint256 royaltyPercentage; // Royalty percentage (e.g., 1000 = 10%)
        uint256 createdAt;
    }
    
    // Mapping from token ID to AI Model
    mapping(uint256 => AIModel) public aiModels;
    
    // Mapping from creator to their models
    mapping(address => uint256[]) public creatorModels;
    
    // Events
    event AIModelMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string modelName,
        string ipfsHash
    );
    
    event AIModelListed(
        uint256 indexed tokenId,
        uint256 price
    );
    
    event AIModelDelisted(
        uint256 indexed tokenId
    );
    
    constructor() ERC721("AI Model NFT", "AIMNFT") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new AI Model NFT
     */
    function mintAIModel(
        string memory modelName,
        string memory description,
        string memory modelType,
        string memory ipfsHash,
        string memory tokenURI,
        uint256 royaltyPercentage
    ) public returns (uint256) {
        require(bytes(modelName).length > 0, "Model name cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(royaltyPercentage <= 10000, "Royalty cannot exceed 100%");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        aiModels[tokenId] = AIModel({
            tokenId: tokenId,
            creator: msg.sender,
            modelName: modelName,
            description: description,
            modelType: modelType,
            ipfsHash: ipfsHash,
            price: 0,
            isListed: false,
            royaltyPercentage: royaltyPercentage,
            createdAt: block.timestamp
        });
        
        creatorModels[msg.sender].push(tokenId);
        
        emit AIModelMinted(tokenId, msg.sender, modelName, ipfsHash);
        
        return tokenId;
    }
    
    /**
     * @dev List an AI Model for sale
     */
    function listModel(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        
        aiModels[tokenId].price = price;
        aiModels[tokenId].isListed = true;
        
        emit AIModelListed(tokenId, price);
    }
    
    /**
     * @dev Delist an AI Model
     */
    function delistModel(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        aiModels[tokenId].isListed = false;
        aiModels[tokenId].price = 0;
        
        emit AIModelDelisted(tokenId);
    }
    
    /**
     * @dev Get AI Model details
     */
    function getAIModel(uint256 tokenId) public view returns (AIModel memory) {
        return aiModels[tokenId];
    }
    
    /**
     * @dev Get all models by creator
     */
    function getCreatorModels(address creator) public view returns (uint256[] memory) {
        return creatorModels[creator];
    }
    
    /**
     * @dev Get total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}

