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

/* Copy to Vue data - E.g.
    data() {
        return {
            // ...
            ...COUNTDOWN,
            // ...
        }
    }
*/
const COUNTDOWN = {
    countdownMessage: '', 

    /* Use watchers to start and stop countdown - E.g.
        watch: {
            // ...
            areCopiesLoading(newValue) {
                this.isCountingDown = newValue;
            },
            // ...
        },
    */
    isCountingDown: false 
}

/* Assign to Vue watch - E.g.

*/
function isCountingDown(newValue) {
    console.log('isCountingDown:', newValue)
    if (newValue) {
        this.startCountdown();
    }
}

/* Assign to Vue methods - E.g.
    methods: {
        // ...
        startCountdown: startCountdown,
        // ...
    }
*/
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