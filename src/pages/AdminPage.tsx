import { useState, useMemo } from 'react'
import { validateExerciseJson } from '../services/exerciseValidator'
import ExerciseRunner from '../components/exercises/ExerciseRunner'
import type { Exercise } from '../types/exercise'

interface GalleryItem {
  label: string
  description: string
  json: string
}

const GALLERY: GalleryItem[] = [
  {
    label: 'Multi-opció — Accents',
    description: "L'alumne tria la resposta correcta entre diverses opcions.",
    json: JSON.stringify({
      id: 'exemple-mc-001',
      titol: 'Accent obert o tancat?',
      descripcio: "Tria l'accent correcte per a cada paraula.",
      tipus: 'multiple-choice',
      nivell: 'CS',
      temps_recomanat: 120,
      preguntes: [
        {
          id: 'q1',
          enunciat: 'Quina és la forma correcta?',
          opcions: ['café', 'cafè'],
          resposta_correcta: 1,
          explicacio: "'Cafè' porta accent obert (è) perquè la e és oberta.",
        },
        {
          id: 'q2',
          enunciat: 'Quina és la forma correcta?',
          opcions: ['també', 'tambè', 'tambe'],
          resposta_correcta: 0,
          explicacio: "'També' porta accent tancat (é) perquè la e és tancada.",
        },
      ],
      metadata: { categoria: 'ortografia', tema: 'accents', tags: ['accents', 'ortografia'] },
    }, null, 2),
  },
  {
    label: 'Omplir buits — Conjugació',
    description: "L'alumne completa la paraula que falta escollint entre opcions.",
    json: JSON.stringify({
      id: 'exemple-fb-001',
      titol: "Present d'indicatiu: verbs irregulars",
      descripcio: 'Completa les frases amb la forma correcta del present.',
      tipus: 'fill-in-the-blank',
      nivell: 'CS',
      temps_recomanat: 120,
      preguntes: [
        {
          id: 'q1',
          enunciat: 'Jo _ (fer) els deures cada tarda.',
          buits: [{ posicio: 0, resposta_correcta: 'faig', opcions: ['faig', 'fac', 'fem', 'fes'] }],
          explicacio: "El verb 'fer' en 1a persona del present d'indicatiu és 'faig'.",
        },
        {
          id: 'q2',
          enunciat: "Tu _ (dir) sempre la veritat.",
          buits: [{ posicio: 0, resposta_correcta: 'dius', opcions: ['dius', 'dirs', 'dís', 'diues'] }],
          explicacio: "'Dir' en 2a persona del singular del present: 'dius'.",
        },
      ],
      metadata: { categoria: 'gramatica', tema: 'conjugacio-verbal', tags: ['conjugació', 'gramàtica'] },
    }, null, 2),
  },
  {
    label: 'Arrossegar — Complements',
    description: "L'alumne arrossega elements a la zona correcta.",
    json: JSON.stringify({
      id: 'exemple-dd-001',
      titol: 'Classifica els complements de la frase',
      descripcio: 'Arrossega cada element a la funció sintàctica correcta.',
      tipus: 'drag-and-drop',
      nivell: 'ESO1',
      temps_recomanat: 120,
      preguntes: [
        {
          id: 'q1',
          enunciat: "Classifica: 'La Maria va donar un llibre al Pere ahir.'",
          elements: ['un llibre', 'al Pere', 'ahir'],
          zones: ['CD', 'CI', 'CCT'],
          parelles_correctes: { 'un llibre': 'CD', 'al Pere': 'CI', ahir: 'CCT' },
          explicacio: 'CD: què va donar? Un llibre. CI: a qui? Al Pere. CCT: quan? Ahir.',
        },
      ],
      metadata: { categoria: 'sintaxi', tema: 'complements', tags: ['complements', 'sintaxi'] },
    }, null, 2),
  },
  {
    label: 'Classificació — Barbarismes',
    description: "L'alumne classifica paraules en columnes.",
    json: JSON.stringify({
      id: 'exemple-wc-001',
      titol: 'Barbarismes: classifica correcte o incorrecte',
      descripcio: 'Classifica les paraules: forma catalana correcta o barbarisme?',
      tipus: 'word-classification',
      nivell: 'CS',
      temps_recomanat: 120,
      preguntes: [
        {
          id: 'q1',
          enunciat: 'Classifica: forma catalana correcta o barbarisme?',
          paraules: ['entonces', 'aleshores', 'barco', 'vaixell', 'gaudir', 'disfrutar'],
          columnes: ['Forma correcta', 'Barbarisme'],
          classificacio_correcta: {
            'Forma correcta': ['aleshores', 'vaixell', 'gaudir'],
            Barbarisme: ['entonces', 'barco', 'disfrutar'],
          },
          explicacio: "'Entonces' → 'aleshores', 'barco' → 'vaixell', 'disfrutar' → 'gaudir'.",
        },
      ],
      metadata: { categoria: 'lexic', tema: 'barbarismes', tags: ['barbarismes', 'lèxic'] },
    }, null, 2),
  },
]

const EMPTY_TEMPLATES: Record<string, string> = {
  'multiple-choice': JSON.stringify({
    id: 'categoria-tema-001',
    titol: "Títol de l'exercici",
    descripcio: 'Descripció breu.',
    tipus: 'multiple-choice',
    nivell: 'CS',
    temps_recomanat: 120,
    preguntes: [
      {
        id: 'q1',
        enunciat: 'Quina és la resposta correcta?',
        opcions: ['Opció A', 'Opció B', 'Opció C', 'Opció D'],
        resposta_correcta: 1,
        explicacio: 'Explicació de per què B és correcta.',
      },
    ],
    metadata: { categoria: 'categoria', tema: 'tema', tags: ['tag1'] },
  }, null, 2),
  'fill-in-the-blank': JSON.stringify({
    id: 'categoria-tema-001',
    titol: "Títol de l'exercici",
    descripcio: 'Descripció breu.',
    tipus: 'fill-in-the-blank',
    nivell: 'CS',
    temps_recomanat: 120,
    preguntes: [
      {
        id: 'q1',
        enunciat: 'Completa: La Maria va _eure aigua.',
        buits: [{ posicio: 0, resposta_correcta: 'b', opcions: ['b', 'v'] }],
        explicacio: "Beure s'escriu amb b.",
      },
    ],
    metadata: { categoria: 'categoria', tema: 'tema', tags: ['tag1'] },
  }, null, 2),
  'drag-and-drop': JSON.stringify({
    id: 'categoria-tema-001',
    titol: "Títol de l'exercici",
    descripcio: 'Descripció breu.',
    tipus: 'drag-and-drop',
    nivell: 'CS',
    temps_recomanat: 180,
    preguntes: [
      {
        id: 'q1',
        enunciat: 'Classifica els elements.',
        elements: ['element1', 'element2'],
        zones: ['zona A', 'zona B'],
        parelles_correctes: { element1: 'zona A', element2: 'zona B' },
        explicacio: 'Explicació.',
      },
    ],
    metadata: { categoria: 'categoria', tema: 'tema', tags: ['tag1'] },
  }, null, 2),
  'word-classification': JSON.stringify({
    id: 'categoria-tema-001',
    titol: "Títol de l'exercici",
    descripcio: 'Descripció breu.',
    tipus: 'word-classification',
    nivell: 'CS',
    temps_recomanat: 180,
    preguntes: [
      {
        id: 'q1',
        enunciat: 'Classifica les paraules.',
        paraules: ['paraula1', 'paraula2', 'paraula3'],
        columnes: ['columna A', 'columna B'],
        classificacio_correcta: { 'columna A': ['paraula1'], 'columna B': ['paraula2', 'paraula3'] },
        explicacio: 'Explicació.',
      },
    ],
    metadata: { categoria: 'categoria', tema: 'tema', tags: ['tag1'] },
  }, null, 2),
}

type Tab = 'editor' | 'guide'

export default function AdminPage() {
  const [json, setJson] = useState(GALLERY[0].json)
  const [previewKey, setPreviewKey] = useState(0)
  const [activeTab, setActiveTab] = useState<Tab>('editor')

  const validation = useMemo(() => validateExerciseJson(json), [json])

  const exercise = useMemo<Exercise | null>(() => {
    if (!validation.valid) return null
    try {
      return JSON.parse(json) as Exercise
    } catch {
      return null
    }
  }, [json, validation.valid])

  function handleDownload() {
    try {
      const formatted = JSON.stringify(JSON.parse(json), null, 2)
      const blob = new Blob([formatted], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = exercise?.id ? `${exercise.id}.json` : 'exercici.json'
      a.click()
      URL.revokeObjectURL(url)
    } catch { /* validation catches errors */ }
  }

  function loadItem(jsonStr: string) {
    setJson(jsonStr)
    setPreviewKey((k) => k + 1)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Admin Previewer</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'editor'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Editor i Galeria
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'guide'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Guia per crear exercicis
        </button>
      </div>

      {activeTab === 'editor' && (
        <>
          {/* Gallery */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Exemples reals (clica per carregar)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {GALLERY.map((item) => (
                <button
                  key={item.label}
                  onClick={() => loadItem(item.json)}
                  className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Empty templates */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400">Plantilla buida:</span>
            {Object.keys(EMPTY_TEMPLATES).map((type) => (
              <button
                key={type}
                onClick={() => loadItem(EMPTY_TEMPLATES[type])}
                className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor panel */}
            <div className="space-y-3">
              <textarea
                value={json}
                onChange={(e) => setJson(e.target.value)}
                spellCheck={false}
                className="w-full h-[500px] font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-xl border border-gray-700 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {validation.valid ? (
                <p className="text-sm text-green-600 font-medium">JSON vàlid</p>
              ) : (
                <div className="space-y-1">
                  {validation.errors.map((err, i) => (
                    <p key={i} className="text-sm text-red-500">{err}</p>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewKey((k) => k + 1)}
                  disabled={!validation.valid}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previsualitzar
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!validation.valid}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Descarregar JSON
                </button>
              </div>
            </div>

            {/* Preview panel */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[400px]">
              {exercise ? (
                <div key={previewKey}>
                  <p className="text-xs text-gray-400 mb-1">
                    {exercise.metadata.categoria} / {exercise.metadata.tema}
                  </p>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{exercise.titol}</h2>
                  <p className="text-sm text-gray-500 mb-4">{exercise.descripcio}</p>
                  <ExerciseRunner
                    exercise={exercise}
                    onComplete={() => {}}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300">
                  <p className="text-center">
                    La previsualització apareixerà aquí quan el JSON sigui vàlid.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'guide' && <ExerciseGuide />}
    </div>
  )
}

function ExerciseGuide() {
  return (
    <div className="max-w-3xl space-y-8 text-sm text-gray-700">
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Com crear un exercici</h2>
        <p>
          Cada exercici és un fitxer <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.json</code> que
          segueix un esquema estàndard. Pots usar l'editor d'aquesta pàgina per crear-lo, previsualitzar-lo i
          descarregar-lo. Després, cal afegir-lo a la carpeta corresponent i registrar-lo al manifest.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Estructura bàsica</h2>
        <p>Tots els exercicis comparteixen aquests camps obligatoris:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 font-semibold">Camp</th>
                <th className="text-left px-3 py-2 font-semibold">Tipus</th>
                <th className="text-left px-3 py-2 font-semibold">Descripció</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="px-3 py-2 font-mono">id</td><td className="px-3 py-2">string</td><td className="px-3 py-2">Identificador únic. Format: <code>categoria-tema-001</code></td></tr>
              <tr><td className="px-3 py-2 font-mono">titol</td><td className="px-3 py-2">string</td><td className="px-3 py-2">Títol visible per l'alumne</td></tr>
              <tr><td className="px-3 py-2 font-mono">descripcio</td><td className="px-3 py-2">string</td><td className="px-3 py-2">Instruccions breus</td></tr>
              <tr><td className="px-3 py-2 font-mono">tipus</td><td className="px-3 py-2">string</td><td className="px-3 py-2"><code>multiple-choice</code>, <code>fill-in-the-blank</code>, <code>drag-and-drop</code> o <code>word-classification</code></td></tr>
              <tr><td className="px-3 py-2 font-mono">nivell</td><td className="px-3 py-2">string</td><td className="px-3 py-2"><code>CS</code> (Cicle Superior), <code>ESO1</code> o <code>ESO2</code></td></tr>
              <tr><td className="px-3 py-2 font-mono">temps_recomanat</td><td className="px-3 py-2">number</td><td className="px-3 py-2">Temps en segons. El temporitzador usarà aquest valor.</td></tr>
              <tr><td className="px-3 py-2 font-mono">preguntes</td><td className="px-3 py-2">array</td><td className="px-3 py-2">Llista de preguntes (mínim 1). Cada pregunta necessita un <code>id</code> únic.</td></tr>
              <tr><td className="px-3 py-2 font-mono">metadata</td><td className="px-3 py-2">object</td><td className="px-3 py-2"><code>categoria</code>, <code>tema</code> i <code>tags</code> (array de strings)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Tipus d'exercici</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-blue-800">multiple-choice</h3>
          <p>L'alumne selecciona la resposta correcta entre diverses opcions.</p>
          <p className="font-semibold">Camps de la pregunta:</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            <li><code>enunciat</code> — El text de la pregunta</li>
            <li><code>opcions</code> — Array de strings amb les opcions (mínim 2)</li>
            <li><code>resposta_correcta</code> — Índex (0, 1, 2...) de l'opció correcta</li>
            <li><code>explicacio</code> — Text que apareix després de respondre</li>
          </ul>
          <p className="text-xs text-blue-700">Ideal per a: conceptes, regles, identificació.</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-green-800">fill-in-the-blank</h3>
          <p>L'alumne completa buits dins d'una frase, escollint entre opcions.</p>
          <p className="font-semibold">Camps de la pregunta:</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            <li><code>enunciat</code> — Frase amb _ (guió baix) on va el buit</li>
            <li><code>buits</code> — Array d'objectes, cadascun amb:
              <ul className="list-disc list-inside ml-4">
                <li><code>posicio</code> — Índex del buit (0 = primer _)</li>
                <li><code>resposta_correcta</code> — La resposta correcta (string)</li>
                <li><code>opcions</code> — Array d'opcions (opcional, si no n'hi ha, serà input lliure)</li>
              </ul>
            </li>
            <li><code>explicacio</code> — Explicació post-resposta</li>
          </ul>
          <p className="text-xs text-green-700">Ideal per a: ortografia, conjugació, completar frases.</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-amber-800">drag-and-drop</h3>
          <p>L'alumne arrossega elements a zones predefinides.</p>
          <p className="font-semibold">Camps de la pregunta:</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            <li><code>enunciat</code> — Instruccions amb la frase a analitzar</li>
            <li><code>elements</code> — Array de strings a arrossegar</li>
            <li><code>zones</code> — Array de strings amb les zones destí</li>
            <li><code>parelles_correctes</code> — Objecte: <code>{`{ "element": "zona" }`}</code></li>
            <li><code>explicacio</code> — Explicació post-resposta</li>
          </ul>
          <p className="text-xs text-amber-700">Ideal per a: anàlisi sintàctica, relacionar conceptes.</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-purple-800">word-classification</h3>
          <p>L'alumne classifica paraules en columnes (categories).</p>
          <p className="font-semibold">Camps de la pregunta:</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            <li><code>enunciat</code> — Instruccions</li>
            <li><code>paraules</code> — Array de paraules a classificar</li>
            <li><code>columnes</code> — Array amb els noms de les categories (mínim 2)</li>
            <li><code>classificacio_correcta</code> — Objecte: <code>{`{ "columna": ["paraula1", "paraula2"] }`}</code></li>
            <li><code>explicacio</code> — Explicació post-resposta</li>
          </ul>
          <p className="text-xs text-purple-700">Ideal per a: b/v, barbarismes, camps semàntics, categories gramaticals.</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Passos per afegir un exercici</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Usa l'editor d'aquesta pàgina per crear el JSON. Pots partir d'un exemple de la galeria o d'una plantilla buida.</li>
          <li>Previsualitza l'exercici per assegurar-te que funciona correctament.</li>
          <li>Descarrega el fitxer JSON amb el botó "Descarregar".</li>
          <li>
            Col·loca el fitxer a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">public/exercicis/{'{categoria}'}/{'{tema}'}/</code>.
            <br />Exemple: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">public/exercicis/ortografia/accents/acc-003.json</code>
          </li>
          <li>
            Afegeix la referència a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">public/continguts.json</code>, dins l'array{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">exercicis</code> del tema corresponent:
            <pre className="bg-gray-900 text-green-400 p-3 rounded-lg mt-1 text-xs overflow-x-auto">
{`{
  "id": "ortografia-acc-003",
  "titol": "Títol del nou exercici",
  "fitxer": "ortografia/accents/acc-003.json"
}`}
            </pre>
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Consells</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li>L'<code>id</code> ha de ser únic a tota l'aplicació. Usa el format <code>categoria-tema-NNN</code>.</li>
          <li>Cada pregunta també necessita un <code>id</code> únic dins l'exercici (<code>q1</code>, <code>q2</code>...).</li>
          <li>L'<code>explicacio</code> és molt important pedagògicament: ajuda l'alumne a entendre l'error.</li>
          <li>Un bon <code>temps_recomanat</code> és 20-30 segons per pregunta (120s per a 5 preguntes).</li>
          <li>Les <code>opcions</code> han d'incloure distractors versemblants, no respostes absurdes.</li>
          <li>En <code>fill-in-the-blank</code>, el guió baix <code>_</code> marca on va el buit dins l'enunciat.</li>
          <li>El <code>nivell</code> ajuda a filtrar: <code>CS</code> = Cicle Superior (10-12 anys), <code>ESO1</code> = 1r-2n ESO, <code>ESO2</code> = 3r-4t ESO.</li>
        </ul>
      </section>
    </div>
  )
}
