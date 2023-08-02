let isAuthenticated = false;

const loginPage = '/sign-in';
const welcomePage = '/avatars';
const apiDomain = 'https://jaxai-prod-817de5757e84.herokuapp.com/';
const apiEndpoints = {
    users: 'auth/users/',
    me: 'auth/users/me/',
    jwtCreate: 'auth/jwt/create/',
    avatars: 'scripts/avatars/',
    solutions: 'scripts/solutions/',
    copies: 'scripts/copies/',
    facebookAdsText: 'scripts/facebookads/text/',
    facebookAdsTemplatedText: 'scripts/facebookads/templatedtext/',
    facebookAdsHeadlines: 'scripts/facebookads/headlines/',
    facebookAdsDescriptions: 'scripts/facebookads/descriptions/'
}

// Prepend api domain to api endpoints
Object.keys(apiEndpoints).forEach(key => apiEndpoints[key] = apiDomain + apiEndpoints[key]);

// Pages that won't be authenticated
const publicPages = ['/register-now', '/forgot-password'];

// Get the current page URL
const currentPage = window.location.pathname;

// Check if the visitor is on an excluded page
const isPublicPage = publicPages.some(page => currentPage === page);

// Grab the JWT token from local storage
const token = localStorage.getItem('jwtToken');

axios.defaults.headers.common['Content-Type'] = 'application/json';

// Authenticate the user if it's a members-only page
if (!isPublicPage) {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
        axios.get(apiEndpoints.me).then(doSuccess).catch(doFail);
    } else {
        redirectToLoginPage();
    }
}

function redirectToLoginPage() {
    if (currentPage != loginPage) {
        window.location.href = loginPage;
    }
}

function doSuccess(response) {
    console.log('Authentication successful...');
    if (currentPage === loginPage) {
        window.location.href = welcomePage;
    }
}

function doFail(error) {
    console.log('Authentication failed...');
    redirectToLoginPage();
}

// Format and print JSON to console for debugging purposes
function logJSON(msg, json) {
    console.log(msg + '\n' + JSON.stringify(json, null, 2));
}