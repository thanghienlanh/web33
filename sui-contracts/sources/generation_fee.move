module ai_model_nft::generation_fee;

use sui::coin::{Self, Coin};
use sui::event;
use sui::object::{Self, ID, UID};
use sui::sui::SUI;
use sui::transfer;
use sui::tx_context::{Self, TxContext};

const E_INSUFFICIENT_FEE: u64 = 1;
const E_NOT_ADMIN: u64 = 2;

/// Cấu hình phí cho mỗi lần generate ảnh.
/// Được share object để ai cũng có thể dùng chung.
public struct FeeConfig has key {
    id: UID,
    admin: address,
    beneficiary: address,
    /// Phí (đơn vị MIST, 1 SUI = 1_000_000_000 MIST)
    fee_amount: u64,
}

/// Ticket chứng nhận đã trả phí (có thể lưu hoặc bỏ).
public struct FeeTicket has key, store {
    id: UID,
    payer: address,
    paid: u64,
    timestamp_ms: u64,
    config_id: ID,
}

/// Event log khi trả phí thành công.
public struct FeePaid has copy, drop {
    payer: address,
    beneficiary: address,
    amount: u64,
    config_id: ID,
}

/// One-time witness cho init
public struct GENERATION_FEE has drop {}

/// Khởi tạo cấu hình phí (gọi một lần, sau đó object được share).
/// Sử dụng giá trị mặc định: admin là sender, beneficiary là admin, fee_amount = 1 SUI
fun init(witness: GENERATION_FEE, ctx: &mut TxContext) {
    let admin = tx_context::sender(ctx);
    let config = FeeConfig {
        id: object::new(ctx),
        admin,
        beneficiary: admin, // Mặc định beneficiary là admin
        fee_amount: 1_000_000_000, // 1 SUI = 1e9 MIST
    };
    transfer::share_object(config);
}

/// Tạo FeeConfig thủ công (có thể gọi nhiều lần để tạo nhiều config)
#[allow(lint(public_entry))]
public entry fun create_fee_config(ctx: &mut TxContext) {
    let admin = tx_context::sender(ctx);
    let config = FeeConfig {
        id: object::new(ctx),
        admin,
        beneficiary: admin,
        fee_amount: 100_000_000, // 0.1 SUI = 1e8 MIST
    };
    transfer::share_object(config);
}

/// Admin cập nhật phí hoặc địa chỉ nhận phí.
public entry fun update_config(
    config: &mut FeeConfig,
    new_beneficiary: address,
    new_fee_amount: u64,
    ctx: &mut TxContext,
) {
    assert!(tx_context::sender(ctx) == config.admin, E_NOT_ADMIN);
    config.beneficiary = new_beneficiary;
    config.fee_amount = new_fee_amount;
}

/// Trả phí generate ảnh.
/// - Người dùng truyền vào shared object `config` và một đồng SUI đủ số tiền.
/// - Hệ thống trích `fee_amount` chuyển cho `beneficiary`, trả lại tiền thừa.
/// - Mint `FeeTicket` + emit event để truy vết.
public entry fun pay_fee(
    config: &FeeConfig,
    mut fee_coin: Coin<SUI>,
    ctx: &mut TxContext,
) {
    let payer = tx_context::sender(ctx);
    let total = coin::value(&fee_coin);
    assert!(total >= config.fee_amount, E_INSUFFICIENT_FEE);

    // Cắt phí và trả lại phần thừa (nếu có).
    let fee_part = coin::split(&mut fee_coin, config.fee_amount, ctx);

    // Chuyển phí cho beneficiary.
    transfer::public_transfer(fee_part, config.beneficiary);

    // Trả lại phần tiền thừa (nếu có).
    if (coin::value(&fee_coin) > 0) {
        transfer::public_transfer(fee_coin, payer);
    } else {
        coin::destroy_zero(fee_coin);
    };

    // Mint ticket xác nhận đã trả phí.
    let ticket = FeeTicket {
        id: object::new(ctx),
        payer,
        paid: config.fee_amount,
        timestamp_ms: tx_context::epoch_timestamp_ms(ctx),
        config_id: object::id(config),
    };
    transfer::public_transfer(ticket, payer);

    // Emit event log.
    event::emit(FeePaid {
        payer,
        beneficiary: config.beneficiary,
        amount: config.fee_amount,
        config_id: object::id(config),
    });
}
