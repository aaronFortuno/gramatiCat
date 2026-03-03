Actua com un expert en desenvolupament web Frontend i arquitectura d'aplicacions educatives. Vull crear "gramatiCat", una aplicació web de pràctica de llengua catalana per a alumnes de Cicle Superior de Primària i ESO, sota llicència GNU GPL v3.

### Objectiu Tècnic
L'app s'ha d'executar a GitHub Pages (estàtica). No hi ha base de dades externa. Tota la persistència d'usuari (estadístiques, ratxes, historial) s'ha de gestionar via `localStorage`.

### Arquitectura de Continguts (Crucial)
L'aplicació ha de basar la seva jerarquia en una estructura de carpetes/fitxers que l'app pugui parsejar o llegir d'un fitxer de configuració central (p. ex. `continguts.json` o una estructura de carpetes a `/public/exercicis/`):
1. Categoria (Gramàtica, Ortografia, Lèxic, Sintaxi).
2. Tema (ex: dins d'Ortografia: "b/v", "g/j", "x/ix").
3. Exercici (fitxer individual amb format JSON que contingui enunciat, tipus d'activitat i dades).

### Funcionalitats Requerides
1. Navegació: Menú lateral o superior per navegar per categories -> temes -> llista d'exercicis.
2. Tipus d'Exercicis: Suport per a multi-opció, omplir buits, arrossegar i anar a buscar la funció sintàctica, i classificació de paraules.
3. Gamificació: Sistema de ratxes (streaks) de respostes correctes, temporitzador per exercici i medalles visuals segons el rendiment.
4. Panell d'Estadístiques: Vista local per a l'alumne amb el percentatge d'encerts per categoria i temps total dedicat.
5. Administració: L'app ha de ser capaç de carregar nous exercicis simplement afegint fitxers JSON a la carpeta corresponent. Crea un "Admin Previewer" on pugui enganxar un JSON i veure com quedarà l'exercici abans de guardar-lo al repositori.

### Estètica i Idioma
- Interfície neta, moderna i accessible (estil escolar però professional).
- Idioma: Totalment en català.
- Stack recomanat: React o Vue amb Tailwind CSS per a la simplicitat i velocitat.

### Tasca Inicial
0. Defineix un pla d'acció amb els passos a seguir per desenvolupar l'aplicació, amb diferents estadis. Pots incloure ús de subagents per investigar els diferents apartats que pot contenir, fer un suggeriment de categories/temes/exercicis, etc.
1. Defineix l'estructura del fitxer JSON estàndard per a un exercici (que serveixi per a sinònims, pronoms o ortografia).
2. Crea l'esquelet de l'aplicació amb el sistema de rutes i la gestió de `localStorage`.
3. Implementa un exercici d'exemple de "Pronoms febles" i un de "b/v".