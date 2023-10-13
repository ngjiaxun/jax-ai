main();

function runVue(user, avatars, solution) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                user: user, 
                avatars: avatars, 
                solution: { data: solution }, 
                ...copies.data,
                copies: {
                }
            }
        },
        watch: {
        },
        computed: {
            ...copies.computed,
        },
        methods: {
            ...authentication.methods,
            ...util.methods,
            ...copies.methods,
        },
        mounted() {
            this.init();
        }
    }).mount('#app')
}