const input = {
    data: {
        /**
         * Copy and paste the following in the inheriting file (e.g. facebook-ads.js). Get the values from the runVue() method.
         *      avatars: avatars, // For displaying the avatars in the avatar select field
         *      solution: { data: solutions[0] },
        */
        avatarSelection: SELECT_ONE,
        avatarName: '', // Create avatar text field
        avatar: { ...copies.copy }, // Pains and desires text fields
        avatarLoadingMessage: AVATAR_LOADING_MESSAGES[0],
        painSuggestionIndex: 3, // The starting index for the pain suggestions
        desireSuggestionIndex: 3, // The starting index for the desire suggestions
        /**
         * Implement these in the inheriting file:
         *      copies: {},
         *      spun: {},
         *      styled: {},
         *      translated: {}
        */
    },
    watch: {
        avatarSelection: 'avatarSelectionChanged',
    },
    computed: {
        isAddAvatarSelected() {
            return this.avatarSelection === ADD_NEW;
        },
        isSelectAvatarSelected() {
            return this.avatarSelection === SELECT_ONE;
        },
        isLoadAvatarSelected() {
            return !this.isAddAvatarSelected && !this.isSelectAvatarSelected;
        },
        isPainSectionVisible() {
            return this.isLoadAvatarSelected && this.avatar.data;
        },
        isStepOneSectionVisible() {
            return !this.isAnyGeneratingOrReady && !this.avatar.isGenerating;
        },
        isStepTwoSectionVisible() {
            return !this.isAnyGeneratingOrReady && this.isLoadAvatarSelected
        },
        isStepThreeSectionVisible() {
            return this.isStepTwoSectionVisible;
        },
        isStepFourSectionVisible() { // Add v-if="isStepFourSectionVisible" to the "Generate" button section
            return this.isStepTwoSectionVisible;
        },
        isCopiesSectionVisible() { // Add v-if="isCopiesSectionVisible" to the "Copies" section
            return this.isAnyGeneratingOrReady;
        },
        isAnyGeneratingOrReady() { // You can create an alias for this.copies using the created() hook - e.g. created() { this.copies = this.batch }
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
        avatarSelectionChanged() {
            if (this.isSelectAvatarSelected) {
                console.log('Clearing avatar...');
                this.avatar.data = null;
            } else if (this.isAddAvatarSelected) {
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
        generateClicked() {  // Add this to the "Generate" button's v-on:click event
            this.updateCopy(this.avatar, endpoints.avatars);
            this.updateCopy(this.solution, endpoints.solutions);
            /**
             * Implement generateCopies() in the inheriting file.
            */
            this.generateCopies(); 
        },
        createAvatarClicked() {
            this.avatarLoadingMessage = AVATAR_LOADING_MESSAGES[1];
            if (this.avatarName === '') {
                this.avatarName = 'Customers';
            }
            this.createAvatar();
        },
        createAvatar() {
            const payload = {
                "industry": this.solution.data.industry,
                "target_market": this.avatarName
            }
            this.generateCopy(this.avatar, endpoints.avatars, payload, endpoints.avatars)
                .then(() => window.location.reload())
                .catch(error => console.error('Error creating avatar:', error.response.data));
        },
    }
};