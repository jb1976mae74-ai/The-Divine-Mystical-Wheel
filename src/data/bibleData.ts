/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BibleVerse {
  number: number;
  text: string;
  literalText?: string;
  originalText?: string; // Hebrew or Greek
  transliteration?: string;
  crossReferences?: string[];
  studyNotes?: string;
  keywords?: string[];
}

export interface SwordRepository {
  name: string;
  description: string;
  manifestUrl: string;
  type: "sword-https" | "sword-http" | "sword-ftp" | "custom";
  host: string;
  catalogDirectory: string;
  packageDirectory: string;
  status?: "online" | "testing" | "active";
  modulesCount?: number;
  lastSynced?: string;
}

export const SWORD_REPOSITORIES_DATABASE: SwordRepository[] = [
  {
    name: "AndBible test",
    description: "Test module repository maintained by AndBible development team",
    manifestUrl: "https://andbible.github.io/data/andbible/test/manifest.json",
    type: "sword-https",
    host: "andbible.github.io",
    catalogDirectory: "/data/andbible/test",
    packageDirectory: "/data/andbible/test/",
    status: "active",
    modulesCount: 24,
    lastSynced: "2026-07-25"
  },
  {
    name: "CrossWire Main Repository",
    description: "Official CrossWire Bible Society main SWORD module repository",
    manifestUrl: "https://crosswire.org/ftpmirror/pub/sword/raw/manifest.json",
    type: "sword-https",
    host: "crosswire.org",
    catalogDirectory: "/ftpmirror/pub/sword/raw",
    packageDirectory: "/ftpmirror/pub/sword/packages/rawzip",
    status: "online",
    modulesCount: 180,
    lastSynced: "2026-07-24"
  },
  {
    name: "eBible.org Open Scripture Repository",
    description: "World Bible Translation Center and eBible public domain scriptures",
    manifestUrl: "https://ebible.org/sword/manifest.json",
    type: "sword-https",
    host: "ebible.org",
    catalogDirectory: "/sword",
    packageDirectory: "/sword/zip",
    status: "online",
    modulesCount: 350,
    lastSynced: "2026-07-20"
  }
];

export interface BibleChapter {
  chapterNumber: number;
  title?: string;
  verses: BibleVerse[];
  chapterSummary?: string;
}

export interface BibleBook {
  id: string;
  name: string;
  testament: "Old Testament" | "New Testament";
  category: "Torah / Pentateuch" | "Historical" | "Wisdom & Poetry" | "Major Prophets" | "Minor Prophets" | "Gospels" | "Apostolic History" | "Epistles" | "Apocalyptic";
  author: string;
  originalLanguage: "Hebrew" | "Aramaic" | "Koine Greek";
  estimatedDate: string;
  description: string;
  keyTheme: string;
  chapters: BibleChapter[];
}

export const BIBLE_BOOKS_DATABASE: BibleBook[] = [
  {
    id: "genesis",
    name: "Genesis (Bereshit)",
    testament: "Old Testament",
    category: "Torah / Pentateuch",
    author: "Moses (Priestly & Ancient Tradition)",
    originalLanguage: "Hebrew",
    estimatedDate: "1400–500 BCE",
    description: "The Book of Beginnings: Creation, the primordial cosmos, the Fall, the Flood, the Patriarchal covenant, and divine providence.",
    keyTheme: "Cosmic Genesis, Covenantal Election, and Divine Blueprint",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Creation of the Heavens and Earth",
        chapterSummary: "The six days of creation through divine command ('Fiat Lux') culminating in the rest on the Sabbath (Shabbat).",
        verses: [
          {
            number: 1,
            text: "In the beginning God created the heavens and the earth.",
            literalText: "B'reshit bara Elohim et hashamayim v'et ha'aretz.",
            originalText: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
            transliteration: "Bereshit bara Elohim et ha-shamayim ve-et ha-aretz",
            crossReferences: ["John 1:1", "Hebrews 11:3", "Psalm 33:6"],
            studyNotes: "'Bereshit' implies 'at the head of things' or 'in the principle'. 'Elohim' is a plural form of majesty, acting as a singular creator verb 'bara'.",
            keywords: ["Creation", "Beginning", "Elohim", "Cosmos"]
          },
          {
            number: 2,
            text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
            literalText: "And the earth was Tohu wa-Bohu (chaos and void)... and Ruach Elohim hovered.",
            originalText: "וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם",
            transliteration: "Ve-ha-aretz hayeta tohu va-vohu ve-choshech al-penei tehom ve-ruach Elohim merachefet al-penei ha-mayim",
            crossReferences: ["Jeremiah 4:23", "Psalm 104:30", "Isaiah 45:18"],
            studyNotes: "'Tohu wa-Bohu' describes primordial unformed chaos. 'Ruach Elohim' denotes the divine breath or wind fluttering vibrating above the waters of the deep ('Tehom').",
            keywords: ["Tohu wa-Bohu", "Ruach", "Tehom", "Spirit"]
          },
          {
            number: 3,
            text: "And God said, 'Let there be light,' and there was light.",
            literalText: "And Elohim said: 'V'hi-or' (Light become!), and light became.",
            originalText: "וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי־אוֹר",
            transliteration: "Vayomer Elohim yehi or vayehi-or",
            crossReferences: ["2 Corinthians 4:6", "John 8:12", "Psalm 119:105"],
            studyNotes: "Creation operates via speech (davar/logos). Divine utterance projects uncreated light into physical manifestation before the sun is created on day four.",
            keywords: ["Fiat Lux", "Word", "Light", "Utterance"]
          },
          {
            number: 26,
            text: "Then God said, 'Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky...'",
            literalText: "And Elohim said: 'Na'aseh adam b'tzalmenu kidmutenu...'",
            originalText: "וַיֹּאמֶר אֱלֹהִים נַעֲשֶׂה אָדָם בְּצַלְמֵנוּ כִּדְמוּתֵנוּ",
            transliteration: "Vayomer Elohim na'aseh adam be-tzalmenu ke-demutenu",
            crossReferences: ["Genesis 9:6", "Colossians 3:10", "Psalm 8:5"],
            studyNotes: "'Tzelem' (Image) and 'Demut' (Likeness) denote humans as divine stewards and representatives on earth bearing the cosmic imprint.",
            keywords: ["Imago Dei", "Adam", "Stewardship", "Likeness"]
          },
          {
            number: 27,
            text: "So God created mankind in his own image, in the image of God he created them; male and female he created them.",
            originalText: "וַיִּבְרָא אֱלֹהִים אֶת־הָאָדָם בְּצַלְמוֹ בְּצֶלֶם אֱלֹהִים בָּרָא אֹתוֹ זָכָר וּנְקֵבָה בָּרָא אֹתָם",
            transliteration: "Vayivra Elohim et-ha-adam be-tzalmo be-tzelem Elohim bara oto zachar u-nekevah bara otam",
            crossReferences: ["Matthew 19:4", "Galatians 3:28"],
            studyNotes: "Emphasizes absolute equal spiritual dignity of male and female as co-bearers of the Imago Dei.",
            keywords: ["Equality", "Image", "Humanity"]
          }
        ]
      },
      {
        chapterNumber: 14,
        title: "Abram Rescues Lot & Encounters Melchizedek King of Salem",
        chapterSummary: "Abram returns from defeating the four kings and is blessed by Melchizedek, King of Salem and Priest of Most High God (El Elyon).",
        verses: [
          {
            number: 18,
            text: "Then Melchizedek king of Salem brought out bread and wine. He was priest of God Most High (El Elyon).",
            literalText: "U-Malki-Tzedek melech Shalem hotzi lechem va-yayin, ve-hu kohen l'El Elyon.",
            originalText: "וּמַלְכִּי־צֶדֶק מֶלֶךְ שָׁלֵם הוֹצִיא לֶחֶם וָיָיִן וְהוּא כֹהֵן לְאֵל עֶלְיוֹן",
            transliteration: "U-Malki-Tzedek melech Shalem hotzi lechem va-yayin ve-hu kohen le-El Elyon",
            crossReferences: ["Psalm 110:4", "Hebrews 5:6", "Hebrews 7:1-3"],
            studyNotes: "'Malki-Tzedek' translates as 'My King is Righteousness'. 'Shalem' signifies Peace/Jerusalem. Bread and wine prefigure the sacramental altar.",
            keywords: ["Melchizedek", "El Elyon", "Salem", "Bread and Wine", "Priesthood"]
          },
          {
            number: 19,
            text: "And he blessed Abram, saying, 'Blessed be Abram by God Most High, Creator of heaven and earth.'",
            originalText: "וַיְבָרְכֵהוּ וַיֹּאמַר בָּרוּךְ אַבְרָם לְאֵל עֶלְיוֹן קֹנֵה שָׁמַיִם וָאָרֶץ",
            transliteration: "Vayevarchehu vayomar baruch Avram le-El Elyon koneh shamayim va-aretz",
            crossReferences: ["Genesis 24:3", "Hebrews 7:7"],
            studyNotes: "Melchizedek pronounces the primary priestly blessing over Abram, establishing the precedence of the Order of Melchizedek over Levi.",
            keywords: ["Blessing", "El Elyon", "Creator", "Abram"]
          },
          {
            number: 20,
            text: "And praise be to God Most High, who delivered your enemies into your hand.' Then Abram gave him a tenth of everything.",
            originalText: "וּבָרוּךְ אֵל עֶלְיוֹן אֲשֶׁר־מִגֵּן צָרֶיךָ בְּיָדֶךָ וַיִּתֶּן־לוֹ מַעֲשֵׂר מִכֹּל",
            transliteration: "U-varuch El Elyon asher-migen tzareicha be-yadecha vayitten-lo ma'aser mi-kol",
            crossReferences: ["Hebrews 7:4", "Genesis 28:22"],
            studyNotes: "Abram pays tithes ('ma'aser') to Melchizedek, demonstrating Melchizedek's superior divine authority before the Aaronic priesthood existed.",
            keywords: ["Tithe", "Ma'aser", "Victory", "Melchizedek"]
          }
        ]
      }
    ]
  },
  {
    id: "exodus",
    name: "Exodus (Shemot)",
    testament: "Old Testament",
    category: "Torah / Pentateuch",
    author: "Moses",
    originalLanguage: "Hebrew",
    estimatedDate: "1400–500 BCE",
    description: "The deliverance of Israel from Egypt, the Burning Bush, the Divine Name revelation, the Law at Sinai, and the construction of the Tabernacle.",
    keyTheme: "Redemption, Covenant Law, and the Indwelling Shechinah",
    chapters: [
      {
        chapterNumber: 3,
        title: "The Burning Bush & Revelation of the Sacred Name",
        chapterSummary: "Moses encounters the angel of the LORD in a bush burning with unconsuming fire and receives the absolute name YHWH.",
        verses: [
          {
            number: 13,
            text: "Moses said to God, 'Suppose I go to the Israelites and say to them, \"The God of your fathers has sent me to you,\" and they ask me, \"What is his name?\" Then what shall I tell them?'",
            originalText: "וַיֹּאמֶר מֹשֶׁה אֶל־הָאֱלֹהִים הִנֵּה אָנֹכִי בָא אֶל־בְּנֵי יִשְׂרָאֵל... מַה־שְּׁמוֹ מָה אֹמַר אֲלֵהֶם",
            transliteration: "Vayomer Moshe el-ha-Elohim hineh anochi va el-benei Yisrael... mah-shemo mah omar aleihem",
            crossReferences: ["Exodus 6:3", "Psalm 9:10"],
            studyNotes: "In the ancient Near East, revealing a name granted relational access and covenant intimacy.",
            keywords: ["Name", "Revelation", "Moses", "Bush"]
          },
          {
            number: 14,
            text: "God said to Moses, 'I AM WHO I AM. This is what you are to say to the Israelites: \"I AM has sent me to you.\"'",
            literalText: "Ehyeh Asher Ehyeh (I Will Be What I Will Be).",
            originalText: "וַיֹּאמֶר אֱלֹהִים אֶל־מֹשֶׁה אֶהְיֶה אֲשֶׁר אֶהְיֶה",
            transliteration: "Vayomer Elohim el-Moshe Ehyeh Asher Ehyeh",
            crossReferences: ["John 8:58", "Revelation 1:8", "Isaiah 44:6"],
            studyNotes: "'Ehyeh Asher Ehyeh' expresses self-existent, uncaused, dynamic BEING. It forms the root of the Tetragrammaton YHWH (Yahweh).",
            keywords: ["Ehyeh", "YHWH", "Self-Existence", "I AM"]
          }
        ]
      },
      {
        chapterNumber: 20,
        title: "The Ten Commandments (Aseret HaDibrot)",
        chapterSummary: "The ethical and monotheistic blueprint delivered at Mount Sinai amidst thunder, smoke, and shofar blasts.",
        verses: [
          {
            number: 2,
            text: "I am the LORD your God, who brought you out of Egypt, out of the land of slavery.",
            originalText: "אָנֹכִי יְהוָה אֱלֹהֶיךָ אֲשֶׁר הוֹצֵאתִיךָ מֵאֶרֶץ מִצְרַיִם מִבֵּית עֲבָדִים",
            transliteration: "Anochi YHWH Eloheicha asher hotzeticha me-eretz Mitzrayim mi-beit avadim",
            crossReferences: ["Deuteronomy 5:6", "Psalm 81:10"],
            studyNotes: "The foundational preamble: redemption precedes commandment.",
            keywords: ["Freedom", "Commandment", "Redemption"]
          },
          {
            number: 3,
            text: "You shall have no other gods before me.",
            originalText: "לֹא יִהְיֶה־לְךָ אֱלֹהִים אֲחֵרִים עַל־פָּנָי",
            transliteration: "Lo yihyeh-lecha elohim acherim al-panai",
            crossReferences: ["Matthew 4:10", "1 Corinthians 8:6"],
            studyNotes: "Absolute allegiance to the singular Creator source, rejecting idol projections.",
            keywords: ["Monotheism", "Singularity", "Covenant"]
          }
        ]
      }
    ]
  },
  {
    id: "psalms",
    name: "Psalms (Tehillim)",
    testament: "Old Testament",
    category: "Wisdom & Poetry",
    author: "David, Asaph, Sons of Korah, Moses, Ethan",
    originalLanguage: "Hebrew",
    estimatedDate: "1000–400 BCE",
    description: "The sacred hymnal and prayerbook of ancient Israel, containing praise, lament, royal messianic songs, and mystical meditations.",
    keyTheme: "Sacred Intimacy, Praise, Cosmic Wonder, and Messianic Hope",
    chapters: [
      {
        chapterNumber: 23,
        title: "The Shepherd Psalm",
        chapterSummary: "A timeless song of divine protection, guidance through darkness, and eternal hospitality.",
        verses: [
          {
            number: 1,
            text: "The LORD is my shepherd, I lack nothing.",
            originalText: "יְהוָה רֹעִי לֹא אֶחְסָר",
            transliteration: "YHWH ro'i lo echsar",
            crossReferences: ["John 10:11", "Ezekiel 34:11", "Revelation 7:17"],
            studyNotes: "'YHWH Ro'i' highlights the intimate pastoral care of God guiding the individual soul.",
            keywords: ["Shepherd", "Provision", "Peace"]
          },
          {
            number: 4,
            text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
            literalText: "Walk through Tzalmavet (the valley of the shadow of death)...",
            originalText: "גַּם כִּי־אֵלֵךְ בְּגֵיא צַלְמָוֶת לֹא־אִירָא רָע כִּי־אַתָּה עִמָּדִי",
            transliteration: "Gam ki-elech be-gei tzalmavet lo-ira ra ki-atah immadi",
            crossReferences: ["Isaiah 43:2", "Job 10:21"],
            studyNotes: "'Tzalmavet' translates as deepest shadow or realm of death. God's presence transforms isolation into invincible sanctuary.",
            keywords: ["Tzalmavet", "Courage", "Sanctuary"]
          }
        ]
      },
      {
        chapterNumber: 119,
        title: "The Acrostic Psalm of Divine Torah",
        chapterSummary: "The longest psalm, celebrating the illumination, sweetness, and guidance of sacred scripture.",
        verses: [
          {
            number: 105,
            text: "Your word is a lamp for my feet, a light on my path.",
            originalText: "נֵר־לְרַגְלִי דְבָרֶךָ וְאוֹר לִנְתִיבָתִי",
            transliteration: "Ner-le-ragli devarecha ve-or li-netivati",
            crossReferences: ["Proverbs 6:23", "2 Peter 1:19"],
            studyNotes: "The scriptures act as an individual lantern ('ner') illuminating step-by-step choices in spiritual dark.",
            keywords: ["Word", "Light", "Lamp", "Guidance"]
          }
        ]
      },
      {
        chapterNumber: 110,
        title: "The Royal Messianic Psalm & Order of Melchizedek",
        chapterSummary: "Davidic psalm proclaiming the enthronement of the Lord at the right hand of God and the eternal priesthood after the order of Melchizedek.",
        verses: [
          {
            number: 1,
            text: "The LORD says to my Lord: 'Sit at my right hand until I make your enemies a footstool for your feet.'",
            originalText: "נְאֻם יְהוָה לַאדֹנִי שֵׁב לִימִינִי עַד־אָשִׁית אֹיְבֶיךָ הֲדֹם לְרַגְלֶיךָ",
            transliteration: "Ne'um YHWH l'Adoni shev li-mini ad-ashit oyveicha hadom le-ragleicha",
            crossReferences: ["Matthew 22:44", "Acts 2:34", "Hebrews 1:13"],
            studyNotes: "The most cited Old Testament verse in the New Testament, establishing the divine co-enthronement of the Messiah.",
            keywords: ["Session", "Right Hand", "King", "Messiah"]
          },
          {
            number: 4,
            text: "The LORD has sworn and will not change his mind: 'You are a priest forever, in the order of Melchizedek.'",
            literalText: "Nishba YHWH ve-lo yinnachem: Atah-kohen le-olam al-divrati malki-tzedek.",
            originalText: "נִשְׁבַּע יְהוָה וְלֹא יִנָּחֵם אַתָּה־כֹהֵן לְעוֹלָם עַל־דִּבְרָתִי מַלְכִּי־צֶדֶק",
            transliteration: "Nishba YHWH ve-lo yinnachem atah-kohen le-olam al-divrati malki-tzedek",
            crossReferences: ["Hebrews 5:6", "Hebrews 6:20", "Hebrews 7:17-21"],
            studyNotes: "An unchangeable divine oath establishing a eternal royal priesthood combining kingship and priesthood outside the Levitical lineage.",
            keywords: ["Priest Forever", "Order of Melchizedek", "Divine Oath", "Melchizedek"]
          }
        ]
      }
    ]
  },
  {
    id: "isaiah",
    name: "Isaiah (Yeshayahu)",
    testament: "Old Testament",
    category: "Major Prophets",
    author: "Prophet Isaiah son of Amoz",
    originalLanguage: "Hebrew",
    estimatedDate: "740–680 BCE",
    description: "The 'Fifth Gospel': High prophetic visions of God's holiness, the Suffering Servant, Immanuel, and the cosmic new heavens and new earth.",
    keyTheme: "Divine Holiness, Salvation, Servant Songs, and Cosmic Renewal",
    chapters: [
      {
        chapterNumber: 6,
        title: "Isaiah's Heavenly Throne Vision & Calling",
        chapterSummary: "Isaiah sees the Lord high and lifted up, surrounded by Seraphim crying 'Kadosh, Kadosh, Kadosh!'.",
        verses: [
          {
            number: 3,
            text: "And they were calling to one another: 'Holy, holy, holy is the LORD Almighty; the whole earth is full of his glory.'",
            originalText: "וְקָרָא זֶה אֶל־זֶה וְאָמַר קָדוֹשׁ קָדוֹשׁ קָדוֹשׁ יְהוָה צְבָאוֹת מְלֹא כָל־הָאָרֶץ כְּבוֹדוֹ",
            transliteration: "Ve-kara zeh el-zeh ve-amar Kadosh Kadosh Kadosh YHWH Tzevaot melo chol-ha-aretz kevodo",
            crossReferences: ["Revelation 4:8", "Ezekiel 1:28"],
            studyNotes: "The Trisagion ('Kadosh' 3 times) signifies absolute perfection of holiness, while 'Kavod' (Glory) fills all immanent creation.",
            keywords: ["Trisagion", "Kadosh", "Seraphim", "Glory"]
          }
        ]
      },
      {
        chapterNumber: 53,
        title: "The Suffering Servant Song",
        chapterSummary: "The prophetic depiction of the righteous servant bearing the sorrows, transgressions, and wounds of humanity.",
        verses: [
          {
            number: 5,
            text: "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.",
            originalText: "וְהוּא מְחֹלָל מִפְּשָׁעֵנוּ מُדֻכָּא מֵעֲוֹנֹתֵינוּ מוּסַר שְׁלוֹמֵנוּ עָלָיו וּבַחֲבֻרָתוֹ נִרְפָּא־לָנוּ",
            transliteration: "Ve-hu mecholal mi-pesha'enu medukka me-avonoteinu musar shelomenu alav u-vachavurato nirpa-lanu",
            crossReferences: ["1 Peter 2:24", "Matthew 8:17", "Romans 5:8"],
            studyNotes: "Central messianic prophecy detailing vicarious atonement, healing, and substitutionary sacrifice.",
            keywords: ["Messiah", "Atonement", "Servant", "Healing"]
          }
        ]
      }
    ]
  },
  {
    id: "matthew",
    name: "Gospel of Matthew (Kata Maththaion)",
    testament: "New Testament",
    category: "Gospels",
    author: "Matthew the Apostle (Levi)",
    originalLanguage: "Koine Greek",
    estimatedDate: "60–80 CE",
    description: "The Gospel presenting Jesus as the promised Jewish Messiah, the new Moses delivering the Sermon on the Mount, and King of the Kingdom of God.",
    keyTheme: "Fulfillment of Prophecy, The Beatitudes, and Kingdom Discipleship",
    chapters: [
      {
        chapterNumber: 5,
        title: "The Sermon on the Mount: The Beatitudes",
        chapterSummary: "Jesus ascends the mountain and proclaims the revolutionary upside-down values of the Kingdom of Heaven.",
        verses: [
          {
            number: 3,
            text: "Blessed are the poor in spirit, for theirs is the kingdom of heaven.",
            originalText: "Μακάριοι οἱ πτωχοὶ τῷ πνεύματι, ὅτι αὐτῶν ἐστιν ἡ βασιλεία τῶν οὐρανῶν.",
            transliteration: "Makarioi hoi ptochoi to pneumati, hoti auton estin he basileia ton ouranon.",
            crossReferences: ["Luke 6:20", "Isaiah 57:15", "Psalm 34:18"],
            studyNotes: "'Makarioi' denotes transcendent spiritual flourishing. 'Poor in spirit' refers to humble spiritual posture emptied of pride.",
            keywords: ["Beatitudes", "Humility", "Kingdom", "Makarioi"]
          },
          {
            number: 14,
            text: "You are the light of the world. A town built on a hill cannot be hidden.",
            originalText: "Ὑμεῖς ἐστε τὸ φῶς τοῦ κόσμου. οὐ δύναται πόλις κρυβῆναι ἐπάνω ὄρους κειμένη·",
            transliteration: "Hymeis este to phos tou kosmou. Ou dynatai polis krybenai epano orous keimene.",
            crossReferences: ["John 8:12", "Philippians 2:15", "Ephesians 5:8"],
            studyNotes: "Disciples are assigned an active radiating cosmic role: illuminating dark corners of human society through love and truth.",
            keywords: ["Light of World", "Illumination", "Witness"]
          }
        ]
      },
      {
        chapterNumber: 6,
        title: "The Lord's Prayer (Pater Noster) & Internal Alignment",
        chapterSummary: "Jesus teaches the archetypal model prayer and calls for trust in divine providence over worldly anxiety.",
        verses: [
          {
            number: 9,
            text: "This, then, is how you should pray: 'Our Father in heaven, hallowed be your name...'",
            originalText: "Οὕτως οὖν προσεύχεσθε ὑμεῖς· Πάτερ ἡμῶν ὁ ἐν τοῖς οὐρανοῖς· ἁγιασθήτω τὸ ὄνομά σου·",
            transliteration: "Houtos oun proseuchesthe hymeis: Pater hemon ho en tois ouranois, hagiastheto to onoma sou.",
            crossReferences: ["Luke 11:2", "Isaiah 63:16"],
            studyNotes: "'Pater' (Abba in Aramaic) combines ultimate cosmic sovereignty with profound familial warmth.",
            keywords: ["Pater Noster", "Prayer", "Abba", "Father"]
          },
          {
            number: 10,
            text: "Your kingdom come, your will be done, on earth as it is in heaven.",
            originalText: "ἐλθέτω ἡ βασιλεία σου, γενηθήτω τὸ θέλημά σου, ὡς ἐν οὐρανῷ καὶ ἐπὶ γῆς·",
            transliteration: "Eltheto he basileia sou, genetheto to thelema sou, hos en ourano kai epi ges.",
            crossReferences: ["Psalm 103:19", "Revelation 11:15"],
            studyNotes: "The ultimate prayer for the total convergence of celestial divine reality with earthly physical conditions.",
            keywords: ["Kingdom", "Divine Will", "As Above So Below"]
          }
        ]
      }
    ]
  },
  {
    id: "john",
    name: "Gospel of John (Kata Ioannen)",
    testament: "New Testament",
    category: "Gospels",
    author: "John the Apostle (The Beloved Disciple)",
    originalLanguage: "Koine Greek",
    estimatedDate: "85–95 CE",
    description: "The mystical Gospel centered on the Logos made flesh, the seven 'I AM' statements, light versus darkness, and eternal life.",
    keyTheme: "The Incarnate Logos, Mystical Union, and Eternal Light",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Logos Prologue",
        chapterSummary: "The cosmic origin of the divine Logos, his incarnation into human history, and John the Baptist's testimony.",
        verses: [
          {
            number: 1,
            text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
            originalText: "Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.",
            transliteration: "En arche en ho Logos, kai ho Logos en pros ton Theon, kai Theos en ho Logos.",
            crossReferences: ["Genesis 1:1", "1 John 1:1", "Revelation 19:13"],
            studyNotes: "'Logos' incorporates Heraclitean philosophical logic, Philo's divine mediator, and the Hebrew 'Davar YHWH' into the person of Christ.",
            keywords: ["Logos", "Word", "Pre-existence", "Deity"]
          },
          {
            number: 14,
            text: "The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.",
            originalText: "Καὶ ὁ λόγος σὰρξ ἐγένετο καὶ ἐσκήνωσεν ἐν ἡμῖν, καὶ ἐθεασάμεθα τὴν δόξαν αὐτοῦ...",
            transliteration: "Kai ho Logos sarx egeneto kai eskenosen en hemin, kai etheasametha ten doxan autou...",
            crossReferences: ["Philippians 2:7", "Colossians 2:9", "1 John 4:2"],
            studyNotes: "'Eskenosen' literally means 'pitched his tabernacle' (mishkan) among humanity, revealing God's physical presence.",
            keywords: ["Incarnation", "Tabernacle", "Grace and Truth", "Glory"]
          }
        ]
      },
      {
        chapterNumber: 14,
        title: "The Upper Room Discourse & The Way, Truth, and Life",
        chapterSummary: "Jesus promises the Holy Spirit (Paraclete), prepares heavenly mansions, and asserts his unique unity with the Father.",
        verses: [
          {
            number: 6,
            text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'",
            originalText: "λέγει αὐτῷ ὁ Ἰησοῦς· Ἐγώ εἰμι ἡ ὁδὸς καὶ ἡ ἀλήθεια καὶ ἡ ζωή· οὐδεὶς ἔρχεται πρὸς τὸν πατέρα εἰ μὴ δι' ἐμοῦ.",
            transliteration: "Legei auto ho Iesous: Ego eimi he hodos kai he aletheia kai he zoe; oudeis erchetai pros ton patera ei me di' emou.",
            crossReferences: ["Hebrews 10:20", "Acts 4:12", "John 10:9"],
            studyNotes: "Uses 'Ego Eimi' (I AM). Jesus identifies himself as the living portal ('Hodos') to divine union.",
            keywords: ["Ego Eimi", "The Way", "Truth", "Life"]
          },
          {
            number: 27,
            text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
            originalText: "Εἰρήνην ἀφίημι ὑμῖν, εἰρήνην τὴν ἐμὴν δίδωμι ὑμῖν... μὴ ταρασσέσθω ὑμῶν ἡ καρδία μηδὲ δειλιάτω.",
            transliteration: "Eirenen aphiemi hymin, eirenen ten emen didomi hymin... me tarassestho hymon he kardia mede deiliato.",
            crossReferences: ["Philippians 4:7", "Colossians 3:15"],
            studyNotes: "'Eirene' (Shalom in Hebrew) is an active cosmic harmony and inner tranquil fortress immune to external turmoil.",
            keywords: ["Shalom", "Peace", "Courage"]
          }
        ]
      }
    ]
  },
  {
    id: "revelation",
    name: "Book of Revelation (Apokalupsis)",
    testament: "New Testament",
    category: "Apocalyptic",
    author: "John the Seer of Patmos",
    originalLanguage: "Koine Greek",
    estimatedDate: "95 CE",
    description: "The grand visionary apocalypse revealing Christ glorified, the seals, trumpets, and bowls, the fall of Babylon, and the descent of New Jerusalem.",
    keyTheme: "Unveiling of Cosmic Destiny, Victory over Darkness, and New Creation",
    chapters: [
      {
        chapterNumber: 1,
        title: "Vision of the Glorified Alpha and Omega",
        chapterSummary: "John encounters Christ standing amidst seven golden lampstands, holding the keys of Death and Hades.",
        verses: [
          {
            number: 8,
            text: "'I am the Alpha and the Omega,' says the Lord God, 'who is, and who was, and who is to come, the Almighty.'",
            originalText: "Ἐγώ εἰμι τὸ  Alpha καὶ τὸ Omega, λέγει κύριος ὁ θεός, ὁ ὢν καὶ ὁ ἦν καὶ ὁ ἐρχόμενος, ὁ παντοκράτωρ.",
            transliteration: "Ego eimi to Alpha kai to Omega, legei Kyrios ho Theos, ho on kai ho en kai ho erchomenos, ho Pantokrator.",
            crossReferences: ["Isaiah 44:6", "Revelation 21:6", "Revelation 22:13"],
            studyNotes: "Alpha and Omega encompass the entire alphabet of creation and time. 'Pantokrator' designates absolute ruler over all forces.",
            keywords: ["Alpha Omega", "Pantokrator", "Eternity"]
          }
        ]
      },
      {
        chapterNumber: 21,
        title: "The New Heavens, New Earth, and New Jerusalem",
        chapterSummary: "The old order passes away; God comes down to tabernacle directly with humanity in a city made of gold and jewel light.",
        verses: [
          {
            number: 4,
            text: "'He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.'",
            originalText: "καὶ ἐξαλείψει πᾶν δάκρυον ἐκ τῶν ὀφθαλμῶν αὐτῶν, καὶ ὁ θάνατος οὐκ ἔσται ἔτι...",
            transliteration: "Kai exaleipsei pan dakryon ek ton ophthalmon auton, kai ho thanatos ouk estai eti...",
            crossReferences: ["Isaiah 25:8", "Isaiah 65:17", "1 Corinthians 15:26"],
            studyNotes: "The culmination of salvation history: death and sorrow are erased, swallowed up in eternal victory.",
            keywords: ["Consummation", "New Creation", "No Death"]
          },
          {
            number: 6,
            text: "He said to me: 'It is done. I am the Alpha and the Omega, the Beginning and the End. To the thirsty I will give water without cost from the spring of the water of life.'",
            originalText: "καὶ εἶπέν μοι· Γέγοναν. ἐγὼ τὸ Alpha καὶ τὸ Omega, ἡ ἀρχὴ καὶ τὸ τέλος...",
            transliteration: "Kai eipen moi: Gegonan. Ego to Alpha kai to Omega, he arche kai to telos...",
            crossReferences: ["Isaiah 55:1", "John 4:14", "John 7:37"],
            studyNotes: "The ultimate invitation to spiritual thirst, offering grace from the living fountain of eternal consciousness.",
            keywords: ["Water of Life", "Finished", "Grace"]
          }
        ]
      }
    ]
  },
  {
    id: "hebrews",
    name: "Epistle to the Hebrews (Pros Ebraious)",
    testament: "New Testament",
    category: "Epistles",
    author: "Pauline Circle / Anonymous Apostolic Scholar",
    originalLanguage: "Koine Greek",
    estimatedDate: "64–68 CE",
    description: "High theological discourse on the supreme priesthood of Christ after the Order of Melchizedek, surpassing the Levitical tabernacle and law.",
    keyTheme: "The Eternal Priesthood of Melchizedek, Superior Covenant, and Faith",
    chapters: [
      {
        chapterNumber: 7,
        title: "The Order of Melchizedek & Eternal Priesthood",
        chapterSummary: "Exposition on Melchizedek, King of Salem and Priest of God Most High: without genealogy, having neither beginning of days nor end of life.",
        verses: [
          {
            number: 1,
            text: "This Melchizedek was king of Salem and priest of God Most High. He met Abraham returning from the defeat of the kings and blessed him,",
            originalText: "Οὗτος γὰρ ὁ Μελχισέδεκ, βασιλεὺς Σαλήμ, ἱερεὺς τοῦ θεοῦ τοῦ ὑψίστου, ὁ συναντήσας Ἀβραὰμ ὑποστρέφοντι ἀπὸ τῆς κοπῆς τῶν βασιλέων καὶ εὐλογήσας αὐτόν,",
            transliteration: "Houtos gar ho Melchisedek, basileus Salem, hiereus tou Theou tou hypsistou, ho synantesas Abraam hypostrephenti apo tes kopes ton basileon kai eulogesas auton,",
            crossReferences: ["Genesis 14:18-20", "Psalm 110:4"],
            studyNotes: "Melchizedek unites royalty ('basileus') and priesthood ('hiereus'), prefiguring the ultimate high priest.",
            keywords: ["Melchizedek", "King of Salem", "Priest of Most High", "Abraham"]
          },
          {
            number: 2,
            text: "and Abraham gave him a tenth of everything. First, 'Melchizedek' means 'king of righteousness'; then also, 'king of Salem' means 'king of peace.'",
            originalText: "ᾧ καὶ δεκάτην ἀπὸ πάντων ἐμέρισεν Ἀβραάμ, πρῶτον μὲν ἑρμηνευόμενος Βασιλεὺς δικαιοσύνης ἔπειτα δὲ καὶ Βασιλεὺς Σαλήμ, ὅ ἐστιν Βασιλεὺς εἰρήνης,",
            transliteration: "ho kai dekaten apo panton emerisen Abraam, proton men hermeneuomenos Basileus dikaiosynes epeita de kai Basileus Salem, ho estin Basileus eirenes,",
            crossReferences: ["Genesis 14:20", "Isaiah 9:6", "Romans 5:1"],
            studyNotes: "Etymological exposition: 'Melchi-Tzedek' = King of Righteousness, 'King of Salem' = King of Peace (Eirene / Shalom). Righteousness and peace kiss.",
            keywords: ["King of Righteousness", "King of Peace", "Etymology", "Salem"]
          },
          {
            number: 3,
            text: "Without father or mother, without genealogy, without beginning of days or end of life, resembling the Son of God, he remains a priest forever.",
            literalText: "Apator, ametor, agenealogetos, mete archen hemeron mete zoes telos echon...",
            originalText: "ἀπάτωρ, ἀμήτωρ, ἀγενεαλόγητος, μήτε ἀρχὴν ἡμερῶν μήτε ζωῆς τέλος ἔχων, ἀφωμοιωμένος δὲ τῷ υἱῷ τοῦ θεοῦ, μένει ἱερεὺς εἰς τὸ διηνεκές.",
            transliteration: "apator, ametor, agenealogetos, mete archen hemeron mete zoes telos echon, aphomoiomenos de to hoio tou Theou, menei hiereus eis to dienekes.",
            crossReferences: ["Psalm 110:4", "Hebrews 5:6", "Hebrews 6:20"],
            studyNotes: "'Apator' (fatherless in record) and 'Ametor' highlight Melchizedek's archetype as an uncreated, eternal heavenly high priest whose priesthood is perpetual.",
            keywords: ["Eternal Priesthood", "Without Genealogy", "Priest Forever", "Melchizedek"]
          },
          {
            number: 25,
            text: "Therefore he is able to save completely those who come to God through him, because he always lives to intercede for them.",
            originalText: "ὅθεν καὶ σῴζειν εἰς τὸ παντελὲς δύναται τοὺς προσερχομένους δι' αὐτοῦ τῷ θεῷ, πάντοτε ζῶν εἰς τὸ ἐντυγχάνειν ὑπὲρ αὐτῶν.",
            transliteration: "hothen kai Sozein eis to panteles dynatai tous proserchomenous di' autou to Theo, pantote zon eis to entygchanein hyper auton.",
            crossReferences: ["Romans 8:34", "1 John 2:1", "Hebrews 9:24"],
            studyNotes: "The ultimate comfort of the Melchizedek priesthood: unending, perpetual intercession and absolute total salvation ('eis to panteles').",
            keywords: ["Intercession", "Salvation", "Eternal Life", "Melchizedek"]
          }
        ]
      }
    ]
  }
];
