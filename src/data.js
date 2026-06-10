/* ------------------------------------------------------------------ */
/*  Content data                                                       */
/* ------------------------------------------------------------------ */
/*
 * Lives in its own module (not App.jsx) so App.jsx exports only React
 * components — that's what keeps React Fast Refresh / HMR working. The
 * verification harness (scripts/) imports PARTS + GAMES from here too.
 * See CLAUDE.md → Architecture.
 */

export const PARTS = [
  // ---- DEL 1: HELE BÅDEN ----
  { id: "faldbarm",  da: "Faldbarm",  en: "Head",  game: "boat", ax: 196, ay: 54,  note: "Sejlets øverste hjørne — her sætter faldet sejlet fast." },
  { id: "halsbarm",  da: "Halsbarm",  en: "Tack",  game: "boat", ax: 196, ay: 300, note: "Sejlets forreste nederste hjørne, fastgjort ved masten/bommen." },
  { id: "skodebarm", da: "Skødebarm", en: "Clew",  game: "boat", ax: 100, ay: 305, note: "Sejlets bageste nederste hjørne — her sidder skødet." },
  { id: "forlig",    da: "Forlig",    en: "Luff",  game: "boat", line: true, ax: 196, ay: 170, note: "Sejlets forkant. På storsejlet løber den langs masten." },
  { id: "agterlig",  da: "Agterlig",  en: "Leech", game: "boat", line: true, ax: 150, ay: 182, note: "Sejlets bagkant." },
  { id: "underlig",  da: "Underlig",  en: "Foot",  game: "boat", line: true, ax: 150, ay: 303, note: "Sejlets underkant — på storsejlet også kaldet bomlig." },
  { id: "mast",      da: "Mast",      en: "Mast",  game: "boat", line: true, ax: 200, ay: 130, note: "Den lodrette stang der bærer sejlene." },
  { id: "bom",       da: "Bom",       en: "Boom",  game: "boat", line: true, ax: 150, ay: 306, note: "Den vandrette stang i bunden af storsejlet." },
  { id: "storsejl",  da: "Storsejl",  en: "Mainsail", game: "boat", ax: 158, ay: 215, note: "Hovedsejlet bag masten." },
  { id: "fok",       da: "Fok",       en: "Jib",   game: "boat", ax: 288, ay: 205, note: "Forsejlet foran masten. En større udgave kaldes en genua." },
  { id: "forstag",   da: "Forstag",   en: "Forestay", game: "boat", line: true, ax: 300, ay: 178, note: "Wiren fra mastetop til stævnen — holder masten forefter. Fokken sættes på forstaget." },
  { id: "agterstag", da: "Agterstag", en: "Backstay", game: "boat", line: true, ax: 112, ay: 176, note: "Wiren fra mastetop til hækken — holder masten agterefter." },
  { id: "topvant",   da: "Topvant",   en: "Cap shroud", game: "boat", line: true, ax: 184, ay: 120, note: "Sidewiren der holder masten fra siden, helt op til toppen." },
  { id: "undervant", da: "Undervant", en: "Lower shroud", game: "boat", line: true, ax: 188, ay: 250, note: "Det nederste vant — støtter masten fra siden under salingen." },
  { id: "salingshorn", da: "Salingshorn", en: "Spreader", game: "boat", ax: 178, ay: 159, note: "Tværarmene på masten der holder vantene ud fra masten." },
  { id: "storfald",  da: "Storfald",  en: "Main halyard", game: "boat", line: true, ax: 201, ay: 150, note: "Tovværket der hejser storsejlet op. Slækker du det, falder sejlet ned igen." },
  { id: "storskode", da: "Storskøde", en: "Mainsheet", game: "boat", line: true, ax: 122, ay: 308, note: "Tovet der trimmer storsejlet ind og ud efter vinden." },

  // ---- DEL 2: MASTETOPPEN ----
  { id: "mastetop",      da: "Mastetop",       en: "Masthead",        game: "top", ax: 150, ay: 105, note: "Mastens øverste ende med topbeslaget, hvor stagene og fald samles." },
  { id: "vindex",        da: "Vindex",         en: "Wind indicator",  game: "top", ax: 158, ay: 56,  note: "Vindfløjen i toppen, der viser den tilsyneladende vindretning." },
  { id: "vhf",           da: "VHF-antenne",    en: "VHF antenna",     game: "top", line: true, ax: 138, ay: 52, note: "Antennen i mastetoppen, der giver VHF-radioen lang rækkevidde." },
  { id: "toplanterne",   da: "Toplanterne",    en: "Masthead light",  game: "top", ax: 192, ay: 112, note: "Lanternen i toppen — lyser for andre skibe i mørke." },
  { id: "forstagsbeslag",da: "Forstagsbeslag", en: "Forestay tang",   game: "top", ax: 197, ay: 104, note: "Beslaget på masthovedet, hvor forstaget er fastgjort." },
  { id: "vantbeslag",    da: "Vantbeslag",     en: "Shroud tang",     game: "top", ax: 132, ay: 133, note: "Beslaget hvor topvantet er fastgjort til masten (kaldet hounds)." },
  { id: "skivgat",       da: "Skivgat",        en: "Sheave slot",     game: "top", ax: 150, ay: 150, note: "Sprækken i masten hvor et fald løber ud." },
  { id: "faldskive",     da: "Faldskive",      en: "Sheave",          game: "top", ax: 151, ay: 190, note: "Hjulet inde i masten, som faldet løber hen over i skivgattet." },
  { id: "hulkel",        da: "Hulkel",         en: "Mast groove",     game: "top", line: true, ax: 134, ay: 245, note: "Rillen i mastens agterkant, hvor storsejlets forlig løber op." },

  // ---- DEL 3: MASTEFODEN ----
  { id: "mastefod",      da: "Mastefod",      en: "Mast step",     game: "bottom", ax: 166, ay: 212, note: "Bunden af masten, hvor den står på dækket eller kølen." },
  { id: "haekvang",      da: "Hækvang",       en: "Boom vang",     game: "bottom", ax: 210, ay: 173, note: "Talje fra mast til bom, der holder bommen nede (kicker)." },
  { id: "fordelerblokke",da: "Fordelerblokke",en: "Deck organiser", game: "bottom", ax: 216, ay: 203, note: "Blokkene ved mastefoden, der leder faldene hen over dækket." },
  { id: "spilaflaster",  da: "Spilaflaster",  en: "Clutch",        game: "bottom", ax: 262, ay: 200, note: "Klemmen der låser et fald, så det ikke løber tilbage." },
  { id: "faldspil",      da: "Faldspil",      en: "Winch",         game: "bottom", ax: 296, ay: 190, note: "Spillet (winchen) der giver kræfter til at hale fald og skøder hjem." },
  { id: "vantskrue",     da: "Vantskrue",     en: "Turnbuckle",    game: "bottom", ax: 58,  ay: 202, note: "Strammeren i bunden af vant og stag, der spænder riggen op." },

  // ---- DEL 4: VIND & RETNINGER ----
  { id: "invinden", da: "I vinden",    en: "Head to wind",  game: "wind", ax: 165, ay: 180, note: "Båden peger lige op i vinden og kan ikke sejle — sejlene blafrer. Også kaldet at ligge i stå." },
  { id: "bidevind", da: "Bidevind",    en: "Close-hauled",  game: "wind", ax: 245, ay: 150, note: "Så tæt på vinden som båden kan sejle — typisk ca. 45° til vinden." },
  { id: "halvvind", da: "Halvvind",    en: "Beam reach",    game: "wind", ax: 278, ay: 210, note: "Vinden kommer ind fra siden, tværs på båden — også kaldet 'på tværs'." },
  { id: "rumskods", da: "Rumskøds",    en: "Broad reach",   game: "wind", ax: 245, ay: 270, note: "Vinden kommer skråt bagfra — 'agten for tværs'." },
  { id: "laens",    da: "Læns",        en: "Running",       game: "wind", ax: 165, ay: 292, note: "Vinden kommer lige bagfra, og båden sejler med vinden." },
  { id: "vende",    da: "Stagvending", en: "Tack",          game: "wind", line: true, ax: 165, ay: 150, note: "At dreje stævnen op gennem vinden, så vinden skifter side. At 'vende'." },
  { id: "halse",    da: "Bomning",     en: "Gybe",          game: "wind", line: true, ax: 165, ay: 332, note: "At dreje agterenden gennem vinden, så bommen skifter side. At 'halse'." },

  // ---- DEL 5: SIDER & HALSE ----
  { id: "staevn",   da: "Stævn",           en: "Bow",            game: "sides", ax: 165, ay: 80,  note: "Bådens forreste ende — også kaldet forude." },
  { id: "haek",     da: "Hæk",             en: "Stern",          game: "sides", ax: 165, ay: 152, note: "Bådens bageste ende — også kaldet agterude." },
  { id: "styrbord", da: "Styrbord",        en: "Starboard",      game: "sides", ax: 183, ay: 118, note: "Bådens højre side set fremad mod stævnen. Vises med grøn lanterne." },
  { id: "bagbord",  da: "Bagbord",         en: "Port",           game: "sides", ax: 147, ay: 118, note: "Bådens venstre side set fremad mod stævnen. Vises med rød lanterne." },
  { id: "sbhalse",  da: "Styrbords halse", en: "Starboard tack", game: "sides", ax: 100, ay: 255, note: "Vinden kommer ind over styrbord side, og bommen står ude i bagbord. Giver ofte vigepligt-fordel." },
  { id: "bbhalse",  da: "Bagbords halse",  en: "Port tack",      game: "sides", ax: 230, ay: 255, note: "Vinden kommer ind over bagbord side, og bommen står ude i styrbord." },
  { id: "luv",      da: "Luv",             en: "Windward",       game: "sides", ax: 220, ay: 112, note: "Den side vinden kommer fra — her styrbord. Luv ligger op mod vinden." },
  { id: "lae",      da: "Læ",              en: "Leeward",        game: "sides", ax: 110, ay: 112, note: "Den side vinden blæser hen imod — modsat luv. Storsejlet står ude i læ." },
];

export const GAMES = [
  { id: "boat",   t: "Del 1 · Hele båden",  s: "Sejl, rig og wires" },
  { id: "top",    t: "Del 2 · Mastetoppen", s: "Det øverste af masten" },
  { id: "bottom", t: "Del 3 · Mastefoden",  s: "Det nederste ved dækket" },
  { id: "wind",   t: "Del 4 · Vind & retninger", s: "Vende, halse, sejladser i vinden" },
  { id: "sides",  t: "Del 5 · Sider & halse", s: "Stævn, hæk, styrbord, bagbord" },
];

export const BASICS = [
  { t: "Fald", e: "Halyard", d: "Et tov der hejser et sejl OP ad masten. Storfaldet hejser storsejlet, forsejlsfaldet hejser fokken. Når du slækker faldet, falder sejlet ned igen — deraf navnet." },
  { t: "Skøde", e: "Sheet", d: "Et tov der styrer sejlets vinkel. Du haler skødet ind for at trimme sejlet tæt på båden, og slækker for at lade det stå længere ude. Storskøde til storsejlet, fokkeskøde til fokken." },
  { t: "Vant", e: "Shroud", d: "Stålwirer der holder masten oprejst fra SIDEN. Topvantet går helt til toppen, undervantet støtter den nedre del." },
  { t: "Stag", e: "Stay", d: "Stålwirer der holder masten fra FOR og AGTER. Forstaget trækker fremad mod stævnen, agterstaget bagud mod hækken." },
  { t: "Lig", e: "Sail edge", d: "Kanterne på et sejl: forlig (forkant), agterlig (bagkant), underlig (underkant). På storsejlet løber forliget langs masten." },
  { t: "Barm", e: "Sail corner", d: "Hjørnerne på et sejl: faldbarm (toppen, hvor faldet sidder), halsbarm (forreste nederste hjørne), skødebarm (bageste nederste hjørne)." },
  { t: "Spil & aflaster", e: "Winch & clutch", d: "Et spil (winch) er en tromle der giver dig kræfter til at hale tunge fald og skøder hjem. En aflaster (klemme) låser linen fast bagefter." },
  { t: "Stående vs. løbende rig", e: "Standing vs. running rigging", d: "Stående rig er de faste wirer der holder masten (vant og stag). Løbende rig er de tove du trækker i undervejs (fald og skøder)." },
  { t: "Luv & læ", e: "Windward & leeward", d: "Luv er den side vinden kommer fra; læ er den modsatte side, vinden blæser hen imod. Storsejlet står ude i læ." },
];
