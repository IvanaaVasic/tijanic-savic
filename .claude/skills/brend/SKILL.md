---
name: brend
description: Use when working on anything visual on the Tijanić Savić site — components, CSS Modules, colors, hex values, typography, type scale, spacing, logo, gold dividers, images, or user-facing copy in Serbian or English. Also when choosing a font, picking a text size, or writing text a visitor will read.
---

# Vizuelni identitet — Tijanić Savić

## Ukratko

Advokatska kancelarija, dve advokatice, Beograd. Identitet stoji na tri
elementa koja se stalno ponavljaju: **teški serif**, **proređeni verzali** i
**zlatna hairline linija**. Taj trojac je potpis brenda — ako ga nema na
ekranu, ne izgleda kao Tijanić Savić.

Ton je miran i ozbiljan. Ništa nije zaobljeno, ništa ne baca senku, ništa se
ne preliva. `border-radius: 0` svuda, bez `box-shadow`, bez gradijenata.
Jedini izuzetak od „bez gradijenata" su ravne dijagonalne pruge koje stoje
kao placeholder za fotografije i mapu.

**Merodavan izvor je `docs/design/design.md`**, uz makete `desktop.png` (1280)
i `mobile.png` (390). Tamo stoji kompletan raspored po sekcijama, sa svim
paddinzima i mobilnim varijantama. Ovaj skill pokriva identitet — boje, slova,
linije, copy — i prepisuje vrednosti iz design.md; ako se njih dvoje ikad
raziđu, design.md je u pravu i ovaj fajl treba popraviti.

Jedna kvaka: `docs/design/` je gitignorovan i postoji samo lokalno. Zato ovaj
skill i `app/tokens.css` moraju da nose sve vrednosti koje su potrebne za rad —
neko ko klonira repo neće imati design.md pred sobom.

---

## Logo, za onoga ko ga nije video

**Monogram.** Veliko `T` i veliko `S` u visokokontrastnom serifu — debele
vertikale, tanke horizontale, izražene serife. `S` je preklopljeno preko
donje polovine `T`, tako da stablo slova `T` prolazi kroz `S` i izlazi ispod
njega. Nisu dva slova jedno pored drugog, nego jedan srasli znak. Sve u
zlatnoj, na providnoj podlozi.

**Horizontalni lockup** (zaglavlje): monogram → tanka **uspravna** zlatna
linija kao razdelnik → dvoredni blok teksta. Gore `TIJANIĆ SAVIĆ` u serifnim
verzalima sa vrlo širokim razmakom između slova (oko `0.24em`), dole, sitnije
i još proređenije, `ADVOKATSKA KANCELARIJA`, sa po jednom kratkom
**vodoravnom** zlatnom crticom levo i desno od natpisa.

**Vertikalni lockup** (podnožje): isti elementi, samo naslagani — monogram
gore, ispod njega ime, ispod imena natpis sa crticama sa strane.

Fajlovi: `TS-monogram-zlatna.svg` (zaglavlje), `TS-vertikalno-zlatna.svg`
(podnožje), plus zelene varijante za krem podlogu. Referentne slike:
`docs/design/Logo-horizontal.png`, `docs/design/Logo-vertical.png`.

**Šta iz logotipa prelazi na sajt:** serif za naslove, proređeni verzali za
labele, zlatna hairline linija kao razdelnik. Sam logo se ne reinterpretira —
ne prekucava se u tekst, ne menja mu se boja, ne stavlja se u krug.

---

## Boje

Sve u `app/tokens.css`, u `:root`. Taj fajl sadrži samo varijable i učitava se
pre `globals.css`. U komponentama isključivo `var(--ime)` — nikad hex.

**Dve pozadine ukupno** — zelena za stranicu, krem za panele. Kartice tima
uzimaju `--green-deep` da sednu korak od strane. Treće podloge nema.

```css
:root {
  /* površine */
  --green-alt:   #0B2F24; /* pozadina cele stranice */
  --green-deep:  #0F382C; /* kartice tima — korak od pozadine */
  --cream:       #EFECE6; /* panel svetlih sekcija */

  /* tekst */
  --ink:         #1E2622; /* telo teksta na krem */
  --grey-green:  #55605A; /* sitne labele i natpisi na krem */
  --cream-62:    rgba(239, 236, 230, 0.62); /* sporedni tekst na zelenoj */

  /* zlatna */
  --gold:        #C49A45; /* linije, romb, ispuna dugmeta, okviri */
  --gold-bright: #D4AF37; /* jedina zlatna koja sme da nosi tekst */
  --gold-50:     rgba(196, 154, 69, 0.5); /* linije razdelnika */
  --gold-70:     rgba(196, 154, 69, 0.7); /* uspravna crta u zaglavlju */

  /* linije */
  --green-line:  #1B4A3B; /* linije i okviri na tamnoj podlozi */
  --line-light:  #DFDBD3; /* linije na krem podlozi */

  /* šrafura — placeholder za fotografije i mapu */
  --stripe-dark-line:  var(--green-line);
  --stripe-dark-base:  #164034;
  --stripe-light-line: #DDE0D6;
  --stripe-light-base: #E7E9DF;
}
```

### Pazi na imena — ne pogađaj po nazivu

`--green-deep` **nije** pozadina stranice, iako ime tako zvuči. Pozadina je
`--green-alt` (`#0B2F24`), a `--green-deep` (`#0F382C`) je za kartice tima i za
tekst na krem podlozi. Imena su nasleđena i zvuče obrnuto — proveri tabelu
ispod pre nego što izabereš po osećaju.

Ova imena stoje na tri mesta — `app/tokens.css`, `CLAUDE.md` i ovaj fajl. Ako
menjaš ime, menjaj ga na sva tri odjednom, inače komponente počnu da traže
varijablu koja ne postoji.

### Gde koja boja sme, a gde ne

| Boja | Sme | Ne sme |
|---|---|---|
| `--green-alt` `#0B2F24` | pozadina stranice, tekst na zlatnom dugmetu | kao boja teksta na zelenom |
| `--green-deep` `#0F382C` | kartice tima, tekst na krem podlozi | kao pozadina cele stranice |
| `--cream` `#EFECE6` | panel svetlih sekcija, telo teksta na zelenoj | kao boja tankih linija na zelenoj — za to ide `--green-line` |
| `--ink` `#1E2622` | telo teksta na krem | bilo šta na tamnoj podlozi |
| `--grey-green` `#55605A` | mono labele i natpisi na krem | telo teksta, tekst na tamnoj |
| `--cream-62` | sporedni tekst na zelenoj (nav, legal, potpisi) | ključne informacije — telefon, mejl, adresa idu punom krem bojom |
| `--gold` `#C49A45` | linije, romb, okviri, ispuna primarnog dugmeta | **kao boja teksta, bilo gde** |
| `--gold-bright` `#D4AF37` | tekst na tamnoj podlozi — labele, aktivna stavka nav-a | na krem podlozi, u bilo kom obliku |
| `--green-line` `#1B4A3B` | linije i okviri na tamnoj | kao boja teksta — nevidljiva je |
| `--line-light` `#DFDBD3` | linije na krem | kao boja teksta |

### Kontrast — provereno računom

| Kombinacija | Odnos | Status |
|---|---|---|
| `--ink` na krem | 13.14 | AAA |
| krem na pozadini `#0B2F24` | 12.31 | AAA |
| krem na kartici `#0F382C` | 10.98 | AAA |
| `--gold-bright` na `#0B2F24` | 6.90 | AA |
| `--gold-bright` na `#0F382C` | 6.16 | AA |
| `--gold` na `#0B2F24` | 5.57 | AA |
| `--green-alt` tekst na zlatnoj ispuni | 5.57 | AA |
| `--cream-62` na `#0B2F24` | 5.62 | AA |
| `--grey-green` na krem | 5.55 | AA |
| `--gold` na `#0F382C` | 4.97 | AA, tesno |
| **`--gold` na krem** | **2.21** | **pada** |
| **`--gold-bright` na krem** | **1.78** | **pada** |

Praktično pravilo, bez računanja: **zlatna nije boja teksta.** Kad zlatan
tekst mora da postoji — labela, aktivna stavka nav-a — ide isključivo na
tamnu podlogu i tada je `--gold-bright`, ne `--gold`.

Zlatna kao **površina** je druga priča i dozvoljena je: primarno dugme ima
ispunu `--gold` i tekst `--green-alt`, što je 5.57. To je jedino puno dugme
na sajtu; svaka druga akcija je zlatni hairline okvir.

---

## Tipografija

Tri familije, sve sa Google Fonts, sve moraju da imaju **latin-ext** —
inače nema ć, č, š, ž, đ. Proveri i verzale: `ZAKAŽITE`, `PODRUČJE RADA` i
`TIJANIĆ SAVIĆ` su verzali sa dijakriticima.

**latin-ext nije dovoljan — pogledaj kako font stvarno crta kvačice.** Makete
traže Cormorant Garamond i on ima latin-ext, ali kvačicu na malom **č, š, ž** i
akcenat na **ć** postavlja previsoko i pomereno udesno; na 76px u heroju se
znak odvoji od slova i seče o vrh reda. Velika slova (Č Š Ž Ć) i **đ** su
ispravna, pa se greška lako previdi ako gledaš samo `TIJANIĆ SAVIĆ`.
`Cormorant` ima istu manu. Zato je na sajtu **EB Garamond** — isti garamond rod,
sve dijakritike na mestu.

Test pre nego što uvedeš bilo koji novi font: ispiši `čaša podrška Žužić Tijanić`
u toj familiji, na 60px i naviše, i pogledaj sedi li kvačica na slovu.

| Familija | Uloga | Težine |
|---|---|---|
| EB Garamond | naslovi, ime kancelarije, veliki brojevi | `--weight-hero` 400, `--weight-heading` 400, `--weight-wordmark` 500 |
| IBM Plex Sans | sav tekući tekst | `--weight-body` 300 |
| IBM Plex Mono | brojevi sekcija, eyebrow labele, telefon i mejl, dugmad | 400 |

Iz maketa dolaze samo te težine. `--weight-body-strong` (600) je dodatak koji
makete nemaju — služi jedino za „podebljano" koje advokatice mogu da uključe
u Sanityju.

Mono ide **uvek u verzalima**, sa razmakom između slova `0.12em`–`0.26em`.
Mono malim slovima ne postoji u ovom sistemu.

### Skala

Jedinice su pikseli. `line-height` ostaje bez jedinice.

Brojevi ispod stoje kao tokeni u `app/tokens.css` — u komponentu ide
`font-size: var(--text-h2)`, ne `font-size: 38px`. Mobilne varijante nose
sufiks `-mobile`.

| Element | Token | Desktop | Ispod 900px |
|---|---|---|---|
| hero naslov | `--text-hero` | 76px / 1.14 | 42px / 1.18 |
| naslov sekcije | `--text-h2` | 38px / 1.28 | 30px / 1.26 |
| naslov kontakta | `--text-contact` | 36px | 28px / 1.26 |
| ime advokatice | `--text-name` | 32px | 29px |
| broj u statistici | `--text-stat` | 34px | — (statistika se izostavlja) |
| uvodni pasus | `--text-lead` | 19px / 1.75 | 16px / 1.78 |
| ime kancelarije u zaglavlju | `--text-wordmark` | 21px | 13px |
| uvodni pasus | `--text-lead` | 19px / 1.75 | 16px / 1.78 |
| telo teksta | `--text-body` | 17px / 1.85 | 15.5px |
| podatak u Kontaktu | `--text-value` | 17px | 16px |
| biografija u kartici | `--text-card` | 16px / 1.8 | 15.5px |
| ime uz telefon | `--text-suffix` | 14px | 13px |
| mejl i telefon u kartici | `--text-mono-contact` | 12px | — |
| mono labela | `--text-label` | 11px | 10px |
| mikro labela | `--text-micro` | 10px | 9.5px |
| natpis u zaglavlju | `--text-tagline` | 8.5px | — (izostavlja se) |

`line-height` ide kroz `--leading-display` (1.14), `--leading-heading` (1.28),
`--leading-lead` (1.75), `--leading-body` (1.85), `--leading-card` (1.8) i
`--leading-legal` (2), sa `-mobile` varijantama gde se razlikuju.

Razmak između slova ide kroz `--tracking-eyebrow` (0.26em),
`--tracking-name` (0.24em), `--tracking-micro` (0.24em), `--tracking-label`
(0.22em), `--tracking-button` (0.2em), `--tracking-nav` (0.18em) i
`--tracking-legal` (0.12em). Nav i dugme **nisu** isti — 0.18 naspram 0.2.

Naslovi drže `line-height` 1.14–1.28, tekući tekst 1.7–1.85. Na svaki naslov
i pasus ide `text-wrap: pretty`.

---

## Zlatna linija kao razdelnik

Dva oblika. Ne mešaj ih.

### 1. Linija sa rombom

Glavni razdelnik. Dve zlatne linije debljine **1px**, providnost `0.5`–`0.6`,
a između njih zlatan kvadrat stranice **6–7px** rotiran za 45°, sa razmakom
od 14–16px sa obe strane.

Stoji na tačno tri mesta: ispod hero naslova, na dnu krem panela, i iznad
pravnog reda u podnožju.

Širine su fiksne i imaju svoje tokene: `--divider-hero` (340px) ispod heroja i
`--divider-footer` (420px) u podnožju, a na mobilnom `--divider-hero-mobile`
(180px) i `--divider-footer-mobile` (200px) — dve različite vrednosti, ne jedna.
Unutar krem panela linije se šire da popune raspoloživu širinu.

```css
.rule {
  display: flex;
  align-items: center;
  gap: 15px;
  width: var(--divider-hero);
}

.rule::before,
.rule::after {
  content: "";
  flex: 1;
  height: var(--hairline);
  background: var(--gold-50);
}

.diamond {
  width: var(--diamond-size);
  height: var(--diamond-size);
  background: var(--gold);
  transform: rotate(45deg);
}
```

```html
<div class="rule" aria-hidden="true"><span class="diamond"></span></div>
```

Razdelnik je dekoracija — ide mu `aria-hidden="true"`, nikad ga ne pravi od
teksta (`———◆———`).

### 2. Goli hairline

Zlatna linija bez romba, uvek 1px:

- **uspravna**, `--hairline-vertical` (42px, na mobilnom 27px), boja
  `--gold-70` — između monograma i imena u zaglavlju
- **vodoravna**, `--hairline-tagline` (14px) — sa obe strane natpisa
  `ADVOKATSKA KANCELARIJA`
- **vodoravna**, `--hairline-role` (16px) — ispred labele `ADVOKAT` u kartici
  advokatice
- **okvir**, `--border-gold` — dugme sa telefonom u zaglavlju i sekundarna
  dugmad

Linije koje samo dele sadržaj, a nisu ukras, **nisu zlatne**: na tamnoj
podlozi su `--green-line`, na krem podlozi `--line-light`.

Zlatna linija je uvek 1px. Nema 2px zlatne linije, nema zlatne linije preko
cele širine ekrana, nema zlatnog okvira oko sekcije.

---

## Ostali tokeni

Boje i slova nisu jedino što stoji u `app/tokens.css`. Pre nego što upišeš broj
u piksele, proveri da li već ima ime.

**Razmaka nema u tokenima, i to je namerno.** Dizajn je ručno štimovan i ne
leži ni na kakvoj skali — u maketama stoje gapovi 8, 12, 14, 16, 18, 22, 26,
28, 30, 32, 38, 40, 46, 56, 72, 80. Skala od osam koraka bi te terala da 46px
zaokružiš na 40px i tiho odlutaš od dizajna. Paddinge i gapove uzimaj iz
`docs/design/design.md`, po sekciji, tačno onako kako tamo piše.

**Padding stranice** se ponavlja i zato jeste token — `--pad-page-x` (64px) i
`--pad-page-x-mobile` (24px) za sadržaj preko cele širine, `--pad-panel-x`
(64px) i `--pad-panel-x-mobile` (16px) za zeleni pojas oko krem panela.
Zaglavlje: `--pad-nav-y` (32px), `--pad-nav-y-mobile` (20px) i
`--pad-nav-x-mobile` (22px) — na mobilnom je zaglavlje uže od ostatka strane.

**Najveća širina sadržaja** — `--content-max` (1440px). Maketa je crtana na
1280, ali sajt na širem ekranu ne treba da se razvlači u nedogled: preko 1440px
sadržaj staje i seda na sredinu. Ograničava se **samo sadržaj** — zelena
pozadina, linija ispod zaglavlja i linija iznad podnožja i dalje idu od ivice do
ivice, inače linija visi kao patrljak u sredini ekrana. Stoji na `.bar` u
Headeru, na `.wrapper` u About i Contact i na `.section` u Timu; Hero, Footer i
404 su centrirane kolone i njima ne treba.

Ovo nije vrednost iz maketa nego dogovorena dopuna — u `design.md` je nema.

**Širine teksta** — `--measure` (900px) za hero naslov, `--measure-lead`
(640px) za uvodni pasus, `--measure-text` (720px) za tekstualnu kolonu u
sekciji O nama. Tri različite mere, ne jedna.

**Visina zaglavlja** — `--header-height` (112px) i `--header-height-mobile`
(74px). Na tome stoji `scroll-margin-top` za sidra `#o-nama`, `#tim` i
`#kontakt`, da naslov ne završi ispod zaglavlja.

**Dodirne mete** — `--tap-min` (44px) je minimum na mobilnom.

**Okviri** — `--border-dark` na zelenoj, `--border-light` na krem,
`--border-gold` za dugmad i sekundarne akcije. Sva tri su `1px solid`; debljina
je `--hairline` i nema druge. `--radius` je 0 i takav ostaje.

**Fokus** — `outline: var(--border-gold)` uz `outline-offset:
var(--focus-offset)`. Već stoji globalno u `globals.css`, pa komponenta to
dira samo ako mora da pomeri offset.

**Šrafura** — dijagonalne pruge pod 45°, `--stripe-width` (6px) pune pa 6px
prazne. Na tamnom `--stripe-dark-line` preko `--stripe-dark-base`, na mapi
`--stripe-light-line` preko `--stripe-light-base`. Svaka šrafura nosi mono
potpis u donjem levom uglu, `--text-micro`, koji opisuje šta tu treba da stoji.

**Logo** — `--logo-mono-nav` (48px) i `--logo-mono-nav-mobile` (34px) za
monogram u zaglavlju, `--logo-vertical-footer` (132px) i
`--logo-vertical-footer-mobile` (104px) za lockup u podnožju.

---

## Jedina animacija na sajtu

Blok se podigne 16px i pojavi se kad uđe u kadar, jednom. To je sve — i to je
dogovoreno, nije proizvoljno dodato. **Paralaks je odbijen**: traži transformaciju
vezanu za svaki frejm skrola i vizuelno je efekat agencije, a ovde ništa ne baca
senku i ništa se ne preliva.

Tokeni: `--reveal-duration` (550ms), `--reveal-rise` (16px), `--reveal-stagger`
(80ms između dve kartice u istom redu), `--reveal-ease`
(`cubic-bezier(0.22, 1, 0.36, 1)`), `--draw-duration` (700ms) i `--draw-delay` za
zlatni razdelnik.

Radi kroz `components/Reveal`, koji renderuje sam element (`div` ili `li`), ne
omotač oko njega. Tri pravila koja ne smeju da se pokvare:

1. **Mirno stanje je vidljivo.** Skrivanje dodaje JS i niko drugi — bez
   JavaScripta i za pretraživač stranica se čita ista.
2. Blok koji je već prešao liniju okidanja (88% visine ekrana) se ne dira, da ne
   bi bljesnuo prazan posle učitavanja.
3. `prefers-reduced-motion` znači **da se ne skriva uopšte**, ne bržu animaciju.
   Isto važi za štampu — štampa ne skroluje, pa bi listovi izašli prazni.

Zlatni razdelnik unutar takvog bloka **iscrtava se iz sredine**: romb se pojavi,
dve linije istrče od njega ka spolja. To radi preko `[data-reveal="hidden"]` u
`Divider.module.css` — atribut, ne klasa, jer CSS Modules ne heširaju atributske
selektore pa stanje iz Reveala stiže do Dividera. Razdelnik kreće tek pošto je
blok stigao (`--draw-delay`), inače bi se crtao ispod fejda i niko ga ne bi video.

Sve preko ovoga i dalje pada pod „animacija koju niko nije tražio".

---

## Copy

Srpski, latinica, sa dijakriticima. URL-ovi i mejl adrese bez njih.

Publika su fizička lica i male firme kojima treba advokat. Piše se mirno i
konkretno: šta kancelarija radi, ko vodi predmet, koliko košta. Bez
marketinškog jezika, bez „inovativnih rešenja", bez uzvičnika.

Dve konvencije koje se vide kroz ceo dizajn i treba ih poštovati:

- **Naslovi se završavaju tačkom.** „Kancelarija je osnovana 2016. godine u
  Beogradu." „Kancelarija se nalazi u centru Beograda."
- **Razdvajanje ide srednjom tačkom `·`, opseg crtom `—`.**
  `BEOGRAD · OSNOVANA 2016.`, `Radnim danima 09—17`. Ne minus, ne `|`.

<Good>
Bavimo se ugovornim pravom, radnim sporovima, prometom nekretnina, naplatom
potraživanja i zastupanjem u sudskim postupcima.

Predmet vodi advokat sa kojim ste razgovarali na prvom sastanku. Troškovi se
dogovaraju unapred, u skladu sa Advokatskom tarifom.
</Good>

<Bad>
Inovativna pravna rešenja za vaš biznis! Naš tim vrhunskih stručnjaka
pruža sveobuhvatnu pravnu podršku 24/7. Kontaktirajte nas već danas!
</Bad>

Ako tekst nedostaje — pitaj. Ne piši „Lorem ipsum" ni izmišljene biografije.

---

## Ispravno i neispravno

**Boja kroz varijablu, ne hex**

<Good>
```css
.title {
  color: var(--cream);
  border-bottom: 1px solid var(--green-line);
}
```
</Good>

<Bad>
```css
.title {
  color: #EFECE6;
  border-bottom: 1px solid #1B4A3B;
}
```
</Bad>

**Zlatna kao linija, ne kao tekst**

<Good>
```css
.sectionLabel {
  color: var(--gold-bright); /* na tamnoj podlozi */
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
```
</Good>

<Bad>
```css
.panelLabel {
  color: var(--gold); /* na krem — kontrast 2.21, nečitko */
}
.heading {
  color: var(--gold-bright); /* zlatan naslov na krem — 1.78 */
}
```
</Bad>

**Pikseli, ravne ivice, bez senke**

<Good>
```css
.card {
  padding: 34px 36px 36px;
  background: var(--green-deep);
  border: var(--border-dark);
}
```
</Good>

<Bad>
```css
.card {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s;
}
```
</Bad>

**Vidljiv fokus na svakom interaktivnom elementu**

<Good>
```css
.link:focus-visible {
  outline: 1px solid var(--gold);
  outline-offset: 4px;
}
```
</Good>

<Bad>
```css
.link:focus {
  outline: none;
}
```
</Bad>

---

## Crvene zastavice — stani i proveri

- Zlatan tekst na krem podlozi, u bilo kom obliku
- `--gold` kao boja teksta bilo gde — čak i na tamnoj podlozi ide `--gold-bright`
- Hex vrednost u `.module.css` fajlu
- Broj u pikselima tamo gde token već postoji — `font-size: 38px` umesto
  `var(--text-h2)`, `1px solid var(--green-line)` umesto `var(--border-dark)`
- Treća pozadinska boja — postoje tačno dve, zelena i krem
- Zaokružen razmak „da bude na skali" — 46px je 46px, ne 40px
- Varijabla sa prefiksom `--ts-` — taj prefiks je uklonjen, imena su gola
- `rem` umesto `px` (osim `line-height`, koji je bez jedinice)
- `border-radius` različit od nule, `box-shadow`, gradijent
- Zlatna linija deblja od 1px
- Razdelnik napravljen od teksta umesto od elemenata
- Mono font malim slovima ili bez `letter-spacing`
- Font bez latin-ext podrške
- Animacija koju niko nije tražio — reveal i iscrtavanje razdelnika su jedini
  dogovoreni, sve preko toga stani i pitaj
- Naslov bez tačke na kraju
- `outline: none` bez zamene

## Izvori

- `docs/design/design.md` — **merodavan izvor**: raspored po sekcijama, svi paddinzi, mobilne varijante. Gitignorovan, postoji samo lokalno
- `docs/design/desktop.png` (1280), `docs/design/mobile.png` (390) — referentne makete
- `docs/design/Logo-horizontal.png`, `docs/design/Logo-vertical.png` — logotip
- `app/tokens.css` — sve varijable; prepisano iz design.md, jedini izvor vrednosti u kodu
- `CLAUDE.md` — pravila projekta (stack, deploy, dvojezičnost); za boje i dimenzije prati design.md
