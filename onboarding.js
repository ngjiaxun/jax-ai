const { createApp } = Vue
createApp({
    data() {
        return {
            ...copies.data,
            copies: {
                solution: { ...copies.copy }
            },
            currentStep: 1
        }
    },
    computed: {
        ...copies.computed
    },
    methods: {
        ...copies.methods,
        setStep(step) {
            this.currentStep = step;
            if (step === 4) {
                this.saveBusinessInfo();
            }
        },
        saveBusinessInfo() {
            this.createCopy(this.copies.solution, endpoints.solutions);
        }
    },
    mounted() {
    }
}).mount('#app')