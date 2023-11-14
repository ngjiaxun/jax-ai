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
            async formSubmitted(e) {
                e.preventDefault();
                console.log('Form submitted');
                success = await resetPassword(this.email);
            }
        },
        mounted() {
            console.log('mounted')
        }
    }).mount('#app')
}