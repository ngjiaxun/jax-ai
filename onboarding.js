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
                    solution: { 
                        ...copies.copy,
                        data: {
                            industry: '',
                            result: '',
                            lead_magnet: ''
                        }
                    }
                },
                currentStep: 1
            }
        },
        computed: {
            ...copies.computed
        },
        methods: {
            ...copies.methods,
            enterPressed(event, field, nextStep) {
                event.preventDefault();
                if (event.key === 'Enter') {
                    this.nextClicked(field, nextStep);
                }
            },
            nextClicked(field, nextStep) {
                if (!this.isEmpty(field)) {
                    this.setStep(nextStep);
                }
            },
            isEmpty(field) {
                return this.copies.solution.data[field] === '';
            },
            setStep(step) {
                this.currentStep = step;
                if (step === 4) {
                    this.createSolution();
                }
            },
            createSolution() {
                this.createCopy(this.copies.solution, endpoints.solutions);
            },
            applyClassStepCurrent(step) {
                return { 'step-current': step === this.currentStep };
            },
            applyClassButtonDisabled(field) {
                return { 'button-disabled': this.isEmpty(field) };
            }
        },
        mounted() {
            fadeOutLoadingScreen();
        }
    }).mount('#app')
}
