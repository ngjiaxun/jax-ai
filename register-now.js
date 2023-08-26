const { createApp } = Vue

createApp({
    data() {
        return {
            formData: {
                username: '',
                email: '',
                password: '',
                first_name: ''
            }
        }
    },
    methods: {
        handleKeyPress(event) {
            const signUpButton = document.getElementById('sign-up-button');
            // If the user presses enter on one of the form's fields, programmatically click the 'sign up' button
            if (event.keyCode === 13) {
                signUpButton.click();
            }
        },
        registerUser() {
            const signUpForm = document.getElementById('sign-up-form');
            if (signUpForm.checkValidity()) {
                this.formData.username = this.formData.email;
                axios
                    .post(endpoints.users, this.formData)
                    .then(response => window.location.href = loginPage)
                    .catch(error => alert(JSON.stringify(error.response.data, null, 2).replace(/[{}\[\],]/g, '')));
            } else {
                signUpForm.reportValidity();
            }
        }
    }
}).mount('#app')