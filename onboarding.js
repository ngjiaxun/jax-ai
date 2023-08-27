ensureSolutionDoesNotAlreadyExist()
    .then(runVue)
    .catch(error => console.error('Error ensuring solution does not already exist:', error.response.data));

async function ensureSolutionDoesNotAlreadyExist() {
    try {
        const response = await axios.get(endpoints.solutions);
        if (response.data.length) {
            window.location.href = welcomePage;
        }
    } catch (error) {
        console.error('Error retrieving solution:', error.response.data);
    }
}

function runVue() {
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
        }
    }).mount('#app')
}
