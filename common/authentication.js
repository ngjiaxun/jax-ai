// Requires settings.js

const loginPage = '/sign-in';
const welcomePage = '/avatars';
const onboardingPage = '/onboarding';

// Pages that won't be authenticated
const publicPages = ['/register-now', '/forgot-password'];

// Get the current page URL
const currentPage = window.location.pathname;

// Check if the visitor is on an excluded page
const isPublicPage = publicPages.some(page => currentPage === page);

// Grab the JWT token from local storage
const token = localStorage.getItem('jwtToken');

authenticateUser();
ensureSolutionExists();
addLogoutEventListener();

function authenticateUser() {
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
}

async function ensureSolutionExists() {
    if (currentPage !== onboardingPage) {
        try {
            // If the user's business info hasn't been set, go to the onboarding page
            const response = await axios.get(endpoints.solutions);
            if (!response.data.length) {
                window.location.href = onboardingPage;
            }
        } catch (error) {
            console.error('Error retrieving solution:', error.response.data);
        }
    }
}

function addLogoutEventListener() {
    const logoutLink = document.getElementById('log-out');
    console.log('logoutLink:', logoutLink);
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior (navigation)
            logout(); // Call the logout function
        });
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