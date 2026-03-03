# gramatiCat 🐱

**Aplicació web de pràctica de llengua catalana per a alumnes de Cicle Superior de Primària i ESO.**

[**Demo en viu**](https://aaronFortuno.github.io/gramatiCat/)

gramatiCat és una eina educativa interactiva que permet als alumnes practicar gramàtica, ortografia, lèxic i sintaxi catalana de manera autònoma i gamificada.

## Característiques

- **4 categories**: Gramàtica, Ortografia, Lèxic i Sintaxi
- **4 tipus d'exercicis**: multi-opció, omplir buits, arrossegar i classificar, classificació de paraules
- **Gamificació**: ratxes de respostes correctes, temporitzador i medalles
- **Estadístiques locals**: percentatge d'encerts per categoria, temps dedicat i evolució
- **Admin Previewer**: previsualitza exercicis JSON abans d'afegir-los al repositori
- **Sense servidor**: funciona completament a GitHub Pages amb localStorage

## Stack tecnològic

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7 (HashRouter)
- @dnd-kit (drag & drop)
- Recharts (gràfics)

## Instal·lació local

```bash
# Clonar el repositori
git clone https://github.com/aaronFortuno/gramatiCat.git
cd gramatiCat

# Instal·lar dependències
npm install

# Iniciar servidor de desenvolupament
npm run dev

# Executar tests
npm run test
```

## Afegir exercicis

Els exercicis són fitxers JSON dins de `public/exercicis/{categoria}/{tema}/`. Per afegir-ne un de nou:

1. Crea un fitxer JSON seguint l'esquema estàndard (veure `ARCHITECTURE.md`)
2. Afegeix l'entrada al manifest `public/continguts.json`
3. Utilitza l'Admin Previewer (`#/admin`) per validar-lo abans de fer commit

## Estructura del projecte

Veure [ARCHITECTURE.md](./ARCHITECTURE.md) per a l'estructura completa de carpetes i decisions tècniques.

## Pla de desenvolupament

Veure [PLAN.md](./PLAN.md) per als estadis de desenvolupament.

## Llicència

Aquest projecte està sota la llicència [GNU General Public License v3.0](./LICENSE).

---

Fet amb estima per a l'ensenyament del català.
