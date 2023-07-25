const SELECT_ONE = 'select one';
const ADD_NEW = 'add new';
const MAX_SUGGESTIONS = 20;

modifyTags();
modifyAttributes();

axios.get(apiEndpoints.avatars)
    .then(response => runVue(response.data))
    .catch(error => console.error('Error fetching data:', error.message));

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

function runVue(data) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                loading: true,
                avatars: data,
                avatar: null,
                avatarSelection: SELECT_ONE,
                painSuggestionIndex: 3,
                desireSuggestionIndex: 3
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
                    this.prepareCreateAvatar();
                } else {
                    this.loadAvatar(this.avatarSelection);
                }
            },
            clearAvatar() {
                console.log('Clearing avatar...');
                this.avatar = null;
                console.log('Avatar cleared...');
            },
            prepareCreateAvatar() {
                console.log('Preparing to create avatar...');
            },
            loadAvatar(avatarId) {
                console.log(`Loading avatar ${avatarId}...`);
                axios.get(apiEndpoints.avatars + avatarId)
                    .then(this.doLoadAvatarSuccess)
                    .catch(error => console.error('Error loading avatar:', error.message));
            },
            doLoadAvatarSuccess(response) {
                logJSON('Avatar loaded...', response.data);
                this.avatar = response.data;
            },
            createAvatar() {
                console.log('Avatar created...');
            },
            refreshClicked(event) {
                const max = MAX_SUGGESTIONS - 1;
                const button = event.target;
                const index = button.dataset.index;
                
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
            }
        },
        mounted() {
            this.loading = false;
        }
    }).mount('#app')
}