const loginPage = '/sign-in';
const welcomePage = '/history';
const onboardingPage = '/onboarding';

// Pages that won't be authenticated
const publicPages = ['/register-now', '/forgot-password', '/forgot-password-confirm'];

// Get the current page URL
const currentPage = window.location.pathname;

async function preInit() {
    expireTokenIfIdle();
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    const isPublicPage = publicPages.some(page => currentPage === page);
    if (!isPublicPage) {
        try {
            const user = await authenticateUser();
            const profile = await getUserProfile();
            return { ...user, ...profile };
        } catch (error) {
            console.error('Error initializing Jax AI:', error.message);
        }
    }
}

async function resetPassword(email) {
    let success = false;
    try {
        const response = await axios.post(endpoints.resetPassword, { email: email });
        console.log('Reset password response:', response.data);
        success = true;
    } catch (error) {
        console.error('Error resetting password:', error.response.data);
    }
    return success;
}

async function resetPasswordConfirm(uid, token, password) {
    let success = false;
    try {
        const payload = JSON.stringify({ uid: uid, token: token, new_password: password });
        console.log(payload);
        const response = await axios.post(endpoints.resetPasswordConfirm, payload, { headers: { 'Content-Type': 'application/json' } });
        console.log('Reset password confirm response:', response.data);
        success = true;
    } catch (error) {
        console.error('Error resetting password:', error.response.data);
    }
    return success;
}

async function getUserProfile() {
    try {
        const response = await axios.get(endpoints.profile);
        
        // Change id to profile_id
        response.data.profile_id = response.data.id;
        delete response.data.id;

        return response.data;
    } catch (error) {
        console.error('Error retrieving user profile:', error.response.data);
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