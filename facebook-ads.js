// Requires authentication.js
// Requires settings.js
// Requires common.js
// Requires inspirational-quotes.js

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
                quoteOfTheDay: getQuoteOfTheDay(),

                loading: true, // Whether the page is loading
                avatars: avatars,
                solution: solutions[0],
                originalSolution: { ...solutions[0] }, // Disable checkboxes if the value is the same as the original
                avatarSelection: SELECT_ONE, 
                avatarName: '',
                painSuggestionIndex: 3, // The starting index for the pain suggestions
                desireSuggestionIndex: 3, // The starting index for the desire suggestions

                tries: 0, // Current number of tries to load the avatar
                copyCountdownMessage: '', // The message to display while the copy is being generated

                // isIndustryCheckboxChecked: true,
                // isResultCheckboxChecked: true,
                // isCtaCheckboxChecked: true,
                // isObjectionsCheckboxChecked: true,
                // isStyleCheckboxChecked: true,

                avatar: {
                    requestedTime: undefined,
                    copy: undefined,
                    isLoading: false // Whether the copy is currently being generated (for the loading animation)
                },

                copies: {
                    text1: {
                        requestedTime: undefined,
                        copy: undefined,
                        isLoading: false 
                    },
                    text2: {
                        requestedTime: undefined,
                        copy: undefined,
                        isLoading: false
                    },
                    text3: {
                        requestedTime: undefined,
                        copy: undefined,
                        isLoading: false
                    },
                    text4: {
                        requestedTime: undefined,
                        copy: undefined,
                        isLoading: false
                    },
                    text5: {
                        requestedTime: undefined,
                        copy: undefined,
                        isLoading: false
                    },
                    headlines: {
                        requestedTime: undefined,
                        copy: undefined,
                        isLoading: false
                    },
                    descriptions: {
                        requestedTime: undefined,
                        copy: undefined,
                        isLoading: false
                    }
                }
            }
        },
        watch: {
            'avatar.isLoading'(newValue) {
                this.startCopyCountdownMessage(this.avatar);
            }
            // 'copies.*.isLoading'(newValue, oldValue) {
            //     console.log('Loading:', newValue);
            // }
        },
        computed: {
            isAddNew() {
                return this.avatarSelection === ADD_NEW;
            },
            isSelectOne() {
                return this.avatarSelection === SELECT_ONE;
            },
            areCopiesLoading() { // The 'generate' button will be hidden while the copies are loading
                return Object.values(this.copies).some(copy => copy.isLoading);
            } 
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
            // }
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
                this.avatar.copy = null;
                console.log('Avatar cleared...');
            },
            addNewAvatar() {
                console.log('Preparing to create avatar...');
            },
            retrieveAvatar(avatarId) {
                console.log(`Retrieving avatar ${avatarId}...`);
                axios.get(apiEndpoints.avatars + avatarId)
                    .then(response => this.avatar.copy = response.data)
                    .catch(error => console.error('Error retrieving avatar:', error.response.data));
            },
            refreshClicked(event) {
                const maxPainSuggestions = this.avatar.copy.pain_suggestions.length - 1;
                const maxDesireSuggestions = this.avatar.copy.desire_suggestions.length - 1;
                const button = event.currentTarget;
                let index = button.dataset.index;

                console.log('Refresh clicked...');
                console.log('Button:', button);
                console.log('Index:', index);

                // Go down the list of suggestions every time the refresh button is clicked, until we reach the end, then start over
                if (index < 3) { // Pains (0, 1, 2)
                    this.avatar.copy.pains[index] = this.avatar.copy.pain_suggestions[this.painSuggestionIndex];
                    this.painSuggestionIndex = this.painSuggestionIndex < maxPainSuggestions ? this.painSuggestionIndex + 1 : 0;
                } else { // Desires (3, 4, 5)
                    index = index - 3;
                    this.avatar.copy.desires[index] = this.avatar.copy.desire_suggestions[this.desireSuggestionIndex];
                    this.desireSuggestionIndex = this.desireSuggestionIndex < maxDesireSuggestions ? this.desireSuggestionIndex + 1 : 0;
                }
            },
            createClicked() {
                this.createAvatar();
            },
            createAvatar() {
                const payload = {
                    "industry": this.solution.industry,
                    "target_market": this.avatarName
                }
                this.generateCopy(this.avatar, apiEndpoints.avatars, apiEndpoints.avatars, payload)
                    .then(() => window.location.reload())
                    .catch(error => console.error('Error creating avatar:', error.response.data));
            },
            generateClicked() {
                this.generateCopies();
                this.updateAvatar();
                this.updateSolution();
            },
            updateAvatar() {
                const endpoint = apiEndpoints.avatars + this.avatar.copy.id;
                // logJSON('Avatar:', this.avatar.copy);
                axios.patch(endpoint, this.avatar.copy)
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
                console.log('Generating copies...');
                const commonPayload = {
                    avatar: this.avatar.copy.id,
                    ...this.avatar.copy,
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
                this.clearCopies();
                this.generateCopy(this.copies.text1, apiEndpoints.facebookAdsText, apiEndpoints.copies, text1Payload)
                    .then(() => this.generateCopy(this.copies.text2, apiEndpoints.facebookAdsText, apiEndpoints.copies, text2Payload))
                    .then(() => this.generateCopy(this.copies.text3, apiEndpoints.facebookAdsTemplatedText, apiEndpoints.copies, text3Payload))
                    .then(() => this.generateCopy(this.copies.text4, apiEndpoints.facebookAdsTemplatedText, apiEndpoints.copies, text4Payload))
                    .then(() => this.generateCopy(this.copies.text5, apiEndpoints.facebookAdsTemplatedText, apiEndpoints.copies, text5Payload))
                    .then(() => this.generateCopy(this.copies.headlines, apiEndpoints.facebookAdsHeadlines, apiEndpoints.copies, headlinesPayload))
                    .then(() => this.generateCopy(this.copies.descriptions, apiEndpoints.facebookAdsDescriptions, apiEndpoints.copies, descriptionsPayload))
                    .catch(error => console.error('An error has occurred:', error.response.data));
            },
            clearCopies() {
                console.log('Clearing copies...');
                Object.values(this.copies).forEach(copy => {
                    copy.requestedTime = undefined;
                    if (copy.copy) {
                        copy.copy.copy = undefined;
                    }
                });
            },
            async startCopyCountdownMessage(copy) {
                this.copyCountdownMessage = '';
                for (let i = 0; i < COPY_COUNTDOWN_MESSAGE.length; i++) {
                    this.copyCountdownMessage += COPY_COUNTDOWN_MESSAGE[i];
                    await delay(1000);
                    if (!copy.isLoading) {
                        break;
                    }
                }
            },
            generateCopy(copy, generationEndpoint, checkingEndpoint, payload) {
                console.log('Generating copy...', copy);
                copy.requestedTime = new Date().toISOString(); // Timestamp for identifying the copy after it's generated
                payload.requested_time = copy.requestedTime;
                return axios.post(generationEndpoint, payload)
                    .then(() => this.checkCopyReady(copy, checkingEndpoint));
            },
            async checkCopyReady(copy, endpoint, maxTries=DEFAULT_MAX_TRIES, timeout=DEFAULT_TIMEOUT) {
                // Check whether the copy is ready by querying its requested timestamp
                // If not, wait a while and keep trying until either the copy is ready or max tries is reached
                console.log('Checking copy ready...', copy.requestedTime)
                endpoint += '?requested_time=' + copy.requestedTime;
                copy.isLoading = true; // Show the 'generating' animation
                let tries = 0;
                while (tries < maxTries) {
                    const response = await axios.get(endpoint);
                    if (response.data.length > 0) {
                        copy.copy = response.data[0];
                        break;
                    } else {
                        await delay(timeout);
                        tries++;
                        console.log('Tries:', tries, '/', maxTries);
                    }
                }
                if (tries >= maxTries) {
                    console.error('Max tries reached. Copy not ready.');
                }
                copy.isLoading = false; // Hide the 'generating' animation
            },
            copyClicked(event) {
                copyToClipboard(event);
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