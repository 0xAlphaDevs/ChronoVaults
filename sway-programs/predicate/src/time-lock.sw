predicate;

/// This predicate is time-lock predicate. It checks if the current time is greater than the deadline.
/// If it is, the predicate is 'unlocked' and the transaction is allowed to proceed.
/// Otherwise, it is reverted.
use std::constants::ZERO_B256;

configurable {
    RECEIVER: Address = Address::from(ZERO_B256),
    AMOUNT: u64 = 0, // total spending budget in ETH
    DEADLINE: u64 = 0,
}

fn main(receiver: Address, current_time: u64) -> bool {
    current_time > DEADLINE && receiver == RECEIVER
}
