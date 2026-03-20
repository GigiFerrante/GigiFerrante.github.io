let score = 0;
let currentIdx = 0;
let currentMode = '';
let currentDiff = '';
let sessionData = [];
let currentSolutions = {};
let attempts = 0; // Reset a ogni nuovo esercizio

const dbInteri = {
    easy: [
        {q: [{t:'f', v:12}, {t:'o', v:'+'}, {t:'i', id:'a1', a:8}, {t:'o', v:'='}, {t:'f', v:20}]},
        {q: [{t:'f', v:30}, {t:'o', v:'-'}, {t:'i', id:'a1', a:15}, {t:'o', v:'='}, {t:'f', v:15}]},
        {q: [{t:'i', id:'a1', a:7}, {t:'o', v:'+'}, {t:'f', v:13}, {t:'o', v:'='}, {t:'f', v:20}]},
        {q: [{t:'f', v:50}, {t:'o', v:'-'}, {t:'i', id:'a1', a:25}, {t:'o', v:'='}, {t:'f', v:25}]},
        {q: [{t:'f', v:9}, {t:'o', v:'+'}, {t:'i', id:'a1', a:9}, {t:'o', v:'='}, {t:'f', v:18}]},
        {q: [{t:'f', v:100}, {t:'o', v:'-'}, {t:'i', id:'a1', a:1}, {t:'o', v:'='}, {t:'f', v:99}]},
        {q: [{t:'i', id:'a1', a:40}, {t:'o', v:'+'}, {t:'f', v:60}, {t:'o', v:'='}, {t:'f', v:100}]},
        {q: [{t:'f', v:15}, {t:'o', v:'+'}, {t:'i', id:'a1', a:15}, {t:'o', v:'='}, {t:'f', v:30}]},
        {q: [{t:'f', v:45}, {t:'o', v:'-'}, {t:'i', id:'a1', a:5}, {t:'o', v:'='}, {t:'f', v:40}]},
        {q: [{t:'f', v:8}, {t:'o', v:'+'}, {t:'i', id:'a1', a:32}, {t:'o', v:'='}, {t:'f', v:40}]}
    ],
    medium: [
        {q: [{t:'f', v:6}, {t:'o', v:'x'}, {t:'i', id:'a1', a:7}, {t:'o', v:'='}, {t:'f', v:42}]},
        {q: [{t:'i', id:'a1', a:9}, {t:'o', v:'x'}, {t:'i', id:'a2', a:4}, {t:'o', v:'='}, {t:'f', v:36}]},
        {q: [{t:'f', v:81}, {t:'o', v:'/'}, {t:'i', id:'a1', a:9}, {t:'o', v:'='}, {t:'f', v:9}]},
        {q: [{t:'f', v:12}, {t:'o', v:'x'}, {t:'i', id:'a1', a:3}, {t:'o', v:'='}, {t:'f', v:36}]},
        {q: [{t:'f', v:100}, {t:'o', v:'/'}, {t:'i', id:'a1', a:4}, {t:'o', v:'='}, {t:'f', v:25}]},
        {q: [{t:'i', id:'a1', a:13}, {t:'o', v:'x'}, {t:'f', v:2}, {t:'o', v:'='}, {t:'i', id:'a2', a:26}]},
        {q: [{t:'f', v:56}, {t:'o', v:'/'}, {t:'i', id:'a1', a:8}, {t:'o', v:'='}, {t:'f', v:7}]},
        {q: [{t:'f', v:15}, {t:'o', v:'x'}, {t:'i', id:'a1', a:4}, {t:'o', v:'='}, {t:'f', v:60}]},
        {q: [{t:'i', id:'a1', a:11}, {t:'o', v:'x'}, {t:'i', id:'a2', a:11}, {t:'o', v:'='}, {t:'f', v:121}]},
        {q: [{t:'f', v:150}, {t:'o', v:'/'}, {t:'i', id:'a1', a:3}, {t:'o', v:'='}, {t:'f', v:50}]}
    ],
    hard: [
        {q: [{t:'f', v:'√144'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:8}, {t:'o', v:'='}, {t:'f', v:20}]},
        {q: [{t:'f', v:'3³'}, {t:'o', v:'-'}, {t:'i', id:'a1', a:7}, {t:'o', v:'='}, {t:'f', v:20}]},
        {q: [{t:'f', v:'2⁵'}, {t:'o', v:'/'}, {t:'i', id:'a1', a:4}, {t:'o', v:'='}, {t:'f', v:8}]},
        {q: [{t:'f', v:'√81'}, {t:'o', v:'x'}, {t:'i', id:'a1', a:9}, {t:'o', v:'='}, {t:'f', v:81}]},
        {q: [{t:'f', v:'10²'}, {t:'o', v:'-'}, {t:'i', id:'a1', a:25}, {t:'o', v:'='}, {t:'f', v:75}]},
        {q: [{t:'f', v:'√100'}, {t:'o', v:'x'}, {t:'i', id:'a1', a:10}, {t:'o', v:'='}, {t:'f', v:100}]},
        {q: [{t:'f', v:'4³'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:36}, {t:'o', v:'='}, {t:'f', v:100}]},
        {q: [{t:'f', v:'√49'}, {t:'o', v:'x'}, {t:'i', id:'a1', a:7}, {t:'o', v:'='}, {t:'f', v:49}]},
        {q: [{t:'f', v:'5³'}, {t:'o', v:'/'}, {t:'i', id:'a1', a:5}, {t:'o', v:'='}, {t:'f', v:25}]},
        {q: [{t:'f', v:'2⁴'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:4}, {t:'o', v:'='}, {t:'f', v:20}]}
    ]
};

const dbFrazioni = {
    easy: [
        {q: [{t:'f', v:'1/2'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:'1/2'}, {t:'o', v:'='}, {t:'f', v:1}], v:[0.5, 0.5]},
        {q: [{t:'f', v:'1/4'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:'1/4'}, {t:'o', v:'='}, {t:'f', v:'2/4'}], v:[0.25, 0.25]},
        {q: [{t:'f', v:'3/8'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:'1/8'}, {t:'o', v:'='}, {t:'f', v:'4/8'}], v:[0.37, 0.12]},
        {q: [{t:'f', v:'1/3'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:'1/3'}, {t:'o', v:'='}, {t:'f', v:'2/3'}], v:[0.33, 0.33]},
        {q: [{t:'f', v:'2/5'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:'2/5'}, {t:'o', v:'='}, {t:'f', v:'4/5'}], v:[0.4, 0.4]},
        {q: [{t:'f', v:'1/6'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:'4/6'}, {t:'o', v:'='}, {t:'f', v:'5/6'}], v:[0.16, 0.66]},
        {q: [{t:'f', v:'2/10'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:'7/10'}, {t:'o', v:'='}, {t:'f', v:'9/10'}], v:[0.2, 0.7]},
        {q: [{t:'f', v:'1/5'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:'1/5'}, {t:'o', v:'='}, {t:'f', v:'2/5'}], v:[0.2, 0.2]},
        {q: [{t:'f', v:'4/9'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:'4/9'}, {t:'o', v:'='}, {t:'f', v:'8/9'}], v:[0.44, 0.44]},
        {q: [{t:'f', v:'1/8'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:'1/8'}, {t:'o', v:'='}, {t:'f', v:'2/8'}], v:[0.12, 0.12]}
    ],
    medium: [
        {q: [{t:'f', v:'1/2'}, {t:'o', v:'-'}, {t:'i', id:'a1', a:'1/4'}, {t:'o', v:'='}, {t:'f', v:'1/4'}]},
        {q: [{t:'f', v:'3/4'}, {t:'o', v:'-'}, {t:'i', id:'a1', a:'1/2'}, {t:'o', v:'='}, {t:'f', v:'1/4'}]},
        {q: [{t:'f', v:'5/6'}, {t:'o', v:'-'}, {t:'i', id:'a1', a:'1/3'}, {t:'o', v:'='}, {t:'f', v:'1/2'}]},
        {q: [{t:'f', v:'1'}, {t:'o', v:'-'}, {t:'i', id:'a1', a:'2/3'}, {t:'o', v:'='}, {t:'f', v:'1/3'}]},
        {q: [{t:'f', v:'7/8'}, {t:'o', v:'-'}, {t:'i', id:'a1', a:'3/8'}, {t:'o', v:'='}, {t:'f', v:'1/2'}]},
        {q: [{t:'f', v:'4/5'}, {t:'o', v:'-'}, {t:'i', id:'a1', a:'1/5'}, {t:'o', v:'='}, {t:'f', v:'3/5'}]},
        {q: [{t:'f', v:'1/2'}, {t:'o', v:'+'}, {t:'i', id:'a1', a:'1/3'}, {t:'o', v:'='}, {t:'f', v:'5/6'}]},
        {q: [{t:'f', v:'2/3'}, {t:'o', v:'-'}, {t:'i', id:'a1', a:'1/6'}, {t:'o', v:'='}, {t:'f', v:'1/2'}]},
        {q: [{t:'f', v:'9/10'}, {t:'o', v:'-'}, {t:'i', id:'a1', a:'2/5'}, {t:'o', v:'='}, {t:'f', v:'1/2'}]},
        {q: [{t:'f', v:'3/5'}, {t:'o', v:'-'}, {t:'i', id:'a1', a:'1/10'}, {t:'o', v:'='}, {t:'f', v:'1/2'}]}
    ],
    hard: [
        {q: [{t:'f', v:'1/2'}, {t:'o', v:'x'}, {t:'i', id:'a1', a:'1/2'}, {t:'o', v:'='}, {t:'f', v:'1/4'}]},
        {q: [{t:'f', v:'3/4'}, {t:'o', v:'/'}, {t:'i', id:'a1', a:'3/4'}, {t:'o', v:'='}, {t:'f', v:1}]},
        {q: [{t:'f', v:'2/3'}, {t:'o', v:'x'}, {t:'i', id:'a1', a:'3/2'}, {t:'o', v:'='}, {t:'f', v:1}]},
        {q: [{t:'f', v:'5/2'}, {t:'o', v:'/'}, {t:'i', id:'a1', a:'5/4'}, {t:'o', v:'='}, {t:'f', v:2}]},
        {q: [{t:'f', v:'1/3'}, {t:'o', v:'x'}, {t:'i', id:'a1', a:'3/4'}, {t:'o', v:'='}, {t:'f', v:'1/4'}]},
        {q: [{t:'f', v:'2/5'}, {t:'o', v:'/'}, {t:'i', id:'a1', a:'1/5'}, {t:'o', v:'='}, {t:'f', v:2}]},
        {q: [{t:'f', v:'4/7'}, {t:'o', v:'x'}, {t:'i', id:'a1', a:'7/4'}, {t:'o', v:'='}, {t:'f', v:1}]},
        {q: [{t:'f', v:'3/10'}, {t:'o', v:'/'}, {t:'i', id:'a1', a:'3/5'}, {t:'o', v:'='}, {t:'f', v:'1/2'}]},
        {q: [{t:'f', v:'1/5'}, {t:'o', v:'x'}, {t:'i', id:'a1', a:5}, {t:'o', v:'='}, {t:'f', v:1}]},
        {q: [{t:'f', v:'6/5'}, {t:'o', v:'/'}, {t:'i', id:'a1', a:2}, {t:'o', v:'='}, {t:'f', v:'3/5'}]}
    ]
};

function resetToMenu() {
    // 1. Nascondi i contenitori di gioco e statistiche
    document.getElementById('grid-container').style.display = 'none';
    document.getElementById('visual-helper').innerHTML = '';
    document.getElementById('prog-text').style.display = 'none';
    document.getElementById('diff-badge').style.display = 'none';
    document.getElementById('mode-badge').style.display = 'none';
    
    // 2. Nascondi i pulsanti di controllo
    document.getElementById('check-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    
    // 3. Pulisci i messaggi
    document.getElementById('feedback').innerText = '';
    document.getElementById('attempt-info').innerText = '';
    
    // 4. Mostra di nuovo la selezione modalità
    document.getElementById('mode-box').style.display = 'block';
    document.getElementById('diff-box').style.display = 'none';

    // 5. Reset variabili sessione (opzionale, se vuoi che il punteggio riparta da zero)
    currentIdx = 0;
    // score = 0; // Decommenta se vuoi resettare i punti tornando al menù
    // document.getElementById('score').innerText = score;
}

// Aggiorna anche showFinalResult per permettere di tornare al menu invece di ricaricare la pagina
function nextLevel() {
    currentIdx++;
    if(currentIdx < 10) loadLevel();
    else {
        document.getElementById('grid-container').innerHTML = `<h2>🏆 Sfida Completata!</h2><p>Hai totalizzato ${score} punti!</p>`;
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('check-btn').style.display = 'none';
        document.getElementById('prog-text').style.display = 'none';
        document.getElementById('back-btn').style.display = 'block'; // Assicurati che sia visibile alla fine
        document.getElementById('back-btn').innerText = "Ricomincia un'altra sfida";
    }
}

function selectMode(m) {
    currentMode = m;
    document.getElementById('mode-box').style.display = 'none';
    document.getElementById('diff-box').style.display = 'block';
    document.getElementById('mode-badge').innerText = m === 'integers' ? '🔢 Interi' : '🍕 Frazioni';
    document.getElementById('mode-badge').style.display = 'inline-block';
}

function initSession(d) {
    currentDiff = d;
    currentIdx = 0;
    score = 0;
    const base = currentMode === 'integers' ? dbInteri[d] : dbFrazioni[d];
    sessionData = [...base].sort(() => Math.random() - 0.5);
    
    document.getElementById('diff-box').style.display = 'none';
    document.getElementById('grid-container').style.display = 'flex';
    document.getElementById('prog-text').style.display = 'block';
    document.getElementById('diff-badge').style.display = 'inline-block';
    document.getElementById('diff-badge').innerText = d;
    document.getElementById('diff-badge').className = `badge bg-${d}`;
    
    document.getElementById('back-btn').style.display = 'block'; // Mostra il tasto quando inizia il gioco
    loadLevel();
}

function loadLevel() {
    attempts = 0; // Reset tentativi
    const container = document.getElementById('grid-container');
    const helper = document.getElementById('visual-helper');
    container.innerHTML = '';
    helper.innerHTML = '';
    currentSolutions = {};
    
    document.getElementById('current-step').innerText = currentIdx + 1;
    document.getElementById('check-btn').style.display = 'block';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('feedback').innerText = '';

    const level = sessionData[currentIdx];

    document.getElementById('attempt-info').innerText = "1° tentativo: +100 punti in palio";

    // Aiuto visivo pizze
    if(currentMode === 'fractions' && currentDiff === 'easy' && level.v) {
        level.v.forEach(p => {
            helper.innerHTML += `<div class="pizza" style="--p:${p*100}%"></div>`;
        });
    }

    level.q.forEach(item => {
        if(item.t === 'f') {
            container.innerHTML += `<div class="circle fixed">${format(item.v)}</div>`;
        } else if(item.t === 'o') {
            container.innerHTML += `<div class="operator">${item.v}</div>`;
        } else {
            container.innerHTML += `<input type="text" class="circle-input" data-id="${item.id}" placeholder="?">`;
            currentSolutions[item.id] = item.a;
        }
    });
}

function format(val) {
    if(String(val).includes('/')) {
        const [n, d] = val.split('/');
        return `<div class="fraction"><span class="num">${n}</span><span>${d}</span></div>`;
    }
    return val;
}

function checkAnswers() {
    attempts++; // Incrementa il numero di tentativi effettuati
    const inputs = document.querySelectorAll('.circle-input');
    let allOk = true;

    inputs.forEach(input => {
        const id = input.dataset.id;
        if(input.value.trim() == currentSolutions[id]) {
            input.style.borderColor = 'var(--success)';
        } else {
            input.style.borderColor = 'var(--error)';
            allOk = false;
        }
    });

    const fb = document.getElementById('feedback');
    const ai = document.getElementById('attempt-info');

    if(allOk) {
        // Logica punteggio: 100, 50, 20 o 10 punti
        let pointsEarned = attempts === 1 ? 100 : attempts === 2 ? 50 : attempts === 3 ? 20 : 10;

        fb.innerText = "✨ Bravissimo! Risposta corretta.";
        fb.style.color = 'var(--success)';
        score += pointsEarned;
        
        document.getElementById('score').innerText = score;
        document.getElementById('check-btn').style.display = 'none';
        document.getElementById('next-btn').style.display = 'block';
    } else {
        fb.innerText = "🤔 Uhm, qualcosa non torna. Riprova!";
        fb.style.color = 'var(--error)';
        // Suggerimento sui punti rimanenti
        let nextPoints = attempts === 1 ? 50 : attempts === 2 ? 20 : 10;
        ai.innerText = `Prossimo tentativo vale: ${nextPoints} punti`;
    }
}

function confirmReset() {
    const userConfirmed = confirm("Attenzione: tornando al menù perderai i progressi della sfida attuale. Vuoi procedere?");
    if (userConfirmed) {
        resetToMenu();
    }
}

function nextLevel() {
    currentIdx++;
    if(currentIdx < 10) loadLevel();
    else {
        document.getElementById('grid-container').innerHTML = `<h2>🏆 Sfida Completata!</h2><p>Hai totalizzato ${score} punti!</p>`;
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('prog-text').style.display = 'none';
    }
}