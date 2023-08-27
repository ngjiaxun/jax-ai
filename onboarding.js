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
                this.createSolution();
            }
        },
        createSolution() {
            this.createCopy(this.copies.solution, endpoints.solutions);
        }
    },
    beforeCreate() {
        // If solution already exists, go to welcome page
        axios.get(endpoints.solutions)
            .then(response => {
                console.log('Solutions:', response.data);
                if (response.data.length) {
                    window.location.href = welcomePage;
                }
            }
        );
    }
}).mount('#app')