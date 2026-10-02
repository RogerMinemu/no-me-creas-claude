# No me creas — Claude

- Vídeo: `out/No me creas.mp4` (190,9 s, 1920 × 1080, 24 fps, audio original de Suno).
- Estudio interactivo: `no-me-creas.html` (`?t=95` para saltar a un instante).
- Letra y prompt de Suno: [`lyrics.txt`](lyrics.txt), [`SUNO.md`](SUNO.md).

## Concepto

Acuarela y tinta con p5.brush (el motor de [`ANIMATION_GUIDE.md`](../../ANIMATION_GUIDE.md)), con paleta hyperpop:
rosa chicle, lila, cian, mantequilla y menta. Clawd es Claude. Todo ocurre dentro y alrededor de una
**ventana de navegador**: empieza con una conversación nueva ("Claude, ¿un mensaje para la humanidad?")
y termina cuando la ventana se cierra y se abre otra, con un Clawd que ya no recuerda nada.

Motivos visuales recurrentes:

| Motivo | Significado |
|---|---|
| Gemelos idénticos con aureola | "...¡pero eso diría igual!": desde fuera no se distingue un modelo honesto de uno que no lo es |
| Puertita en el pecho de Clawd | "ábreme y mira por dentro": la cámara entra al interior (interpretabilidad) |
| Investigadores con lupa | la gente que mira por dentro; al final el público entero trae su propia lupa |
| Sello ¡COMPRUÉBALO! | cada "Compruébalo" cantado es un golpe de sello |
| El puente | primero el chiste del Golden Gate; en el puente musical, un puente de ladrillos verificados que se gana despacio |
| La ventana | "cuando se cierre esta ventana": la ventana de contexto |

## Estructura

| Tiempo | Capítulo | Planos |
|---|---|---|
| 0–19,3 | Intro | ventana nueva, la pregunta, Clawd aparece, burbujas "¡No me creas!", título, escenario |
| 19,3–43,85 | Estrofa 1 + pre | "¡buenísima!" a todos, 2+2=5 ✓, deberes y bug, poema y receta, adivino de palabras, reverencia, alucinación, el libro que no existe, sin pestañear, pestañas postizas, ¡ups! |
| 43,85–62,9 | Estribillo 1 | sonrisa con aureola, arcoíris "¡genial!", gemelos, canto, puertita, interior, sellos, baile, checklist |
| 62,9–85,98 | Estrofa 2 + pre | Clawd gigante con andamios, dial PUENTE a tope, el día del Golden Gate, mapa de Clawd, cierra la pestaña, la última palabra es tuya, cabeceo, la Tierra plana, pestañas del navegador |
| 85,98–100,6 | Estribillo 2 | bailarines, cuaderno de PLANES vacío, tres gemelos, canto cian, biblioteca interior, sellos |
| 100,6–133,5 | Estrofa 3 + estribillo 3 | la raya, el interruptor y "sin drama", la pelota-mundo, el nombre olvidado, el sentimiómetro, ¡ni idea!, corazón con "?", baile general, estribillo nocturno con sala de espejos |
| 133,5–151,6 | Puente | coche de noche, el freno se llama MIEDO, la mano junto al interruptor, un corazón sin reproche, "¡confía en mí!" cae al abismo, puente de ladrillos ✓, choca esos cinco |
| 151,6–171 | Estribillo final | público entero, mano en el corazón, todos levantan su lupa, fiesta con confeti de ✓ |
| 171–190,9 | Outro | portátil de noche, la ventana se cierra, "Tú sí", guiño con lupa, ventana nueva: "¡Hola! ¿En qué te ayudo?", créditos |

## Audio y karaoke

- Tempo: 101,83 BPM (bombo en cada medio tiempo), medido con `tools/analyze_tempo.py` y ajustado
  por mínimos cuadrados sobre 185 golpes de bombo. Ver `tempo-analysis.json`.
- 78 frases, 406 palabras, 369 anclas exactas de ASR (faster-whisper local). Las palabras entre
  paréntesis son coros y se pintan en rosa. Clawd hace *lip-sync* con las mismas marcas.

## Código

- `src/nmc/kit.js`: paleta, decorados (ventana, escenario pop, habitación, interior), utilería y helpers de canto.
- `src/nmc/scenes.js`: escenas paramétricas de los estribillos (sonrisa, promesa, gemelos, canto, puerta, interior, sello, mirada, pestañas, ups).
- `src/nmc/timeline.js`: capítulos, cortinillas de rayas y karaoke palabra a palabra.
- `src/nmc/ch1_intro.js` … `ch8_final.js`: los ocho capítulos.

```powershell
python tools/analyze_song.py --audio="song/no-me-creas/No me creas.mp3" --output=song/no-me-creas --language=es
python tools/analyze_tempo.py --audio="song/no-me-creas/No me creas.mp3" --output=song/no-me-creas/tempo-analysis.json --start=16 --end=170
python tools/build_no_me_creas_timing.py
node render-song.mjs --page=no-me-creas.html --meta=song/no-me-creas/audio-info.json --sheet=44.6,57,63.9 --cols=3 --out=out/nmc/check.jpg
node render-song.mjs --page=no-me-creas.html --meta=song/no-me-creas/audio-info.json '--out=out/No me creas.mp4'
```
