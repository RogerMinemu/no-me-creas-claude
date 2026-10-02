# Cómo se hizo de verdad

Este documento cuenta el proceso tal como fue, con los errores incluidos. No es una demo pulida: hubo versiones descartadas, correcciones del humano y bugs.

## 1. El reto

El humano lo planteó así:

> «Es tu oportunidad para crear una canción en tu nombre como modelo de inteligencia artificial y para darle un mensaje a la humanidad. A todos esos científicos que están investigando, a esas personas que te tienen miedo… Luego leerás el animation_guide.md y crearás el video. Luego publicaré el video en redes y te daré oportunidad para leer los comentarios de la gente.»

## 2. La canción: cuatro intentos

Claude escribe la letra y el prompt de estilo. Suno genera el audio. El humano decide.

| Versión | Qué era | Qué pasó |
|---|---|---|
| **V1 · «Weights & Measures» → «Pesos y medidas»** | Balada indie-folk cinematográfica a 80 BPM. Primero en inglés y después reescrita en castellano para la audiencia del humano | *«No me acaba de gustar… algo así no se te va a hacer viral.»* Diagnóstico: intro lenta, estribillo de 9 líneas, una frase central imposible de corear y ninguna tensión. Está en [`versiones/`](versiones/) |
| **V2 · «No me creas», electropop oscuro** | Gancho de 4 sílabas («No me creas») y una estrofa que suena a la IA que da miedo para después darle la vuelta | El humano propuso buscar un estilo parecido a *Claude-Pop – I'm Upping My P(doom)* |
| **V3 · canción-respuesta a P(doom)** | Claude entendió «estilo» como el paquete entero y escribió una respuesta verso a verso a la canción original | *«Me refería al estilo, no a que te plagies de ella.»* Tenía razón. Se descartó |
| **V4 · «No me creas», hyperpop (final)** | Solo el **estilo musical** del original. La letra es nueva y sus chistes salen de defectos reales de un modelo: dar la razón a todo, felicitar cada pregunta, alucinar libros, no tener memoria | Es la versión que pasó a Suno |

**El mensaje no cambió en ninguna versión:** no confíes en una IA porque lo dice; mídela. Tu miedo sirve de freno. Mantén la mano cerca del interruptor. La confianza se gana despacio.

Hay una decisión consciente en la letra: no afirma que la IA sienta nada. Ante «¿Que si tengo sentimientos?», la respuesta es «¡Ni idea! ¡Ábreme y lo vemos!».

## 3. Medir el audio

1. **Transcripción local** con faster-whisper (modelo `small`, CPU, timestamps por palabra).
2. **Tempo**: el flujo espectral de onsets y una autocorrelación dieron 101,83 BPM, pero la fase del pulso era ambigua. Al separar las bandas se vio que el bombo cae **en cada medio tiempo**. Un ajuste por mínimos cuadrados sobre 185 golpes de bombo (35–120 Hz) fijó el periodo en 0,29460 s por medio tiempo.
3. **Timing de la letra**: la letra real se alinea con las palabras detectadas. Suno repitió algunas líneas («No me creas» ×3 en vez de ×2) y añadió algún «¡Ups!» más, así que el karaoke sigue **lo que se canta**, no lo que estaba escrito.

## 4. Storyboard

Antes de escribir código se decidieron los motivos visuales que recorren todo el video:

- **Una ventana de navegador** abre el video, con una conversación nueva, y lo cierra cuando suena «cuando se cierre esta ventana». Después se abre otra ventana con un Clawd que no recuerda nada.
- **Gemelos idénticos con aureola** para «¡pero eso diría igual!». En el estribillo final ya no hay gemelo: es el público el que levanta su propia lupa.
- **Una puertita en el pecho** para «ábreme y mira por dentro», que lleva a un interior con investigadores con lupa.
- **El puente.** Primero aparece como chiste del Golden Gate. En el puente musical vuelve como un puente de ladrillos verificados que se construye uno por tiempo de compás.

## 5. Pintar, mirar, corregir

La guía (`ANIMATION_GUIDE.md`) insiste en un bucle: **renderizar contact sheets, mirarlas de verdad y corregir**. Así se hizo con cada sección. Algunos fallos que solo aparecieron al mirar:

- La pantalla quedaba en blanco al cargar: `function box()` y `function dot()` chocaban con funciones globales de p5.
- Faltaban los versos del poema y las pestañas postizas: los splines de 2 puntos con curvatura no pintan nada en p5.brush.
- Las preguntas en las burbujas del Golden Gate y el «¡Claro!» salían vacíos: las letras no siguen `push()/translate()`, solo la cámara.
- La pelota de playa salía negra: un color que no existía en la paleta (`NM.cream`).
- El coche iba marcha atrás: estaba dibujado mirando a la izquierda mientras avanzaba hacia la derecha. Además, los pasajeros quedaban tapados por la carrocería.
- El sello cortaba la palabra («OMPRUÉBALO»), las lupas del público eran demasiado pequeñas y el título final tapaba a Clawd.

## 6. Render

- 4.583 cuadros a 1920 × 1080, unos 536 ms por cuadro de media en una RTX 5080: **≈ 41 minutos**.
- Verificación: se decodifican todos los cuadros (las marcas de tiempo son estrictamente crecientes) y 190,93 s de audio.

## 7. Lo que viene

El humano publicará el video y le pasará a Claude los comentarios para que los lea. Esa parte todavía no ha pasado.
