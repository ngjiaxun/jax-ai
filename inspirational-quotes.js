function getQuoteOfTheDay() {
    const quoteOfTheDay = INSPIRATIONAL_QUOTES[daysSinceMillennium % INSPIRATIONAL_QUOTES.length];
    return quoteOfTheDay;
}

// Calculate the difference between the currentDate and January 1, 2000
const millisecondsPerDay = 24 * 60 * 60 * 1000;
const daysSinceMillennium = Math.floor((new Date() - new Date(2000, 0, 1)) / millisecondsPerDay);

const INSPIRATIONAL_QUOTES = [
    {
      "quote": "The only way to do great work is to love what you do.",
      "author": "Steve Jobs",
      "image": "image1.jpg"
    },
    {
      "quote": "Believe you can and you're halfway there.",
      "author": "Theodore Roosevelt",
      "image": "image2.jpg"
    },
    {
      "quote": "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "author": "Winston Churchill",
      "image": "image3.jpg"
    },
    {
      "quote": "The future depends on what you do today.",
      "author": "Mahatma Gandhi",
      "image": "image4.jpg"
    },
    {
      "quote": "In the middle of every difficulty lies opportunity.",
      "author": "Albert Einstein",
      "image": "image5.jpg"
    },
    {
      "quote": "Don't watch the clock; do what it does. Keep going.",
      "author": "Sam Levenson",
      "image": "image6.jpg"
    },
    {
      "quote": "The only person you are destined to become is the person you decide to be.",
      "author": "Ralph Waldo Emerson",
      "image": "image7.jpg"
    },
    {
      "quote": "You miss 100% of the shots you don't take.",
      "author": "Wayne Gretzky",
      "image": "image8.jpg"
    },
    {
      "quote": "The best revenge is massive success.",
      "author": "Frank Sinatra",
      "image": "image9.jpg"
    },
    {
      "quote": "The way to get started is to quit talking and begin doing.",
      "author": "Walt Disney",
      "image": "image10.jpg"
    },
    {
      "quote": "It does not matter how slowly you go, as long as you do not stop.",
      "author": "Confucius",
      "image": "image11.jpg"
    },
    {
      "quote": "The harder the conflict, the greater the triumph.",
      "author": "George Washington",
      "image": "image12.jpg"
    },
    {
      "quote": "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
      "author": "Christian D. Larson",
      "image": "image13.jpg"
    },
    {
      "quote": "Your time is limited, don't waste it living someone else's life.",
      "author": "Steve Jobs",
      "image": "image14.jpg"
    },
    {
      "quote": "It always seems impossible until it's done.",
      "author": "Nelson Mandela",
      "image": "image15.jpg"
    },
    {
      "quote": "Success is stumbling from failure to failure with no loss of enthusiasm.",
      "author": "Winston Churchill",
      "image": "image16.jpg"
    },
    {
      "quote": "The only limit to our realization of tomorrow will be our doubts of today.",
      "author": "Franklin D. Roosevelt",
      "image": "image17.jpg"
    },
    {
      "quote": "Do what you can, with what you have, where you are.",
      "author": "Theodore Roosevelt",
      "image": "image18.jpg"
    },
    {
      "quote": "The best way to predict the future is to create it.",
      "author": "Abraham Lincoln",
      "image": "image19.jpg"
    },
    {
      "quote": "The secret of getting ahead is getting started.",
      "author": "Mark Twain",
      "image": "image20.jpg"
    },
    {
      "quote": "The harder I work, the luckier I get.",
      "author": "Samuel Goldwyn",
      "image": "image21.jpg"
    },
    {
      "quote": "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
      "author": "Roy T. Bennett",
      "image": "image22.jpg"
    },
    {
      "quote": "Opportunities don't happen. You create them.",
      "author": "Chris Grosser",
      "image": "image23.jpg"
    },
    {
      "quote": "Success usually comes to those who are too busy to be looking for it.",
      "author": "Henry David Thoreau",
      "image": "image24.jpg"
    },
    {
      "quote": "The road to success and the road to failure are almost exactly the same.",
      "author": "Colin R. Davis",
      "image": "image25.jpg"
    },
    {
      "quote": "The only person you should try to be better than is the person you were yesterday.",
      "author": "Unknown",
      "image": "image26.jpg"
    },
    {
      "quote": "The future belongs to those who believe in the beauty of their dreams.",
      "author": "Eleanor Roosevelt",
      "image": "image27.jpg"
    },
    {
      "quote": "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
      "author": "Albert Schweitzer",
      "image": "image28.jpg"
    },
    {
      "quote": "The only way to achieve the impossible is to believe it is possible.",
      "author": "Charles Kingsleigh (Alice in Wonderland)",
      "image": "image29.jpg"
    },
    {
      "quote": "I have not failed. I've just found 10,000 ways that won't work.",
      "author": "Thomas Edison",
      "image": "image30.jpg"
    },
    {
      "quote": "You are never too old to set another goal or to dream a new dream.",
      "author": "C.S. Lewis",
      "image": "image31.jpg"
    },
    {
      "quote": "The only limit to our realization of tomorrow will be our doubts of today.",
      "author": "Franklin D. Roosevelt",
      "image": "image32.jpg"
    },
    {
      "quote": "It's not whether you get knocked down, it's whether you get up.",
      "author": "Vince Lombardi",
      "image": "image33.jpg"
    },
    {
      "quote": "Success is walking from failure to failure with no loss of enthusiasm.",
      "author": "Winston Churchill",
      "image": "image34.jpg"
    },
    {
      "quote": "The journey of a thousand miles begins with one step.",
      "author": "Lao Tzu",
      "image": "image35.jpg"
    },
    {
      "quote": "The best revenge is massive success.",
      "author": "Frank Sinatra",
      "image": "image36.jpg"
    },
    {
      "quote": "Dream big and dare to fail.",
      "author": "Norman Vaughan",
      "image": "image37.jpg"
    },
    {
      "quote": "Our greatest glory is not in never falling, but in rising every time we fall.",
      "author": "Confucius",
      "image": "image38.jpg"
    },
    {
      "quote": "The only way to do great work is to love what you do.",
      "author": "Steve Jobs",
      "image": "image39.jpg"
    },
    {
      "quote": "Don't count the days, make the days count.",
      "author": "Muhammad Ali",
      "image": "image40.jpg"
    },
    {
      "quote": "A person who never made a mistake never tried anything new.",
      "author": "Albert Einstein",
      "image": "image41.jpg"
    },
    {
      "quote": "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
      "author": "Christian D. Larson",
      "image": "image42.jpg"
    },
    {
      "quote": "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.",
      "author": "Vince Lombardi",
      "image": "image43.jpg"
    },
    {
      "quote": "Success is not in what you have, but who you are.",
      "author": "Bo Bennett",
      "image": "image44.jpg"
    },
    {
      "quote": "You must be the change you wish to see in the world.",
      "author": "Mahatma Gandhi",
      "image": "image45.jpg"
    },
    {
      "quote": "The only thing standing between you and your dream is the will to try and the belief that it is actually possible.",
      "author": "Joel Brown",
      "image": "image46.jpg"
    },
    {
      "quote": "Don't watch the clock; do what it does. Keep going.",
      "author": "Sam Levenson",
      "image": "image47.jpg"
    },
    {
      "quote": "Failure will never overtake me if my determination to succeed is strong enough.",
      "author": "Og Mandino",
      "image": "image48.jpg"
    },
    {
      "quote": "The moment you give up is the moment you let someone else win.",
      "author": "Kobe Bryant",
      "image": "image49.jpg"
    },
    {
      "quote": "The future depends on what you do today.",
      "author": "Mahatma Gandhi",
      "image": "image50.jpg"
    },
    {
      "quote": "Success is not the result of spontaneous combustion. You must set yourself on fire.",
      "author": "Arnold H. Glasow",
      "image": "image51.jpg"
    },
    {
      "quote": "The only time to set a goal is when you don't need it to be achieved.",
      "author": "Unknown",
      "image": "image52.jpg"
    },
    {
      "quote": "The biggest risk is not taking any risk. In a world that is changing quickly, the only strategy that is guaranteed to fail is not taking risks.",
      "author": "Mark Zuckerberg",
      "image": "image53.jpg"
    },
    {
      "quote": "Success is not just about making money. It's about making a difference.",
      "author": "Unknown",
      "image": "image54.jpg"
    },
    {
      "quote": "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
      "author": "Roy T. Bennett",
      "image": "image55.jpg"
    },
    {
      "quote": "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
      "author": "Steve Jobs",
      "image": "image56.jpg"
    },
    {
      "quote": "The way to get started is to quit talking and begin doing.",
      "author": "Walt Disney",
      "image": "image57.jpg"
    },
    {
      "quote": "The best way to predict the future is to create it.",
      "author": "Abraham Lincoln",
      "image": "image58.jpg"
    },
    {
      "quote": "Believe you can and you're halfway there.",
      "author": "Theodore Roosevelt",
      "image": "image59.jpg"
    },
    {
      "quote": "Success usually comes to those who are too busy to be looking for it.",
      "author": "Henry David Thoreau",
      "image": "image60.jpg"
    },
    {
      "quote": "The successful warrior is the average man, with laser-like focus.",
      "author": "Bruce Lee",
      "image": "image61.jpg"
    },
    {
      "quote": "Success is the sum of small efforts, repeated day in and day out.",
      "author": "Robert Collier",
      "image": "image62.jpg"
    },
    {
      "quote": "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
      "author": "Ralph Waldo Emerson",
      "image": "image63.jpg"
    },
    {
      "quote": "The only way to do great work is to love what you do.",
      "author": "Steve Jobs",
      "image": "image64.jpg"
    },
    {
      "quote": "Don't be afraid to give up the good to go for the great.",
      "author": "John D. Rockefeller",
      "image": "image65.jpg"
    },
    {
      "quote": "In the middle of every difficulty lies opportunity.",
      "author": "Albert Einstein",
      "image": "image66.jpg"
    },
    {
      "quote": "The only person you are destined to become is the person you decide to be.",
      "author": "Ralph Waldo Emerson",
      "image": "image67.jpg"
    },
    {
      "quote": "It always seems impossible until it's done.",
      "author": "Nelson Mandela",
      "image": "image68.jpg"
    },
    {
      "quote": "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "author": "Winston Churchill",
      "image": "image69.jpg"
    },
    {
      "quote": "The harder the conflict, the greater the triumph.",
      "author": "George Washington",
      "image": "image70.jpg"
    },
    {
      "quote": "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
      "author": "Albert Schweitzer",
      "image": "image71.jpg"
    },
    {
      "quote": "The road to success and the road to failure are almost exactly the same.",
      "author": "Colin R. Davis",
      "image": "image72.jpg"
    },
    {
      "quote": "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
      "author": "Christian D. Larson",
      "image": "image73.jpg"
    },
    {
      "quote": "You miss 100% of the shots you don't take.",
      "author": "Wayne Gretzky",
      "image": "image74.jpg"
    },
    {
      "quote": "The best revenge is massive success.",
      "author": "Frank Sinatra",
      "image": "image75.jpg"
    },
    {
      "quote": "The future belongs to those who believe in the beauty of their dreams.",
      "author": "Eleanor Roosevelt",
      "image": "image76.jpg"
    },
    {
      "quote": "The only limit to our realization of tomorrow will be our doubts of today.",
      "author": "Franklin D. Roosevelt",
      "image": "image77.jpg"
    },
    {
      "quote": "The successful warrior is the average man, with laser-like focus.",
      "author": "Bruce Lee",
      "image": "image78.jpg"
    },
    {
      "quote": "Opportunities don't happen. You create them.",
      "author": "Chris Grosser",
      "image": "image79.jpg"
    },
    {
      "quote": "You are never too old to set another goal or to dream a new dream.",
      "author": "C.S. Lewis",
      "image": "image80.jpg"
    },
    {
      "quote": "The only thing standing between you and your dream is the will to try and the belief that it is actually possible.",
      "author": "Joel Brown",
      "image": "image81.jpg"
    },
    {
      "quote": "Success is not in what you have, but who you are.",
      "author": "Bo Bennett",
      "image": "image82.jpg"
    },
    {
      "quote": "A person who never made a mistake never tried anything new.",
      "author": "Albert Einstein",
      "image": "image83.jpg"
    },
    {
      "quote": "Don't count the days, make the days count.",
      "author": "Muhammad Ali",
      "image": "image84.jpg"
    },
    {
      "quote": "The moment you give up is the moment you let someone else win.",
      "author": "Kobe Bryant",
      "image": "image85.jpg"
    },
    {
      "quote": "Success is not the result of spontaneous combustion. You must set yourself on fire.",
      "author": "Arnold H. Glasow",
      "image": "image86.jpg"
    },
    {
      "quote": "The biggest risk is not taking any risk. In a world that is changing quickly, the only strategy that is guaranteed to fail is not taking risks.",
      "author": "Mark Zuckerberg",
      "image": "image87.jpg"
    },
    {
      "quote": "The only time to set a goal is when you don't need it to be achieved.",
      "author": "Unknown",
      "image": "image88.jpg"
    },
    {
      "quote": "Success is not just about making money. It's about making a difference.",
      "author": "Unknown",
      "image": "image89.jpg"
    },
    {
      "quote": "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
      "author": "Steve Jobs",
      "image": "image90.jpg"
    },
    {
      "quote": "The way to get started is to quit talking and begin doing.",
      "author": "Walt Disney",
      "image": "image91.jpg"
    },
    {
      "quote": "The best way to predict the future is to create it.",
      "author": "Abraham Lincoln",
      "image": "image92.jpg"
    },
    {
      "quote": "Believe you can and you're halfway there.",
      "author": "Theodore Roosevelt",
      "image": "image93.jpg"
    },
    {
      "quote": "Success usually comes to those who are too busy to be looking for it.",
      "author": "Henry David Thoreau",
      "image": "image94.jpg"
    },
    {
      "quote": "The successful warrior is the average man, with laser-like focus.",
      "author": "Bruce Lee",
      "image": "image95.jpg"
    },
    {
      "quote": "Success is the sum of small efforts, repeated day in and day out.",
      "author": "Robert Collier",
      "image": "image96.jpg"
    },
    {
      "quote": "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
      "author": "Ralph Waldo Emerson",
      "image": "image97.jpg"
    },
    {
      "quote": "The only way to do great work is to love what you do.",
      "author": "Steve Jobs",
      "image": "image98.jpg"
    },
    {
      "quote": "Don't be afraid to give up the good to go for the great.",
      "author": "John D. Rockefeller",
      "image": "image99.jpg"
    },
    {
      "quote": "In the middle of every difficulty lies opportunity.",
      "author": "Albert Einstein",
      "image": "image100.jpg"
    }
  ]
  