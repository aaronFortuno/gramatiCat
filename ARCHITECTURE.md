# gramatiCat — Arquitectura

## Stack Tecnològic

| Capa | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite |
| Estils | Tailwind CSS v4 |
| Routing | React Router v7 (HashRouter) |
| Drag & Drop | @dnd-kit |
| Gràfics | Recharts |
| Tests | Vitest + Testing Library |
| Deploy | GitHub Pages (via GitHub Actions) |

---

## Estructura de Carpetes

```
gramatiCat/
├── public/
│   ├── continguts.json              # Manifest central de categories/temes/exercicis
│   └── exercicis/
│       ├── ortografia/
│       │   ├── b-v/
│       │   │   ├── bv-001.json
│       │   │   └── bv-002.json
│       │   ├── accents/
│       │   ├── ela-geminada/
│       │   ├── apostrof-guionet/
│       │   ├── c-s-ss/
│       │   └── dieresi/
│       ├── gramatica/
│       │   ├── pronoms-febles/
│       │   │   ├── pf-001.json
│       │   │   └── pf-002.json
│       │   ├── conjugacio-verbal/
│       │   ├── determinants/
│       │   ├── concordanca/
│       │   └── categories-gramaticals/
│       ├── lexic/
│       │   ├── sinonims-antonims/
│       │   ├── camps-semantics/
│       │   ├── formacio-paraules/
│       │   ├── barbarismes/
│       │   └── frases-fetes/
│       └── sintaxi/
│           ├── subjecte-predicat/
│           ├── complements/
│           ├── tipus-oracions/
│           ├── connectors/
│           └── oracio-composta/
├── src/
│   ├── main.tsx                     # Entry point
│   ├── App.tsx                      # Router + Layout
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Barra superior amb logo i navegació
│   │   │   ├── Sidebar.tsx          # Menú lateral amb categories/temes
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx           # Wrapper amb sidebar + main content
│   │   ├── exercises/
│   │   │   ├── ExerciseRunner.tsx   # Orquestrador: rep JSON i renderitza el component adequat
│   │   │   ├── MultipleChoice.tsx   # Exercici de multi-opció
│   │   │   ├── FillInTheBlank.tsx   # Exercici d'omplir buits
│   │   │   ├── DragAndDrop.tsx      # Exercici d'arrossegar a zones
│   │   │   ├── WordClassification.tsx # Classificar paraules en columnes
│   │   │   ├── ExerciseTimer.tsx    # Temporitzador
│   │   │   ├── ExerciseFeedback.tsx # Feedback correcte/incorrecte
│   │   │   └── StreakCounter.tsx    # Comptador de ratxa
│   │   ├── gamification/
│   │   │   ├── MedalBadge.tsx       # Component visual de medalla
│   │   │   ├── MedalGrid.tsx        # Grid de medalles
│   │   │   └── StreakBanner.tsx     # Banner de ratxa diària
│   │   ├── stats/
│   │   │   ├── CategoryChart.tsx    # Gràfic per categoria
│   │   │   ├── ActivityHeatmap.tsx  # Heatmap d'activitat
│   │   │   └── ProgressBar.tsx      # Barra de progrés
│   │   ├── admin/
│   │   │   ├── JsonEditor.tsx       # Editor de JSON
│   │   │   └── ExercisePreview.tsx  # Preview de l'exercici
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       └── Loading.tsx
│   ├── pages/
│   │   ├── HomePage.tsx             # Pàgina d'inici amb categories
│   │   ├── CategoryPage.tsx         # Llista de temes d'una categoria
│   │   ├── TopicPage.tsx            # Llista d'exercicis d'un tema
│   │   ├── ExercisePage.tsx         # Pàgina d'un exercici individual
│   │   ├── StatsPage.tsx            # Panell d'estadístiques
│   │   ├── MedalsPage.tsx           # Pàgina de medalles
│   │   └── AdminPage.tsx            # Admin Previewer
│   ├── services/
│   │   ├── contentService.ts        # Carregar continguts.json i exercicis individuals
│   │   ├── storageService.ts        # CRUD localStorage (stats, streaks, historial)
│   │   └── gamificationService.ts   # Lògica de ratxes, medalles, puntuació
│   ├── hooks/
│   │   ├── useLocalStorage.ts       # Hook reactiu per localStorage
│   │   ├── useExercise.ts           # Estat i lògica d'un exercici en curs
│   │   ├── useStats.ts              # Accés a estadístiques
│   │   └── useTimer.ts              # Hook del temporitzador
│   ├── types/
│   │   ├── exercise.ts              # Tipus TypeScript per exercicis JSON
│   │   ├── content.ts               # Tipus per continguts.json (categories, temes)
│   │   ├── stats.ts                 # Tipus per estadístiques i historial
│   │   └── gamification.ts          # Tipus per medalles i ratxes
│   ├── utils/
│   │   ├── validation.ts            # Validació d'esquemes JSON
│   │   └── formatting.ts            # Formatejadors (temps, percentatges)
│   └── styles/
│       └── index.css                # Tailwind directives + custom styles
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── requeriments.md
├── PLAN.md
├── ARCHITECTURE.md
└── README.md
```

---

## Diagrama de Flux de Dades

```
continguts.json ──fetch──► contentService ──► Pàgines de navegació
                                                    │
exercicis/*.json ──fetch──► ExerciseRunner ──► Component d'exercici
                                                    │
                                              Resposta alumne
                                                    │
                                    ┌───────────────┼───────────────┐
                                    ▼               ▼               ▼
                              storageService  gamificationService  Feedback UI
                              (localStorage)  (ratxes, medalles)  (correcte/error)
                                    │               │
                                    ▼               ▼
                              StatsPage        MedalsPage
```

---

## Rutes (HashRouter)

| Ruta | Pàgina | Descripció |
|---|---|---|
| `#/` | HomePage | Inici amb 4 categories |
| `#/categoria/:categoriaId` | CategoryPage | Temes d'una categoria |
| `#/categoria/:categoriaId/:temaId` | TopicPage | Exercicis d'un tema |
| `#/exercici/:exerciciId` | ExercisePage | Exercici individual |
| `#/estadistiques` | StatsPage | Panell d'estadístiques |
| `#/medalles` | MedalsPage | Col·lecció de medalles |
| `#/admin` | AdminPage | Admin Previewer |

---

## Model de Dades (localStorage)

### Clau: `gramaticat_stats`
```typescript
interface UserStats {
  categories: {
    [categoriaId: string]: {
      encerts: number;
      errors: number;
      tempsTotal: number; // en segons
    };
  };
}
```

### Clau: `gramaticat_streaks`
```typescript
interface Streaks {
  ratxaActual: number;      // respostes correctes consecutives
  ratxaMaxima: number;
  ratxaDiaria: number;      // dies consecutius practicant
  ratxaDiariaMaxima: number;
  ultimaData: string;       // ISO date
}
```

### Clau: `gramaticat_historial`
```typescript
interface HistorialEntry {
  exerciciId: string;
  data: string;             // ISO datetime
  encerts: number;
  errors: number;
  temps: number;            // en segons
}
type Historial = HistorialEntry[];
```

### Clau: `gramaticat_medalles`
```typescript
interface Medal {
  id: string;
  data: string;             // ISO datetime quan es va aconseguir
}
type Medalles = Medal[];
```

---

## Esquema JSON d'Exercici

Veure detall complet a [PLAN.md](./PLAN.md#esquema-json-dexercici-estàndard).

**Tipus suportats:** `multiple-choice` | `fill-in-the-blank` | `drag-and-drop` | `word-classification`

Cada fitxer JSON conté un exercici complet amb:
- Metadades (id, títol, descripció, nivell, temps recomanat)
- Array de preguntes amb format específic per tipus
- Explicació per pregunta (feedback pedagògic)
- Metadata (categoria, tema, tags)

---

## Decisions Arquitecturals

1. **HashRouter** en lloc de BrowserRouter per compatibilitat total amb GitHub Pages (sense necessitat de 404.html hack).

2. **Manifest central `continguts.json`** en lloc d'escaneig de carpetes (impossible en estàtic). L'administrador afegeix exercicis JSON i actualitza el manifest.

3. **Sense framework d'estat global** (Redux, Zustand). L'app és prou simple per funcionar amb Context + hooks locals. Si creix, migrar a Zustand.

4. **Lazy loading de rutes** amb `React.lazy()` per minimitzar el bundle inicial.

5. **@dnd-kit** per drag & drop: accessible (ARIA), lleugera, mantenida activament, millor que react-dnd per a projectes nous.

6. **Recharts** per gràfics: basat en React, API declarativa, bona documentació.

7. **Tot en català**: components, variables, comentaris i UI. Noms de fitxers en kebab-case en anglès per convenció tècnica.
