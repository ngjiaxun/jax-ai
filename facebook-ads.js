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
                    text1: { ...copies.copy },
                    text2: { ...copies.copy },
                    text3: { ...copies.copy },
                    text4: { ...copies.copy },
                    text5: { ...copies.copy },
                    headlines: { ...copies.copy },
                    descriptions: { ...copies.copy }
                },
                spun: {
                    text1: { ...copies.copy },
                    text2: { ...copies.copy },
                    text3: { ...copies.copy },
                    text4: { ...copies.copy },
                    text5: { ...copies.copy },
                    headlines: { ...copies.copy },
                    descriptions: { ...copies.copy }
                },
                styled: {
                    text1: { ...copies.copy },
                    text2: { ...copies.copy },
                    text3: { ...copies.copy },
                    text4: { ...copies.copy },
                    text5: { ...copies.copy },
                    headlines: { ...copies.copy },
                    descriptions: { ...copies.copy }
                },
                translated: {
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
            },
            plusSpin() {
                return this.solution.data.spin ? ' + ' + this.solution.data.spin : '';
            },
            plusStyle() {
                return this.solution.data.style ? ' + ' + this.solution.data.style : '';
            },
            plusTranslation() {
                return this.solution.data.translation ? ' + ' + this.solution.data.translation : '';
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
                    const copies = {
                        text1: await this.generateCopy(this.copies.text1, endpoints.facebookAdsText, text1Payload),
                        text2: await this.generateCopy(this.copies.text2, endpoints.facebookAdsText, text2Payload),
                        text3: await this.generateCopy(this.copies.text3, endpoints.facebookAdsText, text3Payload),
                        text4: await this.generateCopy(this.copies.text4, endpoints.facebookAdsText, text4Payload),
                        text5: await this.generateCopy(this.copies.text5, endpoints.facebookAdsText, text5Payload),
                        headlines: await this.generateCopy(this.copies.headlines, endpoints.facebookAdsHeadlines, headlinesPayload),
                        descriptions: await this.generateCopy(this.copies.descriptions, endpoints.facebookAdsHeadlines, descriptionsPayload)
                    }

                    // Spin
                    if (this.solution.data.spin) {
                        await this.transformCopies(this.solution.data.spin, transformation.spin, copies, this.spun);
                    }

                    // Style
                    if (this.solution.data.style) {
                        await this.transformCopies(this.solution.data.style, transformation.style, copies, this.styled);
                    }

                    // Translate
                    if (this.solution.data.translation) {
                        await this.transformCopies(this.solution.data.translation, transformation.translation, copies, this.translated);
                    }
                } catch (error) {
                    console.error('Error generating copies:', error.message);
                }
            },
            async transformCopies(transformation, transformationType, from, to) {
                const payload = { 
                    transformation: transformation,
                    transformation_type: transformationType
                }
                from.text1 = await this.generateCopy(to.text1, endpoints.transform, { ...payload, transform_from: from.text1.data.id });
                from.text2 = await this.generateCopy(to.text2, endpoints.transform, { ...payload, transform_from: from.text2.data.id });
                from.text3 = await this.generateCopy(to.text3, endpoints.transform, { ...payload, transform_from: from.text3.data.id });
                from.text4 = await this.generateCopy(to.text4, endpoints.transform, { ...payload, transform_from: from.text4.data.id });
                from.text5 = await this.generateCopy(to.text5, endpoints.transform, { ...payload, transform_from: from.text5.data.id });
                from.headlines = await this.generateCopy(to.headlines, endpoints.transform,  { ...payload, transform_from: from.headlines.data.id });
                from.descriptions = await this.generateCopy(to.descriptions, endpoints.transform, { ...payload, transform_from: from.descriptions.data.id });
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