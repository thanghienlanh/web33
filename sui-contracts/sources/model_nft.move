module ai_model_nft::model_nft;

use sui::object::{Self, UID, ID};
use sui::tx_context::{Self, TxContext};
use sui::transfer;
use sui::event;
use std::string::{Self, String};

/// NFT đại diện cho mô hình AI
/// Lưu metadata cơ bản + URI (IPFS/URL)
public struct ModelNFT has key, store {
    id: UID,
    /// Tên mô hình AI
    name: String,
    /// Mô tả mô hình
    description: String,
    /// Loại mô hình (image-generation, text-classification, etc.)
    model_type: String,
    /// URI metadata (IPFS hash hoặc URL)
    metadata_uri: String,
    /// URI hình ảnh (IPFS hash hoặc URL)
    image_uri: String,
    /// Địa chỉ người tạo
    creator: address,
    /// Royalty percentage (basis points, e.g., 1000 = 10%)
    royalty_percentage: u64,
    /// Timestamp khi tạo
    created_at: u64,
}

/// Event khi mint NFT
public struct ModelNFTMinted has copy, drop {
    object_id: ID,
    creator: address,
    name: vector<u8>,
}

/// Mint NFT mới cho mô hình AI
/// 
/// # Arguments
/// - `name`: Tên mô hình AI
/// - `description`: Mô tả mô hình
/// - `model_type`: Loại mô hình
/// - `metadata_uri`: URI metadata (IPFS/URL)
/// - `image_uri`: URI hình ảnh (IPFS/URL)
/// - `royalty_percentage`: Royalty percentage (basis points)
/// - `ctx`: Transaction context
/// 
/// # Returns
/// ModelNFT object được transfer cho người gọi
public fun mint(
    name: vector<u8>,
    description: vector<u8>,
    model_type: vector<u8>,
    metadata_uri: vector<u8>,
    image_uri: vector<u8>,
    royalty_percentage: u64,
    ctx: &mut TxContext
): ModelNFT {
    // Validate inputs
    assert!(royalty_percentage <= 10000, 0); // Royalty không được vượt quá 100%
    
    let creator = tx_context::sender(ctx);
    let timestamp = tx_context::epoch_timestamp_ms(ctx);
    
    // Tạo ModelNFT object
    let nft = ModelNFT {
        id: object::new(ctx),
        name: string::utf8(name),
        description: string::utf8(description),
        model_type: string::utf8(model_type),
        metadata_uri: string::utf8(metadata_uri),
        image_uri: string::utf8(image_uri),
        creator,
        royalty_percentage,
        created_at: timestamp,
    };
    
    // Emit event
    event::emit(ModelNFTMinted {
        object_id: object::id(&nft),
        creator,
        name,
    });
    
    nft
}

/// Mint và transfer NFT cho người gọi
#[allow(lint(public_entry))]
public entry fun mint_and_transfer(
    name: vector<u8>,
    description: vector<u8>,
    model_type: vector<u8>,
    metadata_uri: vector<u8>,
    image_uri: vector<u8>,
    royalty_percentage: u64,
    ctx: &mut TxContext
) {
    let nft = mint(
        name,
        description,
        model_type,
        metadata_uri,
        image_uri,
        royalty_percentage,
        ctx
    );
    
    // Transfer NFT cho người gọi
    transfer::transfer(nft, tx_context::sender(ctx));
}

/// Lấy thông tin NFT
public fun get_name(nft: &ModelNFT): String {
    nft.name
}

public fun get_description(nft: &ModelNFT): String {
    nft.description
}

public fun get_model_type(nft: &ModelNFT): String {
    nft.model_type
}

public fun get_metadata_uri(nft: &ModelNFT): String {
    nft.metadata_uri
}

public fun get_image_uri(nft: &ModelNFT): String {
    nft.image_uri
}

public fun get_creator(nft: &ModelNFT): address {
    nft.creator
}

public fun get_royalty_percentage(nft: &ModelNFT): u64 {
    nft.royalty_percentage
}

public fun get_created_at(nft: &ModelNFT): u64 {
    nft.created_at
}
