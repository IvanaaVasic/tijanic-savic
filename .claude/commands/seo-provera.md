---
description: Prolazi kroz SEO checklist za ceo sajt i prijavljuje šta nedostaje
---

Uradi SEO reviziju sajta. Za svaku rutu proveri i prijavi status:

Metapodaci

metadata export postoji i vuče vrednosti iz Sanityja
title je jedinstven i ispod 60 karaktera
description je jedinstven, 120–160 karaktera, i sadrži lokaciju
openGraph i twitter postavljeni, sa slikom 1200x630

Struktura

Tačno jedan h1 po stranici
Hijerarhija naslova bez preskakanja nivoa
Semantički elementi umesto div gde ima smisla

JSON-LD

LegalService na početnoj: naziv, adresa, telefon, radno vreme, areaServed
Attorney za svaku advokaticu na Tim stranici
Validan JSON, bez praznih polja

Tehnički

sitemap.ts generiše sve rute, u obe jezičke verzije
robots.ts dozvoljava indeksiranje i pokazuje na sitemap
Kanonski URL postavljen, bez www duplikata
Svaka slika ima alt koji nije prazan i nije naziv fajla

Dvojezičnost

lang na <html> odgovara aktivnom jeziku (sr-Latn ili en)
alternates.languages postavljen na svakoj ruti, sa x-default koji pokazuje na srpsku verziju
Hreflang veze idu u oba smera — srpska pokazuje na englesku i obrnuto
Kanonski URL pokazuje na sopstvenu jezičku verziju
/ vraća 301 na /sr, ne meta refresh
Prekidač za jezik je <a href> i vodi na istu stranicu
Nijedna engleska stranica nije prazna zbog neprevedenog polja
Nema srpskog teksta zaostalog na engleskoj verziji koji nije namerno neprevodiv (imena, adresa)

Izlistaj nalaze kao tabelu: ruta, stavka, status, šta popraviti. Ne popravljaj ništa dok ne odobrim — prvo mi daj nalaz.
