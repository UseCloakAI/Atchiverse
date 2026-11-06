// 10 short history videos for CA 6th grade History-Social Science (World History: Ancient Civilizations).
// Written simple and slow: one short idea per beat, then a 3-point recap (feed.js turns recap into closing beats).
// over: { title } kinetic title card, { chip } badge, { fact } top label.
export const VIDEOS = [
  {
    "id": "early-humans",
    "hero": "hunter",
    "title": "The First Humans",
    "std": "6.1",
    "hue": "#c96d2b",
    "beats": [
      {
        "set": "title",
        "say": "Long, long ago, there were no cities and no stores.",
        "over": {
          "title": "THE FIRST HUMANS"
        },
        "sfx": "boom"
      },
      {
        "set": "map-world",
        "say": "The first humans lived in Africa.",
        "over": {
          "fact": "Started in Africa"
        },
        "sfx": "whoosh"
      },
      {
        "set": "map-world",
        "say": "Over a very long time, they spread all over the world.",
        "sfx": "whoosh"
      },
      {
        "set": "savanna",
        "cast": [
          [
            "hunter",
            110,
            {
              "anim": "a-bob",
              "talk": true
            }
          ],
          [
            "gatherer",
            240,
            {
              "anim": "a-bob",
              "flip": true
            }
          ]
        ],
        "say": "They hunted animals and picked wild plants to eat.",
        "over": {
          "chip": "Hunter-gatherers"
        },
        "sfx": "swoosh"
      },
      {
        "set": "ice",
        "cast": [
          [
            "hunter",
            90,
            {
              "anim": "a-walk"
            }
          ],
          [
            "gatherer",
            150,
            {
              "anim": "a-walk",
              "d": 0.3
            }
          ]
        ],
        "say": "They moved around to follow their food. People who move like this are called nomads.",
        "over": {
          "fact": "Nomads = movers"
        },
        "sfx": "whoosh"
      },
      {
        "set": "savanna",
        "cast": [
          [
            "hunter",
            180,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "Their tools were made of stone. That is why we call it the Stone Age.",
        "over": {
          "chip": "Stone Age"
        },
        "sfx": "drum"
      },
      {
        "set": "cave",
        "cast": [
          [
            "gatherer",
            90,
            {
              "anim": "a-bob"
            }
          ],
          [
            "hunter",
            270,
            {
              "anim": "a-bob",
              "flip": true,
              "talk": true
            }
          ]
        ],
        "say": "Then they learned to use fire.",
        "over": {
          "title": "FIRE"
        },
        "sfx": "boom"
      },
      {
        "set": "cave",
        "cast": [
          [
            "hunter",
            270,
            {
              "anim": "a-bob",
              "flip": true,
              "talk": true
            }
          ]
        ],
        "say": "Fire kept them warm, cooked their food, and scared away animals.",
        "sfx": "swoosh"
      },
      {
        "set": "cave",
        "cast": [
          [
            "gatherer",
            200,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "They even painted animals on cave walls.",
        "sfx": "sparkle"
      }
    ],
    "recap": [
      "Humans started in Africa",
      "They hunted and gathered food",
      "They used stone tools and fire"
    ],
    "faq": [
      {
        "q": "What is a hunter-gatherer?",
        "a": "Someone who gets food by hunting animals and gathering wild plants, instead of farming."
      },
      {
        "q": "What does nomad mean?",
        "a": "A person who moves from place to place instead of living in one spot. Early humans followed animal herds and the seasons."
      },
      {
        "q": "Why is it called the Stone Age?",
        "a": "Because people made most of their tools from stone. The early part is called the Paleolithic, or Old Stone Age."
      },
      {
        "q": "Why was fire such a big deal?",
        "a": "Fire gave warmth, light, protection from animals, and let people cook food, which made it safer and easier to eat."
      }
    ],
    "quiz": [
      {
        "q": "Early humans first lived in...",
        "a": "Africa",
        "choices": [
          "Africa",
          "Europe",
          "Australia",
          "North America"
        ]
      },
      {
        "q": "Why was this time called the Stone Age?",
        "a": "Tools were made of stone",
        "choices": [
          "People lived in stone houses",
          "Tools were made of stone",
          "It was very cold",
          "People ate stones"
        ]
      }
    ],
    "check": {
      "q": "Hunter-gatherers moved around mostly to...",
      "a": "Follow food sources",
      "choices": [
        "Follow food sources",
        "Visit other cities",
        "Find gold",
        "Go to school"
      ]
    }
  },
  {
    "id": "farming",
    "hero": "farmer",
    "title": "The Farming Revolution",
    "std": "6.1.3",
    "hue": "#5f9a3a",
    "beats": [
      {
        "set": "title",
        "say": "About ten thousand years ago, people learned something huge.",
        "over": {
          "title": "THE FARMING REVOLUTION"
        },
        "sfx": "boom"
      },
      {
        "set": "fields",
        "cast": [
          [
            "farmer",
            120,
            {
              "anim": "a-dig",
              "talk": true
            }
          ]
        ],
        "say": "They learned to plant seeds and grow their own food.",
        "over": {
          "chip": "Farming"
        },
        "sfx": "swoosh"
      },
      {
        "set": "fields",
        "cast": [
          [
            "farmer",
            200,
            {
              "anim": "a-bob",
              "talk": true
            }
          ]
        ],
        "say": "They also tamed animals, like goats and sheep.",
        "over": {
          "fact": "Taming = domestication"
        },
        "sfx": "pop"
      },
      {
        "set": "village",
        "cast": [
          [
            "farmer",
            100,
            {
              "anim": "a-bob",
              "talk": true
            }
          ]
        ],
        "say": "Farmers had to stay close to their crops.",
        "sfx": "whoosh"
      },
      {
        "set": "village",
        "cast": [
          [
            "farmer",
            100,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "So they stopped moving, and built villages.",
        "over": {
          "title": "VILLAGES"
        },
        "sfx": "boom"
      },
      {
        "set": "village",
        "cast": [
          [
            "farmer",
            90,
            {
              "anim": "a-bob",
              "talk": true
            }
          ],
          [
            "gatherer",
            270,
            {
              "anim": "a-bob",
              "flip": true
            }
          ]
        ],
        "say": "Sometimes they grew extra food. Extra food is called a surplus.",
        "over": {
          "chip": "Surplus = extra"
        },
        "sfx": "sparkle"
      },
      {
        "set": "village",
        "cast": [
          [
            "farmer",
            70,
            {
              "anim": "a-dig"
            }
          ],
          [
            "scribe",
            190,
            {
              "anim": "a-bob",
              "talk": true
            }
          ],
          [
            "hunter",
            300,
            {
              "anim": "a-bob",
              "flip": true
            }
          ]
        ],
        "say": "With extra food, some people could do other jobs, like making pots or tools.",
        "over": {
          "fact": "New jobs"
        },
        "sfx": "drum"
      },
      {
        "set": "village",
        "say": "Villages grew bigger and bigger, and became the first cities.",
        "sfx": "whoosh"
      }
    ],
    "recap": [
      "People learned to farm and tame animals",
      "Farmers stayed put and built villages",
      "Extra food let people do new jobs"
    ],
    "faq": [
      {
        "q": "What is agriculture?",
        "a": "Growing crops and raising animals for food. It began about 10,000 years ago in the New Stone Age."
      },
      {
        "q": "What is domestication?",
        "a": "Taming wild plants and animals so people can control and use them, like wheat, goats, and cattle."
      },
      {
        "q": "What is a surplus?",
        "a": "More of something than you need. A food surplus let some people do jobs other than farming."
      },
      {
        "q": "How did farming lead to cities?",
        "a": "Farmers settled in one place, food surpluses let populations grow, and villages grew into towns and then cities."
      }
    ],
    "quiz": [
      {
        "q": "Taming plants and animals is called...",
        "a": "Domestication",
        "choices": [
          "Irrigation",
          "Domestication",
          "Migration",
          "Democracy"
        ]
      },
      {
        "q": "Once people farmed, they began to...",
        "a": "Live in permanent villages",
        "choices": [
          "Move every week",
          "Live in permanent villages",
          "Stop eating meat",
          "Build pyramids"
        ]
      }
    ],
    "check": {
      "q": "Extra food that is more than people need is called a...",
      "a": "Surplus",
      "choices": [
        "Nomad",
        "Surplus",
        "Dynasty",
        "Tribute"
      ]
    }
  },
  {
    "id": "mesopotamia",
    "hero": "king",
    "title": "Mesopotamia",
    "std": "6.2",
    "hue": "#c9955a",
    "beats": [
      {
        "set": "title",
        "say": "Let's visit one of the first places with cities.",
        "over": {
          "title": "MESOPOTAMIA"
        },
        "sfx": "boom"
      },
      {
        "set": "map-fertile",
        "say": "Mesopotamia means land between the rivers.",
        "over": {
          "fact": "Land between rivers"
        },
        "sfx": "whoosh"
      },
      {
        "set": "map-fertile",
        "say": "The two rivers were the Tigris and the Euphrates.",
        "over": {
          "chip": "Tigris + Euphrates"
        },
        "sfx": "sparkle"
      },
      {
        "set": "rivers",
        "cast": [
          [
            "farmer",
            80,
            {
              "anim": "a-dig",
              "talk": true
            }
          ]
        ],
        "say": "The rivers flooded, so farmers dug ditches to bring water to their crops.",
        "sfx": "swoosh"
      },
      {
        "set": "rivers",
        "cast": [
          [
            "farmer",
            80,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "Bringing water to crops is called irrigation.",
        "over": {
          "title": "IRRIGATION"
        },
        "sfx": "boom"
      },
      {
        "set": "ziggurat",
        "cast": [
          [
            "king",
            90,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "Cities like Ur ruled themselves. They are called city-states.",
        "over": {
          "chip": "City-states"
        },
        "sfx": "drum"
      },
      {
        "set": "ziggurat",
        "cast": [
          [
            "scribe",
            290,
            {
              "anim": "a-bob",
              "flip": true,
              "talk": true
            }
          ]
        ],
        "say": "Each city had a giant stepped temple called a ziggurat.",
        "over": {
          "title": "ZIGGURAT"
        },
        "sfx": "boom"
      },
      {
        "set": "ziggurat",
        "cast": [
          [
            "king",
            80,
            {
              "anim": "a-bob",
              "talk": true
            }
          ],
          [
            "scribe",
            180,
            {
              "anim": "a-bob"
            }
          ],
          [
            "farmer",
            290,
            {
              "anim": "a-bob",
              "flip": true
            }
          ]
        ],
        "say": "People believed in many gods. Kings and priests were at the top.",
        "sfx": "whoosh"
      }
    ],
    "recap": [
      "Mesopotamia was between two rivers",
      "Farmers used irrigation",
      "Cities had ziggurat temples"
    ],
    "faq": [
      {
        "q": "What does Mesopotamia mean?",
        "a": "\"Land between the rivers.\" It was between the Tigris and Euphrates Rivers in modern-day Iraq."
      },
      {
        "q": "What is irrigation?",
        "a": "Bringing water to crops using canals and ditches. Mesopotamians used it to control unpredictable floods and farm dry land."
      },
      {
        "q": "What is a city-state?",
        "a": "A city that governs itself and the land around it, like its own small country. Ur and Uruk were Sumerian city-states."
      },
      {
        "q": "What is a ziggurat?",
        "a": "A huge stepped temple at the center of a Sumerian city, built to honor the city's god."
      }
    ],
    "quiz": [
      {
        "q": "Digging canals to bring water to crops is called...",
        "a": "Irrigation",
        "choices": [
          "Irrigation",
          "Domestication",
          "Cuneiform",
          "Surplus"
        ]
      },
      {
        "q": "A giant stepped temple in Sumer was a...",
        "a": "Ziggurat",
        "choices": [
          "Pyramid",
          "Ziggurat",
          "Stupa",
          "Colosseum"
        ]
      }
    ],
    "check": {
      "q": "Mesopotamia was between which two rivers?",
      "a": "Tigris and Euphrates",
      "choices": [
        "Nile and Kush",
        "Tigris and Euphrates",
        "Indus and Ganges",
        "Huang He and Yangtze"
      ]
    }
  },
  {
    "id": "writing-laws",
    "hero": "scribe",
    "title": "Writing and Laws",
    "std": "6.2.9",
    "hue": "#7a5a3a",
    "beats": [
      {
        "set": "title",
        "say": "Big cities need two things: writing, and rules.",
        "over": {
          "title": "WRITING + LAWS"
        },
        "sfx": "boom"
      },
      {
        "set": "scribe",
        "cast": [
          [
            "scribe",
            100,
            {
              "anim": "a-write",
              "talk": true
            }
          ]
        ],
        "say": "The people of Sumer made one of the first kinds of writing.",
        "over": {
          "chip": "About 3200 BCE"
        },
        "sfx": "tick"
      },
      {
        "set": "scribe",
        "cast": [
          [
            "scribe",
            100,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "It is called cuneiform. That means wedge-shaped.",
        "over": {
          "title": "CUNEIFORM"
        },
        "sfx": "boom"
      },
      {
        "set": "scribe",
        "cast": [
          [
            "scribe",
            100,
            {
              "anim": "a-write",
              "talk": true
            }
          ]
        ],
        "say": "Writers pressed a sharp reed into wet clay to make marks.",
        "over": {
          "fact": "Reed + wet clay"
        },
        "sfx": "tick"
      },
      {
        "set": "scribe",
        "cast": [
          [
            "scribe",
            100,
            {
              "anim": "a-bob",
              "talk": true
            }
          ]
        ],
        "say": "Writing helped them keep track of trades, taxes, and stories.",
        "sfx": "sparkle"
      },
      {
        "set": "stele",
        "cast": [
          [
            "king",
            70,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "Later, a king named Hammurabi wrote down 282 laws.",
        "over": {
          "title": "HAMMURABI'S CODE"
        },
        "sfx": "boom"
      },
      {
        "set": "stele",
        "cast": [
          [
            "farmer",
            70,
            {
              "anim": "a-bob"
            }
          ],
          [
            "scribe",
            290,
            {
              "anim": "a-bob",
              "flip": true,
              "talk": true
            }
          ]
        ],
        "say": "He carved them on a big stone, so everyone could see the rules.",
        "over": {
          "fact": "Rules for all to see"
        },
        "sfx": "drum"
      },
      {
        "set": "stele",
        "cast": [
          [
            "king",
            290,
            {
              "anim": "a-bob",
              "flip": true,
              "talk": true
            }
          ]
        ],
        "say": "Some punishments were harsh, like an eye for an eye.",
        "over": {
          "chip": "An eye for an eye"
        },
        "sfx": "whoosh"
      }
    ],
    "recap": [
      "Sumer made cuneiform writing",
      "Writing was pressed into clay",
      "Hammurabi wrote laws for all to see"
    ],
    "faq": [
      {
        "q": "What is cuneiform?",
        "a": "The wedge-shaped writing invented in Sumer, made by pressing a reed into wet clay. One of the first writing systems."
      },
      {
        "q": "What did scribes do?",
        "a": "Scribes were trained writers. They recorded trades, taxes, laws, and stories. It was a respected job."
      },
      {
        "q": "What was Hammurabi's Code?",
        "a": "A set of 282 laws written by King Hammurabi of Babylon around 1754 BCE and carved on a stone for all to see."
      },
      {
        "q": "Why did written laws matter?",
        "a": "Everyone could know the rules, and the rules stayed the same. That is a big step toward fair, organized government."
      }
    ],
    "quiz": [
      {
        "q": "Hammurabi carved his laws on stone so that...",
        "a": "Everyone could see them",
        "choices": [
          "Nobody could read them",
          "Everyone could see them",
          "They would float",
          "Kings could hide them"
        ]
      },
      {
        "q": "Hammurabi was a king of...",
        "a": "Babylon",
        "choices": [
          "Babylon",
          "Egypt",
          "Athens",
          "China"
        ]
      }
    ],
    "check": {
      "q": "Cuneiform was written on...",
      "a": "Clay tablets",
      "choices": [
        "Paper",
        "Clay tablets",
        "Silk",
        "Papyrus"
      ]
    }
  },
  {
    "id": "egypt",
    "hero": "pharaoh",
    "title": "Ancient Egypt",
    "std": "6.2",
    "hue": "#d99a2b",
    "beats": [
      {
        "set": "title",
        "say": "Pyramids, pharaohs, and mummies. Let's go to Egypt!",
        "over": {
          "title": "ANCIENT EGYPT"
        },
        "sfx": "boom"
      },
      {
        "set": "map-nile",
        "say": "Egypt grew along the Nile River.",
        "over": {
          "fact": "The Nile River"
        },
        "sfx": "whoosh"
      },
      {
        "set": "map-nile",
        "say": "Fun fact: the Nile flows north.",
        "over": {
          "chip": "Flows north"
        },
        "sfx": "sparkle"
      },
      {
        "set": "nile",
        "cast": [
          [
            "egyptian",
            100,
            {
              "anim": "a-dig",
              "talk": true
            }
          ]
        ],
        "say": "Each year the river flooded and left rich soil for farming.",
        "over": {
          "title": "GIFT OF THE NILE"
        },
        "sfx": "swoosh"
      },
      {
        "set": "pyramids",
        "cast": [
          [
            "pharaoh",
            90,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "Egypt's kings were called pharaohs. People thought they were gods.",
        "over": {
          "fact": "Pharaoh = king"
        },
        "sfx": "drum"
      },
      {
        "set": "pyramids",
        "cast": [
          [
            "egyptian",
            300,
            {
              "anim": "a-walk",
              "flip": true
            }
          ]
        ],
        "say": "Pyramids were giant tombs for pharaohs.",
        "over": {
          "title": "PYRAMIDS"
        },
        "sfx": "boom"
      },
      {
        "set": "tomb",
        "cast": [
          [
            "egyptian",
            70,
            {
              "anim": "a-bob",
              "talk": true
            }
          ]
        ],
        "say": "Egyptians believed in life after death, so they made mummies.",
        "sfx": "whoosh"
      },
      {
        "set": "tomb",
        "cast": [
          [
            "egyptian",
            70,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "They wrote with picture symbols called hieroglyphics.",
        "over": {
          "chip": "Hieroglyphics"
        },
        "sfx": "sparkle"
      }
    ],
    "recap": [
      "Egypt grew along the Nile",
      "Pharaohs ruled and built pyramids",
      "They wrote in hieroglyphics"
    ],
    "faq": [
      {
        "q": "Why is Egypt called the gift of the Nile?",
        "a": "The Nile's yearly flood left rich silt for farming, and the river was a highway for travel and trade. Egypt depended on it."
      },
      {
        "q": "What is a pharaoh?",
        "a": "The ruler of Ancient Egypt. Egyptians believed the pharaoh was a god-king with total power."
      },
      {
        "q": "What were pyramids for?",
        "a": "Tombs for pharaohs, built to protect their bodies and treasures for the afterlife."
      },
      {
        "q": "What are hieroglyphics?",
        "a": "Egyptian writing that used picture symbols. Scribes wrote on papyrus, a paper made from a river plant."
      }
    ],
    "quiz": [
      {
        "q": "Egyptian rulers were called...",
        "a": "Pharaohs",
        "choices": [
          "Emperors",
          "Pharaohs",
          "Consuls",
          "Kandakes"
        ]
      },
      {
        "q": "Pyramids were built as...",
        "a": "Tombs for pharaohs",
        "choices": [
          "Schools",
          "Tombs for pharaohs",
          "Markets",
          "Forts"
        ]
      }
    ],
    "check": {
      "q": "The Nile flood was important because it...",
      "a": "Left rich soil for farming",
      "choices": [
        "Destroyed the pyramids",
        "Left rich soil for farming",
        "Made the desert bigger",
        "Froze the river"
      ]
    }
  },
  {
    "id": "kush",
    "hero": "kandake",
    "title": "The Kingdom of Kush",
    "std": "6.2.8",
    "hue": "#b5652f",
    "beats": [
      {
        "set": "title",
        "say": "Egypt had a strong neighbor. Let's meet Kush.",
        "over": {
          "title": "KINGDOM OF KUSH"
        },
        "sfx": "boom"
      },
      {
        "set": "map-nile",
        "say": "Kush was south of Egypt, along the Nile.",
        "over": {
          "fact": "South of Egypt"
        },
        "sfx": "whoosh"
      },
      {
        "set": "meroe",
        "cast": [
          [
            "kush",
            110,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "Kush had lots of gold, and traded it far away.",
        "over": {
          "chip": "Gold"
        },
        "sfx": "sparkle"
      },
      {
        "set": "meroe",
        "cast": [
          [
            "kush",
            300,
            {
              "anim": "a-bob",
              "flip": true,
              "talk": true
            }
          ]
        ],
        "say": "For a long time, Egypt ruled Kush.",
        "sfx": "drum"
      },
      {
        "set": "pyramids",
        "cast": [
          [
            "kush",
            90,
            {
              "anim": "a-walk",
              "talk": true
            }
          ],
          [
            "kush",
            160,
            {
              "anim": "a-walk",
              "d": 0.2
            }
          ]
        ],
        "say": "Then Kush grew strong, and took over Egypt!",
        "over": {
          "title": "KUSH RULES EGYPT"
        },
        "sfx": "boom"
      },
      {
        "set": "meroe",
        "cast": [
          [
            "kandake",
            100,
            {
              "anim": "a-bob",
              "talk": true
            }
          ]
        ],
        "say": "Later, the city of Meroë became famous for making iron.",
        "over": {
          "fact": "Iron"
        },
        "sfx": "drum"
      },
      {
        "set": "meroe",
        "cast": [
          [
            "kandake",
            100,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "Strong queens, called kandakes, ruled there too.",
        "over": {
          "chip": "Kandakes = queens"
        },
        "sfx": "sparkle"
      },
      {
        "set": "meroe",
        "say": "Kush built pyramids too. Theirs are smaller and pointier.",
        "sfx": "whoosh"
      }
    ],
    "recap": [
      "Kush was south of Egypt",
      "Kush was rich in gold and iron",
      "Kush once ruled Egypt"
    ],
    "faq": [
      {
        "q": "Where was Kush?",
        "a": "South of Egypt along the Nile, in a region called Nubia. Today it is part of Sudan."
      },
      {
        "q": "What made Kush rich?",
        "a": "Trade in gold, ivory, ebony, and later iron."
      },
      {
        "q": "Did Kush ever rule Egypt?",
        "a": "Yes. Around 750 BCE Kush conquered Egypt, and Kushite kings ruled as pharaohs for about a century."
      },
      {
        "q": "What was Meroë known for?",
        "a": "Meroë was a Kushite capital and a major center for making iron."
      }
    ],
    "quiz": [
      {
        "q": "Kush became famous for making...",
        "a": "Iron",
        "choices": [
          "Paper",
          "Iron",
          "Silk",
          "Glass"
        ]
      },
      {
        "q": "Around 750 BCE, Kush...",
        "a": "Conquered Egypt",
        "choices": [
          "Conquered Egypt",
          "Invented writing",
          "Built the Great Wall",
          "Became a democracy"
        ]
      }
    ],
    "check": {
      "q": "Kush was located...",
      "a": "South of Egypt",
      "choices": [
        "North of Greece",
        "South of Egypt",
        "East of China",
        "In Mesopotamia"
      ]
    }
  },
  {
    "id": "india",
    "hero": "monk",
    "title": "Ancient India",
    "std": "6.5",
    "hue": "#e07a1e",
    "beats": [
      {
        "set": "title",
        "say": "Next stop: ancient India.",
        "over": {
          "title": "ANCIENT INDIA"
        },
        "sfx": "boom"
      },
      {
        "set": "map-india",
        "say": "India's first cities grew along the Indus River.",
        "over": {
          "fact": "Indus River"
        },
        "sfx": "whoosh"
      },
      {
        "set": "indus",
        "cast": [
          [
            "indus",
            110,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "Cities like Harappa had straight streets and brick houses.",
        "over": {
          "chip": "Planned cities"
        },
        "sfx": "drum"
      },
      {
        "set": "indus",
        "cast": [
          [
            "indus",
            260,
            {
              "anim": "a-bob",
              "flip": true,
              "talk": true
            }
          ]
        ],
        "say": "Many homes even had drains for water!",
        "sfx": "sparkle"
      },
      {
        "set": "bodhi",
        "cast": [
          [
            "indus",
            240,
            {
              "anim": "a-bob",
              "talk": true,
              "flip": true
            }
          ]
        ],
        "say": "A religion called Hinduism grew in India.",
        "over": {
          "title": "HINDUISM"
        },
        "sfx": "boom"
      },
      {
        "set": "bodhi",
        "cast": [
          [
            "indus",
            240,
            {
              "anim": "a-wave",
              "talk": true,
              "flip": true
            }
          ]
        ],
        "say": "Hindus believe in karma. That means your actions come back to you.",
        "over": {
          "chip": "Karma"
        },
        "sfx": "chime"
      },
      {
        "set": "bodhi",
        "cast": [
          [
            "indus",
            70,
            {
              "anim": "a-bob"
            }
          ],
          [
            "indus",
            140,
            {
              "anim": "a-bob"
            }
          ],
          [
            "farmer",
            290,
            {
              "anim": "a-bob",
              "flip": true,
              "talk": true
            }
          ]
        ],
        "say": "People were sorted into groups called castes. Your group decided your job.",
        "over": {
          "fact": "Caste system"
        },
        "sfx": "whoosh"
      },
      {
        "set": "bodhi",
        "cast": [
          [
            "monk",
            120,
            {
              "anim": "a-bob",
              "talk": true
            }
          ]
        ],
        "say": "A prince named Siddhartha became the Buddha, and started Buddhism.",
        "over": {
          "title": "BUDDHISM"
        },
        "sfx": "sparkle"
      }
    ],
    "recap": [
      "India's first cities were on the Indus River",
      "Hinduism teaches karma",
      "The Buddha started Buddhism"
    ],
    "faq": [
      {
        "q": "What was special about Indus Valley cities?",
        "a": "They were carefully planned, with grid streets, brick homes, and drainage systems. Harappa and Mohenjo-daro are the best known."
      },
      {
        "q": "What are karma and reincarnation?",
        "a": "Hindu beliefs. Karma means your actions have consequences. Reincarnation means the soul is reborn in a new life."
      },
      {
        "q": "What was the caste system?",
        "a": "A strict social structure in ancient India that decided people's jobs and limited who they could marry."
      },
      {
        "q": "Who was the Buddha?",
        "a": "Siddhartha Gautama, a prince who gave up his wealth to understand suffering. His teachings became Buddhism."
      }
    ],
    "quiz": [
      {
        "q": "Siddhartha Gautama became known as...",
        "a": "The Buddha",
        "choices": [
          "The Buddha",
          "A pharaoh",
          "Confucius",
          "An emperor"
        ]
      },
      {
        "q": "The Hindu idea that your actions have results is...",
        "a": "Karma",
        "choices": [
          "Karma",
          "Caste",
          "Mandate",
          "Surplus"
        ]
      }
    ],
    "check": {
      "q": "The first civilization in India grew along the...",
      "a": "Indus River",
      "choices": [
        "Nile River",
        "Indus River",
        "Tigris River",
        "Yellow River"
      ]
    }
  },
  {
    "id": "china",
    "hero": "emperor",
    "title": "Ancient China",
    "std": "6.6",
    "hue": "#b3261e",
    "beats": [
      {
        "set": "title",
        "say": "Let's travel to ancient China.",
        "over": {
          "title": "ANCIENT CHINA"
        },
        "sfx": "boom"
      },
      {
        "set": "map-china",
        "say": "China began along the Yellow River.",
        "over": {
          "fact": "Yellow River"
        },
        "sfx": "whoosh"
      },
      {
        "set": "yellow-river",
        "cast": [
          [
            "farmer",
            100,
            {
              "anim": "a-dig",
              "talk": true
            }
          ]
        ],
        "say": "Its floods gave good soil, but they also wrecked homes.",
        "sfx": "swoosh"
      },
      {
        "set": "palace",
        "cast": [
          [
            "emperor",
            100,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "Families of rulers, called dynasties, ruled China.",
        "over": {
          "chip": "Dynasty = ruling family"
        },
        "sfx": "drum"
      },
      {
        "set": "yellow-river",
        "cast": [
          [
            "sage",
            180,
            {
              "anim": "a-bob",
              "talk": true
            }
          ]
        ],
        "say": "A teacher named Confucius taught: respect your family, and be honest.",
        "over": {
          "title": "CONFUCIUS"
        },
        "sfx": "chime"
      },
      {
        "set": "wall",
        "cast": [
          [
            "emperor",
            80,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "The first emperor joined all of China together.",
        "over": {
          "chip": "221 BCE"
        },
        "sfx": "boom"
      },
      {
        "set": "wall",
        "cast": [
          [
            "emperor",
            80,
            {
              "anim": "a-bob",
              "talk": true
            }
          ]
        ],
        "say": "He started the Great Wall to keep enemies out.",
        "over": {
          "title": "GREAT WALL"
        },
        "sfx": "boom"
      },
      {
        "set": "map-silk",
        "say": "Later, the Silk Road carried silk and goods all the way to Rome.",
        "over": {
          "fact": "Silk Road"
        },
        "sfx": "whoosh"
      }
    ],
    "recap": [
      "China began on the Yellow River",
      "Confucius taught respect and honesty",
      "China built the Great Wall"
    ],
    "faq": [
      {
        "q": "What is a dynasty?",
        "a": "A line of rulers from the same family. Power passes from parent to child."
      },
      {
        "q": "What is the Mandate of Heaven?",
        "a": "The belief that heaven gave a ruler the right to rule. If a ruler was unjust or disasters hit, people said he had lost it."
      },
      {
        "q": "What did Confucius teach?",
        "a": "Respect for family and elders, honesty, and that leaders should be good role models."
      },
      {
        "q": "What was the Silk Road?",
        "a": "A network of trade routes connecting China to the Middle East and Rome. Silk, spices, and ideas traveled along it."
      }
    ],
    "quiz": [
      {
        "q": "The Mandate of Heaven was the idea that...",
        "a": "Heaven approved the ruler",
        "choices": [
          "Heaven approved the ruler",
          "Everyone could vote",
          "Rivers were gods",
          "Farming was wrong"
        ]
      },
      {
        "q": "The Silk Road was a...",
        "a": "Trade route",
        "choices": [
          "Trade route",
          "Wall",
          "River",
          "Temple"
        ]
      }
    ],
    "check": {
      "q": "The first emperor of a united China was...",
      "a": "Qin Shi Huang",
      "choices": [
        "Confucius",
        "Qin Shi Huang",
        "Hammurabi",
        "Julius Caesar"
      ]
    }
  },
  {
    "id": "greece",
    "hero": "greek",
    "title": "Ancient Greece",
    "std": "6.4",
    "hue": "#2f6db5",
    "beats": [
      {
        "set": "title",
        "say": "Ever voted in class? Thank the ancient Greeks.",
        "over": {
          "title": "ANCIENT GREECE"
        },
        "sfx": "boom"
      },
      {
        "set": "map-greece",
        "say": "Greece has lots of mountains, and lots of sea.",
        "over": {
          "fact": "Mountains + sea"
        },
        "sfx": "whoosh"
      },
      {
        "set": "map-greece",
        "say": "So each city ruled itself. These were called city-states.",
        "over": {
          "chip": "City-states"
        },
        "sfx": "sparkle"
      },
      {
        "set": "athens",
        "cast": [
          [
            "greek",
            90,
            {
              "anim": "a-wave",
              "talk": true
            }
          ]
        ],
        "say": "In Athens, people voted on their own laws.",
        "over": {
          "title": "DEMOCRACY"
        },
        "sfx": "boom"
      },
      {
        "set": "athens",
        "cast": [
          [
            "greek",
            80,
            {
              "anim": "a-bob"
            }
          ],
          [
            "greek",
            280,
            {
              "anim": "a-bob",
              "flip": true,
              "talk": true
            }
          ]
        ],
        "say": "But only some men could vote. Women and enslaved people could not.",
        "over": {
          "fact": "Not everyone voted"
        },
        "sfx": "whoosh"
      },
      {
        "set": "sparta",
        "cast": [
          [
            "spartan",
            110,
            {
              "anim": "a-march",
              "talk": true
            }
          ],
          [
            "spartan",
            200,
            {
              "anim": "a-march",
              "d": 0.2
            }
          ]
        ],
        "say": "Sparta was different. It was all about being strong soldiers.",
        "over": {
          "title": "SPARTA"
        },
        "sfx": "drum"
      },
      {
        "set": "olympia",
        "cast": [
          [
            "greek",
            120,
            {
              "anim": "a-walk"
            }
          ]
        ],
        "say": "The Greeks also started the Olympic Games.",
        "over": {
          "chip": "776 BCE"
        },
        "sfx": "sparkle"
      },
      {
        "set": "athens",
        "cast": [
          [
            "greek",
            180,
            {
              "anim": "a-bob",
              "talk": true
            }
          ]
        ],
        "say": "Greek thinkers asked big questions, like what is fair and what is true.",
        "over": {
          "fact": "Philosophy"
        },
        "sfx": "chime"
      }
    ],
    "recap": [
      "Greece was made of city-states",
      "Athens started democracy",
      "Sparta trained soldiers"
    ],
    "faq": [
      {
        "q": "Why did Greece have city-states?",
        "a": "Mountains and sea separated communities, so each city grew up independently with its own government."
      },
      {
        "q": "What is democracy?",
        "a": "Government by the people. In Athens, citizens voted directly on laws. That is called direct democracy."
      },
      {
        "q": "How was Sparta different from Athens?",
        "a": "Sparta focused on military strength and discipline. Athens focused on democracy, art, and learning."
      },
      {
        "q": "Who was Alexander the Great?",
        "a": "A Macedonian king who built a huge empire and spread Greek culture from Greece to Egypt and India."
      }
    ],
    "quiz": [
      {
        "q": "Greece formed city-states because of...",
        "a": "Mountains and sea",
        "choices": [
          "Mountains and sea",
          "A big desert",
          "One great river",
          "Ice"
        ]
      },
      {
        "q": "In Athens, who could vote?",
        "a": "Free men born in Athens",
        "choices": [
          "Everyone",
          "Free men born in Athens",
          "Only the king",
          "Women only"
        ]
      }
    ],
    "check": {
      "q": "Which city-state created the first democracy?",
      "a": "Athens",
      "choices": [
        "Sparta",
        "Athens",
        "Rome",
        "Babylon"
      ]
    }
  },
  {
    "id": "rome",
    "hero": "caesar",
    "title": "Ancient Rome",
    "std": "6.7",
    "hue": "#7b2d8e",
    "beats": [
      {
        "set": "title",
        "say": "Now let's visit ancient Rome.",
        "over": {
          "title": "ANCIENT ROME"
        },
        "sfx": "boom"
      },
      {
        "set": "map-rome",
        "say": "Rome started as a small city in Italy.",
        "over": {
          "fact": "Started in Italy"
        },
        "sfx": "whoosh"
      },
      {
        "set": "senate",
        "cast": [
          [
            "roman",
            90,
            {
              "anim": "a-wave",
              "talk": true
            }
          ],
          [
            "roman",
            270,
            {
              "anim": "a-bob",
              "flip": true
            }
          ]
        ],
        "say": "Romans got rid of their king. They chose leaders by voting.",
        "over": {
          "title": "REPUBLIC"
        },
        "sfx": "boom"
      },
      {
        "set": "senate",
        "cast": [
          [
            "roman",
            180,
            {
              "anim": "a-bob",
              "talk": true
            }
          ]
        ],
        "say": "That kind of government is called a republic.",
        "over": {
          "chip": "Republic"
        },
        "sfx": "drum"
      },
      {
        "set": "rome",
        "cast": [
          [
            "caesar",
            120,
            {
              "anim": "a-wave",
              "talk": true
            }
          ],
          [
            "legion",
            250,
            {
              "anim": "a-march",
              "flip": true
            }
          ]
        ],
        "say": "A general named Julius Caesar took power. Then he was killed.",
        "over": {
          "chip": "44 BCE"
        },
        "sfx": "boom"
      },
      {
        "set": "colosseum",
        "cast": [
          [
            "caesar",
            80,
            {
              "anim": "a-bob",
              "talk": true
            }
          ]
        ],
        "say": "Next, Augustus became Rome's first emperor.",
        "over": {
          "title": "EMPIRE"
        },
        "sfx": "boom"
      },
      {
        "set": "aqueduct",
        "cast": [
          [
            "legion",
            80,
            {
              "anim": "a-march"
            }
          ],
          [
            "roman",
            280,
            {
              "anim": "a-bob",
              "flip": true,
              "talk": true
            }
          ]
        ],
        "say": "Romans built roads, and aqueducts to carry water.",
        "over": {
          "fact": "Roads + aqueducts"
        },
        "sfx": "whoosh"
      },
      {
        "set": "aqueduct",
        "cast": [
          [
            "roman",
            280,
            {
              "anim": "a-wave",
              "flip": true,
              "talk": true
            }
          ]
        ],
        "say": "Their language, Latin, gave us lots of English words.",
        "sfx": "sparkle"
      }
    ],
    "recap": [
      "Rome started as a republic",
      "Then it became an empire",
      "Romans built roads and aqueducts"
    ],
    "faq": [
      {
        "q": "What is a republic?",
        "a": "A government where citizens elect leaders to represent them. Rome became a republic in 509 BCE. The United States is one too."
      },
      {
        "q": "What was the Senate?",
        "a": "A group of leaders who advised and made laws in Rome. Two elected consuls ran the government."
      },
      {
        "q": "Who was Augustus?",
        "a": "Julius Caesar's heir and Rome's first emperor, starting in 27 BCE. His rule began a long peace called the Pax Romana."
      },
      {
        "q": "What did Romans leave behind?",
        "a": "Roads, arches, aqueducts, the Latin language, ideas about law and government, and the spread of Christianity."
      }
    ],
    "quiz": [
      {
        "q": "Rome's first emperor was...",
        "a": "Augustus",
        "choices": [
          "Julius Caesar",
          "Augustus",
          "Romulus",
          "Hammurabi"
        ]
      },
      {
        "q": "Aqueducts were built to...",
        "a": "Carry water to cities",
        "choices": [
          "Carry water to cities",
          "Store grain",
          "Hold races",
          "Bury emperors"
        ]
      }
    ],
    "check": {
      "q": "In a republic, citizens...",
      "a": "Elect leaders to represent them",
      "choices": [
        "Obey a pharaoh",
        "Elect leaders to represent them",
        "Have no rights",
        "Follow the Mandate of Heaven"
      ]
    }
  }
];

// History path: two videos per unit, then a unit test.
export const HIST_PATH = [
  {
    "unit": "First people",
    "videos": [
      "early-humans",
      "farming"
    ]
  },
  {
    "unit": "Mesopotamia",
    "videos": [
      "mesopotamia",
      "writing-laws"
    ]
  },
  {
    "unit": "Egypt and Kush",
    "videos": [
      "egypt",
      "kush"
    ]
  },
  {
    "unit": "India and China",
    "videos": [
      "india",
      "china"
    ]
  },
  {
    "unit": "Greece and Rome",
    "videos": [
      "greece",
      "rome"
    ]
  }
];
