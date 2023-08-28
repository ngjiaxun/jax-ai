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
            setStep(step, key) {
                if (this.copies.solution.data[key] !== '') {
                    this.currentStep = step;
                    if (step === 4) {
                        this.createSolution();
                    }
                }
            },
            createSolution() {
                this.createCopy(this.copies.solution, endpoints.solutions);
            },
            classStepCurrent(step) {
                return {
                    'step-current': step === this.currentStep
                };
            },
            classButtonDisabled(key) {
                return {
                    'button-disabled': this.copies.solution.data[key] === ''
                };
            }
        },
        mounted() {
            $('#loading-splash').fadeOut(2000);
        }
    }).mount('#app')
}
