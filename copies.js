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

const copies = {
    data: {
        countdownMessage: '',
        copy: {
            data: undefined,
            isGenerating: false
        }
    },
    methods: {
        async startCountdown(copy) {
            console.log('Restarting countdown...');
            this.countdownMessage = '';
            for (let i = 0; i < COUNTDOWN_MESSAGE.length; i++) {
                this.countdownMessage += COUNTDOWN_MESSAGE[i];
                await delay(1000);
                if (!copy.isGenerating) {
                    break;
                }
            }
        },
        async generateCopy(copy, generationEndpoint, checkingEndpoint, payload) {
            console.log('Generating copy...', copy);
            const requestedTime = new Date().toISOString(); // Timestamp for identifying the copy after it's generated
            payload.requested_time = requestedTime;
            await axios.post(generationEndpoint, payload);
            copy.isGenerating = true; 
            this.startCountdown(copy);
            copy.data = await this.checkCopyReady(requestedTime, checkingEndpoint);
            copy.isGenerating = false; 
        },
        async checkCopyReady(requestedTime, endpoint, maxTries=DEFAULT_MAX_TRIES, timeout=DEFAULT_TIMEOUT) {
            console.log('Checking if copy is ready...', requestedTime)
            endpoint += '?requested_time=' + requestedTime;
            let tries = 0; 
            while (tries < maxTries) {
                const response = await axios.get(endpoint);
                if (response.data.length > 0) {
                    return response.data[0];
                } else {
                    await delay(timeout); 
                    tries++;
                    console.log('Tries:', tries, '/', maxTries);
                }
            }
        }
    }
};