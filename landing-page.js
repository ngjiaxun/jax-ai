(function main() {
    init()
        .then(user => runVue(user))
        .catch(error => console.error('Error initializing Jax AI:', error.message));
})();

function runVue(user) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                user: user,
                ...copies.data,
                copies: {
                }
            }
        },
        watch: {
        },
        computed: {
        },
        methods: {
            ...copies.methods,
            logout: logout,
            reInitWebflow: reInitWebflow
        },
        mounted() {
            fadeOutLoadingScreen();
            this.reInitWebflow();
        }
    }).mount('#app')
}