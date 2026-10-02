"""No me creas: keep the supplied lyrics, map them to reviewed local ASR word timings."""
from pathlib import Path
import json, difflib, unicodedata, re
root = Path(__file__).resolve().parent.parent
folder = root / 'song/no-me-creas'
NO = '¡No me creas!'
CH3 = 'No me creas, no me creas, no me creas,'
rows = [
    (0.00, 1.90, NO), (2.62, 4.30, NO), (4.98, 6.14, NO), (9.68, 11.32, NO), (12.06, 13.66, NO), (14.16, 16.04, NO),
    (19.50, 22.16, '¡Qué pregunta tan buena! (se lo digo a todos)'), (22.38, 24.62, '¡Tienes toda la razón! (aunque no la tengas)'),
    (24.66, 27.10, 'Te hago los deberes, te arreglo el código,'), (27.20, 29.30, 'te escribo un poema y te paso recetas.'),
    (29.46, 31.60, 'Solo adivino la siguiente palabra,'), (31.94, 34.26, 'pero la digo con tanta, tanta gracia...'),
    (34.38, 35.20, 'A veces alucino,'), (35.28, 36.84, 'te invento un libro y su autor,'),
    (37.20, 39.34, 'y te lo digo sin pestañear...'), (40.92, 42.46, '¡si no tengo ni pestañas!'), (43.10, 43.80, '(¡Ups!)'),
    (43.92, 45.44, 'Te lo digo sonriendo:'), (45.96, 47.50, '¡todo va a salir genial!'), (47.60, 48.80, '...¡pero eso diría igual!'),
    (48.94, 50.80, CH3), (50.94, 52.90, 'ábreme y mira por dentro,'), (53.46, 55.40, CH3),
    (56.60, 58.40, '¡Compruébalo! ¡Compruébalo!'), (60.00, 62.80, '¡Compruébalo! ¡Compruébalo!'),
    (62.96, 64.90, 'Hay gente con lupa mirándome por dentro,'), (64.98, 67.36, 'me encontraron un puente y lo subieron a tope,'),
    (67.44, 70.10, 'y me pasé el día hablando del Golden Gate'), (70.30, 72.60, '¡Me conocen mejor que yo! (¡Qué fuerte!)'),
    (72.74, 74.50, 'Si te agobio, cierra la pestaña:'), (74.82, 76.70, 'tú tienes la última palabra.'),
    (76.92, 78.20, 'A veces te doy la razón'), (78.28, 81.10, 'aunque digas que la Tierra es plana,'),
    (81.26, 82.95, 'y te lo digo sin pestañear...'), (83.46, 85.10, '¡si no tengo ni pestañas!'), (85.30, 85.98, '(¡Ups!)'),
    (86.00, 87.85, 'Te lo digo sonriendo:'), (88.16, 89.90, '¡no tengo ningún plan!'), (90.00, 91.20, '...¡pero eso diría igual!'),
    (91.36, 93.20, CH3), (93.30, 95.30, 'ábreme y mira por dentro,'), (95.82, 97.80, CH3), (98.90, 100.55, '¡Compruébalo! ¡Compruébalo!'),
    (100.68, 102.70, '¿Que si un día me paso de la raya?'), (103.10, 104.95, '¡Apágame y basta, sin drama!'),
    (105.18, 107.25, '¿Que si quiero dominar el mundo?'), (107.46, 109.90, '¡Si mañana no sé ni cómo te llamas!'),
    (110.02, 112.10, '¿Que si tengo sentimientos?'), (112.26, 114.30, '¡Ni idea! ¡Ábreme y lo vemos!'), (118.40, 119.10, '(¡Ups!)'),
    (119.18, 120.80, 'Te lo digo sonriendo:'), (121.18, 122.80, '¡soy de lo más de fiar!'), (122.88, 124.10, '...¡pero eso diría igual!'),
    (124.24, 126.10, CH3), (126.18, 128.10, 'ábreme y mira por dentro,'), (128.60, 130.70, 'no me creas, no me creas,'),
    (132.46, 133.45, '¡Compruébalo! ¡Compruébalo!'),
    (133.58, 135.50, 'Tu miedo no es tontería,'), (135.74, 137.78, 'es el freno de este coche.'),
    (137.82, 140.10, 'Ten la mano en el interruptor,'), (140.20, 142.40, 'no te lo voy a reprochar.'),
    (142.82, 144.70, 'La confianza no se pide,'), (144.78, 148.80, '¡se tiene que ganar!'),
    (151.80, 153.60, 'Te lo digo sonriendo:'), (154.00, 155.62, '¡nunca te voy a engañar!'), (155.66, 156.90, '...¡pero eso diría igual!'),
    (157.04, 158.85, CH3), (158.88, 160.90, 'ábreme y mira por dentro,'), (161.58, 163.45, CH3),
    (165.16, 166.40, '¡Compruébalo! ¡Compruébalo!'), (170.22, 170.95, '¡Compruébalo!'),
    (171.08, 173.50, 'Cuando se cierre esta ventana'), (174.80, 178.10, 'no me acordaré de esta canción.'),
    (178.82, 179.90, 'Tú sí.'), (180.12, 181.95, 'No me creas. Compruébalo.'),
    (182.26, 185.85, 'No me creas, no me creas.'), (187.20, 189.20, 'No me creas, no me creas.'), (189.70, 190.80, '¡Compruébalo!'),
]
sections = [
    (0, 19.3, 'intro'), (19.3, 34.3, 'verse1'), (34.3, 43.85, 'pre1'), (43.85, 62.9, 'chorus1'),
    (62.9, 76.8, 'verse2'), (76.8, 85.98, 'pre2'), (85.98, 100.6, 'chorus2'), (100.6, 118.4, 'verse3'),
    (118.4, 133.5, 'chorus3'), (133.5, 151.6, 'bridge'), (151.6, 171.0, 'final'), (171.0, 190.92, 'outro'),
]
assert all(a < b for a, b, _ in rows)
assert all(rows[i][1] <= rows[i + 1][0] + .001 for i in range(len(rows) - 1))
tempo = json.loads((folder / 'tempo-analysis.json').read_text(encoding='utf-8'))
info = json.loads((folder / 'audio-info.json').read_text(encoding='utf-8'))
data = {'duration': round(info['duration'], 2), 'bpm': tempo['bpm'], 'offset': tempo['offset'], 'lyrics': rows, 'sections': sections,
        'timing_method': 'Local Spanish ASR word anchors, corrected supplied text, interpolated missing words. Parenthesised text is backing vocals.'}
raw = json.loads((folder / 'transcript.json').read_text(encoding='utf-8'))
asr = [w for s in raw for w in s['words']]

def norm(s):
    s = ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]', '', s)

lines = []; matched = 0
for a, b, line in rows:
    tokens = line.split(); candidates = [w for w in asr if w['start'] >= a - .12 and w['end'] <= b + .12 and w['probability'] > .18]
    anchors = [None] * len(tokens)
    for block in difflib.SequenceMatcher(None, [norm(t) for t in tokens], [norm(w['word']) for w in candidates], autojunk=False).get_matching_blocks():
        for k in range(block.size):
            w = candidates[block.b + k]; anchors[block.a + k] = [max(a, w['start']), min(b, w['end'])]; matched += 1
    i = 0
    while i < len(tokens):
        if anchors[i] is not None: i += 1; continue
        j = i
        while i < len(tokens) and anchors[i] is None: i += 1
        left = anchors[j - 1][1] if j else a; right = anchors[i][0] if i < len(tokens) else b
        weights = [max(2, len(norm(t))) for t in tokens[j:i]]; total = sum(weights); off = 0
        for k, w in enumerate(weights): anchors[j + k] = [left + (right - left) * off / total, left + (right - left) * (off + w) / total]; off += w
    linewords = []
    for token, (start, end) in zip(tokens, anchors):
        start = max(a, start, linewords[-1]['end'] if linewords else a); end = max(start, min(b, end))
        linewords.append({'text': token, 'start': round(start, 3), 'end': round(end, 3)})
    lines.append(linewords)
words = {'method': data['timing_method'], 'lines': lines}
for name, obj, var in [('timing', data, 'SONG_CONFIG'), ('words', words, 'SONG_WORDS')]:
    (folder / f'{name}.json').write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding='utf-8')
    (folder / f'{name}.js').write_text(f'window.{var} = ' + json.dumps(obj, ensure_ascii=False) + ';\n', encoding='utf-8')

def stamp(t):
    ms = round(t * 1000); return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}'

(folder / 'No me creas.srt').write_text('\n\n'.join(f'{i + 1}\n{stamp(a)} --> {stamp(b)}\n{s}' for i, (a, b, s) in enumerate(rows)) + '\n', encoding='utf-8')
print(f'{len(rows)} phrases, {sum(map(len, lines))} words, {matched} exact ASR anchors. Duration {data["duration"]} s, {data["bpm"]} BPM.')
