(async function main() {
    try {
        const user = await preInit();
        // Load batch_time list
        const batches = await axios.get(endpoints.batches);
        // Make batch_time user-friendly
        batches.data = batches.data.map(batch => {
            batch.friendly_batch_time = toFriendlyDatetime(batch.batch_time);
            return batch;
        });
        vForSelect('#batches', 'batches', 'batch', 'batch_time', false);
        runVue(user, batches.data);
    } catch (error) {
        console.error('Error initializing Jax AI:', error.message);
    }
})();

function runVue(user, batches) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                user: user,
                batches: batches, // Select field options
                selectedBatch: null, // Selected option
                ...copies.data,
                batch: { ...copies.copy }, // Copies for selected batch
            }
        },
        watch: {
            selectedBatch: function (newBatchTime) {
                this.listCopies(this.batch, endpoints.copies, newBatchTime);
            }
        },
        computed: {
            ...copies.computed,
        },
        methods: {
            ...authentication.methods,
            ...util.methods,
            ...copies.methods
        },
        mounted() {
            this.init();
        }
    }).mount('#app')
}