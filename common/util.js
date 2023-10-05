function delay(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

function fadeOutLoadingScreen() {
    delay(1000).then(() => $('#loading-splash').fadeOut(1000));
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function copyToClipboard(event, html = false) {
    const button = event.currentTarget;
    const copyId = button.dataset.copyid;
    const copy = document.getElementById(copyId);
    const escapedLeftBracket = escapeRegExp(LEFT_BRACKET);
    const delimiter = '\n**********\n\n';
    let text = copy.innerText;

    // Add line breaks and horizontal rules before opening brackets
    text = text.replace(new RegExp(`(${escapedLeftBracket})`, "g"), `${delimiter}$1`);

    if (html) {
        text = copy.innerHTML;
    }
    navigator.clipboard.writeText(text)
        .then(() => console.log('Text copied to clipboard:', text))
        .catch(error => console.error('Error copying text to clipboard:', error.message));
}


// Format and print JSON to console for debugging purposes
function logJSON(msg, json) {
    console.log(msg + '\n' + JSON.stringify(json, null, 2));
}

function toFriendlyDatetime(dateString) {
    // Create a Date object from the input string (assumes the input is in UTC)
    const inputDate = new Date(dateString);

    // Get the user's timezone offset in minutes
    const userTimezoneOffset = new Date().getTimezoneOffset();

    // Adjust the date to the user's timezone
    const userDateTime = new Date(inputDate.getTime() - userTimezoneOffset * 60 * 1000);

    // Convert the adjusted date to a human-friendly format without seconds
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long',
        hour12: true,
        timeZoneName: 'longOffset'
    };

    return userDateTime.toLocaleString(undefined, options);
}

function numberToLetter(number) {
    if (number >= 1 && number <= 26) {
        // Assuming 1 corresponds to 'A', 2 corresponds to 'B', and so on
        return String.fromCharCode(64 + number); // ASCII code for 'A' is 65
    } else {
        return "Invalid input. Please enter a number between 1 and 26.";
    }
}

function handleEnterKeyPress(event) {
    const signInButton = document.getElementById('sign-in-button');
    // If the user presses enter on one of the form's fields, programmatically click the 'sign up' button
    if (event.keyCode === 13) {
        signInButton.click();
    }
}

// Adds v-for='item in list' and :value='item.key' to the first option of the select field with the given cssQuerySelector
function vForSelect(cssQuerySelector, list, item, key, selectOne = true) {
    const selectField = document.querySelector(cssQuerySelector);
    if (selectField) {
        if (selectField.options.length > 0) {
            const option = selectField.options[0]; // The first option of the select field
            option.setAttribute('v-for', `${item} in ${list}`);
            option.setAttribute(':key', `${item}.${key}`);
            option.removeAttribute('value'); // Replace with :value
            option.setAttribute(':value', `${item}.${key}`);
        }
        if (selectOne) {
            const option = document.createElement('option');
            option.value = SELECT_ONE;
            option.text = SELECT_ONE;
            selectField.add(option, 0);
        }
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
        copyClicked(event, html = false) {
            copyToClipboard(event, html);
        }
    }
};