const COUNTDOWN_MESSAGE = [
    'Ready in ',
    '5',
    '.',
    '.',
    '.',
    ' ',
    '4',
    '.',
    '.',
    '.',
    ' ',
    '3',
    '.',
    '.',
    '.',
    ' ',
    '2',
    '.',
    '.',
    '.',
    ' ',
    '1',
    '.',
    '.',
    '.',
    ' ',
    'Any',
    ' ',
    'second',
    ' ',
    'now',
    '!',
    '.',
    '.',
    '.',
    ' '
];

// Copy to Vue data
// E.g. countdown: { ...COUNTDOWN }
// const COUNTDOWN = {
//     countdownMessage: '', 
//     isCountingDown: false // Use watchers to start and stop countdown e.g. areCopiesLoading(newValue) { this.countdown.isCountingDown = newValue; }
// }

// Assign to Vue watch
// E.g. isCountingDown: isCountingDown
function isCountingDown(newValue) {
    console.log('isCountingDown:', newValue)
    if (newValue) {
        this.startCountdown();
    }
}

// Assign to Vue methods
// E.g. startCountdown: startCountdown
async function startCountdown() {
    console.log('Starting countdown...');
    this.countdownMessage = '';
    for (let i = 0; i < COUNTDOWN_MESSAGE.length; i++) {
        this.countdownMessage += COUNTDOWN_MESSAGE[i];
        await delay(1000);
        if (!this.isCountingDown) {
            break;
        }
    }
}