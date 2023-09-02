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
            logout: logout
        },
        mounted() {
            fadeOutLoadingScreen();

            // https://discourse.webflow.com/t/vue-js-stops-tabs-interactions/82870/2
            this.$nextTick(function () {
                //RE-INIT WF as Vue.js init breaks WF interactions
                Webflow.destroy();
                Webflow.ready();
                Webflow.require('ix2').init();
            });
        }
    }).mount('#app')
}