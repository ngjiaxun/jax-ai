runVue();
function runVue() {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                username: username,
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