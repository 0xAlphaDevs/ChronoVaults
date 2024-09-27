predicate;

/// This predicate is spending-budget predicate. Amount is unlocked linearly over a period of time.
// Ex: $1200 spending monthly budget - $40 per day
/// If it is, the predicate is 'unlocked' and the transaction is allowed to proceed.
/// Otherwise, it is reverted.
use std::constants::ZERO_B256;

configurable {
    RECEIVER: Address = Address::from(ZERO_B256),
    AMOUNT: u64 = 0, // total spending budget in ETH
    START_TIME: u64 = 0, // start time of the budget unix timestamp
    TIME_PERIOD: u64 = 0, // duration of the budget in seconds
}

fn main(receiver: Address,amount: u64, current_time: u64) -> bool { 
    amount <= ((current_time - START_TIME) / TIME_PERIOD) * AMOUNT && receiver == RECEIVER
}
