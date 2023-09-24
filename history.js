(async function main() {
    try {
        const user = await preInit();
        // Load batch_time list
        const generations = await axios.get(endpoints.generations);
        // Convert batch_time to user-friendly format
        const generationsData = generations.data.map(generation => ({ batch_time: toFriendlyDatetime(generation.batch_time)}));
        vForSelect('#generations', 'generations', 'generation', 'batch_time');
        runVue(user, generationsData);
    } catch (error) {
        console.error('Error initializing Jax AI:', error.message);
    }
})();

function runVue(user, generations) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                user: user,
                generations: generations,
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