# Tijanić Savić — advokatska kancelarija

Prezentacioni sajt za advokatsku kancelariju sa dve advokatice.
Sadržaj uređuju same, kroz Sanity Studio.

## Stack

- Next.js (App Router) + TypeScript
- CSS Modules — jedan `.module.css` uz svaku komponentu
  (`Button.tsx` + `Button.module.css`). Bez Tailwinda, bez CSS-in-JS,
  bez gotovih UI biblioteka.
- Jedinice u **pikselima**, ne `rem` — i za font, i za razmake, i za
  breakpointe. Izuzetak je `line-height`, koji ostaje bez jedinice.
- Boje i tipografska skala kao CSS varijable u globalnom fajlu;
  komponente ih koriste, ne prepisuju hex vrednosti.
- Sanity v3 kao CMS, Studio embedovan na `/studio`
- Sanity šeme žive u ovom repou (`/sanity/schemas`)
- Statički build (`output: 'export'`), deploy okida Sanity webhook
- Dvojezičan: srpski (primarni) i engleski

Verzije

next 15.x · react / react-dom 19.x · sanity 3.x · next-sanity 12.x · Node 20+

Namerno ostajemo na Next 15, ne na 16 — dokazana kombinacija sa Sanityjem. Ne nadograđuj major verzije bez dogovora.

Paket menadžer

Yarn, ne npm. Uvek yarn dev, yarn build, yarn add <paket>, yarn lint. Nikad npm install ni npm run dev.

U repou stoji yarn.lock; package-lock.json ne sme da postoji. Ako ga zatekneš, obriši ga.

Statički export — šta to znači u kodu

Sajt se builduje u obične fajlove. Zato:

Nema middleware / proxy, nema Route Handlera, nema API ruta
images: { unoptimized: true } — slike idu kroz Sanity CDN i @sanity/image-url, koji ionako radi bolje transformacije
redirects iz next.config se ne primenjuju — idu u vercel.json ili \_redirects, zavisno od hostinga
Ne koristi <SanityLive> ni defineLive — to traži živ server
Sadržaj se čita u build-time; izmena u Sanityju je vidljiva tek posle novog builda, koji okida webhook
Studio na /studio

Studio stoji na /studio, u ovom projektu, kroz next-sanity i NextStudio. Uz statički export ima tri pravila:

Catch-all ruta app/studio/[[...tool]]/page.tsx
U toj ruti: export const dynamic = 'force-static' i export function generateStaticParams() { return [{ tool: [] }] }
Studio je klijentska aplikacija — sam rešava svoje podrute u browseru. Hosting mora sve pod /studio/\* da servira isti index.html, inače osvežavanje stranice u Studiju vraća 404. Na Vercelu to je rewrite u vercel.json, na Cloudflare-u linija u \_redirects sa statusom 200.

Bez tog trećeg pravila Studio radi dok klikćeš, a puca čim neko pritisne F5. To je jedini stvarni problem i rešava se jednom linijom.

Dodaj i robots pravilo da se /studio ne indeksira.

Ton i publika

Klijenti su fizička lica i male firme koje traže advokata. Nisu tehnički. Sajt mora da deluje ozbiljno, mirno i pouzdano — ne startap, ne agencija. Bez marketinškog jezika, bez "inovativnih rešenja", bez ikonica koje ne znače ništa.

Copy pišeš na srpskom, latinica, sa dijakriticima (ć, č, š, ž, đ). URL-ovi i mejl adrese bez dijakritika.

Brend

Merodavan izvor za boje, dimenzije i tipografiju je docs/design/design.md, uz makete desktop.png i mobile.png. Sve vrednosti odatle prepisane su u app/tokens.css i u skill „brend" — taj folder je gitignorovan i postoji samo lokalno, pa ta dva fajla moraju da nose pune vrednosti. Ako se razilaze, design.md je u pravu.

Boje (iz postojećeg vizuelnog identiteta — logo, vizit karte, rokovnik):

--green-alt: #0B2F24 /_ pozadina cele stranice _/
--green-deep: #0F382C /_ kartice tima; tekst na krem podlozi _/
--green-line: #1B4A3B /_ sve linije i okviri na tamnoj podlozi _/
--gold: #C49A45 /_ akcenat: linije, monogram, okviri, ispuna dugmeta _/
--gold-bright: #D4AF37 /_ samo kad zlatna mora da nosi tekst _/
--cream: #EFECE6 /_ panel svetlih sekcija; telo teksta na zelenoj _/
--ink: #1E2622 /_ telo teksta na krem _/
--grey-green: #55605A /_ sitne labele i natpisi na krem _/
--line-light: #DFDBD3 /_ linije na krem podlozi _/

Pazi: pozadina stranice je --green-alt, ne --green-deep, iako ime zvuči obrnuto. Pozadine su tačno dve — zelena za stranicu, krem za panele; kartice tima uzimaju --green-deep da sednu korak od strane.

Zlatna nije boja teksta. Kontrast zlatne na krem podlozi je 2.21 — pada svaki standard. Zlatna služi za linije, monogram i dekorativne detalje. Ako zlatan tekst mora da postoji, ide isključivo na tamnu podlogu i tada koristi --gold-bright (6.90 na pozadini stranice), ne --gold (5.57).

Provereni odnosi: --ink na krem 13.14 · krem na pozadini #0B2F24 12.31 · krem na kartici #0F382C 10.98 · --grey-green na krem 5.55 · --cream-62 na pozadini 5.62. Sve su bezbedne za tekst.

Logo je monogram TS u visokokontrastnom serifu, uz ime u proređenim verzalima i tanku zlatnu liniju kao razdelnik. Taj odnos — teški serif pored proređenih verzala pored hairline zlatne linije — je vizuelni potpis brenda i treba da se oseti u tipografiji sajta.

Tipografija — tri familije, sve sa Google Fonts, sve moraju da podržavaju Latin Extended-A (naša slova). Proveri svaki font pre nego što ga uvedeš.

EB Garamond — naslovi, ime kancelarije, veliki brojevi. Težine 400, 500

Makete traže Cormorant Garamond, ali on ne valja za naš jezik: kvačica na malom č, š, ž i akcenat na ć lebde iznad slova i pomereni su udesno, pa se u heroju na 76px odvoje od slova i seku o vrh reda. Velika slova i đ su ispravna, zato se lako previdi. Isto važi i za `Cormorant` — provereno. EB Garamond je isti garamond rod i sve crta kako treba. Nema težinu 300, pa je `--weight-hero` 400.
IBM Plex Sans — sav tekući tekst. Težina 300
IBM Plex Mono — oznake sekcija, labele, telefon i mejl, dugmad. Težina 400, uvek verzali sa letter-spacingom 0.12em–0.26em

Skala je u pikselima, od hero naslova 76px do natpisa u zaglavlju 8.5px, i stoji kao --text-\* tokeni. Cela tabela sa mobilnim varijantama je u skillu „brend".

Strukture sajta

Tri sekcije, jedna stranica ili tri rute — odluči i obrazloži:

O nama — kratak opis kancelarije, oblasti prava
Tim — dve advokatice: ime, titula, biografija, foto, mejl, telefon
Kontakt — adresa, mapa, telefoni, mejlovi

Faza 1 (sada): imena, telefoni, mejlovi, lokacija sa mapom. Faza 2 (sredina septembra): biografije i fotografije. Piši šeme i komponente tako da faza 2 ne traži prepravku — polja postoje, samo su prazna.

Dvojezičnost

Srpski je primarni jezik, engleski je drugi. Prekidač za jezik stoji u zaglavlju.

Rutiranje

Srpski je podrazumevan i stoji na korenu, bez prefiksa. / je srpska verzija, /en/ engleska. Prefiks ima samo engleski.
Dve obične rute, bez dinamičkog segmenta: app/(sr)/page.tsx i app/(en)/en/page.tsx. Svaka grupa ima svoj root layout, a zajedničko — html, fontovi, zaglavlje i podnožje — stoji u components/SiteShell.
Ne vraćaj [locale] ni catch-all rutu. Uz output: 'export' Next u dev režimu baca grešku na svaku adresu koja nije u generateStaticParams, pa se 404 stranica ne vidi dok se radi.
/sr i /sr/\* preusmeravaju na / sa 301 — zbog ranije verzije rutiranja, da stari linkovi ne puknu.
Ugrađeni i18n iz next.config NE radi sa App Routerom ni sa statičkim exportom — ne pokušavaj

404

app/global-not-found.tsx renderuje ceo dokument, sa svojim <html lang>. Traži experimental.globalNotFound u next.config — bez toga Next umota 404 u generisani root layout koji nema lang, a ovaj projekat nema svoj app/layout.tsx jer su (sr), (en) i (studio) tri odvojena korena.
Statički export od toga pravi out/404.html, koji i Cloudflare Pages i Vercel serviraju sami. Jedan fajl služi sve nepostojeće adrese, pa stranica ne zna sa kog je jezika posetilac došao — zato nosi oba jezika i dva linka na početnu.

Jezik koda

Kod je na engleskom: imena komponenti, fajlova, funkcija, promenljivih, CSS klasa i komentara. Srpski u kodu ostaje samo tamo gde je sadržaj — tekst koji posetilac vidi ili čuje kroz čitač ekrana, i natpisi u Sanity Studiju koje čitaju advokatice.
Izuzetak su imena polja i tipova u Sanity šemama (podesavanja, nazivKancelarije, oNama…). Ona su zapisana u bazi zajedno sa sadržajem, pa bi preimenovanje osirotelo sve što je uneto. Ostaju na srpskom dok se ne uradi migracija.

Prekidač za jezik

Mora biti pravi <a href>, ne dugme sa JS-om — pretraživač treba da može da ga prati
Vodi na istu stranicu na drugom jeziku, ne na početnu
Prikazuje "SR / EN", bez zastavica (zastavica označava državu, ne jezik)

Prevodi u Sanityju — na nivou polja, ne dokumenta

Napravi ponovo upotrebljive tipove lokalniTekst, lokalniNaslov i lokalniBlok, svaki sa poljima sr i en. Advokatice tada u jednom dokumentu vide oba jezika jedno pored drugog i teže je zaboraviti prevod.

Ne uvodi @sanity/document-internationalization. Za sajt sa tri stranice udvostručava broj dokumenata bez ikakve dobiti.

Šta se NE prevodi — imena, adresa, telefoni, mejlovi. To su ista polja za oba jezika. Prevode se samo naslovi, opisi, biografije, oblasti prava i navigacija.

Rezervni jezik — ako en nije popunjen, prikaži sr umesto praznog mesta. Nikad ne renderuj praznu sekciju. U Studiju polje en neka ima description koji upozorava da će, ako ostane prazno, posetilac videti srpski tekst.

Sanity — pravila
Sve što je tekst na sajtu mora biti editabilno. Ništa hardkodovano osim labela u navigaciji.
Šeme drži jednostavnim. One nisu tehničke — polja imaju jasna srpska imena i description koji objašnjava gde se to vidi na sajtu.
Svaka stranica ima SEO objekat: title, description, ogImage.
Slike kroz Sanity image pipeline, sa alt poljem koje je obavezno.
SEO
metadata API po ruti, ne next/head
sitemap.ts i robots.ts
JSON-LD: LegalService za kancelariju, Attorney za svaku advokaticu
lang na <html> prati aktivni jezik: sr-Latn ili en
alternates.languages na svakoj ruti — hreflang veza između srpske i engleske verzije, plus x-default koji pokazuje na srpsku
Sitemap sadrži obe jezičke verzije svake stranice
Kanonski URL pokazuje na sopstvenu jezičku verziju, ne na srpsku
Semantički HTML: jedan h1 po stranici, prava hijerarhija
Slike sa width/height, moderni formati
Stilovi
CSS Modules, bez Tailwinda i bez CSS-in-JS
Svaka komponenta ima svoj fajl: Button.tsx + Button.module.css
Dva globalna fajla i ništa više: app/tokens.css drži samo :root varijable, app/globals.css samo reset i osnovnu tipografiju. Tokeni se uvoze prvi.
Boje, tipografska skala, padding stranice, širine teksta i linije su CSS varijable. Nikad hardkodovana hex vrednost u komponenti.
Razmaci između elemenata namerno nisu tokeni — dizajn je ručno štimovan i ne leži na skali. Gapove i paddinge sekcija uzimaj iz design.md, tačno onako kako tamo piše, i ne zaokružuj ih.
Jedinice u pikselima, ne rem
Klase imenuj po ulozi u komponenti (.wrapper, .title, .meta), ne po izgledu (.greenBox, .big)
Media query-ji mobile-first, min-width
Kvalitet — pod ispod kog se ne ide
Responsive od 320px naviše, mobile-first
Vidljiv focus state na svakom interaktivnom elementu
prefers-reduced-motion poštovan
Kontrast minimum WCAG AA
Lighthouse: 95+ na sve četiri kategorije
Bez any u TypeScriptu
Deploy

Build je statički (output: 'export') — nema Node servera u produkciji. Zato ne treba nikakav Cloudflare adapter i sajt radi identično na Cloudflare Pages i na Vercelu.

Cloudflare Pages — produkcija, kad se okači pravi domen
Vercel — isti repo, paralelno, za preview dok se sajt pokazuje kancelariji
Oba povezana na GitHub, build na push

Pošto je sadržaj zapečen u build-time, izmena u Sanityju se ne vidi sama od sebe. Sanity webhook zove Cloudflare Deploy Hook na publish, što pokreće novi build. Kašnjenje je minut do dva i to je očekivano — nemoj to "rešavati" prelaskom na ISR ili client-side dohvatanje.

\_redirects fajl na hostingu vodi /sr na / sa 301 i servira /studio/\* iz jednog index.html. Isto stoji i u vercel.json, za preview.

Šta ne raditi
Ne dodavati animacije koje nisu tražene — postoji tačno jedna, `components/Reveal` (blok se podigne i pojavi kad uđe u kadar, plus zlatni razdelnik koji se iscrtava). Paralaks je razmatran i odbijen. Detalji u skillu „brend"
Ne uvoditi biblioteku za nešto što je 20 linija CSS-a
Ne pisati placeholder copy tipa "Lorem ipsum" — ako fali tekst, pitaj
Ne menjati boje brenda
