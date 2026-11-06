// Question bank. grade = CA grade level the skill belongs to.
// Placement walks up/down grades per subject to find where Atchi is solid.
export const ASSESSMENT = {
  math: [
    { g: 1, skill: 'add-20', q: '7 + 5 = ?', a: '12', choices: ['11', '12', '13', '75'] },
    { g: 1, skill: 'sub-20', q: '15 − 6 = ?', a: '9', choices: ['8', '9', '11', '21'] },
    { g: 2, skill: 'place-value', q: 'In 347, what is the 4 worth?', a: '40', choices: ['4', '40', '400', '7'] },
    { g: 2, skill: 'add-regroup', q: '58 + 27 = ?', a: '85', choices: ['75', '85', '715', '81'] },
    { g: 2, skill: 'sub-regroup', q: '72 − 38 = ?', a: '34', choices: ['46', '34', '44', '36'] },
    { g: 3, skill: 'mult-facts', q: '6 × 7 = ?', a: '42', choices: ['36', '42', '48', '13'] },
    { g: 3, skill: 'div-facts', q: '56 ÷ 8 = ?', a: '7', choices: ['6', '7', '8', '9'] },
    { g: 3, skill: 'fractions-intro', q: 'Which is bigger?', a: '1/2', choices: ['1/2', '1/4', '1/8', 'Same'] },
    { g: 4, skill: 'multi-digit-mult', q: '23 × 4 = ?', a: '92', choices: ['82', '92', '96', '27'] },
    { g: 4, skill: 'equiv-fractions', q: '2/4 is the same as…', a: '1/2', choices: ['1/2', '2/8', '1/4', '4/2'] },
    { g: 5, skill: 'decimals', q: '0.5 + 0.25 = ?', a: '0.75', choices: ['0.30', '0.75', '0.525', '7.5'] },
    { g: 5, skill: 'fraction-add', q: '1/3 + 1/3 = ?', a: '2/3', choices: ['2/6', '2/3', '1/6', '1/9'] },
    { g: 6, skill: 'ratios', q: '3 apples cost $6. 5 apples cost…', a: '$10', choices: ['$8', '$10', '$11', '$15'] },
    { g: 6, skill: 'negatives', q: '−3 + 5 = ?', a: '2', choices: ['−8', '−2', '2', '8'] },
  ],
  reading: [
    { g: 1, skill: 'sight-words', q: 'Pick the word that fits: "I ___ a dog."', a: 'have', choices: ['have', 'hav', 'haf', 'hove'] },
    { g: 1, skill: 'short-vowels', q: 'Which word rhymes with "cat"?', a: 'hat', choices: ['cut', 'hat', 'kit', 'cot'] },
    { g: 2, skill: 'long-vowels', q: 'Which word has a long A sound?', a: 'cake', choices: ['cat', 'cake', 'cap', 'can'] },
    { g: 2, skill: 'compound-words', q: 'Sun + flower = ?', a: 'sunflower', choices: ['sunflower', 'flowersun', 'sunny', 'flowers'] },
    { g: 2, skill: 'main-idea-short', q: '"Max ran to the bus. He was late for school." Why did Max run?', a: 'He was late', choices: ['He likes buses', 'He was late', 'It was raining', 'He was racing'] },
    { g: 3, skill: 'prefixes', q: '"Unhappy" means…', a: 'not happy', choices: ['very happy', 'not happy', 'happy again', 'a little happy'] },
    { g: 3, skill: 'context-clues', q: '"The puppy was so tiny it fit in my hand." Tiny means…', a: 'small', choices: ['loud', 'small', 'fast', 'brown'] },
    { g: 4, skill: 'inference', q: '"Mia grabbed her umbrella and boots." What is the weather probably like?', a: 'Rainy', choices: ['Sunny', 'Rainy', 'Windy', 'Hot'] },
    { g: 4, skill: 'synonyms', q: 'A synonym for "enormous" is…', a: 'huge', choices: ['tiny', 'huge', 'quick', 'quiet'] },
    { g: 5, skill: 'figurative', q: '"It\'s raining cats and dogs" means…', a: 'Raining hard', choices: ['Pets falling', 'Raining hard', 'A little rain', 'Animals outside'] },
    { g: 5, skill: 'theme', q: 'A story where a kid keeps practicing and finally wins. The lesson is…', a: "Don't give up", choices: ['Winning is easy', "Don't give up", 'Sports are fun', 'Be fast'] },
    { g: 6, skill: 'author-purpose', q: 'An ad for sneakers is mostly trying to…', a: 'Persuade', choices: ['Inform', 'Entertain', 'Persuade', 'Explain'] },
    { g: 6, skill: 'evidence', q: 'Which best SUPPORTS "Dogs are loyal"?', a: 'Dogs wait for owners daily', choices: ['Dogs have fur', 'Dogs wait for owners daily', 'Dogs like bones', 'Dogs bark'] },
  ],
};

// Short, 3-step lessons: hook → example → practice. Keyed by skill.
export const LESSONS = {
  'add-regroup': {
    title: 'Adding with Carrying', subject: 'math', g: 2,
    hook: 'When the ones add up to 10 or more, you trade 10 ones for 1 ten. Like trading 10 pennies for a dime.',
    example: '58 + 27 → ones: 8+7=15 → write 5, carry 1 → tens: 5+2+1=8 → 85',
    practice: [
      { q: '36 + 47 = ?', a: '83', choices: ['73', '83', '713', '84'] },
      { q: '19 + 25 = ?', a: '44', choices: ['34', '44', '314', '45'] },
      { q: '68 + 14 = ?', a: '82', choices: ['72', '82', '712', '92'] },
    ],
  },
  'sub-regroup': {
    title: 'Subtracting with Borrowing', subject: 'math', g: 2,
    hook: "Can't take 8 from 2? Borrow a ten from next door. That 2 becomes 12.",
    example: '72 − 38 → 2−8 no → borrow: 12−8=4 → tens: 6−3=3 → 34',
    practice: [
      { q: '53 − 27 = ?', a: '26', choices: ['36', '26', '34', '24'] },
      { q: '81 − 46 = ?', a: '35', choices: ['45', '35', '25', '47'] },
      { q: '40 − 18 = ?', a: '22', choices: ['28', '22', '32', '38'] },
    ],
  },
  'place-value': {
    title: 'Place Value Power', subject: 'math', g: 2,
    hook: 'Where a digit sits decides what it is worth. Think of it like levels in a game.',
    example: '347 → 3 hundreds (300) + 4 tens (40) + 7 ones (7)',
    practice: [
      { q: 'In 582, the 8 is worth…', a: '80', choices: ['8', '80', '800', '5'] },
      { q: '400 + 60 + 3 = ?', a: '463', choices: ['4603', '463', '436', '346'] },
      { q: 'In 905, the 9 is worth…', a: '900', choices: ['9', '90', '900', '5'] },
    ],
  },
  'mult-facts': {
    title: 'Multiplication = Fast Adding', subject: 'math', g: 3,
    hook: '4 × 3 just means 4 groups of 3. 3 + 3 + 3 + 3 = 12.',
    example: '6 × 7 → 6 groups of 7 → 7,14,21,28,35,42 → 42',
    practice: [
      { q: '5 × 6 = ?', a: '30', choices: ['11', '30', '35', '25'] },
      { q: '8 × 3 = ?', a: '24', choices: ['11', '21', '24', '27'] },
      { q: '9 × 4 = ?', a: '36', choices: ['32', '36', '13', '45'] },
    ],
  },
  'fractions-intro': {
    title: 'Fractions = Pizza Slices', subject: 'math', g: 3,
    hook: 'The bottom number is how many slices the pizza is cut into. More slices = smaller slices.',
    example: '1/2 of a pizza > 1/4 of a pizza, because halves are bigger slices.',
    practice: [
      { q: 'Bigger slice?', a: '1/3', choices: ['1/3', '1/6', '1/10', 'Same'] },
      { q: '3/4 means 3 slices out of…', a: '4', choices: ['3', '4', '7', '12'] },
      { q: 'Which equals one whole?', a: '4/4', choices: ['1/4', '4/4', '4/1', '0/4'] },
    ],
  },
  'long-vowels': {
    title: 'Sneaky Silent E', subject: 'reading', g: 2,
    hook: 'A silent E at the end makes the vowel say its name. It\'s a power-up.',
    example: 'cap → cape   kit → kite   hop → hope',
    practice: [
      { q: 'tap + e = ?', a: 'tape', choices: ['tape', 'tapp', 'teap', 'tip'] },
      { q: 'Which has a long I?', a: 'bike', choices: ['big', 'bike', 'bit', 'bin'] },
      { q: 'Which has a long O?', a: 'rope', choices: ['rop', 'rope', 'rot', 'rock'] },
    ],
  },
  'main-idea-short': {
    title: 'What Is It Really About?', subject: 'reading', g: 2,
    hook: 'Main idea = the one thing the writer most wants you to know. Ask: "If I had to say it in one line?"',
    example: '"Bees make honey. They also help flowers grow." → Bees are helpful.',
    practice: [
      { q: '"Sam brushed his teeth, packed his bag, and ate breakfast." Main idea?', a: 'Sam got ready for school', choices: ['Sam likes food', 'Sam got ready for school', 'Sam has a bag', 'Sam is tired'] },
      { q: '"Cats sleep a lot. They nap up to 16 hours a day." Main idea?', a: 'Cats sleep a lot', choices: ['Cats are cute', 'Cats sleep a lot', 'Cats eat fish', 'Days are long'] },
      { q: '"The game was tied. Lee kicked the last goal. The crowd cheered." What happened?', a: 'Lee won the game', choices: ['Lee lost', 'Lee won the game', 'It rained', 'The crowd left'] },
    ],
  },
  'context-clues': {
    title: 'Detective Words', subject: 'reading', g: 3,
    hook: "Don't know a word? Look around it. The sentence leaves clues.",
    example: '"The soup was scalding, so I waited for it to cool." → scalding = very hot',
    practice: [
      { q: '"He was famished, so he ate three burgers." Famished means…', a: 'very hungry', choices: ['very tired', 'very hungry', 'very happy', 'very full'] },
      { q: '"The room was silent; not one sound." Silent means…', a: 'quiet', choices: ['loud', 'dark', 'quiet', 'empty'] },
      { q: '"She was elated when she won." Elated means…', a: 'very happy', choices: ['sad', 'angry', 'very happy', 'scared'] },
    ],
  },
  'inference': {
    title: 'Read Between the Lines', subject: 'reading', g: 4,
    hook: 'Inference = clues + what you already know. The story won\'t say it — you figure it out.',
    example: '"Jay\'s face turned red and he slammed the door." → Jay is angry.',
    practice: [
      { q: '"Ana yawned and rubbed her eyes." Ana is…', a: 'tired', choices: ['hungry', 'tired', 'excited', 'cold'] },
      { q: '"The ground was wet and there were puddles." What happened?', a: 'It rained', choices: ['It snowed', 'It rained', 'It was hot', 'Nothing'] },
      { q: '"Ben hid behind the couch during the movie." The movie was…', a: 'scary', choices: ['funny', 'boring', 'scary', 'short'] },
    ],
  },
};
