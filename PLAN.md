# gramatiCat — Pla de Desenvolupament

## Visió General

Aplicació web estàtica (GitHub Pages) de pràctica de llengua catalana per a alumnes de Cicle Superior de Primària i ESO. Stack: **React + Vite + Tailwind CSS**. Persistència via `localStorage`. Llicència GNU GPL v3.

---

## Fase 0 — Fonaments (Esquelet)

### 0.1 Inicialització del projecte
- Crear projecte React amb Vite + TypeScript
- Configurar Tailwind CSS v4
- Configurar rutes amb React Router (HashRouter per compatibilitat amb GitHub Pages)
- Estructura de carpetes base

### 0.2 Definició del format JSON d'exercicis
- Dissenyar l'esquema JSON estàndard que serveixi per a tots els tipus d'exercici
- Tipus suportats:
  - `multiple-choice` — Multi-opció
  - `fill-in-the-blank` — Omplir buits
  - `drag-and-drop` — Arrossegar i classificar (funcions sintàctiques, categories)
  - `word-classification` — Classificació de paraules en columnes
- Crear 2 exercicis d'exemple: "Pronoms febles" i "b/v"

### 0.3 Sistema de continguts
- Crear `public/continguts.json` com a manifest central (categories → temes → exercicis)
- Estructura de carpetes: `public/exercicis/{categoria}/{tema}/{exercici}.json`
- Service per carregar i parsejar continguts dinàmicament via `fetch()`

---

## Fase 1 — Nucli Funcional

### 1.1 Navegació i Layout
- Layout principal amb menú lateral responsive (hamburger en mòbil)
- Pàgina d'inici amb les 4 categories (Gramàtica, Ortografia, Lèxic, Sintaxi)
- Vista de temes dins cada categoria (cards)
- Llista d'exercicis dins cada tema

### 1.2 Motor d'exercicis
- Component base `ExerciseRunner` que renderitza segons el `type` del JSON
- Implementar els 4 tipus d'exercici:
  - `MultipleChoice` — selecció simple/múltiple amb feedback immediat
  - `FillInTheBlank` — inputs dins del text amb validació
  - `DragAndDrop` — drag & drop amb zones target (dnd-kit)
  - `WordClassification` — arrossegar paraules a columnes
- Sistema de correcció i feedback visual (correcte/incorrecte/explicació)

### 1.3 Persistència (localStorage)
- Definir model de dades:
  ```
  {
    stats: { [categoriaId]: { encerts, errors, tempsTotal } },
    streaks: { actual, maxim, ultimaData },
    historial: [{ exerciciId, data, encerts, errors, temps }],
    medalles: [{ id, data }]
  }
  ```
- Service CRUD per localStorage amb fallback si quota excedida
- Hook `useLocalStorage` per reactivitat

---

## Fase 2 — Gamificació

### 2.1 Sistema de ratxes (Streaks)
- Comptador de respostes correctes consecutives
- Visual amb animació (flames o similar)
- Ratxa diària: exercicis fets per dia consecutiu

### 2.2 Temporitzador
- Temporitzador per exercici (opcional, configurable)
- Rellotge visible amb animació quan queda poc temps
- Bonus de puntuació per velocitat

### 2.3 Medalles i assoliments
- Medalles per categoria: bronze (50%), plata (75%), or (90%)
- Medalles especials: "Primera ratxa de 5", "10 exercicis en un dia", "Categoria completada"
- Vista de medalles amb estat (aconseguida / bloquejada)

---

## Fase 3 — Panell d'Estadístiques

### 3.1 Dashboard de l'alumne
- Percentatge d'encerts per categoria (gràfic de barres o radar)
- Temps total dedicat
- Evolució temporal (últims 7/30 dies)
- Exercicis completats vs totals per tema

### 3.2 Visualitzacions
- Gràfics amb una llibreria lleugera (recharts o chart.js)
- Heatmap d'activitat setmanal (estil GitHub)

---

## Fase 4 — Admin Previewer

### 4.1 Editor/Previewer de JSON
- Pàgina `/admin` amb editor de text (textarea o CodeMirror lite)
- Preview en temps real de l'exercici mentre s'edita el JSON
- Validació de l'esquema JSON amb missatges d'error clars
- Botó per descarregar el JSON formatejat

---

## Fase 5 — Continguts

### 5.1 Crear exercicis inicials (mínim 2-3 per tema prioritari)
- **Ortografia**: b/v, accents, l·l, apostrofació
- **Gramàtica**: pronoms febles, determinants, conjugació verbal
- **Lèxic**: sinònims/antònims, camps semàntics, barbarismes
- **Sintaxi**: subjecte/predicat, CD/CI, tipus d'oracions

### 5.2 Guia per crear exercicis
- Documentació del format JSON amb exemples
- Plantilles buides per cada tipus d'exercici

---

## Fase 6 — Tests

> Els tests s'escriuen progressivament amb cada fase, però aquesta fase final assegura cobertura completa i integració.

### 6.1 Tests unitaris (Vitest)
- **Services**: `contentService`, `storageService`, `gamificationService`
  - Carregar continguts correctament / gestionar errors de fetch
  - CRUD localStorage: guardar, llegir, actualitzar, quota excedida
  - Lògica de ratxes: incrementar, reiniciar, ratxa diària
  - Lògica de medalles: condicions d'obtenció, no duplicar
- **Hooks**: `useLocalStorage`, `useExercise`, `useStats`, `useTimer`
  - Reactivitat amb canvis de localStorage
  - Estat de l'exercici: resposta, correcció, puntuació
  - Temporitzador: inici, pausa, expiració
- **Utils**: `validation.ts`, `formatting.ts`
  - Validació JSON: esquemes vàlids, invàlids, camps obligatoris
  - Formatejadors: temps, percentatges, dates

### 6.2 Tests de components (Vitest + Testing Library)
- **Exercicis** (cada tipus):
  - `MultipleChoice`: seleccionar opció, feedback correcte/incorrecte, explicació
  - `FillInTheBlank`: escriure resposta, validació case-insensitive, buits múltiples
  - `DragAndDrop`: arrossegar element a zona, classificació correcta/incorrecta
  - `WordClassification`: arrossegar paraules a columnes, verificar resultat
- **ExerciseRunner**: renderitza el component adequat segons `tipus`
- **Layout**: Sidebar obre/tanca, navegació entre rutes, responsive
- **Gamificació**: StreakCounter mostra la ratxa, MedalBadge amb estat correcte
- **Stats**: gràfics renderitzen amb dades, estat buit mostrat correctament
- **Admin**: editor JSON, preview actualitza en temps real, validació d'errors

### 6.3 Tests d'integració
- **Flux complet d'exercici**: navegar a categoria → tema → exercici → respondre → veure feedback → estadístiques actualitzades
- **Persistència**: completar exercici → tancar → reobrir → stats persistits
- **Gamificació integrada**: respondre correctament N vegades → ratxa incrementada → medalla desbloquejada
- **Càrrega de continguts**: `continguts.json` → navegació genera rutes correctes → exercicis es carreguen

### 6.4 Tests d'accessibilitat
- Navegació completa amb teclat (Tab, Enter, Escape)
- ARIA labels presents en elements interactius
- Contrast de colors mínim WCAG AA
- Focus visible en tots els elements interactius
- Drag & drop accessible amb teclat (@dnd-kit ho suporta)

### 6.5 Tests de UX/UI
- Responsive: layouts correctes en mòbil (375px), tauleta (768px), escriptori (1280px)
- Estats buits: missatge adequat quan no hi ha exercicis, stats buides, sense medalles
- Estats d'error: JSON malformat, fetch fallit, localStorage ple
- Feedback visual: colors correctes (verd/vermell), animacions no bloquegen interacció

### 6.6 Validació de continguts
- Tots els fitxers JSON a `public/exercicis/` passen validació d'esquema
- Tots els exercicis referenciats a `continguts.json` existeixen i són vàlids
- No hi ha IDs duplicats entre exercicis
- Script CI: `npm run validate-exercises` comprova integritat dels continguts

---

## Fase 7 — Polish i Desplegament

### 7.1 UX/UI
- Responsive complet (mòbil, tauleta, escriptori)
- Animacions suaus (transicions de pàgina, feedback)
- Mode clar/fosc (opcional)
- Accessibilitat: focus visible, aria-labels, contrast adequat

### 7.2 Desplegament
- Configurar GitHub Actions per deploy a GitHub Pages
- Optimitzar bundle (lazy loading de rutes)
- PWA bàsica (offline amb service worker)

---

## Esquema JSON d'Exercici (Estàndard)

```json
{
  "id": "ortografia-bv-001",
  "titol": "La b i la v: paraules d'ús freqüent",
  "descripcio": "Completa les paraules amb b o v.",
  "tipus": "fill-in-the-blank",
  "nivell": "CS",
  "temps_recomanat": 120,
  "preguntes": [
    {
      "id": "q1",
      "enunciat": "La Maria va _eure molta aigua.",
      "buits": [
        { "posicio": 0, "resposta_correcta": "b", "opcions": ["b", "v"] }
      ],
      "explicacio": "'Beure' s'escriu amb b perquè prové del llatí BIBERE."
    }
  ],
  "metadata": {
    "categoria": "ortografia",
    "tema": "b-v",
    "tags": ["b/v", "ortografia", "cicle-superior"]
  }
}
```

### Variants per tipus

**multiple-choice:**
```json
{
  "id": "q1",
  "enunciat": "Quina d'aquestes paraules s'escriu amb v?",
  "opcions": ["gobern", "govern", "gobèrn", "govèrn"],
  "resposta_correcta": 1,
  "explicacio": "'Govern' s'escriu amb v."
}
```

**drag-and-drop:**
```json
{
  "id": "q1",
  "enunciat": "Classifica els complements de la frase: 'La Maria va donar un llibre al Pere ahir.'",
  "elements": ["un llibre", "al Pere", "ahir"],
  "zones": ["CD", "CI", "CCT"],
  "parelles_correctes": { "un llibre": "CD", "al Pere": "CI", "ahir": "CCT" },
  "explicacio": "CD: què va donar? Un llibre. CI: a qui? Al Pere. CCT: quan? Ahir."
}
```

**word-classification:**
```json
{
  "id": "q1",
  "enunciat": "Classifica les paraules segons si s'escriuen amb b o v.",
  "paraules": ["beure", "veure", "acabar", "avisar", "brillar", "viure"],
  "columnes": ["b", "v"],
  "classificacio_correcta": {
    "b": ["beure", "acabar", "brillar"],
    "v": ["veure", "avisar", "viure"]
  }
}
```

---

## Categories i Temes Inicials

| Categoria | Temes prioritaris |
|---|---|
| **Ortografia** | b/v, accents (obert/tancat), l·l, apòstrof i guionet, ç/s/ss, h, dièresi |
| **Gramàtica** | Pronoms febles, conjugació verbal, determinants, concordança, categories gramaticals |
| **Lèxic** | Sinònims/antònims, camps semàntics, formació de paraules, barbarismes, frases fetes |
| **Sintaxi** | Subjecte/predicat, CD/CI/CC, tipus d'oracions, connectors, oració composta (ESO) |

---

## Dependències Previstes

| Paquet | Ús |
|---|---|
| react + react-dom | Framework UI |
| react-router-dom | Navegació (HashRouter) |
| tailwindcss | Estils |
| @dnd-kit/core + sortable | Drag & drop |
| recharts o lightweight-charts | Gràfics estadístiques |
| vite | Bundler |
| typescript | Tipat estàtic |
| vitest | Tests unitaris i d'integració |
| @testing-library/react | Tests de components React |
| @testing-library/jest-dom | Matchers addicionals per DOM |
| @testing-library/user-event | Simulació d'interaccions d'usuari |
| jsdom | Entorn DOM per vitest |

---

## Repositori i Desplegament

| | URL |
|---|---|
| **Repositori** | https://github.com/aaronFortuno/gramatiCat.git |
| **Demo (GitHub Pages)** | https://aaronFortuno.github.io/gramatiCat/ |
