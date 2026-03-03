# gramatiCat — Instruccions per a l'Agent

## Projecte

Aplicació web estàtica de pràctica de llengua catalana (Cicle Superior + ESO). React 19 + TypeScript + Vite + Tailwind CSS v4. Desplegada a GitHub Pages.

- **Repositori**: https://github.com/aaronFortuno/gramatiCat.git
- **Demo**: https://aaronFortuno.github.io/gramatiCat/
- **Llicència**: GNU GPL v3
- **Idioma UI**: Tot en català
- **Idioma codi**: Noms de fitxers en kebab-case anglès, variables/funcions en anglès o català segons context

## Comandes habituals

```bash
npm run dev          # Servidor de desenvolupament
npm run build        # Build producció (tsc + vite build)
npm run test         # Tests (vitest run)
npm run test:watch   # Tests en mode watch
npm run lint         # ESLint
```

## Git — Commit i Push

1. Executar `npm run test` i `npm run build` ABANS de fer commit. No fer commit si fallen.
2. Fer `git add` dels fitxers específics (mai `git add .` ni `git add -A`).
3. Missatge de commit en anglès, concís, amb format convencional:
   - `feat: ...` per funcionalitats noves
   - `fix: ...` per correccions
   - `refactor: ...` per refactoritzacions
   - `test: ...` per tests
   - `docs: ...` per documentació
   - `chore: ...` per manteniment
4. Afegir `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` al final.
5. Push a `main` amb `git push origin main`.
6. **Mai** fer `--force`, `--no-verify`, ni `--amend` sense permís explícit.

## Tests

- Framework: **Vitest 4** + **Testing Library**
- Fitxers de test al costat del fitxer font: `nomFitxer.test.ts(x)`
- Peculiaritat vitest 4 + ESM + jsdom: el `localStorage` del test i del mòdul són instàncies diferents. Usar `vi.resetModules()` + `await import()` + `setStorage(mockStorage)` per aïllar tests del storageService.
- Executar `npm run test` després de cada canvi significatiu.

## Documentació — Quan actualitzar

Actualitzar **PLAN.md** quan:
- Es completa una fase o subtasca (marcar-la com a feta)
- Canvia l'abast o prioritats d'una fase

Actualitzar **ARCHITECTURE.md** quan:
- S'afegeixen nous fitxers/carpetes a `src/`
- Canvia l'estructura de rutes
- S'afegeixen noves dependències
- Canvia el model de dades de localStorage

Actualitzar **README.md** quan:
- Canvien les instruccions d'instal·lació o ús
- S'afegeixen noves funcionalitats visibles per l'usuari

## Estructura clau

```
public/continguts.json          → Manifest central (categories/temes/exercicis)
public/exercicis/{cat}/{tema}/  → Fitxers JSON d'exercicis
src/components/                 → Components React
src/pages/                      → Pàgines (lazy loaded)
src/services/                   → Lògica de negoci (contentService, storageService)
src/hooks/                      → Hooks React reutilitzables
src/types/                      → Tipus TypeScript
```

## Convencions de codi

- **Components**: PascalCase, un component per fitxer, `export default`
- **Hooks**: camelCase amb prefix `use`
- **Services**: camelCase, funcions exportades individualment
- **Estils**: Tailwind CSS classes directes, CSS custom mínim a `src/styles/index.css`
- **Tipus**: definits a `src/types/`, importats amb `import type`
- **Rutes**: HashRouter (`#/path`) per compatibilitat GitHub Pages
- **Base URL**: `/gramatiCat/` (configurat a `vite.config.ts`)

## Exercicis JSON

4 tipus suportats: `multiple-choice`, `fill-in-the-blank`, `drag-and-drop`, `word-classification`. Esquema complet a PLAN.md.

Quan s'afegeix un exercici nou:
1. Crear fitxer JSON a `public/exercicis/{categoria}/{tema}/`
2. Afegir referència a `public/continguts.json`
