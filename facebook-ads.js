const SELECT_ONE = 'select one';
const ADD_NEW = 'add new';
const MAX_SUGGESTIONS = 20;
const LOADING_MESSAGES = [
    'The countdown begins! In 10-15 seconds, your avatar will shine like a beacon in the virtual universe!',
    'Jax AI is channeling its inner Picasso to paint your one-of-a-kind avatar. Grab some virtual popcorn while we complete our masterpiece!',
    'Just a few more seconds, and your avatar will emerge like a phoenix from the digital ashes. It\'s going to be legendary!',
    'Yikes! Our digital hamsters are in a virtual traffic jam. We\'re rerouting them, and you can expect their return in just a minute or two. Check back shortly!',
];

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
    const option = document.querySelector('#avatar-select-field').options[1];
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
                avatarSelection: SELECT_ONE, 
                avatarName: '',
                painSuggestionIndex: 3,
                desireSuggestionIndex: 3,
                tries: 0, // Number of times we've tried to load the avatar
                loadingMessages: LOADING_MESSAGES
            }
        },
        computed: {
            isAddNew() {
                return this.avatarSelection === ADD_NEW;
            },
            isSelectOne() {
                return this.avatarSelection === SELECT_ONE;
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
                const maxTries = 3; // Number of times to try to load the avatar
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
                    $('#processing-message').text(this.loadingMessages[3]);
                    setTimeout(() => window.location.reload(), timeout);
                }
            }
        },
        mounted() {
            this.loading = false;
        }
    }).mount('#app')
}