(async function main() {
    try {
        const user = await preInit();
        // Load "batch_time"s
        const batch_times = await axios.get(endpoints.generations);
        runVue(user, batch_times.data);
    } catch (error) {
        console.error('Error initializing Jax AI:', error.message);
    }
})();

function runVue(user, batch_times) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                user: user,
                batch_times: batch_times,
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