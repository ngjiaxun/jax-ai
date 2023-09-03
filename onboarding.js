// function runVue() {
//     const { createApp } = Vue
//     createApp({
//         data() {
//             return {
//                 username: username,
//                 ...copies.data,
//                 copies: {
//                     solution: {
//                         ...copies.copy,
//                         data: {
//                             industry: '',
//                             result: '',
//                             lead_magnet: ''
//                         }
//                     }
//                 },
//                 currentStep: 1
//             }
//         },
//         computed: {
//             ...copies.computed
//         },
//         watch: {
//             currentStep: {
//                 handler(newStep) {
//                     // Focus the field for the current step
//                     const field = document.getElementById(`${FIELD_ID_PREFIX}${newStep}`);
//                     field.focus();
//                 },
//                 flush: 'post' // Wait for v-if to update the DOM before focusing the field
//             }
//         },
//         methods: {
//             ...copies.methods,
//             enterPressed(event, field, nextStep) {
//                 if (event.key === 'Enter') {
//                     event.preventDefault();
//                     this.nextClicked(field, nextStep);
//                 }
//             },
//             nextClicked(field, nextStep) {
//                 if (!this.isEmpty(field)) {
//                     this.setStep(nextStep);
//                 }
//             },
//             isEmpty(field) {
//                 return this.copies.solution.data[field] === '';
//             },
//             setStep(step) {
//                 this.currentStep = step;
//                 if (step === 4) {
//                     this.createSolution();
//                 }
//             },
//             createSolution() {
//                 this.createCopy(this.copies.solution, endpoints.solutions);
//             },
//             applyClassStepCurrent(step) {
//                 return { 'step-current': step === this.currentStep };
//             },
//             applyClassButtonDisabled(field) {
//                 return { 'button-disabled': this.isEmpty(field) };
//             }
//         },
//         mounted() {
//             fadeOutLoadingScreen();
//         }
//     }).mount('#app')
// }




const FIELD_ID_PREFIX = 'onboarding-field-';

(async function main() {
    try {
        const user = await preInit();
        await ensureSolutionDoesNotAlreadyExist();
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
        watch: {
        },
        computed: {
            ...copies.computed,
        },
        watch: {
            currentStep: {
                handler(newStep) {
                    // Focus the field for the current step
                    const field = document.getElementById(`${FIELD_ID_PREFIX}${newStep}`);
                    field.focus();
                },
                flush: 'post' // Wait for v-if to update the DOM before focusing the field
            }
        },
        methods: {
            ...copies.methods,
            ...util.methods,
            enterPressed(event, field, nextStep) {
                if (event.key === 'Enter') {
                    event.preventDefault();
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
            this.init();
        }
    }).mount('#app')
}

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