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
    'This could take a tad longer than expected. Why not treat yourself to a nice cup of joe and come back in a minute or two? 😊☕️'
];

const LEFT_BRACKET = '[~';
const RIGHT_BRACKET = '~]';

class Copy {
    constructor(endpoint=endpoints.transform, checkingEndpoint=endpoints.copies) {
        this.data = null;
        this.isGenerating = false;
        this.hasError = false;
        this.endpoint = endpoint;
        this.checkingEndpoint = checkingEndpoint;
        this.payload = null;
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
    data: {
        countdownMessage: '' // Only one thing can load or generate at a time, so this is fine
        // copysets: {} // Remember to implement
    },
    computed: {
        isAnyGenerating() {
            for (const copyset of Object.values(this.copysets)) {
                for (const copy of Object.values(copyset)) {
                    if (copy.isGenerating) {
                        return true;
                    }
                }
            }
        },
        isAnyReady() {
            for (const copyset of Object.values(this.copysets)) {
                for (const copy of Object.values(copyset)) {
                    if (copy.data) {
                        return true;
                    }
                }
            }
        },
        totalCopies() {
            return Object.keys(this.copysets).length * Object.keys(this.copysets[Object.keys(this.copysets)[0]]).length 
        },
        leftBracket() {
            return LEFT_BRACKET;
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
        async generateCopy(copy) {
            console.log('Generating copy...');
            try {
                const requestedTime = new Date().toISOString(); // Timestamp for identifying the copy after it's generated
                copy.payload.requested_time = requestedTime;
                await axios.post(copy.endpoint, copy.payload);
                copy.isGenerating = true; 
                this.startCountdown(copy);
                copy.data = await this.checkCopyReady(requestedTime, copy.checkingEndpoint);
                copy.hasError = !copy.data;
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
                console.error('Error: copy took too long to generate.');
            } catch (error) {
                console.error('Error checking if copy is ready:', error.response.data);
            }
            return null;
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
        getCopyTitle(copy) {
            const label = copy.data.label ? ' ' + copy.data.label : '';
            const copyType = LEFT_BRACKET + copy.data.original_copy_type_display + label + RIGHT_BRACKET;
            return `${copyType} ${copy.data.transformation ?? ''} ${copy.data.transformation_copy_type_display ?? ''}`;
        },
        getCopyLoadingMessage(copyset, copysetIndex, copyIndex) {
            return `Generating... ${Math.floor((copysetIndex * Object.keys(copyset).length + copyIndex) / this.totalCopies * 100)}%`;
        },
        isArray(copy) {
            if (copy.data) { // copy == copy
                return Array.isArray(copy.data.copy);
            } else if (copy.copy) { // copy == copy.data
                return Array.isArray(copy.copy);
            } else { // copy == copy.data.copy
                return Array.isArray(copy);
            }
        }
    }
};