// Requires authentication.js
// Requires settings.js
// Requires common.js
// Requires countdown.js
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
                troubleshooting: 'troubleshooting',

                tries: 0, // Current number of tries to load the avatar

                ...copies.data,

                copies: {
                    avatar: {...copies.data.copy},
                    text1: {...copies.data.copy},
                    text2: {...copies.data.copy},
                    text3: {...copies.data.copy},
                    text4: {...copies.data.copy},
                    text5: {...copies.data.copy},
                    headlines: {...copies.data.copy},
                    descriptions: {...copies.data.copy}
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
            isGeneratingAny: copies.computed.isGeneratingAny
        },
        methods: {
            startCountdown: copies.method.startCountdown,
            generateCopy: copies.method.generateCopy,
            checkCopyReady: copies.method.checkCopyReady,
            clearProperty: copies.method.clearProperty,
            avatarSelectionChanged() {
                console.log(`Avatar ${this.avatarSelection} selected...`);
                if (this.isSelectOne) {
                    console.log('Clearing avatar...');
                    this.copies.avatar.data = null;
                } else if (this.isAddNew) {
                    this.addNewAvatar();
                } else {
                    this.retrieveAvatar(this.avatarSelection);
                }
            },
            addNewAvatar() {
                console.log('Preparing to create avatar...');
            },
            retrieveAvatar(avatarId) {
                console.log(`Retrieving avatar ${avatarId}...`);
                axios.get(apiEndpoints.avatars + avatarId)
                    .then(response => this.copies.avatar.data = response.data)
                    .catch(error => console.error('Error retrieving avatar:', error.response.data));
            },
            refreshClicked(event) {
                const maxPainSuggestions = this.copies.avatar.data.pain_suggestions.length - 1;
                const maxDesireSuggestions = this.copies.avatar.data.desire_suggestions.length - 1;
                const button = event.currentTarget;
                let index = button.dataset.index;

                console.log('Refresh clicked...');
                console.log('Button:', button);
                console.log('Index:', index);

                // Go down the list of suggestions every time the refresh button is clicked, until we reach the end, then start over
                if (index < 3) { // Pains (0, 1, 2)
                    this.copies.avatar.data.pains[index] = this.copies.avatar.data.pain_suggestions[this.painSuggestionIndex];
                    this.painSuggestionIndex = this.painSuggestionIndex < maxPainSuggestions ? this.painSuggestionIndex + 1 : 0;
                } else { // Desires (3, 4, 5)
                    index = index - 3;
                    this.copies.avatar.data.desires[index] = this.copies.avatar.data.desire_suggestions[this.desireSuggestionIndex];
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
                this.generateCopy(this.copies.avatar, apiEndpoints.avatars, apiEndpoints.avatars, payload)
                    .then(() => window.location.reload())
                    .catch(error => console.error('Error creating avatar:', error.response.data));
            },
            generateClicked() {
                this.generateCopies();
                this.updateAvatar();
                this.updateSolution();
            },
            updateAvatar() {
                const endpoint = apiEndpoints.avatars + this.copies.avatar.data.id;
                // logJSON('Avatar:', this.copies.avatar.data);
                axios.patch(endpoint, this.copies.avatar.data)
                    .then(response => console.log('Avatar updated...'))
                    .catch(error => console.error('Error updating avatar:', error.message));
            },
            updateSolution() {
                // logJSON('Solution:', this.solution);

                const endpoint = apiEndpoints.solutions + this.solution.id;
                // console.log(endpoint);

                axios.patch(endpoint, this.solution)
                    .then(response => console.log('Solution updated...'))
                    .catch(error => console.error('Error updating solution:', error));
            },
            generateCopies() {
                console.log('Generating copies...');
                const commonPayload = {
                    avatar: this.copies.avatar.data.id,
                    ...this.copies.avatar.data,
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
                this.clearProperty('copy');
                this.generateCopy(this.copies.text1, apiEndpoints.facebookAdsText, apiEndpoints.copies, text1Payload)
                    .then(() => this.generateCopy(this.copies.text2, apiEndpoints.facebookAdsText, apiEndpoints.copies, text2Payload))
                    .then(() => this.generateCopy(this.copies.text3, apiEndpoints.facebookAdsTemplatedText, apiEndpoints.copies, text3Payload))
                    .then(() => this.generateCopy(this.copies.text4, apiEndpoints.facebookAdsTemplatedText, apiEndpoints.copies, text4Payload))
                    .then(() => this.generateCopy(this.copies.text5, apiEndpoints.facebookAdsTemplatedText, apiEndpoints.copies, text5Payload))
                    .then(() => this.generateCopy(this.copies.headlines, apiEndpoints.facebookAdsHeadlines, apiEndpoints.copies, headlinesPayload))
                    .then(() => this.generateCopy(this.copies.descriptions, apiEndpoints.facebookAdsDescriptions, apiEndpoints.copies, descriptionsPayload))
                    .catch(error => console.error('An error has occurred:', error.response.data));
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