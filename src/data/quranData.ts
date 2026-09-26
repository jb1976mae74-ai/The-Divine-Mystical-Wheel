/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuranAyah {
  numberInSurah: number;
  arabicText: string;
  transliteration: string;
  englishTranslation: string;
  tafsirNotes?: string;
  keyThemes?: string[];
}

export interface QuranSurah {
  number: number;
  nameArabic: string;
  nameTransliterated: string;
  nameEnglish: string;
  revelationType: "Meccan" | "Medinan";
  totalAyahs: number;
  revelationOrder?: number;
  summary: string;
  spiritualVirtue?: string;
  ayahs: QuranAyah[];
}

export const QURAN_SURAHS_DATABASE: QuranSurah[] = [
  {
    number: 1,
    nameArabic: "الفَاتِحَة",
    nameTransliterated: "Al-Fatiha",
    nameEnglish: "The Opening",
    revelationType: "Meccan",
    totalAyahs: 7,
    revelationOrder: 5,
    summary: "The Essence of the Quran (Umm al-Kitab). The quintessential prayer recited in every unit of Islamic prayer, establishing pure monotheism, divine mercy, and guidance on the Straight Path.",
    spiritualVirtue: "Known as As-Shatfyah (The Cure) and As-Sab' al-Mathani (The Seven Oft-Recited Verses). Recited to align heart and mind with divine grace.",
    ayahs: [
      {
        numberInSurah: 1,
        arabicText: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        transliteration: "Bismillāhir-Raḥmānir-Raḥīm",
        englishTranslation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        tafsirNotes: "The Basmala initiates all noble endeavors. 'Ar-Rahman' represents all-encompassing cosmic mercy to all created beings, while 'Ar-Rahim' highlights particular intimate grace.",
        keyThemes: ["Basmala", "Mercy", "Divine Names"]
      },
      {
        numberInSurah: 2,
        arabicText: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
        transliteration: "Al-ḥamdu lillāhi Rabbil-ʿālamīn",
        englishTranslation: "[All] praise is [due] to Allah, Lord of the worlds -",
        tafsirNotes: "'Al-Hamd' encompasses both total gratitude and intrinsic praise. 'Rabb' implies the Sustainer, Educator, and Evolver of all realms ('Al-Alamin').",
        keyThemes: ["Praise", "Gratitude", "Lordship"]
      },
      {
        numberInSurah: 3,
        arabicText: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        transliteration: "Ar-Raḥmānir-Raḥīm",
        englishTranslation: "The Entirely Merciful, the Especially Merciful,",
        tafsirNotes: "Reiterates the supreme primacy of Love and Compassion over wrath or fear at the cornerstone of the relationship between God and humanity.",
        keyThemes: ["Compassion", "Grace"]
      },
      {
        numberInSurah: 4,
        arabicText: "مَٰلِكِ يَوْمِ ٱلدِّينِ",
        transliteration: "Māliki Yawmid-Dīn",
        englishTranslation: "Sovereign of the Day of Recompense.",
        tafsirNotes: "'Yawm ad-Din' is the day of total spiritual alignment, justice, and truth where all hidden actions and intentions bear their ultimate reality.",
        keyThemes: ["Sovereignty", "Justice", "Hereafter"]
      },
      {
        numberInSurah: 5,
        arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        transliteration: "Iyyāka naʿbudu wa-iyyāka nastaʿīn",
        englishTranslation: "It is You we worship and You we ask for help.",
        tafsirNotes: "The central axis of the covenant: pure Tawhid (singularity). Surrendering ego worship ('Na'budu') and recognizing God as the sole true source of assistance ('Nasta'in').",
        keyThemes: ["Tawhid", "Worship", "Reliance"]
      },
      {
        numberInSurah: 6,
        arabicText: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
        transliteration: "Ihdināṣ-Ṣirāṭal-Mustaqīm",
        englishTranslation: "Guide us to the straight path -",
        tafsirNotes: "'Sirat al-Mustaqim' is the balanced, harmonious middle path that avoids ideological or moral extremes, aligning mortal soul with eternal truth.",
        keyThemes: ["Guidance", "Straight Path", "Wisdom"]
      },
      {
        numberInSurah: 7,
        arabicText: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
        transliteration: "Ṣirāṭalladhīna anʿamta ʿalayhim ghayril-maghḍūbi ʿalayhim wa-laḍ-ḍāāāllīn",
        englishTranslation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
        tafsirNotes: "Prays for the footsteps of prophets, saints, and righteous seekers who received direct divine favor and illumination.",
        keyThemes: ["Illumination", "Prophetic Legacy", "Alignment"]
      }
    ]
  },
  {
    number: 2,
    nameArabic: "البَقَرَة",
    nameTransliterated: "Al-Baqarah",
    nameEnglish: "The Cow (Featuring Ayat al-Kursi)",
    revelationType: "Medinan",
    totalAyahs: 286,
    summary: "The longest Surah of the Quran, covering foundational social law, covenant history, prayer, fasting, charity, and the immortal Throne Verse (Ayat al-Kursi).",
    spiritualVirtue: "Contains Ayat al-Kursi (Verse 255), hailed by the Prophet Muhammad as the greatest single verse in the Quran for protection and divine awareness.",
    ayahs: [
      {
        numberInSurah: 255,
        arabicText: "ٱللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ٱلْحَيُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ לَّهُۥ مَا فِي ٱلسَّمَٰوَٰتِ وَمَا فِي ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِي يَشْفَعُ عِندَهُۥ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِۦ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِيُّ ٱلْعَظِيمُ",
        transliteration: "Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm. Lā ta'khudhuhū sinatuw-wa lā nawm. Lahū mā fis-samāwāti wa mā fil-arḍ. Man dhalladhī yashfaʿu ʿindahū illā bi-idhnih. Yaʿlamu mā bayna aydīhim wa mā khalfahum, wa lā yuḥīṭūna bi-shay'im-min ʿilmihī illā bimā shāāā'. Wasiʿa kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhū ḥifẓuhumā, wa Huwal-ʿAliyyul-ʿAẓīm.",
        englishTranslation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi (Throne) extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
        tafsirNotes: "Ayat al-Kursi (The Throne Verse). 'Al-Hayy' (Ever-Living) and 'Al-Qayyum' (Self-Subsisting Sustainer) form the Greatest Name of God. The 'Kursi' symbolizes absolute divine knowledge, authority, and cosmic sovereignty encompassing all dimensions.",
        keyThemes: ["Throne Verse", "Al-Qayyum", "Cosmic Sovereignty", "Omniscience"]
      },
      {
        numberInSurah: 256,
        arabicText: "لَا إِكْرَاهَ فِي ٱลดِّينِ ۖ قَد تَّبَيَّنَ ٱلرُّشْدُ مِنَ ٱلْغَيِّ",
        transliteration: "Lā ikrāha fid-dīn, qat-tabayyanar-rushdu minal-ghayy",
        englishTranslation: "There shall be no compulsion in acceptance of the religion. The right course has become clear from the wrong.",
        tafsirNotes: "Establishes absolute freedom of conscience and spiritual autonomy in belief. Truth shines naturally by its own light and cannot be forced.",
        keyThemes: ["Freedom of Conscience", "Tolerance", "Clarity"]
      }
    ]
  },
  {
    number: 24,
    nameArabic: "النُّور",
    nameTransliterated: "An-Nur",
    nameEnglish: "The Light (Featuring Ayat an-Nur)",
    revelationType: "Medinan",
    totalAyahs: 64,
    summary: "The Surah of Divine Light. Focuses on social purity, dignity, family ethics, and contains the immortal Parable of Light (Ayat an-Nur).",
    spiritualVirtue: "Ayat an-Nur (Verse 35) is the primary mystical verse studied by Sufi saints, philosophers (such as Al-Ghazali in Mishkat al-Anwar), and seekers of divine illumination.",
    ayahs: [
      {
        numberInSurah: 35,
        arabicText: "ٱللَّهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ ۚ مَثَلُ نُورِهِۦ كَمِشْكَوٰةٍ فِيهَا مِصْبَاحٌ ۖ ٱلْمِصْبَاحُ فِي زُجَاجَةٍ ۖ ٱلزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّيٌّ يُوقَدُ مِن شَجَرَةٍ مُّبَٰرَكَةٍ زَيْتُونَةٍ لَّا شَرْقِيَّةٍ وَلَا غَرْبِيَّةٍ يَكَادُ زَيْتُهَا يُضِيٓءُ وَلَوْ لَمْ تَمْسَسْهُ نَارٌ ۚ نُورٌ عَلَىٰ نُورٍ ۗ يَهْدِي ٱللَّهُ لِنُورِهِۦ مَن يَشَاءُ ۚ وَيَضْرِبُ ٱللَّهُ ٱلْأَمْثَٰلَ لِلنَّاسِ ۗ وَٱللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ",
        transliteration: "Allāhu nūrus-samāwāti wal-arḍ. Mathalu nūrihī ka-mishkātin fīhā miṣbāḥ. Al-miṣbāḥu fī zujājah. Az-zujājatu ka-annahā kawkabun durriyyuy-yūqadu min shajaratim-mubārakatin zaytūnati-lā sharqiyyatin wa lā gharbiyyatin yakādu zaytuhā yuḍīāā'u wa law lam tamsas-hu nār. Nūrun ʿalā nūr. Yahdiyallāhu li-nūrihī may-yashāāā'. Wa yaḍribullāhul-amthāla lin-nās, wallāhu bi-kulli shay'in ʿAlīm.",
        englishTranslation: "Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp, the lamp is within glass, the glass as if it were a pearly [brilliant] star lit from [the oil of] a blessed olive tree, neither of the east nor of the west, whose oil would almost glow even if untouched by fire. Light upon Light. Allah guides to His light whom He wills. And Allah presents examples for the people, and Allah is Knowing of all things.",
        tafsirNotes: "Ayat an-Nur (The Light Verse). 'Niche' (Mishkat) represents the human body or chest; 'Glass' (Zujajah) represents the pristine heart; 'Lamp' (Misbah) represents divine intellect/spirit; 'Olive Tree' represents non-dual cosmic wisdom. 'Nur 'ala Nur' (Light upon Light) describes the fusion of divine revelation with pure innate human intellect.",
        keyThemes: ["Light Verse", "Nur 'ala Nur", "Illumination", "Mystical Metaphor"]
      }
    ]
  },
  {
    number: 36,
    nameArabic: "يس",
    nameTransliterated: "Ya-Sin",
    nameEnglish: "Ya-Sin (The Heart of the Quran)",
    revelationType: "Meccan",
    totalAyahs: 83,
    summary: "Known as the Heart of the Quran (Qalb al-Quran). Focuses on resurrection, cosmic order, signs in nature, the prophetic mission, and divine sovereign creation.",
    spiritualVirtue: "Recited for comfort during times of trial, spiritual awakening, and transitions between earthly and eternal existence.",
    ayahs: [
      {
        numberInSurah: 82,
        arabicText: "إِنَّمَآ أَمْرُهُۥٓ إِذَآ أَرَادَ شَيْـًٔا أَن يَقُولَ لَهُۥ كُن فَيَكُونُ",
        transliteration: "Innamā amruhū idhā arāda shay'an ay-yaqūla lahū KUN FA-YAKŪN",
        englishTranslation: "His command is only when He intends a thing that He says to it, 'Be,' and it is.",
        tafsirNotes: "The ultimate principle of immediate divine creation: 'Kun fayaKun' (Be, and it is!). Creation is instant, effortless, and unmediated through divine intent.",
        keyThemes: ["Kun FayaKun", "Instant Creation", "Divine Will"]
      },
      {
        numberInSurah: 83,
        arabicText: "فَسُبْحَٰنَ ٱلَّذِي بِيَدِهِۦ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ",
        transliteration: "Fa-subḥānalladhī bi-yadihī malakūtu kulli shay'iw-wa ilayhi turjaʿūn",
        englishTranslation: "So exalted is He in whose hand is the realm of all things, and to Him you will be returned.",
        tafsirNotes: "'Malakut' refers to the subtle inner dominion and spiritual matrix governing all visible physical form ('Mulk').",
        keyThemes: ["Malakut", "Return to Source", "Exaltation"]
      }
    ]
  },
  {
    number: 112,
    nameArabic: "الإِخْلَاص",
    nameTransliterated: "Al-Ikhlas",
    nameEnglish: "Sincerity / Absolute Monotheism",
    revelationType: "Meccan",
    totalAyahs: 4,
    summary: "The absolute declaration of Tawhid (Divine Singularity). Equal to one-third of the entire Quran in spiritual weight.",
    spiritualVirtue: "Purifies the heart of all subtle polytheism, anthropomorphism, or dualistic assumptions.",
    ayahs: [
      {
        numberInSurah: 1,
        arabicText: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
        transliteration: "Qul Huwallāhu Aḥad",
        englishTranslation: "Say, 'He is Allah, [who is] One,'",
        tafsirNotes: "'Ahad' denotes absolute, indivisible, non-composite Unity—beyond any partner, division, or numerical plural.",
        keyThemes: ["Tawhid", "Ahad", "Unity"]
      },
      {
        numberInSurah: 2,
        arabicText: "ٱللَّهُ ٱلصَّمَدُ",
        transliteration: "Allāhuṣ-Ṣamad",
        englishTranslation: "Allah, the Eternal Refuge.",
        tafsirNotes: "'As-Samad' means the Absolute, Self-Sufficient Source upon whom all depend while He depends on none.",
        keyThemes: ["As-Samad", "Self-Sufficiency"]
      },
      {
        numberInSurah: 3,
        arabicText: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        transliteration: "Lam yalid wa lam yūlad",
        englishTranslation: "He neither begets nor is born,",
        tafsirNotes: "Rejects all physical lineage, origin, or progeny regarding the uncreated eternal Divine Source.",
        keyThemes: ["Uncreated", "Eternal"]
      },
      {
        numberInSurah: 4,
        arabicText: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
        transliteration: "Wa lam yakul-lahū kufuwan aḥad",
        englishTranslation: "Nor is there to Him any equivalent.",
        tafsirNotes: "Transcends all human imagination, metaphors, or created comparisons.",
        keyThemes: ["Transcendent", "Peerless"]
      }
    ]
  }
];
