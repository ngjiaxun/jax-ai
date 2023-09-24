function delay(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

function fadeOutLoadingScreen() {
    delay(1000).then(() => $('#loading-splash').fadeOut(1000));
}

function copyToClipboard(event) {
    const button = event.currentTarget;
    const copyId = button.dataset.copyid;
    const text = document.getElementById(copyId).innerText;
    navigator.clipboard.writeText(text)
        .then(() => console.log('Text copied to clipboard:', text))
        .catch(error => console.error('Error copying text to clipboard:', error.message));
}

// Format and print JSON to console for debugging purposes
function logJSON(msg, json) {
    console.log(msg + '\n' + JSON.stringify(json, null, 2));
}

function handleEnterKeyPress(event) {
    const signInButton = document.getElementById('sign-in-button');
    // If the user presses enter on one of the form's fields, programmatically click the 'sign up' button
    if (event.keyCode === 13) {
        signInButton.click();
    }
}

const util = {
    methods: {
        reInitWebflow() {
            // https://discourse.webflow.com/t/vue-js-stops-tabs-interactions/82870/2
            this.$nextTick(function () {
                //RE-INIT WF as Vue.js init breaks WF interactions
                Webflow.destroy();
                Webflow.ready();
                Webflow.require('ix2').init();
            });
        },
        init() {
            fadeOutLoadingScreen();
            this.reInitWebflow();
        },
        reload() {
            location.reload();
        },
        populateSelectField(cssQuerySelector, list, key, value, selectOne=false) {
            const selectField = document.querySelector(cssQuerySelector);
            if (selectField) {
                if (selectOne) {
                    const option = document.createElement('option');
                    option.value = '';
                    option.text = SELECT_ONE;
                    selectField.add(option);
                }
                const option = document.createElement('option');
                option.setAttribute('v-for', `${key} in ${list}`);
                option.setAttribute(':key', `${key}.${value}`);0
                option.setAttribute(':value', `${key}.${value}`);
            }
        }
    }
};