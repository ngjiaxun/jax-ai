(async function main() {
    try {
        const user = await preInit();
        // Load batch_time list
        const generations = await axios.get(endpoints.generations);
        // Make batch_time user-friendly
        generations.data = generations.data.map(generation => {
            generation.friendly_batch_time = toFriendlyDatetime(generation.batch_time);
            return generation;
        });
        vForSelect('#generations', 'generations', 'generation', 'batch_time', false);
        runVue(user, generations.data);
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
            generationSelectionChanged(event) {
                this.updateCopies(event.target.value);
            },
            updateCopies(batch_time) {
            }
        },
        mounted() {
            this.init();
        }
    }).mount('#app')
}