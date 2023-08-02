const SELECT_ONE = 'select one';
const ADD_NEW = 'add new';
const MAX_SUGGESTIONS = 20;
const LOADING_MESSAGES = [
    'Sit back and relax, it\'s JaxAI\'s turn to do the writing. All it needs is 10-20 seconds of focus!',
    'Charging the creativity batteries... Your copy will be electrifying!',
    'In a parallel universe, your copy is already finished. We\'re just waiting for the teleporter to catch up.',
    'Just a few more seconds, and your copy will emerge like a phoenix from the digital ashes. It\'s going to be legendary!',
    'Don\'t be alarmed if your screen gets a little brighter - it\'s just the AI\'s creative lightbulb turning on!',
    'Keep calm and let the AI do its copy magic. No wands required.',
    'Currently, our AI is taking a yoga class to find its inner copywriting zen.',
    'Please wait while we train our AI in the ancient art of persuasive word-jitsu.',
    'Be patient! Our AI is seeking writing inspiration from a talking parrot. Results may vary.',
    'Your copy is being expertly crafted by a team of word-wrangling llamas. Seriously!',
    'Cooking up copy goodness... Don\'t worry, it\'s gluten-free and grammar-full!',
    'Please wait while we tickle the keyboard\'s fancy to produce your magical copy.',
    'Hold on tight! Our AI copywriter is doing mental gymnastics for your masterpiece.',
    'Waiting for the copy fairy to sprinkle words of wisdom all over your screen...',
    'Don\'t panic! Our AI is just busy bribing the pun gods for some epic wordplay.',
    'Did you hear the one about the AI and the copy? Your punchy lines are almost ready!',
    'Loading... because copywriting by carrier pigeon just didn\'t work out.',
    'Apologies for the delay. The AI copywriter got distracted by a funny cat video.',
    'It\'s not you, it\'s the AI. It\'s trying to decide which adjective goes best with your copy.',
    'Hang in there! Our AI is attending a spelling bee to avoid any "typos of doom."',
    'The AI copywriter\'s horoscope says it\'s a lucky day for wordsmithing!',
    'Tick-tock! Our AI is dancing the cha-cha with the thesaurus for some fancy synonyms.'
];
const TAKING_TOO_LONG_MESSAGE = 'Yikes! Our digital hamsters are in a virtual traffic jam. We\'re rerouting them, and you can expect their return in just a minute or two. Check back shortly!';

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
    option.removeAttribute('value');
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

                tries: 0, // Number of times we've tried to load the avatar
                loadingMessages: LOADING_MESSAGES,
                takingTooLongMessage: TAKING_TOO_LONG_MESSAGE,

                isIndustryCheckboxChecked: true,
                isResultCheckboxChecked: true,
                isCtaCheckboxChecked: true,
                isObjectionsCheckboxChecked: true,
                isStyleCheckboxChecked: true,

                text1: 'Facebook text #1'
            }
        },
        computed: {
            isAddNew() {
                return this.avatarSelection === ADD_NEW;
            },
            isSelectOne() {
                return this.avatarSelection === SELECT_ONE;
            },
            isIndustryCheckboxDisabled() {
                return this.solution.industry === this.originalSolution.industry;
            },
            isResultCheckboxDisabled() {
                return this.solution.result === this.originalSolution.result;
            },
            isCtaCheckboxDisabled() {
                return this.solution.lead_magnet === this.originalSolution.lead_magnet;
            },
            isObjectionsCheckboxDisabled() {
                return this.solution.objections === this.originalSolution.objections;
            },
            isStyleCheckboxDisabled() {
                return this.solution.style === this.originalSolution.style;
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
                // Generate copy
                this.generateCopy();

                // Update avatar
                this.updateAvatar();

                // Update solution
                this.updateSolution();
            },
            updateAvatar() {
                const endpoint = apiEndpoints.avatars + this.avatar.id;
                // logJSON('Avatar:', this.avatar);
                axios.patch(endpoint, this.avatar)
                    .then(this.updateAvatarSuccess)
                    .catch(error => console.error('Error updating avatar:', error.message));
            },
            updateAvatarSuccess(response) {
                console.log('Avatar updated...');
            },
            updateSolution() {
                // logJSON('Solution:', this.solution);

                const endpoint = apiEndpoints.solutions + this.solution.id;
                // console.log(endpoint);

                // Update only the fields with 'set default' checkbox checked
                this.solution.industry = this.isIndustryCheckboxChecked ? this.solution.industry : this.originalSolution.industry;
                this.solution.result = this.isResultCheckboxChecked ? this.solution.result : this.originalSolution.result;
                this.solution.lead_magnet = this.isCtaCheckboxChecked ? this.solution.lead_magnet : this.originalSolution.lead_magnet;
                this.solution.objections = this.isObjectionsCheckboxChecked ? this.solution.objections : this.originalSolution.objections;
                this.solution.style = this.isStyleCheckboxChecked ? this.solution.style : this.originalSolution.style;
                axios.patch(endpoint, this.solution)
                    .then(this.updateSolutionSuccess)
                    .catch(error => console.error('Error updating solution:', error.message));
            },
            updateSolutionSuccess(response) {
                console.log('Solution updated...');
            },
            generateCopy() {
                const endpoint = apiEndpoints.facebookAdsText;
                // console.log(endpoint);

                const text = {
                    avatar: this.avatar.id,
                    industry: this.solution.industry,
                    target_market: this.avatar.target_market,
                    lead_magnet: this.solution.lead_magnet,
                    result: this.solution.result,
                    objections: this.solution.objections,
                    pains: this.avatar.pains,
                    desires: this.avatar.desires,
                    prompt_id: 1,
                    style: this.solution.style
                }
                // logJSON('Text:', facebookAdsText);

                const templatedText = {}
                const headlines = {}
                const descriptions = {} 
                axios.post(endpoint, text)
                    .then(this.generateCopySuccess)
                    .catch(error => console.error('Error generating copy:', error.message));
            },
            generateCopySuccess(response) {
                console.log('Generating copy...');
                // Wait 5 seconds before checking if the copy is ready
                setTimeout(this.checkCopyReady, 5000); 
            },
            checkCopyReady() {
                const endpoint = apiEndpoints.copies;
                console.log(endpoint);

                axios.get(endpoint)
                    .then(response => this.text1 = response.data[0].copy)
                    .catch(error => console.error('Error checking if copy is ready:', error.message));
            },
            copyText1() {
                const text1 = document.getElementById('text1');
                console.log(text1);
                text1.select();
                navigator.clipboard.writeText(text1.value);
            }
        },
        mounted() {
            const option = document.querySelector('#avatar-select-field').options[1] // The option after 'Select one...' in the avatar select field
            this.avatarSelection = option.value;
            this.avatarSelectionChanged(); // Manually call the avatar selection changed event
            this.loading = false;
        }
    }).mount('#app')
}