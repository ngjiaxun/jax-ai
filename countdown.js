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

// Assign to Vue data - e.g. countdown: COUNTDOWN
const COUNTDOWN = {
    countdownMessage: '', 
    isCountingDown: false // Toggle in Vue watch - e.g. isGenerating(newValue) { isCountingDown: newValue }
}

// Assign to Vue watch - e.g. isCountingDown: isCountingDown
function isCountingDown(newValue) {
    console.log('isCountingDown:', newValue)
    if (newValue) {
        this.startCountdown();
    }
}

// Assign to Vue method - e.g. startCountdown: startCountdown
async function startCountdown() {
    console.log('Starting countdown...');
    this.countdownMessage = '';
    console.log('this in countdown.js', this);
    console.log('this.countdownMessage in countdown.js', this.countdownMessage);
    console.log('this.troubleshooting in countdown.js', this.troubleshooting);
    for (let i = 0; i < COUNTDOWN_MESSAGE.length; i++) {
        this.countdownMessage += COUNTDOWN_MESSAGE[i];
        await delay(1000);
        if (!this.isCountingDown) {
            break;
        }
    }
}