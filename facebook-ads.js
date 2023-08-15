// Requires authentication.js
// Requires settings.js

modifyTags();
modifyAttributes();
listAvatarsAndSolutions();

// Add or modify tags where Webflow doesn't allow direct
function modifyTags() {
    const transition = document.querySelector('Transition');
    const loadingAnimation = document.getElementById('loading-animation');
    transition.appendChild(loadingAnimation);
}

// Add or modify attributes where Webflow doesn't allow directly
function modifyAttributes() {
    const option = document.querySelector('#avatar-select-field').options[1]; // The option after 'Select one...' in the avatar select field
    option.setAttribute('v-for', 'avatar in avatars');
    option.setAttribute(':key', 'avatar.id');
    option.removeAttribute('value'); // Webflow adds this attribute automatically, which prevents Vue from binding the value
    option.setAttribute(':value', 'avatar.id');
}

function listAvatarsAndSolutions() {
    const requests = [
        axios.get(apiEndpoints.avatars),
        axios.get(apiEndpoints.solutions),
        new Promise(resolve => setTimeout(resolve, 2000)) // Let the loading animation play at least once
    ];
    Promise.all(requests)
        .then(responses => runVue(responses[0].data, responses[1].data))
        .catch(error => console.error('Error fetching data:', error.message));
}

function runVue(avatars, solutions) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                loading: true, // Whether the page is loading
                avatars: avatars,
                solution: solutions[0],
                originalSolution: { ...solutions[0] }, // Disable checkboxes if the value is the same as the original
                avatar: null,
                avatarSelection: SELECT_ONE, 
                avatarName: '',
                painSuggestionIndex: 3, // The starting index for the pain suggestions
                desireSuggestionIndex: 3, // The starting index for the desire suggestions

                tries: 0, // Current number of tries to load the avatar
                defaultMaxTries: 5, // The default maximum number of times to try to load something
                defaultTimeout: 5000, // The default amount of time to wait before trying to load something again
                loadingMessages: LOADING_MESSAGES,
                takingTooLongMessage: TAKING_TOO_LONG_MESSAGE,
                copyCountdownMessage: '', // The message to display while the copy is being generated

                // isIndustryCheckboxChecked: true,
                // isResultCheckboxChecked: true,
                // isCtaCheckboxChecked: true,
                // isObjectionsCheckboxChecked: true,
                // isStyleCheckboxChecked: true,

                copies: {
                    text1: {
                        requestedTime: undefined,
                        copy: '',
                        isLoading: false // Whether the copy is currently being generated (for the loading animation)
                    },
                    text2: {
                        requestedTime: undefined,
                        copy: '',
                        isLoading: false
                    },
                    text3: {
                        requestedTime: undefined,
                        copy: '',
                        isLoading: false
                    },
                    text4: {
                        requestedTime: undefined,
                        copy: '',
                        isLoading: false
                    },
                    text5: {
                        requestedTime: undefined,
                        copy: '',
                        isLoading: false
                    },
                    headlines: {
                        requestedTime: undefined,
                        copy: '',
                        isLoading: false
                    },
                    descriptions: {
                        requestedTime: undefined,
                        copy: '',
                        isLoading: false
                    }
                }
            }
        },
        computed: {
            isAddNew() {
                return this.avatarSelection === ADD_NEW;
            },
            isSelectOne() {
                return this.avatarSelection === SELECT_ONE;
            },
            // isIndustryCheckboxDisabled() {
            //     return this.solution.industry === this.originalSolution.industry;
            // },
            // isResultCheckboxDisabled() {
            //     return this.solution.result === this.originalSolution.result;
            // },
            // isCtaCheckboxDisabled() {
            //     return this.solution.lead_magnet === this.originalSolution.lead_magnet;
            // },
            // isObjectionsCheckboxDisabled() {
            //     return this.solution.objections === this.originalSolution.objections;
            // },
            // isStyleCheckboxDisabled() {
            //     return this.solution.style === this.originalSolution.style;
            // },
            areCopiesLoading() { // The 'generate' button will be hidden while the copies are loading
                return this.copies.text1.loading || this.copies.text2.loading;
            }
        },
        methods: {
            avatarSelectionChanged() {
                console.log(`Avatar ${this.avatarSelection} selected...`);
                if (this.isSelectOne) {
                    this.clearAvatar();
                } else if (this.isAddNew) {
                    this.addNewAvatar();
                } else {
                    this.retrieveAvatar(this.avatarSelection);
                }
            },
            clearAvatar() {
                console.log('Clearing avatar...');
                this.avatar = null;
                console.log('Avatar cleared...');
            },
            addNewAvatar() {
                console.log('Preparing to create avatar...');
            },
            retrieveAvatar(avatarId) {
                console.log(`Loading avatar ${avatarId}...`);
                axios.get(apiEndpoints.avatars + avatarId)
                    .then(this.retrieveAvatarSuccess)
                    .catch(error => console.error('Error loading avatar:', error.message));
            },
            retrieveAvatarSuccess(response) {
                // logJSON('Avatar loaded...', response.data);
                this.avatar = response.data;
            },
            refreshClicked(event) {
                const max = MAX_SUGGESTIONS - 1;
                const button = event.currentTarget;
                let index = button.dataset.index;

                console.log('Refresh clicked...');
                console.log('Button:', button);
                console.log('Index:', index);

                // Go down the list of suggestions every time the refresh button is clicked, until we reach the end, then start over
                if (index < 3) { // Pains (0, 1, 2)
                    this.avatar.pains[index] = this.avatar.pain_suggestions[this.painSuggestionIndex];
                    this.painSuggestionIndex = this.painSuggestionIndex < max ? this.painSuggestionIndex + 1 : 0;
                } else { // Desires (3, 4, 5)
                    index = index - 3;
                    this.avatar.desires[index] = this.avatar.desire_suggestions[this.desireSuggestionIndex];
                    this.desireSuggestionIndex = this.desireSuggestionIndex < max ? this.desireSuggestionIndex + 1 : 0;
                }
            },
            createClicked() {
                console.log('Create clicked...');
                const data = {
                    "industry": this.solution.industry,
                    "target_market": this.avatarName
                }
                axios.post(apiEndpoints.avatars, data)
                    .then(this.createAvatar)
                    .catch(error => console.error('Error creating avatar:', error.message));
            },
            createAvatar(response) {
                $('#processing-animation').fadeIn(500);
                this.checkAvatarCreated(null);
            },
            checkAvatarCreated(response) {
                const maxTries = 5; // Number of times to try to load the avatar
                const timeout = 5000; // How long to wait before checking again
                const numAvatars = response ? response.data.length : 0;
                console.log('Number of avatars:', numAvatars);
                $('#processing-message').text(this.loadingMessages[this.tries]);
                if (numAvatars > this.avatars.length) {
                    window.location.reload();
                } else if (this.tries < maxTries) {
                    this.tries++;
                    setTimeout(() => {
                        axios.get(apiEndpoints.avatars)
                            .then(this.checkAvatarCreated)
                            .catch(error => console.error('Error listing avatars:', error.message));
                    }, timeout);
                } else {
                    $('#processing-message').text(this.takingTooLongMessage);
                    setTimeout(() => window.location.reload(), timeout);
                }
            },
            generateClicked() {
                this.generateCopies();
                this.updateAvatar();
                this.updateSolution();
            },
            updateAvatar() {
                const endpoint = apiEndpoints.avatars + this.avatar.id;
                // logJSON('Avatar:', this.avatar);
                axios.patch(endpoint, this.avatar)
                    .then(response => console.log('Avatar updated...'))
                    .catch(error => console.error('Error updating avatar:', error.message));
            },
            updateSolution() {
                // logJSON('Solution:', this.solution);

                const endpoint = apiEndpoints.solutions + this.solution.id;
                // console.log(endpoint);

                // Update only the fields with 'set default' checkbox checked
                // this.solution.industry = this.isIndustryCheckboxChecked ? this.solution.industry : this.originalSolution.industry;
                // this.solution.result = this.isResultCheckboxChecked ? this.solution.result : this.originalSolution.result;
                // this.solution.lead_magnet = this.isCtaCheckboxChecked ? this.solution.lead_magnet : this.originalSolution.lead_magnet;
                // this.solution.objections = this.isObjectionsCheckboxChecked ? this.solution.objections : this.originalSolution.objections;
                // this.solution.style = this.isStyleCheckboxChecked ? this.solution.style : this.originalSolution.style;
                axios.patch(endpoint, this.solution)
                    .then(response => console.log('Solution updated...'))
                    .catch(error => console.error('Error updating solution:', error));
            },
            generateCopies() {
                this.clearCopies();

                const commonPayload = {
                    avatar: this.avatar.id,
                    ...this.avatar,
                    ...this.solution
                }
                const text1Payload = {
                    ...commonPayload,
                    prompt_id: 1
                }
                const text2Payload = {
                    ...commonPayload,
                    prompt_id: 2
                }
                const text3Payload = {
                    ...commonPayload,
                    template_id: 0
                }
                const text4Payload = {
                    ...commonPayload,
                    template_id: 1
                }
                const text5Payload = {
                    ...commonPayload,
                    template_id: 2
                }
                const headlinesPayload = {
                    ...commonPayload,
                }
                const descriptionsPayload = {
                    ...commonPayload,
                }
                this.generateCopy(this.copies.text1, apiEndpoints.facebookAdsText, text1Payload)
                    .then(() => this.generateCopy(this.copies.text2, apiEndpoints.facebookAdsText, text2Payload))
                    .then(() => this.generateCopy(this.copies.text3, apiEndpoints.facebookAdsTemplatedText, text3Payload))
                    .then(() => this.generateCopy(this.copies.text4, apiEndpoints.facebookAdsTemplatedText, text4Payload))
                    .then(() => this.generateCopy(this.copies.text5, apiEndpoints.facebookAdsTemplatedText, text5Payload))
                    .then(() => this.generateCopy(this.copies.headlines, apiEndpoints.facebookAdsHeadlines, headlinesPayload))
                    .then(() => this.generateCopy(this.copies.descriptions, apiEndpoints.facebookAdsDescriptions, descriptionsPayload))
                    .catch(error => console.error('An error has occurred:', error.response.data));
                    // .then(response => this.checkCopyReady(response.data[0].requested_time))
                    // .then(() => this.generateFacebookAdsText(2))
                    // .then(() => this.delay(5000))
                    // .catch(error => console.error('An error has occurred:', error.message));
            },
            clearCopies() {
                this.copies.text1.copy = '';
                this.copies.text2.copy = '';
            },
            delay(ms=this.defaultTimeout) {
                return new Promise(resolve => setTimeout(resolve, ms)); 
            },
            async startCopyCountdownMessage(copy) {
                this.copyCountdownMessage = '';
                for (let i = 0; i < COPY_COUNTDOWN_MESSAGE.length; i++) {
                    this.copyCountdownMessage += COPY_COUNTDOWN_MESSAGE[i];
                    await this.delay(1000);
                    if (!copy.isLoading) {
                        break;
                    }
                }
            },
            generateCopy(copy, endpoint, payload) {
                copy.requestedTime = new Date().toISOString(); // Timestamp for identifying the copy after it's generated
                payload.requested_time = copy.requestedTime;
                return axios.post(endpoint, payload)
                    .then(response => this.checkCopyReady(copy));
            },
            async checkCopyReady(copy, maxTries=this.defaultMaxTries, timeout=this.defaultTimeout) {
                // Check whether the copy is ready by querying its requested timestamp
                // If not, wait a while and keep trying until either the copy is ready or max tries is reached
                console.log('Checking copy ready...', copy.requestedTime)
                copy.isLoading = true; // Show the 'generating' animation
                this.startCopyCountdownMessage(copy);
                let tries = 0;
                while (tries < maxTries) {
                    const endpoint = apiEndpoints.copies + '?requested_time=' + copy.requestedTime;
                    const response = await axios.get(endpoint);
                    if (response.data.length > 0) {
                        copy.copy = response.data[0].copy;
                        break;
                    } else {
                        await this.delay(timeout);
                        tries++;
                        console.log('Tries:', tries, '/', maxTries);
                    }
                }
                if (tries >= maxTries) {
                    console.error('Max tries reached. Copy not ready.');
                }
                copy.isLoading = false; // Hide the 'generating' animation
            },
            copyText1() {
                const text1 = document.getElementById('text1').innerText;
                navigator.clipboard.writeText(text1)
                    .then(() => console.log('Text 1 copied to clipboard:', text1))
                    .catch(error => console.error('Error copying text 1 to clipboard:', error.message));
            }
        },
        mounted() {
            const option = document.querySelector('#avatar-select-field').options[1] // The option after 'Select one...' in the avatar select field
            this.avatarSelection = option.value;
            this.avatarSelectionChanged(); // Manually call the avatar selection changed event
            this.loading = false; // Hide the page loading animation
        }
    }).mount('#app')
}