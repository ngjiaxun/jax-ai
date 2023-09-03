(async function main() {
    try {
        const user = await preInit();
        const avatars = await axios.get(endpoints.avatars);
        const solutions = await axios.get(endpoints.solutions);
        modifyAttributes();
        runVue(user, avatars.data, solutions.data);
    } catch (error) {
        console.error('Error initializing Jax AI:', error.message);
    }
})();

// Hack for adding or modifying attributes where Webflow doesn't allow directly
function modifyAttributes() {
    const option = document.querySelector('#avatar-select-field').options[1]; // The option after 'Select one...' in the avatar select field
    option.setAttribute('v-for', 'avatar in avatars');
    option.setAttribute(':key', 'avatar.id');
    option.removeAttribute('value'); // Webflow adds this attribute automatically, which prevents Vue from binding the value
    option.setAttribute(':value', 'avatar.id');
}

function runVue(user, avatars, solutions) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                user: user,
                quoteOfTheDay: getQuoteOfTheDay(),

                avatars: avatars,
                avatarSelection: SELECT_ONE,
                avatarName: '',
                avatarLoadingMessage: AVATAR_LOADING_MESSAGES[0],
                painSuggestionIndex: 3, // The starting index for the pain suggestions
                desireSuggestionIndex: 3, // The starting index for the desire suggestions

                ...copies.data,

                copies: {
                    solution: { data: solutions[0] },
                    avatar: { ...copies.copy },
                    text1: { ...copies.copy },
                    text2: { ...copies.copy },
                    text3: { ...copies.copy },
                    text4: { ...copies.copy },
                    text5: { ...copies.copy },
                    headlines: { ...copies.copy },
                    descriptions: { ...copies.copy }
                }
            }
        },
        watch: {
            avatarSelection: 'avatarSelectionChanged'
        },
        computed: {
            ...copies.computed,
            isAddNew() {
                return this.avatarSelection === ADD_NEW;
            },
            isSelectOne() {
                return this.avatarSelection === SELECT_ONE;
            },
            isPainSectionVisible() {
                return !this.isAddNew && !this.isSelectOne && this.copies.avatar.data;
            },
            isStepTwoSectionVisible() {
                return !this.isGeneratingAny && !this.isAddNew && !this.isSelectOne;
            }
        },
        methods: {
            ...copies.methods,
            ...util.methods,
            avatarSelectionChanged() {
                if (this.isSelectOne) {
                    console.log('Clearing avatar...');
                    this.copies.avatar.data = null;
                } else if (this.isAddNew) {
                    console.log('Add new avatar selected...');
                } else {
                    this.avatarLoadingMessage = AVATAR_LOADING_MESSAGES[0];
                    this.retrieveCopy(this.copies.avatar, endpoints.avatars, this.avatarSelection);
                }
            },
            refreshClicked(event) {
                const maxPainSuggestions = this.copies.avatar.data.pain_suggestions.length - 1;
                const maxDesireSuggestions = this.copies.avatar.data.desire_suggestions.length - 1;
                const button = event.currentTarget;
                let index = button.dataset.index;

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
                this.avatarLoadingMessage = AVATAR_LOADING_MESSAGES[1];
                this.createAvatar();
            },
            createAvatar() {
                const payload = {
                    "industry": this.copies.solution.data.industry,
                    "target_market": this.avatarName
                }
                this.generateCopy(this.copies.avatar, endpoints.avatars, endpoints.avatars, payload)
                    .then(() => window.location.reload())
                    .catch(error => console.error('Error creating avatar:', error.response.data));
            },
            generateClicked() {
                this.generateCopies();
                this.updateCopy(this.copies.avatar, endpoints.avatars);
                this.updateCopy(this.copies.solution, endpoints.solutions);
            },
            generateCopies() {
                console.log('Generating copies...');
                const commonPayload = {
                    avatar: this.copies.avatar.data.id,
                    ...this.copies.avatar.data,
                    ...this.copies.solution.data
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
                this.clearProp('copy');
                this.generateCopy(this.copies.text1, endpoints.facebookAdsText, endpoints.copies, text1Payload)
                    .then(() => this.generateCopy(this.copies.text2, endpoints.facebookAdsText, endpoints.copies, text2Payload))
                    .then(() => this.generateCopy(this.copies.text3, endpoints.facebookAdsTemplatedText, endpoints.copies, text3Payload))
                    .then(() => this.generateCopy(this.copies.text4, endpoints.facebookAdsTemplatedText, endpoints.copies, text4Payload))
                    .then(() => this.generateCopy(this.copies.text5, endpoints.facebookAdsTemplatedText, endpoints.copies, text5Payload))
                    .then(() => this.generateCopy(this.copies.headlines, endpoints.facebookAdsHeadlines, endpoints.copies, headlinesPayload))
                    .then(() => this.generateCopy(this.copies.descriptions, endpoints.facebookAdsDescriptions, endpoints.copies, descriptionsPayload))
                    .catch(error => console.error('An error has occurred:', error.response.data));
            },
            copyClicked(event) {
                copyToClipboard(event);
            }
        },
        mounted() {
            this.init();
            this.avatarSelection = (this.avatars && this.avatars.length) ? this.avatars[0].id : this.avatarSelection; // Select the first avatar by default
        }
    }).mount('#app')
}