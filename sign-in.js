// Requires authentication.js
// Requires settings.js
// Requires common.js

const { createApp } = Vue

createApp({
    data() {
        return {
            formData: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        handleKeyPress(event) {
            const signInButton = document.getElementById('sign-in-button');
            // If the user presses enter on one of the form's fields, programmatically click the 'sign up' button
            if (event.keyCode === 13) {
                signInButton.click();
            }
        },
        signInUser() {
            const signInForm = document.getElementById('sign-in-form');
            if (signInForm.checkValidity()) {
                axios
                    .post(endpoints.jwtCreate, this.formData)
                    .then(response => {
                        localStorage.setItem('jwtToken', response.data.access);
                        localStorage.setItem('lastPageLoad', new Date().getTime().toString());
                        window.location.href = welcomePage;
                    })
                    .catch(error => alert(JSON.stringify(error.response.data, null, 2).replace(/[{}\[\],]/g, '')));
            } else {
                signInForm.reportValidity();
            }
        }
    }
}).mount('#app')