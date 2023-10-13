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
                ...input.data,
                copysets: {
                }
            }
        },
        watch: {
        },
        computed: {
            ...copies.computed,
            ...input.computed
        },
        methods: {
            ...authentication.methods,
            ...util.methods,
            ...copies.methods,
            ...input.methods
        },
        mounted() {
            this.init();
        }
    }).mount('#app')
}