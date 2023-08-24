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
        data: {
            countdownMessage: ''
        },
        copy: {
            data: undefined,
            isGenerating: false
        }
    },
    computed: {
        isGeneratingAny() { // The 'generate' button will be hidden while the copies are loading
            return Object.values(this.copies).some(copy => copy.isGenerating);
        }
    },
    method: {
        async startCountdown(copy) {
            console.log('Starting countdown...');
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
            console.log('Generating copy...');
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
        },
        retrieveCopy(copy, endpoint, copyId) {
            console.log(`Retrieving copy ${copyId}...`);
            axios.get(endpoint + copyId)
                .then(response => copy.data = response.data)
                .catch(error => console.error('Error retrieving copy:', error.response.data));
        },
        updateCopy(copy, endpoint) {
            axios.patch(endpoint + copy.data.id, copy.data)
                .then(response => console.log('Copy updated...', response.data.id))
                .catch(error => console.error('Error updating copy:', error.message));
        },
        clearProp(prop) {
            console.log('Clearing property...', prop);
            Object.values(this.copies).forEach(copy => {
                if (copy.data) {
                    copy.data[prop] = '';
                }
            });
        },
        getProp(copyStr, prop) {
            return this.copies[copyStr].data ? this.copies[copyStr].data[prop] : '';
        }
    }
};