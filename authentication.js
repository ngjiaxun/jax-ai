// Requires settings.js

let isAuthenticated = false;

// Prepend api domain to api endpoints
Object.keys(endpoints).forEach(key => endpoints[key] = apiDomain + endpoints[key]);

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
        axios.get(endpoints.me).then(doSuccess).catch(doFail);
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

function logout() {
    console.log('Logging out...');
    localStorage.removeItem('jwtToken');
    redirectToLoginPage();
}