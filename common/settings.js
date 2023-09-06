const IDLE_EXPIRY_MINUTES = 30;
const RECAPTCHA_SITE_KEY = '6Ldwq_knAAAAAG3LpMIRYzyHPvJxzXeOJgfJGfKi';

const apiDomain = 'https://jaxai-prod-817de5757e84.herokuapp.com/';
const endpoints = {
    users: 'auth/users/',
    me: 'auth/users/me/',
    jwtCreate: 'auth/jwt/create/',
    avatars: 'scripts/avatars/',
    solutions: 'scripts/solutions/',
    copies: 'scripts/copies/',
    facebookAdsText: 'scripts/facebookads/text/',
    facebookAdsTemplatedText: 'scripts/facebookads/templatedtextv2/',
    facebookAdsHeadlines: 'scripts/facebookads/headlines/',
    facebookAdsDescriptions: 'scripts/facebookads/descriptions/'
}

// Prepend api domain to api endpoints
Object.keys(endpoints).forEach(key => endpoints[key] = apiDomain + endpoints[key]);

const SELECT_ONE = 'select one';
const ADD_NEW = 'add new';
const AVATAR_LOADING_MESSAGES = [
    'Retrieving avatar...',
    'Creating avatar...',
]