const loginPage = '/sign-in';
const welcomePage = '/history';
const onboardingPage = '/onboarding';

// Pages that won't be authenticated
const publicPages = ['/register-now', '/forgot-password'];

// Get the current page URL
const currentPage = window.location.pathname;

function preInit() {
    expireTokenIfIdle();
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    const isPublicPage = publicPages.some(page => currentPage === page);
    if (!isPublicPage) {
        return authenticateUser();
    }
}

function expireTokenIfIdle() {
    const lastPageLoad = localStorage.getItem('lastPageLoad');
    if (lastPageLoad) {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - parseInt(lastPageLoad);
        // console.log('Elapsed time:', elapsedTime / 60 / 1000, 'minutes');
        // If the user is idle for too long, require them to login again
        if (elapsedTime > IDLE_EXPIRY_MINUTES * 60 * 1000) {
            clearToken();
            console.log('User has been idle for too long. Please login again.');
        }
    } else {
        // If the user has never logged in before, require them to login
        clearToken();
        console.log('User has never logged in before. Please login.');
    }
    localStorage.setItem('lastPageLoad', new Date().getTime().toString());
}


async function authenticateUser() {
    if (getToken()) {
        try {
            axios.defaults.headers.common['Authorization'] = `JWT ${getToken()}`;
            const response = await axios.get(endpoints.me);

            if (currentPage === loginPage) {
                window.location.href = welcomePage;
            }
            ensureSolutionExists();

            return response.data;
        } catch (error) {
            console.log('Authentication failed...', error.message);
            redirectToLoginPage();
        }
    } else {
        redirectToLoginPage();
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

function redirectToLoginPage() {
    if (currentPage != loginPage) {
        window.location.href = loginPage;
    }
}

function getToken() {
    return localStorage.getItem('jwtToken');
}

function clearToken() {
    localStorage.removeItem('jwtToken');
}

const authentication = {
    methods: {
        logout() {
            console.log('Logging out...');
            clearToken();
            redirectToLoginPage();
        }
    }
};