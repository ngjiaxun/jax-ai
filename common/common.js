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