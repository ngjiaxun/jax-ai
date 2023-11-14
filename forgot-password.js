runVue();

function runVue() {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                email: ''
            }
        },
        watch: {

        },
        computed: {

        },
        methods: {
            ...authentication.methods,
            ...util.methods,
            ...copies.methods,
            ...input.methods,
            formSubmitted(e) {
                e.preventDefault();
                console.log('Form submitted');
            }
        },
        mounted() {

        }
    }).mount('#app')
}