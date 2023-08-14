const SELECT_ONE = 'select one';
const ADD_NEW = 'add new';
const MAX_SUGGESTIONS = 20;
const LOADING_MESSAGES = [
    'Sit back and relax, it\'s JaxAI\'s turn to do the writing. All it needs is 10-20 seconds of focus!',
    'Charging the creativity batteries... Your copy will be electrifying!',
    'In a parallel universe, your copy is already finished. We\'re just waiting for the teleporter to catch up.',
    'Just a few more seconds, and your copy will emerge like a phoenix from the digital ashes. It\'s going to be legendary!',
    'Don\'t be alarmed if your screen gets a little brighter - it\'s just the AI\'s creative lightbulb turning on!',
    'Keep calm and let the AI do its copy magic. No wands required.',
    'Currently, our AI is taking a yoga class to find its inner copywriting zen.',
    'Please wait while we train our AI in the ancient art of persuasive word-jitsu.',
    'Be patient! Our AI is seeking writing inspiration from a talking parrot. Results may vary.',
    'Your copy is being expertly crafted by a team of word-wrangling llamas. Seriously!',
    'Cooking up copy goodness... Don\'t worry, it\'s gluten-free and grammar-full!',
    'Please wait while we tickle the keyboard\'s fancy to produce your magical copy.',
    'Hold on tight! Our AI copywriter is doing mental gymnastics for your masterpiece.',
    'Waiting for the copy fairy to sprinkle words of wisdom all over your screen...',
    'Don\'t panic! Our AI is just busy bribing the pun gods for some epic wordplay.',
    'Did you hear the one about the AI and the copy? Your punchy lines are almost ready!',
    'Loading... because copywriting by carrier pigeon just didn\'t work out.',
    'Apologies for the delay. The AI copywriter got distracted by a funny cat video.',
    'It\'s not you, it\'s the AI. It\'s trying to decide which adjective goes best with your copy.',
    'Hang in there! Our AI is attending a spelling bee to avoid any "typos of doom."',
    'The AI copywriter\'s horoscope says it\'s a lucky day for wordsmithing!',
    'Tick-tock! Our AI is dancing the cha-cha with the thesaurus for some fancy synonyms.'
];
const TAKING_TOO_LONG_MESSAGE = 'Oops, it looks like our servers are busy! Please try again in a few minutes...';
const COPY_COUNTDOWN_MESSAGE = [
    'Ready in ',
    '5',
    '.',
    '.',
    '.',
    ' ',
    '4',
    '.',
    '.',
    '.',
    ' ',
    '3',
    '.',
    '.',
    '.',
    ' ',
    '2',
    '.',
    '.',
    '.',
    ' ',
    '1',
    '.',
    '.',
    '.',
    ' '
];