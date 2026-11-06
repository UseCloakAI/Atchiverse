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

  // ── Math backfill + grade-level ────────────────────────────────────────
  'add-20': {
    title: 'Make a 10', subject: 'math', g: 1,
    hook: 'Adding to 20 is easier if you fill up to 10 first, then add the rest.',
    example: '7 + 5 → 7 + 3 = 10 → 10 + 2 = 12',
    practice: [
      { q: '8 + 6 = ?', a: '14', choices: ['13', '14', '15', '86'] },
      { q: '9 + 4 = ?', a: '13', choices: ['12', '13', '14', '5'] },
      { q: '6 + 7 = ?', a: '13', choices: ['12', '13', '14', '11'] },
    ],
  },
  'sub-20': {
    title: 'Count Up to Subtract', subject: 'math', g: 1,
    hook: 'For 15 − 6, start at 6 and count up to 15. How far did you go? That\'s the answer.',
    example: '15 − 6 → 6 to 10 is 4, 10 to 15 is 5 → 4 + 5 = 9',
    practice: [
      { q: '14 − 8 = ?', a: '6', choices: ['5', '6', '7', '22'] },
      { q: '17 − 9 = ?', a: '8', choices: ['7', '8', '9', '12'] },
      { q: '12 − 5 = ?', a: '7', choices: ['6', '7', '8', '17'] },
    ],
  },
  'div-facts': {
    title: 'Division = Splitting Up', subject: 'math', g: 3,
    hook: '56 ÷ 8 asks: how many 8s fit in 56? Flip it into a times fact: 8 × ? = 56.',
    example: '56 ÷ 8 → 8 × 7 = 56 → 7',
    practice: [
      { q: '24 ÷ 6 = ?', a: '4', choices: ['3', '4', '6', '18'] },
      { q: '45 ÷ 9 = ?', a: '5', choices: ['4', '5', '6', '36'] },
      { q: '32 ÷ 4 = ?', a: '8', choices: ['6', '7', '8', '9'] },
    ],
  },
  'multi-digit-mult': {
    title: 'Break It Apart', subject: 'math', g: 4,
    hook: 'Big times problem? Split the big number into tens and ones, multiply each, add them up.',
    example: '23 × 4 → 20×4 = 80, 3×4 = 12 → 80 + 12 = 92',
    practice: [
      { q: '14 × 3 = ?', a: '42', choices: ['32', '42', '43', '17'] },
      { q: '32 × 5 = ?', a: '160', choices: ['150', '160', '165', '37'] },
      { q: '26 × 2 = ?', a: '52', choices: ['48', '52', '62', '28'] },
    ],
  },
  'equiv-fractions': {
    title: 'Same Pizza, More Slices', subject: 'math', g: 4,
    hook: 'Multiply the top and bottom by the same number and the fraction stays the same size.',
    example: '1/2 → ×2 top and bottom → 2/4 → ×3 → 3/6. All the same!',
    practice: [
      { q: '1/3 is the same as…', a: '2/6', choices: ['2/6', '1/6', '3/3', '2/3'] },
      { q: '3/4 is the same as…', a: '6/8', choices: ['3/8', '6/8', '4/3', '6/4'] },
      { q: '4/8 is the same as…', a: '1/2', choices: ['1/4', '1/2', '4/4', '2/8'] },
    ],
  },
  'decimals': {
    title: 'Decimals = Money', subject: 'math', g: 5,
    hook: 'Think of decimals like dollars. 0.5 is 50 cents, 0.25 is a quarter.',
    example: '0.5 + 0.25 → 50¢ + 25¢ = 75¢ → 0.75',
    practice: [
      { q: '0.25 + 0.25 = ?', a: '0.5', choices: ['0.05', '0.5', '0.25', '5'] },
      { q: '1.5 + 0.5 = ?', a: '2', choices: ['1.10', '2', '1.55', '2.5'] },
      { q: '0.75 − 0.25 = ?', a: '0.5', choices: ['0.5', '0.05', '1', '0.25'] },
    ],
  },
  'fraction-add': {
    title: 'Adding Fractions', subject: 'math', g: 5,
    hook: 'Same bottom number? Add the tops, keep the bottom. The bottom is the slice size, and that doesn\'t change.',
    example: '1/3 + 1/3 → 1 + 1 = 2 → 2/3',
    practice: [
      { q: '2/5 + 1/5 = ?', a: '3/5', choices: ['3/10', '3/5', '2/5', '1/5'] },
      { q: '1/4 + 2/4 = ?', a: '3/4', choices: ['3/8', '3/4', '2/4', '1/2'] },
      { q: '3/8 + 3/8 = ?', a: '6/8', choices: ['6/16', '6/8', '9/8', '3/8'] },
    ],
  },
  'ratios': {
    title: 'Ratios & Unit Price', subject: 'math', g: 6,
    hook: 'Find the price of ONE first. Then multiply for however many you want.',
    example: '3 apples = $6 → 1 apple = $2 → 5 apples = $10',
    practice: [
      { q: '4 tacos cost $8. 6 tacos cost…', a: '$12', choices: ['$10', '$12', '$14', '$16'] },
      { q: '2 games take 30 min. 5 games take…', a: '75 min', choices: ['60 min', '75 min', '90 min', '50 min'] },
      { q: 'Ratio of 3 dogs to 6 cats in simplest form?', a: '1:2', choices: ['3:6', '1:2', '2:1', '1:3'] },
    ],
  },
  'negatives': {
    title: 'Negative Numbers', subject: 'math', g: 6,
    hook: 'Picture a number line. Negative is below zero, like temperature. Adding moves right, subtracting moves left.',
    example: '−3 + 5 → start at −3, move 5 right → 2',
    practice: [
      { q: '−2 + 6 = ?', a: '4', choices: ['−8', '−4', '4', '8'] },
      { q: '3 − 5 = ?', a: '−2', choices: ['2', '−2', '8', '−8'] },
      { q: 'Which is colder?', a: '−10°', choices: ['−10°', '−2°', '0°', '5°'] },
    ],
  },

  // ── Reading backfill + grade-level ─────────────────────────────────────
  'sight-words': {
    title: 'Sight Word Speed Run', subject: 'reading', g: 1,
    hook: 'Some words show up everywhere. Know them on sight and reading gets way faster.',
    example: 'the · said · have · they · were · because',
    practice: [
      { q: '"She ___ she was hungry."', a: 'said', choices: ['sed', 'said', 'sayed', 'sedd'] },
      { q: '"___ went to the park."', a: 'They', choices: ['Thay', 'They', 'Thei', 'Tey'] },
      { q: '"I stayed home ___ I was sick."', a: 'because', choices: ['becuz', 'because', 'becaus', 'beacause'] },
    ],
  },
  'short-vowels': {
    title: 'Rhyme Time', subject: 'reading', g: 1,
    hook: 'Rhyming words end with the same sound. Swap the first letter, keep the ending.',
    example: 'cat → hat → bat → sat',
    practice: [
      { q: 'Rhymes with "dog"?', a: 'log', choices: ['dig', 'log', 'dug', 'dot'] },
      { q: 'Rhymes with "pin"?', a: 'win', choices: ['pan', 'win', 'pen', 'pit'] },
      { q: 'Rhymes with "bug"?', a: 'rug', choices: ['bag', 'big', 'rug', 'bun'] },
    ],
  },
  'compound-words': {
    title: 'Word Mash-Ups', subject: 'reading', g: 2,
    hook: 'Compound words are two words smashed into one. The meaning usually comes from both parts.',
    example: 'foot + ball = football   rain + bow = rainbow',
    practice: [
      { q: 'Snow + man = ?', a: 'snowman', choices: ['snowman', 'mansnow', 'snowy', 'snowmen'] },
      { q: 'Which is a compound word?', a: 'backpack', choices: ['backing', 'backpack', 'packed', 'backs'] },
      { q: 'Base + ball = ?', a: 'baseball', choices: ['ballbase', 'baseball', 'basebal', 'bases'] },
    ],
  },
  'prefixes': {
    title: 'Prefix Power-Ups', subject: 'reading', g: 3,
    hook: 'A prefix goes at the start and changes the meaning. un = not, re = again, pre = before.',
    example: 'un + fair = not fair   re + play = play again',
    practice: [
      { q: '"Redo" means…', a: 'do again', choices: ['not do', 'do again', 'do before', 'do badly'] },
      { q: '"Unlock" means…', a: 'open the lock', choices: ['lock again', 'open the lock', 'lock first', 'big lock'] },
      { q: '"Preview" means…', a: 'see before', choices: ['see again', 'not see', 'see before', 'see far'] },
    ],
  },
  'synonyms': {
    title: 'Word Twins', subject: 'reading', g: 4,
    hook: 'Synonyms mean the same thing. Swap one in and the sentence still makes sense.',
    example: 'big = huge = enormous   fast = quick = rapid',
    practice: [
      { q: 'Synonym for "happy"?', a: 'glad', choices: ['sad', 'glad', 'mad', 'bad'] },
      { q: 'Synonym for "begin"?', a: 'start', choices: ['end', 'start', 'stop', 'wait'] },
      { q: 'Synonym for "difficult"?', a: 'hard', choices: ['easy', 'hard', 'fun', 'short'] },
    ],
  },
  'figurative': {
    title: "Don't Take It Literally", subject: 'reading', g: 5,
    hook: 'Idioms say one thing but mean another. Ask: what would a person actually mean?',
    example: '"Break a leg" → good luck   "Piece of cake" → super easy',
    practice: [
      { q: '"That test was a piece of cake" means…', a: 'It was easy', choices: ['It was hard', 'It was easy', 'There was cake', 'It was long'] },
      { q: '"Hit the books" means…', a: 'Study', choices: ['Punch books', 'Study', 'Drop books', 'Read slowly'] },
      { q: '"I\'m all ears" means…', a: "I'm listening", choices: ['Big ears', "I'm listening", "I'm tired", "I can't hear"] },
    ],
  },
  'theme': {
    title: "The Story's Lesson", subject: 'reading', g: 5,
    hook: 'Theme = the life lesson. Ask: what did the character learn, and could it apply to anyone?',
    example: 'Kid lies, gets caught, loses a friend → Theme: honesty matters.',
    practice: [
      { q: 'A kid shares lunch with a new student and they become best friends. Theme?', a: 'Kindness builds friendships', choices: ['Lunch is good', 'Kindness builds friendships', 'School is fun', 'Be new'] },
      { q: 'A rabbit brags, naps, and loses the race to a turtle. Theme?', a: 'Slow and steady wins', choices: ['Rabbits are fast', 'Slow and steady wins', 'Naps are good', 'Turtles are cool'] },
      { q: 'A girl is scared to try out, does it anyway, and makes the team. Theme?', a: 'Be brave and try', choices: ['Teams are big', 'Be brave and try', 'Never be scared', 'Tryouts are easy'] },
    ],
  },
  'author-purpose': {
    title: "Why'd They Write It?", subject: 'reading', g: 6,
    hook: 'Authors write to Persuade, Inform, or Entertain. Remember it like a PIE.',
    example: 'Ad = Persuade   Textbook = Inform   Comic = Entertain',
    practice: [
      { q: 'A news article about a storm is mostly to…', a: 'Inform', choices: ['Persuade', 'Inform', 'Entertain', 'Sell'] },
      { q: 'A funny story about a talking dog is mostly to…', a: 'Entertain', choices: ['Persuade', 'Inform', 'Entertain', 'Teach'] },
      { q: '"Vote for Maya for class president!" is to…', a: 'Persuade', choices: ['Persuade', 'Inform', 'Entertain', 'Explain'] },
    ],
  },
  'evidence': {
    title: 'Prove It', subject: 'reading', g: 6,
    hook: 'Evidence is a fact or detail that backs up a claim. It answers: how do you know?',
    example: 'Claim: "Exercise is healthy." Evidence: "It makes your heart stronger."',
    practice: [
      { q: 'Best evidence for "Recess helps students"?', a: 'Kids focus better after playing', choices: ['Recess is fun', 'Kids focus better after playing', 'Swings are red', 'Recess is at noon'] },
      { q: 'Best evidence for "Reading builds vocabulary"?', a: 'Readers see new words often', choices: ['Books are heavy', 'Readers see new words often', 'Libraries are quiet', 'Books have covers'] },
      { q: 'Best evidence for "Sleep matters"?', a: 'Sleep helps your brain remember', choices: ['Beds are soft', 'Sleep helps your brain remember', 'Night is dark', 'Pillows are nice'] },
    ],
  },
};
