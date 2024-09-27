predicate;

/// This predicate checks if the given password is 1337.
/// If it is, the predicate is 'unlocked' and the transaction is allowed to proceed.
/// Otherwise, it is reverted.
use std::block::timestamp;
use std::constants::ZERO_B256;

configurable {
    RECEIVER: Address = Address::from(ZERO_B256),
    DEADLINE: u64 = 0,
}

fn main(receiver: Address, current_time: u64) -> bool {
    current_time > DEADLINE && receiver == RECEIVER
}
