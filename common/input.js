const SELECT_ONE = 'Select one...';
const ADD_NEW = '+ Add new';
const AVATAR_LOADING_MESSAGES = [
    'Retrieving avatar...',
    'Creating avatar...',
]

const input = {
    data: {
        /**
         * Paste this into the inheriting file:
         *      avatars: avatars, // For displaying the avatars in the avatar select field
         *      solution: { data: solutions[0] },
        */
        avatarSelection: SELECT_ONE,
        avatarName: '', // Create avatar text field
        // Pains and desires text fields
        avatar: { 
            ...copies.copy,
            endpoint: endpoints.avatars,
            checkingEndpoint: endpoints.avatars 
        }, 
        avatarLoadingMessage: AVATAR_LOADING_MESSAGES[0],
        painSuggestionIndex: 3, // The starting index for the pain suggestions
        desireSuggestionIndex: 3, // The starting index for the desire suggestions
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
            return !this.isAnyGeneratingOrReady
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
        isAnyGeneratingOrReady() { 
            return this.isAnyGenerating || this.isAnyReady;
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
        selectFirstAvatar() { 
            this.avatarSelection = (this.avatars && this.avatars.length) ? this.avatars[0].id : this.avatarSelection;
        },
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
        async generateClicked() {  // Add this to the "Generate" button's v-on:click event
            await this.updateCopy(this.avatar, endpoints.avatars);
            await this.updateCopy(this.solution, endpoints.solutions);
            /**
             * Implement generateCopies() in the inheriting file.
            */
            this.generateCopies(); 
        },
        async createAvatarClicked() {
            this.avatarLoadingMessage = AVATAR_LOADING_MESSAGES[1];
            if (this.avatarName === '') {
                this.avatarName = 'Customers';
            }
            await this.updateCopy(this.solution, endpoints.solutions);
            this.createAvatar();
        },
        createAvatar() {
            console.log('Creating avatar...');
            this.avatar.payload = {
                "industry": this.solution.data.industry,
                "target_market": this.avatarName
            }
            this.generateCopy(this.avatar)
                .then(() => window.location.reload())
                .catch(error => console.error('Error creating avatar:', error.message));
        }
    },
    vForSelectAvatar() {
        vForSelect('#avatar-select-field', 'avatars', 'avatar', 'id')
    }
};