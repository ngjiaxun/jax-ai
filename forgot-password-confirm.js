runVue();

function runVue() {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                password: '',
                confirmPassword: '',
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
            formSubmitted(e) {
                e.preventDefault();
                console.log('Form submitted');
                this.doResetPasswordConfirm();
            },
            async doResetPasswordConfirm() {
                try {
                    console.log('Resetting password confirm');
                    if (this.validatePassword()) {
                        document.getElementById('reset-button').value = 'Please wait...';
                        // Get uid and token from URL
                        const urlParams = new URLSearchParams(window.location.search);
                        const uid = urlParams.get('uid');
                        const token = urlParams.get('token');
                        this.success = await resetPasswordConfirm(uid, token, this.password);
                    } else {
                        alert('Passwords do not match');
                    }
                } catch (error) {
                    console.error('Error resetting password:', error.message);
                    alert('Error resetting password. Please contact support at jax@getjax.ai');
                }
            },
            validatePassword() {
                console.log('Validating password');
                return this.password === this.confirmPassword;
            }
        },
        mounted() {
            console.log('mounted')
        }
    }).mount('#app')
}