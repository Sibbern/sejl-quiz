/* ------------------------------------------------------------------ */
/*  Duelighed — indhold                                                 */
/* ------------------------------------------------------------------ */
/*
 * Kilder: SKS Instruktionshæfte (2007) og Jørgen Ring, Yngling Tovværk &
 * Sømandskab (2020). Krav: docs/duelighed-requirements.md.
 *
 * Tre spørgsmålstyper:
 *   scenario  { id, type:"scenario", wind, a:{kind,hdg,x,y,...}, b:{...}, answer:"a"|"b"|"both"|"none", note, rule }
 *             kind: "sail" | "motor" | "row". hdg = kurs i grader (0 = op på skærmen).
 *             wind = retning vinden KOMMER FRA i grader (0 = fra toppen af skærmen).
 *             Halse udledes af wind+hdg i tegningen; hardcodes ikke her.
 *             overtaking: true → markér at A ligger agten for og haler ind på B.
 *   order     { id, type:"order", q, steps:[...i rigtig rækkefølge], note }
 *   mcq       { id, type:"mcq", q, a: correct, wrong:[3 strings], note }
 */

export const DUE_SECTIONS = [
  { id: "vige",    t: "Vigeregler",            s: "Hvem skal vige? Tegning + svar",        kind: "scenario" },
  { id: "manovre", t: "Kommandoer & manøvrer", s: "Tryk trinnene i rigtig rækkefølge",     kind: "order" },
  { id: "knob",    t: "Knob & stik",           s: "Hvilket knob til hvad",                 kind: "mcq" },
  { id: "sikker",  t: "Sikkerhed",             s: "Udstyr, nødsignaler, hårdt vejr",       kind: "mcq" },
  { id: "tov",     t: "Tovværk",               s: "Materialer og egenskaber",              kind: "mcq" },
  { id: "flag",    t: "Flag",                  s: "Yachtflag og flagtid",                  kind: "mcq" },
  { id: "ord",     t: "Ordforklaringer",       s: "Hvad betyder …",                        kind: "mcq" },
];

/* Hjælper: halse ud fra vind-fra-retning og kurs. Vind relativt til båden:
   rel = (wind - hdg + 360) % 360. 0 = ret forfra. rel i (0,180) = vinden ind
   over styrbord side => styrbord halse. */
export function tackOf(wind, hdg) {
  const rel = (((wind - hdg) % 360) + 360) % 360;
  return rel > 0 && rel < 180 ? "sb" : "bb";
}
/* Hvem er luv-båd af to på samme halse: den der ligger nærmest vinden. Beregnes i tegningen
   som den båd hvis position ligger længst "mod" vindretningen. */
export function windwardOf(wind, a, b) {
  const r = (wind * Math.PI) / 180; // vinden kommer FRA denne retning
  const ux = Math.sin(r), uy = -Math.cos(r); // enhedsvektor mod vinden (skærm-koords, y ned)
  const pa = a.x * ux + a.y * uy, pb = b.x * ux + b.y * uy;
  return pa > pb ? "a" : "b";
}

export const DUE = [
  // ================= VIGEREGLER (scenario) =================
  // Koordinater i viewBox 0 0 300 300. Begge både ca. midt i billedet, kurser så de skærer.
  { id: "vg1", type: "scenario", sec: "vige", wind: 0,
    a: { kind: "sail", hdg: 45,  x: 90,  y: 180 }, b: { kind: "sail", hdg: 315, x: 210, y: 180 },
    answer: "a", rule: "regel 3",
    note: "Forskellig halse: vinden kommer forfra. A sejler mod højre med vinden ind over bagbord side (bagbord halse), B mod venstre med vinden over styrbord (styrbord halse). Bagbord halse viger for styrbord halse." },
  { id: "vg2", type: "scenario", sec: "vige", wind: 0,
    a: { kind: "sail", hdg: 315, x: 210, y: 180 }, b: { kind: "sail", hdg: 45,  x: 90,  y: 180 },
    answer: "b", rule: "regel 3",
    note: "Samme situation spejlet. B har vinden over bagbord side (bagbord halse) og viger. Tjek altid: hvilken side kommer vinden ind over? Bommen står i læ, modsat halsen." },
  { id: "vg3", type: "scenario", sec: "vige", wind: 0,
    a: { kind: "sail", hdg: 60,  x: 110, y: 120 }, b: { kind: "sail", hdg: 60,  x: 110, y: 200 },
    answer: "a", rule: "regel 5",
    note: "Samme halse (begge bagbord halse — vinden over bagbord side). Så gælder: luv båd viger for læ båd. A ligger nærmest vinden (luv) og viger." },
  { id: "vg4", type: "scenario", sec: "vige", wind: 90, windAt: 60,
    a: { kind: "sail", hdg: 0,   x: 120, y: 190 }, b: { kind: "sail", hdg: 0,   x: 200, y: 190 },
    answer: "b", rule: "regel 5",
    note: "Vinden fra højre, begge på styrbord halse og samme kurs. B ligger til luv (nærmest vinden) og viger for A i læ." },
  { id: "vg5", type: "scenario", sec: "vige", wind: 45,
    a: { kind: "sail", hdg: 0,   x: 190, y: 220 }, b: { kind: "motor", hdg: 90,  x: 100, y: 150 },
    answer: "b", rule: "regel 2",
    note: "Motor viger for sejl. Det gælder uanset fra hvilken side sejlbåden kommer — regel 2 går forud for styrbord-reglen for motorbåde. Her er B motorbåden." },
  { id: "vg6", type: "scenario", sec: "vige", wind: 315,
    a: { kind: "motor", hdg: 90,  x: 100, y: 160 }, b: { kind: "sail", hdg: 180, x: 190, y: 105 },
    answer: "a", rule: "regel 2",
    note: "Sejlbåden kommer fra motorbådens BAGBORD side — for to motorbåde skulle sejlbåden vige. Men regel 2 (motor viger for sejl) kommer før regel 4. Motorbåden viger. Husk: sejlbåd med motoren i gang regnes som motorbåd." },
  { id: "vg7", type: "scenario", sec: "vige", wind: 0,
    a: { kind: "motor", hdg: 0,   x: 190, y: 220 }, b: { kind: "motor", hdg: 90,  x: 100, y: 150 },
    answer: "b", rule: "regel 4",
    note: "To motorbåde på skærende kurser: den der har den anden om styrbord viger. A kommer fra B's styrbord side → B viger. Huskeregel: 'hold tilbage for højre'." },
  { id: "vg8", type: "scenario", sec: "vige", wind: 0, windAt: 320,
    a: { kind: "motor", hdg: 90,  x: 100, y: 160 }, b: { kind: "motor", hdg: 180, x: 190, y: 110 },
    answer: "b", rule: "regel 4",
    note: "B har A om styrbord (A kommer fra B's højre side) → B viger. A holder kurs og fart." },
  { id: "vg9", type: "scenario", sec: "vige", wind: 0, windAt: 40,
    a: { kind: "motor", hdg: 0,   x: 150, y: 235 }, b: { kind: "motor", hdg: 180, x: 150, y: 110 },
    answer: "both", rule: "stævn mod stævn: begge til styrbord",
    note: "Stævn mod stævn: begge drejer til styrbord (højre), så de passerer hinanden bagbord mod bagbord." },
  { id: "vg10", type: "scenario", sec: "vige", wind: 150, overtaking: "a",
    a: { kind: "sail", hdg: 0,   x: 150, y: 220 }, b: { kind: "motor", hdg: 0,   x: 150, y: 120 },
    answer: "a", rule: "regel 1",
    note: "A er en sejlbåd der haler ind på motorbåden B agterfra. Overhalende båd viger ALTID — regel 1 går forud for 'motor viger for sejl'." },
  { id: "vg11", type: "scenario", sec: "vige", wind: 150, overtaking: "b",
    a: { kind: "sail", hdg: 0,   x: 150, y: 120 }, b: { kind: "motor", hdg: 0,   x: 150, y: 220 },
    answer: "b", rule: "regel 1",
    note: "Overhalende motorbåd viger for sejlbåden foran — her peger både regel 1 og regel 2 samme vej." },
  { id: "vg12", type: "scenario", sec: "vige", wind: 0,
    a: { kind: "row",  hdg: 0,   x: 190, y: 220 }, b: { kind: "sail", hdg: 90,  x: 100, y: 150 },
    answer: "b", rule: "regel 2",
    note: "Robåde skal både motor- og sejlbåde vige for. Sejlbåden B viger." },
  { id: "vg13", type: "scenario", sec: "vige", wind: 0,
    a: { kind: "sail", hdg: 45,  x: 90,  y: 180 }, b: { kind: "motor", hdg: 315, x: 210, y: 180 },
    answer: "b", rule: "regel 2",
    note: "Sejl mod motor på skærende kurser: motorbåden viger. Sejlbådens halse er ligegyldig her." },
  { id: "vg14", type: "scenario", sec: "vige", wind: 90, windAt: 120,
    a: { kind: "sail", hdg: 135, x: 80,  y: 90 },  b: { kind: "sail", hdg: 45,  x: 80,  y: 215 },
    answer: "a", rule: "regel 3",
    note: "Vinden fra højre. A sejler skråt NED mod højre: vinden kommer ind over bagbord side → bagbord halse. B sejler skråt OP mod højre med vinden over styrbord. A viger." },

  { id: "vg15", type: "scenario", sec: "vige", wind: 0, windAt: 0,
    a: { kind: "sail", hdg: 225, x: 95,  y: 150 }, b: { kind: "sail", hdg: 135, x: 205, y: 150 },
    answer: "none", rule: "ingen fare for sammenstød",
    note: "Kurserne skilles — bådene sejler væk fra hinanden. Vigeregler gælder kun når der er fare for sammenstød. Tjek altid først: nærmer vi os hinanden overhovedet?" },
  { id: "vg16", type: "scenario", sec: "vige", wind: 90, windAt: 60,
    a: { kind: "sail", hdg: 0,   x: 190, y: 215 }, b: { kind: "motor", hdg: 270, x: 105, y: 115 },
    answer: "none", rule: "ingen fare for sammenstød",
    note: "A sejler op, B sejler mod venstre fra et punkt der allerede ligger foran og til venstre for A — de skilles. Ingen vigepligt opstår." },
  { id: "vgm1", type: "mcq", sec: "vige", q: "Du sejler IND i Skovshoved havn, en båd er på vej UD. Hvem viger?", a: "Du — indadgående viger for udadgående", wrong: ["Den udadgående", "Begge drejer til styrbord", "Den mindste båd"], note: "Hovedreglen ved ind- og udsejling. Enkelte havne har det modsat — tjek Den Danske Havnelods. Skovshoved følger hovedreglen." },
  { id: "vgm2", type: "mcq", sec: "vige", q: "Du har IKKE vigepligt i en situation. Hvad skal du gøre?", a: "Holde kurs og fart", wrong: ["Dreje til styrbord for en sikkerheds skyld", "Stoppe båden", "Skære op i vinden"], note: "Den anden båd planlægger sin manøvre ud fra at du fortsætter. En sejlbåd må dog stadig udføre nødvendige kursændringer på bidevind og planlagte stagvendinger." },
  { id: "vgm3", type: "mcq", sec: "vige", q: "Et stort erhvervsfartøj nærmer sig, og efter reglerne ville DET have vigepligt for dig. Hvad er god skik?", a: "Ændre kurs i god tid, så det store fartøj aldrig får vigepligt", wrong: ["Holde kurs og fart — jeg har retten", "Sende opmærksomhedssignal", "Sætte flaget"], note: "SKS kap. 3: det er god skik, ikke en søvejsregel. Ring's 'lille viger for stor' handler om det samme." },
  { id: "vgm4", type: "mcq", sec: "vige", q: "En sejlbåd sejler med motoren i gang (og sejl oppe). Hvordan regnes den i vigereglerne?", a: "Som motorbåd", wrong: ["Som sejlbåd", "Som robåd", "Den har altid vigepligt"], note: "SKS regel 4, parentesen. Så den viger fx for en ren sejlbåd." },
  { id: "vgm5", type: "mcq", sec: "vige", q: "SKS' vigeregler står i prioriteret orden. Hvilken regel kommer FØRST?", a: "Overhalende båd viger altid, uanset type", wrong: ["Motor viger for sejl", "Bagbord halse viger for styrbord halse", "Luv båd viger for læ båd"], note: "Rækkefølgen: 1 overhaling → 2 motor/sejl/robåd → 3 halse → 4 motor fra styrbord → 5 luv/læ på samme halse." },

  // ================= KOMMANDOER & MANØVRER (order) =================
  { id: "mo1", type: "order", sec: "manovre", q: "Stagvending — kommandoer og trin (SKS kap. 7)",
    steps: [
      "Rorgænger: \"Klar vende\"",
      "Gaster går til skødespillene; luv skøde 2 tørn om spillet, læ skøde fri af klampen",
      "Gaster: \"Klar her\"",
      "Rorgænger: \"Læ\" — rorpinden føres til læ",
      "Lige før fokken bakker: læ fokkeskøde slippes, hales hjem på modsat spil",
      "Fald af til ønsket kurs og trim sejlene" ],
    note: "Stævnen går gennem vindøjet. Rorpinden til LÆ — det er den modsatte side af bomningens 'luv'." },
  { id: "mo2", type: "order", sec: "manovre", q: "Bomning — kommandoer og trin (SKS kap. 8)",
    steps: [
      "Rorgænger: \"Klar bomme\"",
      "Gaster klar ved skødespillene: \"Klar her\"",
      "Rorgænger: \"Luv\" — rorpinden en anelse til luv, fald af til plat læns",
      "Storskødet hales HELT hjem midt i båden",
      "Fald yderligere af til vinden fanger storsejlet på modsat side",
      "Slæk storsejlet helt ud og skær op til ønsket kurs" ],
    note: "Hal storsejlet hjem FØR bommen svinger — så den ikke flyver over cockpittet. Bomning er den farligste manøvre vi laver." },
  { id: "mo3", type: "order", sec: "manovre", q: "Mand over bord (SKS kap. 15)",
    steps: [
      "Råb \"MAND OVER BORD\" — udpeg en der holder udkig, kast redningskrans",
      "Ændr kurs til halv vind og sejl 2–4 bådlængder væk",
      "Stagvend og fald straks af til agten for tværs",
      "Hold på indtil manden kan holdes på foran for tværs, skær så op mod ham",
      "Slæk sejlene så der kun lige er styrefart; regulér fart med storsejlet",
      "Tag manden op i LÆ side med båden HELT stille" ],
    note: "Altid stagvending, aldrig bomning — en bomning er farligere i blæst. Ring's Yngling-variant: fald af til plat læns, 5 bådlængder, spids op og stagvend." },
  { id: "mo4", type: "order", sec: "manovre", q: "Ligge bak / underdrejet (SKS kap. 10, Ring s. 25)",
    steps: [
      "Hal sejlene hjem til bidevind",
      "Gå over stag UDEN at skifte skøder — fokken bakker",
      "Slæk storsejlet lidt",
      "Læg rorpinden i borde til læ" ],
    note: "Fok og storsejl ophæver næsten hinanden; båden ligger stille og roligt med kun styrefart. Bruges til pause, rebe, reparation." },
  { id: "mo5", type: "order", sec: "manovre", q: "Sætte storsejl (SKS 2.6)",
    steps: [
      "Giv rigelig slæk på storskødet",
      "Tjek at kickingstrap, cunningham og bomnedhal er slække",
      "Læg båden i vindøjet",
      "Hejs med faldet — stræk med et par tørn om spillet og spilhåndtaget",
      "Lås faldet i spilaflasteren, kvejl tampen op",
      "Hal kickingstrappen tot" ],
    note: "Storsejlet sættes altid med stævnen i vindøjet (Ring s. 28). Bjærges normalt også i vinden — i hårdt vejr dog på bidevind for fok alene (SKS 17.3). Fokken kan tages ned på medvind." },
  { id: "mo6", type: "order", sec: "manovre", q: "Rebe storsejlet (SKS 17.2)",
    steps: [
      "Sejl bidevind på fokken og slæk storsejlet så det ikke trækker",
      "Fir storsejlsfaldet så rebehullet i masteliget når ned til bommen",
      "Fastgør rebehullet ved svanehalsen (krog eller bind til mast og bom)",
      "Stræk storsejlsfaldet igen",
      "Hal agterligets rebehul ud mod bomnokken med rebelinen og tot til",
      "Bind den overskydende dug løst op i rebehullerne" ],
    note: "Reb i havn hvis du kan — det er langt lettere end til søs. Opbindingen må ikke bære træk." },
  { id: "mo7", type: "order", sec: "manovre", q: "Bjærge storsejl i hårdt vejr (SKS 17.3)",
    steps: [
      "Læg båden på bidevindkurs",
      "Hal fokken hjem og sejl for den alene",
      "Lad storskødet være slækt",
      "Slæk storfaldet",
      "Bjærg bom og storsejl indenbords" ],
    note: "I blæsevejr: storsejlet ned, sejl for fok alene — og hold båden tom for vand med pøsene." },
  { id: "mo8", type: "order", sec: "manovre", q: "Anløb af plads med FRALANDSVIND (SKS 12.1)",
    steps: [
      "Styr med moderat fart på foran for tværs mod åbningen mellem pælene",
      "Når opskuddet rækker: slæk sejlene så de ikke trækker (for lidt fart: tag hjem på storsejlet — for meget: zig-zag med roret)",
      "Umiddelbart før åbningen: skær op til luv pæl",
      "Fortøj til pælen og bjærg sejlene" ],
    note: "Fralandsvind = vinden bærer fra land ud mod dig. Du kommer ind MOD vinden, så opskuddet bremser dig." },
  { id: "mo9", type: "order", sec: "manovre", q: "Anløb af plads med PÅLANDSVIND (SKS 12.2)",
    steps: [
      "Sejl langs pælerækken ca. én bådlængde fra den, vind mellem foran for tværs og læns",
      "Når agterenden er ud for pladsen: skær kraftigt op med roret i borde",
      "I vindøjet under drejet: bjærg storsejlet hurtigt, derefter fokken",
      "Styr ind mellem pælene",
      "Tag fortøjningerne af pælene, brems med dem og hal ind langs luv stræktov" ],
    note: "Pålandsvind blæser dig ind mod land — sejlene SKAL ned i drejet, ellers kommer du for hurtigt." },
  { id: "mo10", type: "order", sec: "manovre", q: "Oplægning til bøje (Ring s. 25)",
    steps: [
      "Spids op så du har bidevindkurs mod bøjen",
      "Slæk sejlene så du taber fart",
      "Hal så meget i skøderne at du lige kommer hen til bøjen",
      "Lig stille så stævnen lige rører bøjen én gang" ],
    note: "Øver præcis manøvrering til havn og pæl. Bøjen holdes til LUV side (modsat mand over bord, hvor manden tages i læ)." },
  { id: "mo11", type: "order", sec: "manovre", q: "Bordfyldning — båden er fuld af vand (Ring s. 30)",
    steps: [
      "Bjærg sejlene — spiler og fok først, så båden går op i vinden",
      "Tøm straks: alle plasker vand ud af cockpittet, brug pøsene",
      "Kast anker hvis du driver ud fra land eller mod en kyst (forlæng med spilerskødet)",
      "Bjærg bortflydende ting",
      "Bliv ved båden — svøm aldrig væk" ],
    note: "Det er meget lettere at tømme før alle hulrum er fyldt. Pumpen virker kun når vandet står under dørken." },

  // ================= KNOB & STIK (mcq) =================
  { id: "kn1", type: "mcq", sec: "knob", q: "Hvilket knob sættes i enden af skøderne, så de ikke løber ud af blokkene?", a: "8-talsstik", wrong: ["Slipstik", "Pælestik", "Råbåndsknob"], note: "Også kaldet flamsk knob eller stopknob. Rorgængeren tjekker stopknob på alle skødetampe før afgang." },
  { id: "kn2", type: "mcq", sec: "knob", q: "Hvilket knob bruges til at sætte en fender på topvantet?", a: "Dobbelt halvstik", wrong: ["Pælestik", "Flagknob", "Slyngstik"], note: "Hurtigt at binde og løsne, holder på en lodret wire." },
  { id: "kn3", type: "mcq", sec: "knob", q: "Hvilket knob giver et fast øje i tovets ende, der ikke glider — fx i spilerskøderne?", a: "Pælestik", wrong: ["Slipstik", "Dobbelt halvstik", "Bardunstik"], note: "Pælestik (bowline) er 'kongen af knob': fast øje, let at løsne selv efter belastning." },
  { id: "kn4", type: "mcq", sec: "knob", q: "Hvordan fastgøres forfortøjningen i stævnen på en Yngling?", a: "Slyngstik", wrong: ["Pælestik", "Råbåndsknob", "8-talsstik"], note: "Midten af tovet gennem bøjlen, de to tampe gennem midten. Ikke særlig holdbart, men let at binde op." },
  { id: "kn5", type: "mcq", sec: "knob", q: "Hvilket knob binder to lige tykke, ens tove sammen?", a: "Råbåndsknob", wrong: ["Dobbelt halvstik", "Pælestik", "Slyngstik"], note: "Tampene skal komme ud sammen på samme side — ellers er det en kællingeknude, som glider." },
  { id: "kn6", type: "mcq", sec: "knob", q: "Hvilket knob binder et tyndt og et tykt tov sammen?", a: "Dobbelt flagknob", wrong: ["Råbåndsknob", "Pælestik", "Dobbelt halvstik"], note: "Et almindeligt flagknob klarer to tove af nogenlunde samme tykkelse; med stor forskel tages en ekstra tørn." },
  { id: "kn7", type: "mcq", sec: "knob", q: "Hvilket stik kan skubbes langs tovet og dermed stramme fx en bardun eller presenning?", a: "Bardunstik", wrong: ["Slipstik", "Pælestik", "Slyngstik"], note: "Også kaldet stopstik/fenderstik om egen part. Tørnen går i klemme og holder, men kan flyttes." },
  { id: "kn8", type: "mcq", sec: "knob", q: "Hvilket stik løsnes ved at trække i en løkke og kan afslutte alle knob?", a: "Slipstik", wrong: ["8-talsstik", "Flagknob", "Pælestik"], note: "En sløjfe er et råbåndsknob med dobbelt slipstik." },
  { id: "kn9", type: "mcq", sec: "knob", q: "Hvordan gøres en fortøjning fast på en dobbelt klampe?", a: "Krydstørn, låst med et halvstik", wrong: ["Et pælestik om klampen", "Et enkelt slipstik", "To råbåndsknob"], note: "Ring s. 6: først krydstørn over klampen, lås med et halvstik der stikkes ind under sig selv. Enkelt klampe: simpel fastgørelse med slipstik." },
  { id: "kn10", type: "mcq", sec: "knob", q: "Hvad kaldes 'alt-mulig-stikket', der bl.a. bruges ved fortøjning af en båd?", a: "Dobbelt halvstik om egen part (med rundtørn)", wrong: ["Flagknob", "Slyngstik", "8-talsstik"], note: "Rundtørn om pælen tager trækket, de to halvstik om egen part låser." },
  { id: "kn11", type: "mcq", sec: "knob", q: "Hvad er delene i tre-slået tovværk, fra helhed til mindste del?", a: "Tov → kordel → garn → fibre", wrong: ["Tov → strømpe → kalv → fibre", "Tov → garn → kordel → fibre", "Tov → spring → kordel → garn"], note: "Flettet tov består derimod af strømpe (yderst) og kalv (kernen)." },
  { id: "kn12", type: "mcq", sec: "knob", q: "Hvad er formålet med en takling?", a: "At tovets ende ikke flosser op", wrong: ["At samle to tove", "At lave et fast øje", "At stramme en bardun"], note: "Taklegarn er tynd, stærk, ofte vokset snor. Skal det holde i mange år, skal taklingen være syet." },
  { id: "kn13", type: "mcq", sec: "knob", q: "Hvor mange indstik skal en øjesplejsning på en fortøjning normalt have?", a: "4–5", wrong: ["2", "3", "8–10"], note: "Glat tovværk skal have flere, naturtov kan nøjes med 3. Altid skråt mod venstre." },
  { id: "kn14", type: "mcq", sec: "knob", q: "Hvad kaldes enden af et tov?", a: "Tampen", wrong: ["Kalven", "Kordelen", "Bugten"], note: "Bugten er løkken/buen midt på tovet. Skødetampen er den ende af skødet du holder i." },

  // ================= SIKKERHED (mcq) =================
  { id: "si1", type: "mcq", sec: "sikker", q: "Hvornår må nødsignaler (røde raketter, MAYDAY) bruges?", a: "Kun ved overhængende fare for besætningens liv", wrong: ["Ved fare for materiel skade", "Når man ønsker bugserhjælp i vindstille", "Når man er gået på grund"], note: "Ellers bruges opmærksomhedssignaler: hvide (nat) eller grønne (dag) blus, almindeligt VHF-opkald, eller stå i stævnen og vink med tovværk." },
  { id: "si2", type: "mcq", sec: "sikker", q: "Hvilket af disse er et officielt nødsignal?", a: "Signalflag N og C hejst sammen", wrong: ["Grønt håndblus", "Hvid raket", "Signalflag A"], note: "N (blå/hvidt skakbræt) over C (rød-hvid-blå-hvid-rød). Også: rund genstand over/under firkantet, langsom hævning/sænkning af armene, uafbrudt tågehorn, orange røg, åben ild." },
  { id: "si3", type: "mcq", sec: "sikker", q: "Hvad betyder det, når en person langsomt hæver og sænker begge arme strakt vandret ud fra kroppen?", a: "Nødsignal — fare for liv", wrong: ["Hilsen til en anden båd", "Bugserhjælp ønskes", "Jeg har vigepligt"], note: "Et af de officielle nødsignaler uden udstyr." },
  { id: "si4", type: "mcq", sec: "sikker", q: "Hvad er livlinens funktion?", a: "At hindre én i at falde over bord", wrong: ["At holde en overbordfalden fast til båden", "At slæbe en anden båd", "At hejse en person op af vandet"], note: "Bæres i hårdt vejr og mørke af alle i cockpittet. Løsn aldrig den ene ende før den anden er fastgjort." },
  { id: "si5", type: "mcq", sec: "sikker", q: "Hvad kontrolleres på en Yngling før sejlads? (Ring s. 30)", a: "Veste til alle, 3 pøse, anker med line, paddel, vandtætte rum lukkede", wrong: ["Veste, radarreflektor, nødraketter, søkort", "Anker, VHF, ildslukker, tågehorn", "Kompas, lænsepumpe, forbindingskasse"], note: "Anker og pøse må IKKE ligge i de vandtætte rum — de skal være tomme og lukkede, det er bådens flydeevne." },
  { id: "si6", type: "mcq", sec: "sikker", q: "Hvilken type ildslukker og hvor, hvis der er motor om bord?", a: "Mindst 2 kg pulverslukker, opbevaret UDEN FOR motorrummet, nåes fra cockpittet", wrong: ["Skumslukker i motorrummet", "CO₂-slukker under dørken", "Vandslukker ved masten"], note: "Pulver eller halon. Den skal kunne nås fra cockpittet." },
  { id: "si7", type: "mcq", sec: "sikker", q: "Hvor lang bør ankerlinen mindst være, og hvad hjælper den med at holde bunden?", a: "Mindst 30 m, med kædeforfang eller vægte", wrong: ["10 m, flydende PP-tov", "15 m, ren kæde", "50 m, tyndt dyneema"], note: "Kæden holder trækket vandret, så ankeret graver sig ned. Et bøjereb i ankerets bund lader dig bjærge det baglæns, hvis det sidder fast." },
  { id: "si8", type: "mcq", sec: "sikker", q: "Det blæser op. Hvad gør du med sejlene på en Yngling?", a: "Bjærg storsejlet og sejl for fok alene", wrong: ["Bjærg fokken og sejl for storsejl alene", "Sæt spileren for at komme hurtigt hjem", "Hal alt helt hjem"], note: "Og hold båden tom for vand med pøsene — pumpen virker kun når vandet er under dørken." },
  { id: "si9", type: "mcq", sec: "sikker", q: "Båden er bordfyldt (fuld af vand). Hvad er den vigtigste regel?", a: "Bliv ved båden — svøm aldrig væk", wrong: ["Svøm mod land med det samme", "Forlad båden i redningsvest", "Kap masten"], note: "Bjærg sejlene først (spiler og fok), tøm straks, kast anker hvis du driver. Sker altid i blæsevejr." },
  { id: "si10", type: "mcq", sec: "sikker", q: "Du er gået på grund. Hvad gør du først?", a: "Find ud af hvor der er dybest og drej båden mod det dybe vand", wrong: ["Send nødsignal", "Hop i vandet og skub", "Sæt mere sejl og fortsæt kursen"], note: "Prøv at sejle af med sejlene, evt. skub med spilerstagen. Hopper du i: pas på skarpe muslinger." },
  { id: "si11", type: "mcq", sec: "sikker", q: "Hvilken manøvre regnes for den farligste vi laver?", a: "Bomning", wrong: ["Stagvending", "Mand over bord", "Rebning"], note: "Bommen svinger lavt og hurtigt over cockpittet — kan give hjernerystelse. Ufrivillig bomning afværges ved hurtigt at skære op." },
  { id: "si12", type: "mcq", sec: "sikker", q: "Huskereglen på læns, når bommen vil over: 'Pind mod …'?", a: "Pind mod pind — rorpinden føres mod bommen", wrong: ["Pind mod vind — rorpinden mod vinden", "Pind i læ", "Pind midtskibs"], note: "Rorpinden mod bommen skærer båden op og tager vinden ud af en begyndende ufrivillig bomning." },
  { id: "si13", type: "mcq", sec: "sikker", q: "Hvornår bør radarreflektoren bruges, og hvor placeres den?", a: "I tåge, usigtbart vejr og mørke — så højt over dæk som muligt", wrong: ["Kun om natten, på hækken", "Altid, i mastefoden", "Kun i havn"], note: "Jo højere, jo længere væk ses du på andres radar." },

  // ================= TOVVÆRK (mcq) =================
  { id: "tv1", type: "mcq", sec: "tov", q: "Hvilket tovværk flyder på vandet?", a: "Polypropylen / polyetylen (PP-tov)", wrong: ["Polyester", "Nylon", "Kevlar"], note: "Derfor godt til fortøjninger og slæbeline, men uegnet til ankerline. Halvt så stærkt som polyester." },
  { id: "tv2", type: "mcq", sec: "tov", q: "Hvilket materiale er bedst til skøder og ankerliner på vores både?", a: "Polyester", wrong: ["Nylon", "Polypropylen", "Kevlar"], note: "Stærkere end nylon, ændrer sig ikke med alderen, tåler sol. 'Velegnet til alt tovværk på vore både.'" },
  { id: "tv3", type: "mcq", sec: "tov", q: "Nylon er meget elastisk. Hvad er det velegnet til?", a: "Ankerline, fortøjning og slæbeline", wrong: ["Skøder", "Fald", "Spilerskøder"], note: "Fjedrer så båden ikke rykker. Uegnet til skøder. Bliver stift og hårdt med alderen — ægte nylontov er sjældent." },
  { id: "tv4", type: "mcq", sec: "tov", q: "Hvad kendetegner kevlar?", a: "Meget u-elastisk, tåler ikke sollys, smelter ikke", wrong: ["Flyder og er meget elastisk", "Billigst og flyder", "Fjedrer og synker"], note: "Dobbelt så stærkt som polyester, altid beskyttet af en polyester-strømpe. Bruges ikke så meget mere." },
  { id: "tv5", type: "mcq", sec: "tov", q: "Spectra/dyneema er 3× stærkere end polyester. Hvad er det UEGNET til?", a: "Fortøjninger og slæbeliner", wrong: ["Fald til storsejl", "Spilerskøder", "Fokkefald"], note: "Det fjedrer ikke, så båden rykker for hårdt. Fremragende til fald og skøder der ikke må strække sig — men dyrt." },
  { id: "tv6", type: "mcq", sec: "tov", q: "Rings 'kort sagt'-regel for tovvalg?", a: "PP til fortøjninger, polyester til skøder og ankerliner, spectra til fald og skøder (dyrt)", wrong: ["Nylon til alt", "Kevlar til fortøjninger, PP til fald", "Polyester til fortøjninger, PP til skøder"], note: "Ring s. 12." },
  { id: "tv7", type: "mcq", sec: "tov", q: "Du brænder enden af et ukendt tov: det brænder med sodende flamme og bliver til sort aske. Hvad er det?", a: "Naturfiber (manilla, hamp, kokos …)", wrong: ["Polyester", "Kevlar", "Dyneema"], note: "Smelter det før det brænder: polyester/PP/nylon/dyneema. Hverken smelter eller brænder: kevlar. Flyder det (gennemblødt): PP/PE." },
  { id: "tv8", type: "mcq", sec: "tov", q: "Hvilket materiale bruges til vant og stag i tov-form (6 = som stål)?", a: "PBO", wrong: ["Nylon", "Polypropylen", "Bomuld"], note: "Brudstyrke ~575 N/mm², ingen elasticitet, tåler ikke sollys. Tabellen Ring s. 13." },
  { id: "tv9", type: "mcq", sec: "tov", q: "Hvad bør du gøre med tovværket før det lægges væk for vinteren?", a: "Skylle det i ferskvand", wrong: ["Smøre det med olie", "Lade det tørre i solen hele vinteren", "Fryse det"], note: "Salt slider fibrene. Naturfibertov blev brugt indtil ca. 1960 — nu kun på veteranskibe." },
  { id: "tv10", type: "mcq", sec: "tov", q: "Hvilket naturfibertov blev brugt på vikingeskibe?", a: "Hestehår", wrong: ["Manilla", "Kokos", "Bomuld"], note: "Manilla var tidligere det almindeligste; hamp blev ofte tjæret; bomuld til 'finere brug'; kokos = gulvtæppe." },

  // ================= FLAG (mcq) =================
  { id: "fl1", type: "mcq", sec: "flag", q: "Hvad er yachtflaget?", a: "Det danske orlogsflag (splitflag) med YF i guld i øverste kvadrat", wrong: ["Det almindelige Dannebrog", "Et hvidt flag med rødt kors", "Dannebrog med en guldstjerne"], note: "Må føres på danske både der udelukkende er til lystfart. KDY's flag har 3 guldstjerner under YF." },
  { id: "fl2", type: "mcq", sec: "flag", q: "Hvornår hejses flaget i havn, og hvornår tages det ned?", a: "Ved solopgang (dog tidligst kl. 8) — ned ved solnedgang, eller når besætningen går fra borde", wrong: ["Kl. 6 — ned kl. 22", "Når man sejler ud — ned når man kommer hjem", "Det hænger hele døgnet"], note: "Til søs kan flaget føres døgnet rundt. Kommer du i havn uden for flagtid: ned omgående." },
  { id: "fl3", type: "mcq", sec: "flag", q: "Hvor føres venskabsflaget (gæstelandets flag), og hvornår sættes det?", a: "Under styrbord salingshorn — før man anløber en fremmed nations havn", wrong: ["På flagspil agter — når man er fortøjet", "I mastetoppen — hele turen", "Under bagbord salingshorn — i havn"], note: "Viser at vi kommer som venner, ikke som krigsskib." },
  { id: "fl4", type: "mcq", sec: "flag", q: "Flagtid i Sverige?", a: "Flaget ned kl. 21, selvom solen ikke er gået ned", wrong: ["Samme som i Danmark", "Ved midnat", "Kl. 18"], note: "Man følger lokal flagtid i udlandet." },
  { id: "fl5", type: "mcq", sec: "flag", q: "Føres der nationalflag under kapsejlads?", a: "Normalt ikke — men god skik at sætte det når mållinjen passeres", wrong: ["Ja, altid", "Kun på startlinjen", "Kun hvis man vinder"], note: "Eller når kapsejladsen afbrydes. 'Tak for sejladsen.'" },
  { id: "fl6", type: "mcq", sec: "flag", q: "Hvorfor siger man ikke at man 'stryger' flaget?", a: "Man stryger kun flaget når man overgiver sig — vi tager det ned / bjærger det", wrong: ["Det er et svensk ord", "Det må kun orlogsskibe sige", "Fordi flaget hales ned med en talje"], note: "Ring s. 33, 'bemærk for sjov'." },
  { id: "fl7", type: "mcq", sec: "flag", q: "Hvor fører skippere af 'den gamle skole' flaget under sejl?", a: "Fra agterkanten af storsejlets flynder", wrong: ["I mastetoppen", "På forstaget", "På bommen"], note: "Ellers fra flagspil agter, som i havn." },

  // ================= ORDFORKLARINGER (mcq) =================
  { id: "or1", type: "mcq", sec: "ord", q: "Hvad betyder 'tot'?", a: "Stram", wrong: ["Løs", "Vådt", "Snoet"], note: "Modsat: slæk. 'Hal tot' = stram op. 'Svinebinde' = ALT for tot, fx fortøjning uden fjedring." },
  { id: "or2", type: "mcq", sec: "ord", q: "Hvad er 'styrefart'?", a: "Den mindste fart hvor roret virker", wrong: ["Topfart", "Fart gennem vandet uden sejl", "Farten ved havneindsejling"], note: "Mister du styrefarten i havn, driver båden ukontrolleret." },
  { id: "or3", type: "mcq", sec: "ord", q: "Hvad betyder 'kloshalet'?", a: "Et hal der ikke kan hales mere", wrong: ["Et hal der er sluppet helt", "At sejle tæt forbi en båd", "At binde to tove sammen"], note: "Storsejlet er kloshalet på bidevind — slæk det på alle andre kurser, ellers slipper vinden sejlet." },
  { id: "or4", type: "mcq", sec: "ord", q: "Hvad vil det sige at båden 'svajer'?", a: "Den ligger fortøjet/ankret så den kan dreje for vind eller strøm", wrong: ["Den krænger", "Den ruller", "Den går i stå"], note: "Før storsejlet sættes, svajes båden så den ligger i vindøjet." },
  { id: "or5", type: "mcq", sec: "ord", q: "Hvad er et 'stræktov'?", a: "Tov spændt ud mellem land og fortøjningspælene, til at hale båden ind med", wrong: ["Et elastisk tov til anker", "Tovet i storsejlets agterlig", "Et slæbetov"], note: "Hal ud langs LUV stræktov, så du ikke driver over i læ nabobåd." },
  { id: "or6", type: "mcq", sec: "ord", q: "Hvad er et 'spring' ved fortøjning?", a: "Fortøjning der går skråt for/agter og hindrer båden i at bevæge sig langs kajen", wrong: ["Et hop fra båd til kaj", "Fortøjningen til ankeret", "En elastisk fortøjning"], note: "Langskibsfortøjning kræver 2 spring. ~20 cm luft til kajen når alt er tot." },
  { id: "or7", type: "mcq", sec: "ord", q: "Hvad er et 'klyds'?", a: "Gennemføring i dækket/rælingen som fortøjningen føres gennem", wrong: ["En lille klampe", "En blok på bommen", "Et øje i sejlet"], note: "Optager sliddet og giver fortøjningen et angrebspunkt." },
  { id: "or8", type: "mcq", sec: "ord", q: "Hvad betyder 'at kvejle'?", a: "At rulle tov op i et kvejl (bundt)", wrong: ["At kaste anker", "At trimme sejlet", "At vende båden"], note: "Fald og skøder kvejles op og lægges på plads efter sejlads." },
  { id: "or9", type: "mcq", sec: "ord", q: "Hvad betyder 'at lette'?", a: "At påbegynde sejladsen — gøre båden fri af fortøjninger og anker", wrong: ["At gøre båden lettere", "At tage sejl ned", "At løsne skødet"], note: "'Let' = båden er frigjort og kan sejle. Duelighedspunkt 2: 'Lette fra pæl, bøje eller bolværk'." },
  { id: "or10", type: "mcq", sec: "ord", q: "Når et sejl 'lever', hvad gør det så?", a: "Det blafrer", wrong: ["Det trækker fuldt", "Det er rebet", "Det står stille"], note: "Trim: slæk ud til sejlet begynder at leve ved forliget, hal så lige hjem til det trækker fuldt." },
  { id: "or11", type: "mcq", sec: "ord", q: "Hvad betyder 'at ligge underdrejet'?", a: "At ligge med bakkede sejl uden at gøre fart gennem vandet", wrong: ["At ligge for anker", "At krænge kraftigt", "At ligge i havn"], note: "Samme som 'at ligge bak'." },
  { id: "or12", type: "mcq", sec: "ord", q: "Hvad er en 'løjert'?", a: "Beslag der hægter forsejlets forlig til forstaget", wrong: ["En lille blok", "Et tov til spileren", "En slags knob"], note: "Sættes på forstaget nedefra, mens forliget følges." },
  { id: "or13", type: "mcq", sec: "ord", q: "Hvad er en 'sejsing'?", a: "En kort line til at binde noget fast med, fx spilerens barme i posen", wrong: ["Et stort sejl", "En type knob", "Et beslag på masten"], note: "Hindrer ligene i at sno sig." },
  { id: "or14", type: "mcq", sec: "ord", q: "Hvad er en 'talje'?", a: "Arrangement af tovværk og blokke der giver udveksling", wrong: ["En slags vinsch", "Et stag", "Enden af et tov"], note: "Storskødet og kickingstrappen er taljer." },
  { id: "or15", type: "mcq", sec: "ord", q: "Hvad er et 'rundholt'?", a: "Rør/stang til mast, bom, spilerstage o.l.", wrong: ["En rund blok", "Et hul i dækket", "En fortøjningsring"], note: "Af aluminium eller træ." },
  { id: "or16", type: "mcq", sec: "ord", q: "Hvad er 'opskud'?", a: "Den fart båden har gennem vandet når den ikke påvirkes af sejlene", wrong: ["Et stød fra kajen", "Vindstød", "Startsignalet i kapsejlads"], note: "Ved anløb skal opskuddet lige række til pælene — for meget bremses med zig-zag på roret." },
  { id: "or17", type: "mcq", sec: "ord", q: "Hvad er 'skral vind'?", a: "Vind der kommer så meget forfra at den ikke kan trække sejlene (mellem ret for og bidevind)", wrong: ["Vind lige bagfra", "Vind fra siden", "Vindstille"], note: "'Vinden skraller' = drejer så den kommer mere forfra. Modsat: 'vinden rummer'." },
  { id: "or18", type: "mcq", sec: "ord", q: "Hvad er 'foran for tværs'?", a: "Vindretningen mellem bidevind og halvvind", wrong: ["Mellem halvvind og læns", "Lige forfra", "Lige fra siden"], note: "SKS' finere inddeling. 'Agten for tværs' = mellem halvvind og læns (= slør)." },
  { id: "or19", type: "mcq", sec: "ord", q: "Hvad er den 'resulterende vind'?", a: "Den vind der føles om bord: sand vind + fartvind — det er den sejlene trimmes efter", wrong: ["Vinden når båden ligger stille", "Vinden i vejrudsigten", "Vinden i masttoppen"], note: "Den føles som kommende mere forfra end den sande vind. Vises på windexen." },
  { id: "or20", type: "mcq", sec: "ord", q: "Hvad er et 'ben' på et kryds?", a: "Sejladsen mellem to vendinger", wrong: ["En bådlængde", "Et stag", "Afstanden til mærket"], note: "Krydset = zig-zag bidevind op mod vinden." },
  { id: "or21", type: "mcq", sec: "ord", q: "Hvad er 'kattepoter'?", a: "Vindens spor på vandoverfladen — viser den sande vinds retning", wrong: ["Små bølger fra en motorbåd", "Knob i tovværket", "Skyer der varsler torden"], note: "Sammen med bølgeretningen aflæses den sande vind." },
  { id: "or22", type: "mcq", sec: "ord", q: "Hvad er en 'pejling'?", a: "Retning til et punkt", wrong: ["Vanddybden", "Bådens fart", "Vindstyrken"], note: "Fx pejling til et mærke eller en landkending." },
  { id: "or23", type: "mcq", sec: "ord", q: "Hvad er 'krap'?", a: "Snæver eller hurtig (fx en krap vending)", wrong: ["Stram", "Våd", "Lang og blød"], note: "En krap vending bremser båden helt — i havn skal vendinger være lange og bløde, medmindre du VIL bremse." },
  { id: "or24", type: "mcq", sec: "ord", q: "Hvad er et 'vindspring'?", a: "Ændring i vindens retning eller styrke", wrong: ["Et hop over bommen", "En bølge", "En vending"], note: "På bidevind korrigeres kursen efter vindspring; på rumskøds trimmes sejlene." },
  { id: "or25", type: "mcq", sec: "ord", q: "Hvad betyder 'at forhale'?", a: "At flytte båden til en anden plads (uden sejl, med tov eller paddel)", wrong: ["At hale skødet hjem", "At sejle hurtigere", "At gøre båden klar"], note: "Fx forhale til svajepladsen før sejlene sættes." },
  { id: "or26", type: "mcq", sec: "ord", q: "Hvad er 'fartvind'?", a: "Den vind der opstår på grund af bådens egen fart gennem vandet", wrong: ["Vinden på en hurtig dag", "Vinden i spileren", "Vind over 10 m/s"], note: "Sand vind + fartvind = resulterende vind." },
  { id: "or27", type: "mcq", sec: "ord", q: "Hvad er en 'skildpaddeblok'?", a: "Blok der er fastspændt på et underlag, fx på bommen til rebelinen", wrong: ["En blok med to skiver", "En flydende blok", "En blok i mastetoppen"], note: "SKS 17.2: rebelinen føres fra skildpaddeblokken op gennem agterligets rebehul." },
  { id: "or28", type: "mcq", sec: "ord", q: "Hvad betyder 'tørne' (et spil)?", a: "At dreje det", wrong: ["At låse det", "At smøre det", "At fjerne håndtaget"], note: "En 'tørn' er tov lagt rundt om en genstand — 2 tørn om spillet før vendingen." },
];

/* Yngling-grej og engelske knob-navne til Oversæt (cat: gear / knob) */
export const DUE_VOCAB = [
  { id: "y_spilerstage", da: "Spilerstage",   en: "Spinnaker pole",      cat: "gear", note: "Stangen der holder spilerens luv skødebarm ud fra masten." },
  { id: "y_ophal",      da: "Stageophal",     en: "Pole uphaul / topping lift", cat: "gear", note: "Løfter spilerstagen. Nedhalet holder den nede." },
  { id: "y_nedhal",     da: "Stagenedhal",    en: "Pole downhaul / foreguy", cat: "gear", note: "Holder spilerstagen nede, så den ikke rejser sig." },
  { id: "y_bomudhal",   da: "Bomudhal",       en: "Outhaul",             cat: "gear", note: "Strækker storsejlets underlig ud mod bomnokken." },
  { id: "y_cunning",    da: "Cunninghamhal",  en: "Cunningham",          cat: "gear", note: "Strammer storsejlets forlig nedad lige over halsbarmen — flader sejlet." },
  { id: "y_kicking",    da: "Kickingstrop",   en: "Kicker / boom vang",  cat: "gear", note: "Talje der holder bommen nede. Samme som hækvang." },
  { id: "y_barber",     da: "Barberhal",      en: "Barber hauler",       cat: "gear", note: "Trækker spiler-/fokkeskødet ned eller ind for at ændre skødevinklen." },
  { id: "y_svanehals",  da: "Svanehals",      en: "Gooseneck",           cat: "gear", note: "Beslaget bommen er fæstet til masten med." },
  { id: "y_rostjern",   da: "Røstjern",       en: "Chainplate",          cat: "gear", note: "Beslaget i dæk/skrog hvor vantene er fastgjort." },
  { id: "y_skodeviser", da: "Skødeviser",     en: "Fairlead / sheet lead", cat: "gear", note: "Blokken (ofte på skinne) skødet løber gennem på vej til spillet." },
  { id: "y_flynder",    da: "Flynder",        en: "Headboard",           cat: "gear", note: "Den stive plade i storsejlets faldbarm. Gamle skippere fører flaget herfra." },
  { id: "y_sejlpind",   da: "Sejlpind",       en: "Batten",              cat: "gear", note: "Lineal-lignende pinde der spreder sejlet ud. Tynd ende inderst." },
  { id: "y_sjaekel",    da: "Sjækel",         en: "Shackle",             cat: "gear", note: "Samleled af metal der kan åbnes." },
  { id: "y_bomnok",     da: "Bomnok",         en: "Boom end",            cat: "gear", note: "Yderste ende af bommen." },
  { id: "y_genakker",   da: "Genakker",       en: "Gennaker",            cat: "gear", note: "Genua + spinnaker: asymmetrisk 'kæmpefok' af spilerdug, sat fra et bovspryd. J70/J80." },
  { id: "y_bovspryd",   da: "Bovspryd",       en: "Bowsprit",            cat: "gear", note: "Stangen der hales frem foran stævnen til genakkeren." },
  { id: "y_fender",     da: "Fender",         en: "Fender",              cat: "gear", note: "Den bløde pølse mellem båd og bolværk. Sættes med dobbelt halvstik." },
  { id: "k_8tal",       da: "8-talsstik",     en: "Figure-eight knot",   cat: "knob", note: "Stopknob i skødetampen. SKS kalder det flamsk knob." },
  { id: "k_paele",      da: "Pælestik",       en: "Bowline",             cat: "knob", note: "Fast øje der ikke glider." },
  { id: "k_dhalv",      da: "Dobbelt halvstik", en: "Two half hitches", cat: "knob", note: "Fender på vantet. Med rundtørn om egen part = round turn and two half hitches." },
  { id: "k_flag",       da: "Flagknob",       en: "Sheet bend",          cat: "knob", note: "Binder to tove sammen; dobbelt = double sheet bend til tyndt+tykt." },
  { id: "k_raaband",    da: "Råbåndsknob",    en: "Reef knot",           cat: "knob", note: "To ens tove. Kællingeknude = granny knot." },
  { id: "k_slip",       da: "Slipstik",       en: "Slipped knot / slip hitch", cat: "knob", note: "Løsnes med et træk i løkken." },
  { id: "k_slyng",      da: "Slyngstik",      en: "Cow hitch / lark's head", cat: "knob", note: "Forfortøjning i Ynglingens stævn." },
  { id: "k_bardun",     da: "Bardunstik",     en: "Rolling hitch / tautline hitch", cat: "knob", note: "Kan skubbes og stramme." },
  { id: "k_takling",    da: "Takling",        en: "Whipping",            cat: "knob", note: "Snor viklet om tovenden så den ikke flosser." },
  { id: "k_splejs",     da: "Øjesplejsning",  en: "Eye splice",          cat: "knob", note: "Fast øje flettet ind i tovet, 4–5 indstik." },
];
