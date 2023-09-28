const DEFAULT_TIMEOUT = 5000;
const DEFAULT_MAX_TRIES = 12;
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
    ' ',
    'Thanks',
    ' ',
    'for',
    ' ',
    'your', 
    ' ',
    'patience',
    '.',
    '.',
    '.',
    ' ',
    ' ',
    ' ',
    ' ',
    'Our servers may be busy.',
    ' ',
    'Please try again later.',
    ' ',
    'If this problem persists,',
    ' ',
    'please contact support.',
];

class Copy {
    constructor(endpoint=endpoints.transform, checkingEndpoint=endpoints.copies) {
        this.data = null;
        this.isGenerating = false;
        this.endpoint = endpoint;
        this.checkingEndpoint = checkingEndpoint;
    }
}

class Copyset {
    constructor(endpoint, checkingEndpoint=endpoints.copies) {
        this.original = new Copy(endpoint, checkingEndpoint);
        this.spun = new Copy();
        this.styled = new Copy();
        this.translated = new Copy();
    }
}

const copies = {
    copy: {
        data: null, // Returned data from the endpoint
        isGenerating: false, // Individual copies must keep track of this to prevent async issues with "countdownMessage"
        endpoint: endpoints.transform, // Generation endpoint
        checkingEndpoint: endpoints.copies // Endpoint for checking if the copy is ready
    },
    // copyset: {
    //     original: { 
    //         ...copies.copy,
    //         endpoint: null
    //     },
    //     spun: { ...copies.copy },
    //     styled: { ...copies.copy },
    //     translated: { ...copies.copy }
    // },
    data: {
        countdownMessage: '' // Only one thing can load or generate at a time, so this is fine
    },
    computed: {
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
        async generateCopy(copy, payload) {
            console.log('Generating copy...');
            try {
                const requestedTime = new Date().toISOString(); // Timestamp for identifying the copy after it's generated
                payload.requested_time = requestedTime;
                await axios.post(copy.endpoint, payload);
                copy.isGenerating = true; 
                this.startCountdown(copy);
                copy.data = await this.checkCopyReady(requestedTime, copy.checkingEndpoint);
                copy.isGenerating = false; 
            } catch (error) {
                console.error('Error generating copy:', error.response.data);
            }
            return copy;
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
                console.error('Error checking if copy is ready:', error.response.data);
            }
        },
        async listCopies(copy, endpoint, { ...args}={}, ordering=null) {
            console.log('Listing copies...');
            try {
                copy.isGenerating = true;
                this.startCountdown(copy);
                endpoint += '?' + Object.entries(args).map(([key, value]) => `${key}=${value}`).join('&');
                endpoint += ordering ? `&ordering=${ordering}` : '';
                const response = await axios.get(endpoint);
                copy.data = response.data;
                copy.isGenerating = false;
            } catch (error) {
                console.error('Error listing copies:', error.message);
            }
        },
        // Use this instead of generateCopy() for endpoints that don't require polling to check if the copy is ready
        async createCopy(copy, endpoint, payload=copy.data) { 
            console.log('Creating copy...');
            try {
                const response = await axios.post(endpoint, payload);
                copy.data = response.data;
            } catch (error) {
                console.error('Error creating copy:', error.response.data);
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
                console.error('Error retrieving copy:', error.response.data);
            }
        },
        async updateCopy(copy, endpoint) {
            console.log('Updating copy...', copy.data.id);
            try {
                await axios.patch(endpoint + copy.data.id, copy.data);
            } catch (error) {
                console.error('Error updating copy:', error.response.data);
            }
        },
        isAnyGenerating(copies) {
            return Object.values(copies).some(copy => copy.isGenerating);
        },
        isAnyReady(copies) {
            return Object.values(copies).some(copy => copy.data);
        },
        isArray(copy, key='copy') {
            if (copy.data) {
                return Array.isArray(copy.data[key]);
            } else {
                return Array.isArray(copy[key]);
            }
        }
    }
};