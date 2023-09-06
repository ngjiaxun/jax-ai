(async function main() {
    try {
        const user = await preInit();
        runVue(user);
    } catch (error) {
        console.error('Error initializing Jax AI:', error.message);
    }
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