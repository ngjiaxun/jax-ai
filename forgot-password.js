runVue();

function runVue() {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                email: '',
                success: false
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
                document.getElementById('reset-button').value 'Please wait...';
                this.success = await resetPassword(this.email);
            }
        },
        mounted() {
            console.log('mounted')
        }
    }).mount('#app')
}