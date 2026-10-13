# Duelighed-sektion — krav

Kilder (begge fra Skovshoved Sejlklub, tilsendt af Erling Bøtcher 8. sep 2026):
- **SKS** = "Skovshoved Sejlklubs Sejlerskole — Instruktionshæfte i praktisk sejlads", rev. 8, 2007 (Albin 78 / Match 28).
- **Ring** = Jørgen Ring, "Yngling — Tovværk & Sømandskab", okt. 2020.

Målet er at dække de teoretiske dele af duelighedsprøvens praktiske pensum
(SKS kap. 1, 18 punkter) som ikke allerede dækkes af Del 1–5 og Oversæt.
Ved konflikt mellem kilderne gælder **SKS** (klubbens egen skolebåd-praksis),
og Ring-varianten nævnes i noten.

## Funktionelle krav

R1. Forsiden får ÉN ny sektion "Duelighed" med under-dele. Forsidens eksisterende
    flow (Del 1–5, Grundbegreber, Oversæt) må ikke ændres.
R2. Tre spørgsmålstyper:
    - **Scenario** (vigeregler): top-down tegning af to både + vindpil, spørgsmål
      "Hvem skal vige?", svar A / B / Begge / Ingen. Tegningen må ikke afsløre svaret
      (ingen farvekodning af "den der viger", ingen tekst der nævner halse/typen ud
      over et neutralt bogstav og bådtype-ikon).
    - **Rækkefølge** (kommandoer/manøvrer): trinnene vises blandet; brugeren trykker
      dem i rigtig rækkefølge. Forkert tryk markeres straks, trinnet forbliver åbent,
      og spørgsmålet tæller som forkert. Når alle er placeret vises den rigtige
      rækkefølge + note.
    - **Spørgsmål** (MCQ): tekst-spørgsmål, 4 svar, forkerte svar fra samme kategori
      (eller eksplicit `wrong`-liste). Samme feedback-boks som resten af appen.
R3. Runde-logik som Oversæt: runde på op til 12 spørgsmål, forkerte gentages én gang
    til sidst, resultatskærm med score. Svage spørgsmål huskes i localStorage (nøgle
    pr. del) og trækkes oftere.
R4. Dansk UI; `en`-gloss kun hvor den findes naturligt. Stil = eksisterende tokens (`C.*`),
    ingen nye hex-farver. Marking-invarianten gælder også scenario-tegningen: ingen
    permanent `C.accent`/`C.gold` på et element der kan læses som "svaret".
R5. `npm run build` grøn. Scenario-tegninger gennemses visuelt (contact sheet eller
    screenshot pr. scenario) før de regnes som færdige.

## Indholdskrav (hvad der SKAL med)

### Vigeregler (SKS kap. 3, Ring s. 31–32) — scenarier, mindst 10
Reglerne i SKS' prioriterede orden:
1. Overhalende båd viger altid, uanset type.
2. Motor viger for sejl; begge viger for robåd. (Sejlbåd for motor = motorbåd.)
3. Bagbord halse viger for styrbord halse.
4. Motor viger for motor der kommer fra styrbord side.
5. Samme halse: luv båd viger for læ båd.
Plus: motorbåde stævn mod stævn → begge drejer styrbord; indadgående viger for
udadgående i havn (Skovshoved følger hovedreglen); den der IKKE har vigepligt
holder kurs og fart. Ring's "lille viger for stor" er IKKE en søvejsregel — SKS kalder
det god skik over for erhvervsfartøjer; må kun optræde som MCQ om god skik, ikke som
scenario-svar.
Mindst ét scenario skal teste at regel 1 slår regel 2 (sejlbåd der overhaler motorbåd
viger), og ét at regel 2 slår regel 4 (motorbåd viger for sejlbåd selv om sejlbåden
kommer fra motorbådens bagbord side).
Halse i tegningen skal udledes af vind + kurs (bom i læ), ikke hardcodes.

### Kommandoer & manøvrer (SKS kap. 7, 8, 10, 12, 15, 17; Ring s. 25–28) — rækkefølge, mindst 8
Stagvending (klar vende → klar her → læ → …), bomning (klar bomme → klar her → luv → …),
mand over bord (SKS-versionen: halv vind, 2–4 bådlængder, stagvend, agten for tværs,
foran for tværs op, læ side, HELT stille — Ring's Yngling-variant i noten), ligge bak,
bøjemanøvre/oplægning til bøje, sætte storsejl (SKS 2.6), bjærge storsejl i hårdt vejr
(SKS 17.3), rebe (SKS 17.2), anløb med fralandsvind (SKS 12.1), anløb med pålandsvind
(SKS 12.2), bordfyldning (Ring s. 30). Huskereglen "pind mod pind" skal med (MCQ).

### Knob & stik (Ring s. 2–6; SKS kap. 23) — MCQ, mindst 12
Anvendelse → knob: 8-talsstik (stopknob i skødetamp; SKS: flamsk knob), slipstik,
slyngstik (forfortøjning i Ynglingens stævn; fokkeskøde i fok), dobbelt halvstik
(fender på topvant), dobbelt halvstik om egen part / rundtørn (fortøjning, "alt mulig"),
pælestik (fast øje, spilerskøder), bardunstik (kan skubbes/strammes), flagknob (to tove /
flag), dobbelt flagknob (tyndt+tykt), råbåndsknob (to ens tove; kællingeknude = fejl),
klampe enkelt (slipstik) og dobbelt (krydstørn + halvstik). Tovets dele (tov→kordel→garn→
fibre; flettet: strømpe+kalv), takling (formål, taklegarn, syet holder), øjesplejsning
(4–5 indstik; glat flere; natur 3). Engelske knob-navne i Oversæt-ordforrådet.

### Sikkerhed (SKS kap. 14; Ring s. 30) — MCQ, mindst 10
Yngling-kontrol (veste til alle, 3 pøse, anker+line, paddel, vandtætte rum lukkede og tomme),
SKS-udstyrsliste (15 punkter; ildslukker pulver/halon, 2 kg ved motor, udenfor motorrum;
ankerline ≥30 m m. kædeforfang; radarreflektor højt), nødsignaler (kun ved fare for liv;
listen i 14.2 — arme, flag N+C, rund over firkant, uafbrudt tågehorn, orange røg, røde
blus/raketter, MAYDAY) vs opmærksomhedssignaler (hvide/grønne blus, vinke med tov),
livline (hindrer fald, holder ikke en overbordfalden), blæsevejr (storsejl ned, fok alene),
pumpe kun under dørk, bordfyldning: bliv ved båden, grundstødning (mod det dybe, spilerstage,
muslinger), bomning = farligste manøvre, afværg ufrivillig bomning ved at skære op.

### Tovværk (Ring s. 12–13) — MCQ, mindst 8
Flyder (PP/PE, dyneema) vs synker; nylon elastisk → anker/fortøjning/slæb, uegnet skøder,
stivner; polyester → alt, skøder, ankerliner, tåler sol; kevlar u-elastisk, tåler ikke sol,
smelter ikke; spectra/dyneema 3× polyester, fald + spilerskøder, uegnet fortøjning; PBO →
vant og stag; "kort sagt"-reglen; identifikation (flyder? smelter? sodende flamme = natur);
naturfibre (manilla, hamp, kokos, bomuld, hestehår; til ~1960); skyl i ferskvand før vinter.

### Flag (Ring s. 33) — MCQ, mindst 6
Yachtflag = orlogsflag/splitflag m. YF i guld; flagspil agter / gamle skole: storsejlets
flynder; flagtid solopgang (tidligst 08) → solnedgang, ned når besætningen går fra borde;
til søs døgnet rundt; Sverige kl. 21; venskabsflag under styrbord salingshorn før anløb;
kapsejlads: normalt ikke, sættes ved mållinjen; "stryge" = overgive sig — man bjærger; KDY
= 3 guldstjerner.

### Ordforklaringer (SKS kap. 24; Ring s. 13–17) — MCQ "hvad betyder…", mindst 25
Udvalg: tot, slæk, kloshalet, styrefart, svaje, forhale, stræktov, spring, klyds, kvejle,
lette, leve (sejl), underdrejet, løjert, sejsing, talje, rundholt, tørn, opskud, svinebinde,
skral vind, foran for tværs, skraller/rummer, sand vind/fartvind/resulterende vind,
ben (kryds), kattepoter, pejling, skildpaddeblok, krap. Yngling-grej i Oversæt (cat gear):
spilerstage, stageophal, stagenedhal, bomudhal, cunninghamhal, kickingstrop, barberhal,
svanehals, røstjern, skødeviser, flynder, sejlpind, sjækel, bomnok, genakker, bovspryd.

## Ikke-krav
- Ingen tegninger af knob (Ring's fotos er ©); knob testes via anvendelse/tekst.
- Ingen motorlære (SKS kap. 21) og kapsejlads (kap. 22) i denne omgang.
- Ingen ny verify-harness; scenario-tegninger gennemses manuelt via screenshots.
