init().then(user => runVue(user));

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
        },
        mounted() {
            fadeOutLoadingScreen();
        }
    }).mount('#app')
}