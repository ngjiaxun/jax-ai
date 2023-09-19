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

function runVue(user, avatars, solutions) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                user: user,
                avatars: avatars,
                avatarSelection: SELECT_ONE,
                avatarName: '',
                avatarLoadingMessage: AVATAR_LOADING_MESSAGES[0],
                painSuggestionIndex: 3, // The starting index for the pain suggestions
                desireSuggestionIndex: 3, // The starting index for the desire suggestions

                ...copies.data,

                solution: { data: solutions[0] },
                avatar: { ...copies.copy },
                copies: {
                    // Original versions
                    text1: { ...copies.copy },
                    text2: { ...copies.copy },
                    text3: { ...copies.copy },
                    text4: { ...copies.copy },
                    text5: { ...copies.copy },
                    headlines: { ...copies.copy },
                    descriptions: { ...copies.copy },

                    // Spin versions
                    text1Spin: { ...copies.copy },
                    text2Spin: { ...copies.copy },
                    text3Spin: { ...copies.copy },
                    text4Spin: { ...copies.copy },
                    text5Spin: { ...copies.copy },
                    headlinesSpin: { ...copies.copy },
                    descriptionsSpin: { ...copies.copy }
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
                return !this.isAddNew && !this.isSelectOne && this.avatar.data;
            },
            isStepOneSectionVisible() {
                return !this.isAnyGenerating(this.copies) && !this.avatar.isGenerating && !this.isAnyReady(this.copies);
            },
            isStepTwoSectionVisible() {
                return !this.isAnyGenerating(this.copies) && !this.avatar.isGenerating && !this.isAnyReady(this.copies) && !this.isAddNew && !this.isSelectOne;
            },
            isStepThreeSectionVisible() {
                return this.isStepTwoSectionVisible;
            },
            isCopiesSectionVisible() {
                return this.isAnyGenerating(this.copies) || this.isAnyReady(this.copies);
            }
        },
        methods: {
            ...authentication.methods,
            ...util.methods,
            ...copies.methods,
            avatarSelectionChanged() {
                if (this.isSelectOne) {
                    console.log('Clearing avatar...');
                    this.avatar.data = null;
                } else if (this.isAddNew) {
                    console.log('Add new avatar selected...');
                } else {
                    this.avatarLoadingMessage = AVATAR_LOADING_MESSAGES[0];
                    this.retrieveCopy(this.avatar, endpoints.avatars, this.avatarSelection);
                }
            },
            refreshClicked(event) {
                const maxPainSuggestions = this.avatar.data.pain_suggestions.length - 1;
                const maxDesireSuggestions = this.avatar.data.desire_suggestions.length - 1;
                const button = event.currentTarget;
                let index = button.dataset.index;

                // Go down the list of suggestions every time the refresh button is clicked, until we reach the end, then start over
                if (index < 3) { // Pains (0, 1, 2)
                    this.avatar.data.pains[index] = this.avatar.data.pain_suggestions[this.painSuggestionIndex];
                    this.painSuggestionIndex = this.painSuggestionIndex < maxPainSuggestions ? this.painSuggestionIndex + 1 : 0;
                } else { // Desires (3, 4, 5)
                    index = index - 3;
                    this.avatar.data.desires[index] = this.avatar.data.desire_suggestions[this.desireSuggestionIndex];
                    this.desireSuggestionIndex = this.desireSuggestionIndex < maxDesireSuggestions ? this.desireSuggestionIndex + 1 : 0;
                }
            },
            createClicked() {
                this.avatarLoadingMessage = AVATAR_LOADING_MESSAGES[1];
                this.createAvatar();
            },
            createAvatar() {
                const payload = {
                    "industry": this.solution.data.industry,
                    "target_market": this.avatarName
                }
                this.generateCopy(this.avatar, endpoints.avatars, endpoints.avatars, payload)
                    .then(() => window.location.reload())
                    .catch(error => console.error('Error creating avatar:', error.response.data));
            },
            generateClicked() {
                this.generateCopies();
                this.updateCopy(this.avatar, endpoints.avatars);
                this.updateCopy(this.solution, endpoints.solutions);
            },
            async generateCopies() {
                console.log('Generating copies...');
                try {
                    const commonPayload = {
                        avatar: this.avatar.data.id,
                        ...this.avatar.data,
                        ...this.solution.data
                    }
                    const text1Payload = {
                        ...commonPayload,
                        prompt_id: 0
                    }
                    const text2Payload = {
                        ...commonPayload,
                        prompt_id: 1
                    }
                    const text3Payload = {
                        ...commonPayload,
                        prompt_id: 2
                    }
                    const text4Payload = {
                        ...commonPayload,
                        prompt_id: 3
                    }
                    const text5Payload = {
                        ...commonPayload,
                        prompt_id: 4
                    }
                    const headlinesPayload = {
                        ...commonPayload,
                        no_of_headlines: 20,
                        max_characters: 40
                    }
                    const descriptionsPayload = {
                        ...commonPayload,
                        no_of_headlines: 20,
                        max_characters: 20
                    }
                    const captionsPayload = {
                        ...commonPayload,
                        no_of_headlines: 20,
                        max_characters: 120
                    }
    
                    // Original
                    let text1 = await this.generateCopy(this.copies.text1, endpoints.facebookAdsText, endpoints.copies, text1Payload);
                    let text2 = await this.generateCopy(this.copies.text2, endpoints.facebookAdsText, endpoints.copies, text2Payload);
                    let text3 = await this.generateCopy(this.copies.text3, endpoints.facebookAdsText, endpoints.copies, text3Payload);
                    let text4 = await this.generateCopy(this.copies.text4, endpoints.facebookAdsText, endpoints.copies, text4Payload);
                    let text5 = await this.generateCopy(this.copies.text5, endpoints.facebookAdsText, endpoints.copies, text5Payload);
                    let headlines = await this.generateCopy(this.copies.headlines, endpoints.facebookAdsHeadlines, endpoints.copies, headlinesPayload);
                    let descriptions = await this.generateCopy(this.copies.descriptions, endpoints.facebookAdsHeadlines, endpoints.copies, descriptionsPayload);

                    // Spin
                    if (this.solution.data.spin) {
                        const spinPayload = { transformation: this.solution.data.spin }
                        text1 = await this.generateCopy(this.copies.text1Spin, endpoints.spin, endpoints.copies, { ...spinPayload, transform_from: text1.data.id });
                        text2 = await this.generateCopy(this.copies.text2Spin, endpoints.spin, endpoints.copies, { ...spinPayload, transform_from: text2.data.id });
                        text3 = await this.generateCopy(this.copies.text3Spin, endpoints.spin, endpoints.copies, { ...spinPayload, transform_from: text3.data.id });
                        text4 = await this.generateCopy(this.copies.text4Spin, endpoints.spin, endpoints.copies, { ...spinPayload, transform_from: text4.data.id });
                        text5 = await this.generateCopy(this.copies.text5Spin, endpoints.spin, endpoints.copies, { ...spinPayload, transform_from: text5.data.id });
                        // headlines = await this.generateCopy(this.copies.headlinesSpin, endpoints.spin, endpoints.copies,  { ...spinPayload, transform_from: headlines.data.id });
                        descriptions = await this.generateCopy(this.copies.descriptionsSpin, endpoints.spin, endpoints.copies, { ...spinPayload, transform_from: descriptions.data.id });
                    }
                } catch (error) {
                    console.error('Error generating copies:', error.response.data);
                }
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

// Hack for adding or modifying attributes where Webflow doesn't allow directly
function modifyAttributes() {
    const option = document.querySelector('#avatar-select-field').options[1]; // The option after 'Select one...' in the avatar select field
    option.setAttribute('v-for', 'avatar in avatars');
    option.setAttribute(':key', 'avatar.id');
    option.removeAttribute('value'); // Webflow adds this attribute automatically, which prevents Vue from binding the value
    option.setAttribute(':value', 'avatar.id');
}