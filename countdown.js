async function startCountdown() {
    console.log('Starting countdown...');
    this.countdownMessage = '';
    for (let i = 0; i < COPY_COUNTDOWN_MESSAGE.length; i++) {
        this.countdownMessage += COPY_COUNTDOWN_MESSAGE[i];
        await delay(1000);
        if (!this.isCountingDown) {
            break;
        }
    }
}