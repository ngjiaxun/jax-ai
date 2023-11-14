const IDLE_EXPIRY_MINUTES = 240; // The number of minutes before the user is required to login again
const DEFAULT_TIMEOUT = 5000; // The time to wait between checks if a copy is ready
const DEFAULT_MAX_TRIES = 12; // The maximum number of times to check if a copy is ready

const RECAPTCHA_SITE_KEY = '6Ldwq_knAAAAAG3LpMIRYzyHPvJxzXeOJgfJGfKi';

const apiDomain = 'https://jaxai-prod-817de5757e84.herokuapp.com/';
const endpoints = {
    jwtCreate: 'auth/jwt/create/',
    resetPassword: 'auth/users/reset_password/',
    resetPasswordConfirm: 'auth/users/reset_password_confirm/',
    users: 'auth/users/',
    me: 'auth/users/me/',
    profile: 'scripts/users/me/',
    avatars: 'scripts/avatars/',
    solutions: 'scripts/solutions/',
    copies: 'scripts/copies/',
    batches: 'scripts/copybatches/',
    transform: 'scripts/copies/transform/',
    facebookAdsText: 'scripts/facebookads/text/',
    facebookAdsHeadlines: 'scripts/facebookads/headlines/',
    generalContent: 'scripts/general/',
}

// Prepend api domain to api endpoints
Object.keys(endpoints).forEach(key => endpoints[key] = apiDomain + endpoints[key]);

const transformation = {
    spin: 'T1',
    style: 'T2',
    translation: 'T3'
}