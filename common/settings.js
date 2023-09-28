const IDLE_EXPIRY_MINUTES = 240;
const RECAPTCHA_SITE_KEY = '6Ldwq_knAAAAAG3LpMIRYzyHPvJxzXeOJgfJGfKi';

const apiDomain = 'https://jaxai-prod-817de5757e84.herokuapp.com/';
const endpoints = {
    users: 'auth/users/',
    me: 'auth/users/me/',
    jwtCreate: 'auth/jwt/create/',
    avatars: 'scripts/avatars/',
    solutions: 'scripts/solutions/',
    copies: 'scripts/copies/',
    batches: 'scripts/copies/batches/',
    transform: 'scripts/copies/transform/',
    facebookAdsText: 'scripts/facebookads/text/',
    facebookAdsHeadlines: 'scripts/facebookads/headlines/'
}

// Prepend api domain to api endpoints
Object.keys(endpoints).forEach(key => endpoints[key] = apiDomain + endpoints[key]);

const transformation = {
    spin: {
        property: 'spun',
        code: 'T1'
    },
    style: {
        property: 'styled',
        code: 'T2'
    },
    translation: {
        property: 'translated',
        code: 'T3'
    }
}

const SELECT_ONE = 'Select one...';
const ADD_NEW = '+ Add new';
const AVATAR_LOADING_MESSAGES = [
    'Retrieving avatar...',
    'Creating avatar...',
]