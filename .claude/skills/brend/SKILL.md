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

Kompletan raspored po sekcijama, sa svim paddinzima, stoji u
`docs/design/design.md`. Ovaj skill pokriva identitet — boje, slova, linije,
copy — ne raspored.

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

Sve u `app/globals.css`, u `:root`. U komponentama isključivo `var(--ime)` —
nikad hex.

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

  /* linije */
  --green-line:  #1B4A3B; /* linije i okviri na tamnoj podlozi */
  --line-light:  #DFDBD3; /* linije na krem podlozi */
}
```

### Pazi na imena — ne pogađaj po nazivu

`--green-deep` **nije** pozadina stranice, iako ime tako zvuči. Pozadina je
`--green-alt` (`#0B2F24`), a `--green-deep` (`#0F382C`) je za kartice tima.
CLAUDE.md opisuje `#0F382C` kao dominantnu površinu, ali izvedeni dizajn radi
obrnuto; mokapi u `docs/design/` su merodavni. Ako ikad menjaš ova imena,
menjaj ih u oba fajla odjednom.

Iz istog razloga su kontrastni brojevi u CLAUDE.md niži od stvarnih — mereni
su prema `#0F382C`. Tabela ispod daje oba, a pravilo prati **lošiji** broj.

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

| Familija | Uloga | Težine |
|---|---|---|
| Cormorant Garamond | naslovi, ime kancelarije, veliki brojevi | 300 hero, 400 naslovi sekcija, 500 wordmark |
| IBM Plex Sans | sav tekući tekst | 300 |
| IBM Plex Mono | brojevi sekcija, eyebrow labele, telefon i mejl, dugmad | 400 |

Mono ide **uvek u verzalima**, sa razmakom između slova `0.12em`–`0.26em`.
Mono malim slovima ne postoji u ovom sistemu.

### Skala

Jedinice su pikseli. `line-height` ostaje bez jedinice.

| Element | Desktop | Ispod 768px |
|---|---|---|
| hero naslov | 76px / 1.14 | 42px / 1.18 |
| naslov sekcije | 38px / 1.28 | 30px / 1.26 |
| naslov kontakta | 36px | 28px / 1.26 |
| ime advokatice | 32px | 29px |
| broj u statistici | 34px | — (statistika se izostavlja) |
| uvodni pasus | 19px / 1.75 | 16px / 1.78 |
| telo teksta | 17px / 1.85 | 15.5px |
| tekst u kartici | 16px / 1.8 | 15.5px |
| mono labela | 11px | 10px |
| mikro labela | 8.5–10px | 9.5px |

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

Širine su fiksne: **340px** ispod heroja, **420px** u podnožju, **180–200px**
na mobilnom. Unutar krem panela linije se šire da popune raspoloživu širinu.

```css
.rule {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 340px;
}

.rule::before,
.rule::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--gold);
  opacity: 0.55;
}

.diamond {
  width: 6px;
  height: 6px;
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

- **uspravna**, 42px visine, providnost 0.7 — između monograma i imena u zaglavlju
- **vodoravna**, 14px — sa obe strane natpisa `ADVOKATSKA KANCELARIJA`
- **vodoravna**, 16px — ispred labele `ADVOKAT` u kartici advokatice
- **okvir** — dugme sa telefonom u zaglavlju i sekundarna dugmad

Linije koje samo dele sadržaj, a nisu ukras, **nisu zlatne**: na tamnoj
podlozi su `--green-line`, na krem podlozi `--line-light`.

Zlatna linija je uvek 1px. Nema 2px zlatne linije, nema zlatne linije preko
cele širine ekrana, nema zlatnog okvira oko sekcije.

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
  border: 1px solid var(--green-line);
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
- `rem` umesto `px` (osim `line-height`, koji je bez jedinice)
- `border-radius` različit od nule, `box-shadow`, gradijent
- Zlatna linija deblja od 1px
- Razdelnik napravljen od teksta umesto od elemenata
- Mono font malim slovima ili bez `letter-spacing`
- Font bez latin-ext podrške
- Animacija koju niko nije tražio
- Naslov bez tačke na kraju
- `outline: none` bez zamene

## Izvori

- `docs/design/design.md` — raspored po sekcijama, svi paddinzi, mobilne varijante
- `docs/design/desktop.png`, `docs/design/mobile.png` — referentni mokapi
- `docs/design/Logo-horizontal.png`, `docs/design/Logo-vertical.png` — logotip
- `CLAUDE.md` — pravila projekta; kod boja poštuj hex vrednosti, ali uloge površina uzmi odavde
