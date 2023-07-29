const ADD_NEW = 'add new';
const MAX_SUGGESTIONS = 20;
const LOADING_MESSAGES = [
    'Sit back and relax, it\'s Jax AI\'s turn to do the writing. All it needs is 10-20 seconds of focus!',
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
    const option = document.querySelector('#avatar-select-field').options[0]; // The first option in the avatar select field
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
                avatar: null,
                avatarName: '',
                painSuggestionIndex: 3,
                desireSuggestionIndex: 3,
                tries: 0, // Number of times we've tried to load the avatar
                loadingMessages: LOADING_MESSAGES,
                takingTooLongMessage: TAKING_TOO_LONG_MESSAGE
            }
        },
        computed: {
            isAddNew() {
                return this.avatarSelection === ADD_NEW;
            }
        },
        methods: {
            avatarSelectionChanged() {
                console.log(`Avatar ${this.avatarSelection} selected...`);
                if (this.isAddNew) {
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

                // Pains - 0, 1, 2
                // Desires - 3, 4, 5
                if (index < 3) {
                    this.avatar.pains[index] = this.avatar.pain_suggestions[this.painSuggestionIndex];
                    this.painSuggestionIndex = this.painSuggestionIndex < max ? this.painSuggestionIndex + 1 : 0;
                } else {
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
            }
        },
        mounted() {
            // For some reason, if you don't select the first option, it will be blank
            $('#avatar-select-field').find('option').eq(0).prop('selected', true);
            this.loading = false;
        }
    }).mount('#app')
}