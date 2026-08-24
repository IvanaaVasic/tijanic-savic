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

Boje (iz postojećeg vizuelnog identiteta — logo, vizit karte, rokovnik):

--green-deep: #0F382C /_ dominantna tamna površina _/
--green-alt: #0B2F24 /_ dublja varijanta, za slojevitost _/
--gold: #C49A45 /_ akcenat: linije, monogram, detalji _/
--gold-bright: #D4AF37 /_ samo kad zlatna mora da nosi tekst _/
--cream: #EFECE6 /_ pozadina svetlih sekcija _/
--ink: #1E2622 /_ telo teksta na svetloj podlozi _/

Zlatna nije boja teksta. Kontrast zlatne na krem podlozi je 2.21 — pada svaki standard. Zlatna služi za linije, monogram i dekorativne detalje. Ako zlatan tekst mora da postoji, ide isključivo na tamnu podlogu i tada koristi --gold-bright (6.16), ne --gold (4.97).

Provereni odnosi: krem na tamnozelenoj 10.98 · --ink na krem 13.14 · tamnozelena na krem 10.98. Sve tri su bezbedne za tekst.

Logo je monogram TS u visokokontrastnom serifu, uz ime u proređenim verzalima i tanku zlatnu liniju kao razdelnik. Taj odnos — teški serif pored proređenih verzala pored hairline zlatne linije — je vizuelni potpis brenda i treba da se oseti u tipografiji sajta.

Tipografija mora da podržava Latin Extended-A (naša slova). Proveri svaki font pre nego što ga uvedeš.

Strukture sajta

Tri sekcije, jedna stranica ili tri rute — odluči i obrazloži:

O nama — kratak opis kancelarije, oblasti prava
Tim — dve advokatice: ime, titula, biografija, foto, mejl, telefon
Kontakt — adresa, mapa, telefoni, mejlovi

Faza 1 (sada): imena, telefoni, mejlovi, lokacija sa mapom. Faza 2 (sredina septembra): biografije i fotografije. Piši šeme i komponente tako da faza 2 ne traži prepravku — polja postoje, samo su prazna.

Dvojezičnost

Srpski je primarni jezik, engleski je drugi. Prekidač za jezik stoji u zaglavlju.

Rutiranje

/sr/... i /en/..., oba sa prefiksom
app/[locale]/ sa generateStaticParams za oba jezika
Koren / preusmerava na /sr — trajno (301), kroz \_redirects fajl na hostingu, ne kroz meta refresh
Ugrađeni i18n iz next.config NE radi sa App Routerom ni sa statičkim exportom — ne pokušavaj

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
Globalne stvari samo u app/globals.css — reset, CSS varijable, @font-face. Ništa drugo.
Boje, razmaci i tipografska skala su CSS varijable u :root. Nikad hardkodovana hex vrednost u komponenti.
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

\_redirects fajl na hostingu vodi / na /sr sa 301.

Šta ne raditi
Ne dodavati animacije koje nisu tražene
Ne uvoditi biblioteku za nešto što je 20 linija CSS-a
Ne pisati placeholder copy tipa "Lorem ipsum" — ako fali tekst, pitaj
Ne menjati boje brenda
