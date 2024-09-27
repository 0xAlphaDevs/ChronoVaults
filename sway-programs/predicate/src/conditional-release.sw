predicate;

/// This predicate is conditinal-release predicate. It checks if the receiver and secret are correct.
/// If it is, the predicate is 'unlocked' and the transaction is allowed to proceed.
/// Otherwise, it is reverted.
use std::constants::ZERO_B256;

configurable {
    RECEIVER: Address = Address::from(ZERO_B256),
    SECRET: u64 = 0,
}

fn main(receiver: Address, secret: u64) -> bool { 
    secret == SECRET && receiver == RECEIVER
}
