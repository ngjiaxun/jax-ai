const DEFAULT_TIMEOUT = 5000;
const DEFAULT_MAX_TRIES = 7;
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
    copy: {
        data: undefined,
        isGenerating: false
    },
    data: {
        countdownMessage: ''
    },
    computed: {
        isGeneratingAny() { // The 'generate' button will be hidden while the copies are loading
            return Object.values(this.copies).some(copy => copy.isGenerating);
        }
    },
    methods: {
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
            try {
                const requestedTime = new Date().toISOString(); // Timestamp for identifying the copy after it's generated
                payload.requested_time = requestedTime;
                await axios.post(generationEndpoint, payload);
                copy.isGenerating = true; 
                this.startCountdown(copy);
                copy.data = await this.checkCopyReady(requestedTime, checkingEndpoint);
                copy.isGenerating = false; 
            } catch (error) {
                console.error('Error generating copy:', error.message);
            }
        },
        async checkCopyReady(requestedTime, endpoint, maxTries=DEFAULT_MAX_TRIES, timeout=DEFAULT_TIMEOUT) {
            console.log('Checking if copy is ready...', requestedTime)
            try {
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
            } catch (error) {
                console.error('Error checking if copy is ready:', error.message);
            }
        },
        async retrieveCopy(copy, endpoint, copyId) {
            console.log('Retrieving copy...', copyId);
            try {
                copy.isGenerating = true;
                this.startCountdown(copy);
                const response = await axios.get(endpoint + copyId);
                copy.data = response.data;
                copy.isGenerating = false;
            } catch (error) {
                console.error('Error retrieving copy:', error.message);
            }
        },
        async updateCopy(copy, endpoint) {
            console.log('Updating copy...', copy.data.id);
            try {
                await axios.patch(endpoint + copy.data.id, copy.data);
            } catch (error) {
                console.error('Error updating copy:', error.message);
            }
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