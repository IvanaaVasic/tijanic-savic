---
description: Proverava kako sajt izgleda i radi na svim širinama, sa screenshotovima
---

Pokreni dev server i proveri rutu koju ti navedem (ako ne navedem, sve rute).

**Pre svakog screenshota uključi `prefers-reduced-motion: reduce`**
(`page.emulateMedia({ reducedMotion: 'reduce' })` pre `goto`). Bez toga sekcije
koje još nisu ušle u kadar stoje na `opacity: 0` — `components/Reveal` ih tako
drži — pa screenshot pune stranice izađe prazan od sekcije Tim nadole i deluje
kao da je nešto puklo. Reveal u tom režimu ne skriva ništa, pa dobijaš čist
raspored. Screenshoti služe za raspored; animacija se proverava zasebno, dole.

Napravi screenshot na svakoj od ovih širina i pogledaj ga:

320px (najuži telefon koji još podržavamo)
390px (iPhone)
768px (tablet, portret)
1024px (tablet, pejzaž / mali laptop)
1440px (desktop)
1920px (široki monitor)

Za svaku širinu prijavi:

Da li se nešto preliva van ekrana ili pravi horizontalni scroll
Da li je tekst čitljiv — minimum 16px za telo, dovoljan line-height
Da li su dugmad i linkovi minimum 44x44px na dodir
Da li razmaci deluju namerno ili se sekcije slepljuju
Da li slike drže odnos stranica i ne skaču pri učitavanju

Na 1920px dodatno: sadržaj mora da stane na `--content-max` (1440px) i sedne na
sredinu, a ne da se razvuče. Zelena pozadina, linija ispod zaglavlja i linija
iznad podnožja i dalje idu od ivice do ivice — ako se linija prekida na 1440 i
visi u sredini, to je greška.

Zatim, nezavisno od širine — ovo bez `reducedMotion`, u normalnom režimu:

Prođi ceo sajt tabom i potvrdi da se focus vidi na svakom koraku
Proveri kontrast teksta prema pozadini — minimum 4.5:1 za telo teksta
Skroluj polako kroz celu stranicu i potvrdi da se svaka sekcija na kraju
pojavila — nijedan blok ne sme da ostane na `opacity: 0`. Proveri i skok na
sidro (`#kontakt`) pa vraćanje nagore: preskočene sekcije moraju da se pojave
Uključi prefers-reduced-motion i potvrdi da animacije stanu, a da pritom ništa
ne ostane nevidljivo
Proveri da naša slova (ć, č, š, ž, đ) nisu isečena ni zamenjena

Daj mi nalaz sa screenshotovima. Popravke predloži, ali ne primenjuj dok ne kažem koje.
