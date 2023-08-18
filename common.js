function copyToClipboard(event) {
    const button = event.currentTarget;
    const copyId = button.dataset.copyid;
    const text = document.getElementById(copyId).innerText;
    navigator.clipboard.writeText(text)
        .then(() => console.log('Text copied to clipboard:', text))
        .catch(error => console.error('Error copying text to clipboard:', error.message));
}