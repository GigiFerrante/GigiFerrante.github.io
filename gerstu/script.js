
/* ============================================================
   DATA
   ============================================================ */
const HOSTS=[
  {id:'h1',name:'Maria Rossi',age:72,photo:'https://randomuser.me/api/portraits/women/65.jpg',city:'Bolzano',neighborhood:'Centro Storico',address:'Via dei Portici 14',price:320,room:'Camera singola con balcone',area:18,floor:2,description:'Sono una ex-insegnante di italiano, vedova, che ama la compagnia. Offro una camera luminosa con balcone affacciato sui portici medievali. Casa pulita, tranquilla, con cucina condivisa. Cerco studenti seri e rispettosi. Amo il teatro e la buona lettura.',apartment:'Appartamento classico al secondo piano con vista sui portici medievali. Cucina attrezzata, bagno condiviso, riscaldamento centralizzato incluso. Wi-Fi veloce. Possibilità di usare la sala in orari concordati.',amenities:['Wi-Fi','Riscaldamento incluso','Cucina condivisa','Balcone','Lavatrice'],rules:['No fumo','Rientro entro mezzanotte in settimana','No animali'],rating:4.8,reviews:[{student:'Luca Ferrari',date:'2025-10',text:'Maria è una host meravigliosa. La camera era pulita e la casa calda. Si è preoccupata per i miei esami con dolcezza materna.',rating:5},{student:'Giulia Bianchi',date:'2025-06',text:'Esperienza ottima. La posizione è perfetta, a 5 minuti dall\'università. Maria prepara spesso il caffè la mattina!',rating:5},{student:'Marco Neri',date:'2025-02',text:'Camera bella, casa ordinata. Il limite del rientro a mezzanotte va benissimo per uno studente mattiniero.',rating:4}],available:true,matchedWith:'s3'},
  {id:'h2',name:'Giovanni Mair',age:68,photo:'https://randomuser.me/api/portraits/men/72.jpg',city:'Bolzano',neighborhood:'Gries',address:'Viale Druso 88',price:280,room:'Camera doppia uso singolo',area:22,floor:1,description:'Ex-ingegnere, bilingue italiano-tedesco, appassionato di montagna e fotografia. La mia casa è grande e silenziosa. Sono autonomo e rispetto la privacy. Cerco uno studente tranquillo, preferibilmente di ingegneria o scienze.',apartment:'Appartamento moderno al primo piano nel quartiere Gries, vicino al parco. Camera spaziosa con scrivania professionale. Bagno privato incluso. Cantina disponibile per biciclette.',amenities:['Wi-Fi fibra','Bagno privato','Scrivania','Parcheggio bici','Balcone','Frigorifero in camera'],rules:['Silenzio dopo le 22:00','No feste','Rispetto spazi comuni'],rating:4.6,reviews:[{student:'Anna Weiss',date:'2025-09',text:'Giovanni è un host discreto e rispettoso. La camera è grande e il bagno privato è un lusso raro. Consigliatissimo!',rating:5},{student:'Pietro Moretti',date:'2025-05',text:'Ottima sistemazione. Giovanni parla tedesco perfettamente, utile per integrarsi meglio a Bolzano.',rating:4}],available:true,matchedWith:'s7'},
  {id:'h3',name:'Elsa Gruber',age:75,photo:'https://randomuser.me/api/portraits/women/68.jpg',city:'Bolzano',neighborhood:'Europa-Novacella',address:'Via Europa 42',price:250,room:'Mansarda indipendente',area:25,floor:3,description:'Sono una nonna vivace che parla tre lingue. Offro la mia mansarda ristrutturata con ingresso indipendente. Amo fare torte e cucinare. Lo studente avrà massima autonomia ma può partecipare ai pranzi domenicali.',apartment:'Mansarda ristrutturata con ingresso separato, finestre a vasistas e travi a vista. Piccolo angolo cottura, bagno privato. Vista sulle Dolomiti. Perfetta per chi vuole indipendenza senza isolarsi.',amenities:['Wi-Fi','Ingresso indipendente','Angolo cottura','Bagno privato','Vista Dolomiti'],rules:['Rispetto del vicinato','Nessuna restrizione di orario'],rating:4.9,reviews:[{student:'Sofia Keller',date:'2025-11',text:'La mansarda di Elsa è un sogno! Indipendenza totale ma calore umano quando ne hai voglia. La torta della domenica è leggendaria.',rating:5},{student:'Davide Costa',date:'2025-07',text:'Perfetta per studiare. Silenziosa, luminosa, e Elsa è discreta. Vista sulle Dolomiti dal letto!',rating:5},{student:'Emma Huber',date:'2025-03',text:'Ho trascorso 8 mesi qui e sono stati i migliori della mia vita universitaria. Elsa è una persona speciale.',rating:5}],available:false,matchedWith:'s1'},
  {id:'h4',name:'Angelo Conti',age:70,photo:'https://randomuser.me/api/portraits/men/75.jpg',city:'Bolzano',neighborhood:'Don Bosco',address:'Via Palermo 5',price:300,room:'Camera con studio separato',area:30,floor:0,description:'Ex-avvocato in pensione. Vivo solo in un grande appartamento al piano terra con giardino. Offro una camera con studio separato, ideale per chi ha bisogno di concentrarsi. Cerco studenti di giurisprudenza o scienze politiche.',apartment:'Piano terra con accesso al giardino privato. Camera da letto separata dallo studio con scrivania doppia. Cucina moderna completamente attrezzata condivisa.',amenities:['Wi-Fi','Giardino privato','Studio separato','Cucina moderna','Lavatrice','Asciugatrice'],rules:['No fumo in casa','Rispetto del giardino'],rating:4.5,reviews:[{student:'Chiara Romano',date:'2025-08',text:'Angelo è gentilissimo e il giardino in estate è magnifico per studiare. Lo studio separato è comodissimo.',rating:5}],available:true,matchedWith:null},
  {id:'h5',name:'Hildegard Pichler',age:73,photo:'https://randomuser.me/api/portraits/women/71.jpg',city:'Bolzano',neighborhood:'Centro',address:'Piazza Walther 3',price:400,room:'Camera di lusso con terrazza',area:28,floor:3,description:'Vivo in un appartamento storico nel cuore di Bolzano. Offro una camera elegante con terrazza privata. Ex-dirigente bancaria, sono ordinata e precisa. Cerco studenti maturi e affidabili, preferibilmente di economia.',apartment:'Palazzo storico in piazza Walther. Camera elegante con stucchi e parquet originali. Terrazza privata con vista sulla cattedrale. Colazione inclusa.',amenities:['Wi-Fi fibra','Terrazza privata','Colazione inclusa','Vista Duomo','Riscaldamento','Lavanderia'],rules:['Massima cura degli spazi','Nessun ospite in camera','Rientro entro le 23:30'],rating:4.7,reviews:[{student:'Federica Longo',date:'2025-10',text:'Posizione imbattibile e camera stupenda. Hildegard è esigente ma giusta. La terrazza al tramonto non ha prezzo.',rating:5},{student:'Thomas Mair',date:'2025-04',text:'Ottima esperienza. La colazione inclusa fa grande differenza. Un po\' cara ma ne vale la pena.',rating:4}],available:true,matchedWith:null},
  {id:'h6',name:'Renato Delai',age:66,photo:'https://randomuser.me/api/portraits/men/68.jpg',city:'Bolzano',neighborhood:'Oltrisarco',address:'Via Resia 12',price:230,room:'Camera singola economica',area:14,floor:1,description:'Sono un ex-operaio andato in pensione. Casa semplice ma pulita. Cucino volentieri e mangiamo spesso insieme. Cerco un ragazzo o una ragazza tranquilli che vogliano risparmiare senza rinunciare a una casa vera.',apartment:'Appartamento semplice e accogliente nel quartiere Oltrisarco. Camera piccola ma funzionale. Cucina condivisa, pasti comuni se gradito. Bus per università a 200 metri.',amenities:['Wi-Fi','Pasti inclusi (opzionale)','Bus vicino','Cucina condivisa'],rules:['Rispetto reciproco','Collaborazione nelle pulizie'],rating:4.4,reviews:[],available:true,matchedWith:null},
  {id:'h7',name:'Carmela Esposito',age:69,photo:'https://randomuser.me/api/portraits/women/74.jpg',city:'Bolzano',neighborhood:'Rencio',address:'Via Rencio 7',price:260,room:'Camera con bagno en-suite',area:20,floor:0,description:'Napoletana trapiantata a Bolzano da 40 anni. Casa vivace e accogliente. Adoro cucinare piatti tipici meridionali. La mia porta è sempre aperta. Cerco studenti del Sud Italia che sentono la nostalgia di casa.',apartment:'Villetta a schiera con piccolo giardino. Camera al piano terra con bagno en-suite. Accesso diretto al giardino. Atmosfera familiare, cucina con sapori del Sud.',amenities:['Wi-Fi','Bagno en-suite','Giardino','Cucina meridionale','Parcheggio auto'],rules:['Come in famiglia','Rispetto degli orari dei pasti'],rating:4.8,reviews:[],available:true,matchedWith:null},
  {id:'h8',name:'Herbert Hofer',age:71,photo:'https://randomuser.me/api/portraits/men/71.jpg',city:'Bolzano',neighborhood:'Firmian',address:'Via Firmiano 33',price:290,room:'Camera moderna con desk pro',area:19,floor:2,description:'Ex-professore universitario di matematica. Ho allestito la camera con scrivania professionale e luce ottimale. Cerco studenti di materie STEM seri e motivati.',apartment:'Appartamento moderno nel quartiere Firmian. Camera attrezzata come studio professionale. Connessione ultra-veloce. Biblioteca condivisa con oltre 1000 volumi tecnici.',amenities:['Wi-Fi 1Gbps','Scrivania premium','Biblioteca','Monitor aggiuntivo','Stampante'],rules:['Silenzio totale 8-22 feriali','Rispetto libri'],rating:4.6,reviews:[],available:true,matchedWith:null},
  {id:'h9',name:'Lucia Trentini',age:74,photo:'https://randomuser.me/api/portraits/women/77.jpg',city:'Bolzano',neighborhood:'Dodiciville',address:'Via Dodici Comuni 8',price:270,room:'Camera singola con angolo relax',area:16,floor:1,description:'Ex-infermiera, ho grande rispetto per chi studia medicina o professioni sanitarie. La mia casa è silenziosa e accogliente. Massima flessibilità sugli orari per chi ha turni.',apartment:'Appartamento tranquillo con cortile interno. Camera con angolo lettura, illuminazione morbida. Frigorifero personale in camera. Vicino all\'ospedale centrale.',amenities:['Wi-Fi','Frigorifero personale','Angolo relax','Vicino ospedale','Nessun vincolo orario'],rules:['Rispetto del riposo altrui','No rumori forti notturni'],rating:4.7,reviews:[],available:true,matchedWith:null},
  {id:'h10',name:'Bruno Castelli',age:67,photo:'https://randomuser.me/api/portraits/men/77.jpg',city:'Bolzano',neighborhood:'Rentsch',address:'Via Renon 21',price:310,room:'Bilocale semi-indipendente',area:35,floor:0,description:'Ex-chef stellato, ora vivo del mio orto e della mia passione per la cucina. Offro un bilocale con cucina propria. Chi vuole impara a cucinare con me. Cerco studenti curiosi che amino la buona tavola.',apartment:'Bilocale al piano terra con cucina autonoma e uscita sul terrazzo-orto. Semi-indipendente con privacy totale. Chef disponibile per lezioni di cucina. Prodotti dell\'orto inclusi.',amenities:['Wi-Fi','Cucina autonoma','Terrazzo-orto','Lezioni di cucina','Prodotti freschi','Parcheggio'],rules:['Rispetto dell\'orto','No sprechi alimentari'],rating:4.9,reviews:[],available:true,matchedWith:null}
];

const STUDENTS=[
  {id:'s1',name:'Emma Bauer',age:22,photo:'https://randomuser.me/api/portraits/women/32.jpg',origin:'Merano',university:'Libera Università di Bolzano',faculty:'Design e Arti',year:2,budget:250,description:'Studentessa di design, creativa e ordinata. Amo l\'indipendenza ma apprezzo il calore umano. Cerco una sistemazione silenziosa dove poter disegnare e studiare. Non fumo, raro consumo di alcol.',interests:['Arte','Design','Fotografia','Montagna'],languages:['Italiano','Tedesco','Inglese'],matchedWith:'h3'},
  {id:'s2',name:'Marco Pellegrini',age:24,photo:'https://randomuser.me/api/portraits/men/32.jpg',origin:'Milano',university:'Libera Università di Bolzano',faculty:'Informatica',year:3,budget:350,description:'Programmatore appassionato, nottambulo occasionale ma rispettoso. Cerco connessione internet veloce sopra tutto. Pulito e ordinato. Adoro le serie TV e il running mattutino.',interests:['Coding','Gaming','Running','Cinema'],languages:['Italiano','Inglese'],matchedWith:null},
  {id:'s3',name:'Chiara Mancini',age:21,photo:'https://randomuser.me/api/portraits/women/35.jpg',origin:'Napoli',university:'Libera Università di Bolzano',faculty:'Scienze della Formazione',year:1,budget:320,description:'Prima volta lontana da casa, cerco un ambiente familiare e accogliente. Sono socievole, amo leggere e cucinare. Rispettosa e responsabile. Sogno di diventare insegnante.',interests:['Lettura','Cucina','Teatro','Lingue'],languages:['Italiano','Francese'],matchedWith:'h1'},
  {id:'s4',name:'Felix Gruber',age:23,photo:'https://randomuser.me/api/portraits/men/35.jpg',origin:'Vienna',university:'Libera Università di Bolzano',faculty:'Ingegneria Industriale',year:2,budget:300,description:'Studente austriaco con ottimo italiano. Preciso, puntuale, silenzioso. Amo la bicicletta e l\'escursionismo. Studio molto ma so anche rilassarmi.',interests:['Ciclismo','Escursionismo','Musica classica','Ingegneria'],languages:['Tedesco','Italiano','Inglese'],matchedWith:null},
  {id:'s5',name:'Sara Conti',age:25,photo:'https://randomuser.me/api/portraits/women/38.jpg',origin:'Roma',university:'Libera Università di Bolzano',faculty:'Giurisprudenza',year:4,budget:350,description:'Studentessa fuori sede al quarto anno. Seria, autonoma, abituata a vivere da sola. Cerco tranquillità e concentrazione per la tesi. Pago sempre puntualmente.',interests:['Diritto','Yoga','Viaggio','Letteratura'],languages:['Italiano','Inglese','Spagnolo'],matchedWith:null},
  {id:'s6',name:'Lena Hofer',age:20,photo:'https://randomuser.me/api/portraits/women/41.jpg',origin:'Brunico',university:'Libera Università di Bolzano',faculty:'Economia e Management',year:1,budget:400,description:'Studentessa locale che preferisce vivere in appartamento per acquisire autonomia. Posso permettermi qualcosa di più confortevole. Amo la moda e lo sport.',interests:['Moda','Sci','Tennis','Economia'],languages:['Tedesco','Italiano','Inglese'],matchedWith:null},
  {id:'s7',name:'Andrea Marini',age:22,photo:'https://randomuser.me/api/portraits/men/38.jpg',origin:'Trento',university:'Libera Università di Bolzano',faculty:'Ingegneria Civile',year:2,budget:280,description:'Trentino, conosco bene la cultura alpina. Bilingue italiano-tedesco. Ordinato, puntuale, amante della montagna. Cerco un host con cui condividere qualche escursione.',interests:['Montagna','Fotografia','Ingegneria','Sci alpino'],languages:['Italiano','Tedesco'],matchedWith:'h2'},
  {id:'s8',name:'Valentina Russo',age:23,photo:'https://randomuser.me/api/portraits/women/44.jpg',origin:'Catania',university:'Libera Università di Bolzano',faculty:'Scienze Infermieristiche',year:3,budget:270,description:'Studentessa di infermieristica con turni variabili. Cerco massima flessibilità oraria. Discreta, silenziosa, rispettosa. Mi sono adattata alla montagna.',interests:['Salute','Danza','Cucina siciliana','Romanzi'],languages:['Italiano','Inglese'],matchedWith:null},
  {id:'s9',name:'Jonas Weber',age:21,photo:'https://randomuser.me/api/portraits/men/41.jpg',origin:'Monaco',university:'Libera Università di Bolzano',faculty:'Scienze Naturali',year:1,budget:310,description:'Tedesco con grande passione per l\'ambiente. Vegano, minimalista, zero-waste. Cerco un host che condivida valori ecologici. Studio le Dolomiti da bambino.',interests:['Ecologia','Arrampicata','Veganismo','Botanica'],languages:['Tedesco','Italiano','Inglese'],matchedWith:null},
  {id:'s10',name:'Giulia Ferrari',age:24,photo:'https://randomuser.me/api/portraits/women/47.jpg',origin:'Firenze',university:'Libera Università di Bolzano',faculty:'Ingegneria Informatica',year:3,budget:290,description:'Ingegnera informatica fiorentina. Amo cucinare e i board game. Cerco una casa tranquilla con buona connessione. Seria nello studio ma amante della convivialità.',interests:['Coding','Board game','Cucina','Cinema indie'],languages:['Italiano','Inglese','Francese'],matchedWith:null}
];

const MATCHES=[
  {id:'m1',hostId:'h3',studentId:'s1',date:'2025-09-01',score:98,reasons:['La mansarda con ingresso indipendente è perfetta per la creatività di Emma','Emma apprezza l\'autonomia ma ama il calore umano offerto da Elsa','Interessi comuni: arte, fotografia e cultura alpina','Budget compatibile al 100% (€250 = €250)','Entrambe multilingue (italiano/tedesco/inglese)'],active:true},
  {id:'m2',hostId:'h1',studentId:'s3',date:'2025-09-15',score:96,reasons:['Maria è un\'ex-insegnante: affinità perfetta con Chiara che vuole diventare insegnante','Chiara cerca ambiente familiare, Maria offre calore e compagnia','Interessi comuni: lettura, teatro, cucina','Budget compatibile al 100% (€320 = €320)','Chiara viene dal Sud e Maria apprezza la vivacità meridionale'],active:true},
  {id:'m3',hostId:'h2',studentId:'s7',date:'2025-10-01',score:95,reasons:['Giovanni ama la montagna, Andrea è escursionista appassionato','Entrambi bilingue italiano-tedesco: comunicazione perfetta','Giovanni è ingegnere, Andrea studia ingegneria: feeling intellettuale','Budget compatibile al 100% (€280 = €280)','Entrambi amanti della fotografia e della vita alpina'],active:true}
];

/* ============================================================
   STATE
   ============================================================ */
let currentUser=null,currentRole=null,currentView='home';
let hostFilterMode='all',studentFilterMode='all';

/* ============================================================
   UTILITIES
   ============================================================ */
function getMatchForHost(id){return MATCHES.find(m=>m.hostId===id)||null}
function getMatchForStudent(id){return MATCHES.find(m=>m.studentId===id)||null}
function getHostById(id){return HOSTS.find(h=>h.id===id)}
function getStudentById(id){return STUDENTS.find(s=>s.id===id)}

function stars(r){
  let s='';
  for(let i=0;i<5;i++) s+=i<Math.round(r)?'<span class="star-f">★</span>':'<span class="star-e">☆</span>';
  return s;
}

function abadge(a){return `<span class="abadge">${a}</span>`}
function lbadge(l){return `<span class="lbadge">${l}</span>`}

function compatScore(host,student){
  let sc=50;
  if(student.budget>=host.price) sc+=30;
  else if(student.budget>=host.price*.9) sc+=15;
  const si=student.interests.filter(i=>host.description.toLowerCase().includes(i.toLowerCase())||host.apartment.toLowerCase().includes(i.toLowerCase()));
  sc+=si.length*5;
  sc+=Math.min(student.languages.length*5,15);
  return Math.min(sc,100);
}

function bestMatches(isHost,pid){
  if(isHost){
    const h=getHostById(pid);
    return STUDENTS.map(s=>({profile:s,score:compatScore(h,s)})).sort((a,b)=>b.score-a.score).slice(0,5);
  } else {
    const s=getStudentById(pid);
    return HOSTS.filter(h=>h.available).map(h=>({profile:h,score:compatScore(h,s)})).sort((a,b)=>b.score-a.score).slice(0,5);
  }
}

function roleLabel(r){return{admin:'Amministratore',host:'Host',student:'Studente'}[r]||r}

/* ============================================================
   NAVIGATION
   ============================================================ */
function showView(view,params){
  currentView=view;
  const m=document.getElementById('main-content');
  if(!m) return;
  window.scrollTo({top:0,behavior:'smooth'});
  switch(view){
    case 'home': renderHome(m); break;
    case 'login': renderLogin(m,params); break;
    case 'register': renderRegister(m,params); break;
    case 'dashboard-admin': renderAdminDashboard(m); break;
    case 'dashboard-host': renderHostDashboard(m); break;
    case 'dashboard-student': renderStudentDashboard(m); break;
    case 'host-profile': renderHostProfile(m,params); break;
    case 'student-profile': renderStudentProfile(m,params); break;
    case 'search-hosts': renderSearchHosts(m); break;
    case 'search-students': renderSearchStudents(m); break;
    case 'match-detail': renderMatchDetail(m,params); break;
    default: renderHome(m);
  }
  updateNav();
}

function updateNav(){
  const um=document.getElementById('user-menu');
  if(!um) return;
  if(currentUser){
    um.innerHTML=`<span class="ubadge ${currentRole}">${roleLabel(currentRole)}</span><span class="uname">${currentUser.name}</span><button class="btn-logout" onclick="logout()">Esci</button>`;
  } else {
    um.innerHTML=`<button class="btn-nav" onclick="showView('login',{role:'host'})">Host</button><button class="btn-nav" onclick="showView('login',{role:'student'})">Studente</button><button class="btn-nav admin" onclick="showView('login',{role:'admin'})">Admin</button>`;
  }
}

function logout(){currentUser=null;currentRole=null;showView('home')}

function loginAs(role,pid){
  if(role==='admin'){currentUser={name:'Amministratore',id:'admin'};currentRole='admin';showView('dashboard-admin')}
  else if(role==='host'){currentUser=getHostById(pid)||HOSTS[0];currentRole='host';showView('dashboard-host')}
  else{currentUser=getStudentById(pid)||STUDENTS[0];currentRole='student';showView('dashboard-student')}
}

/* ============================================================
   NAVBAR
   ============================================================ */
function buildNav(){
  const n=document.getElementById('navbar');
  if(!n) return;
  n.innerHTML=`<div class="nav-inner"><div class="nav-brand" onclick="showView('home')">🏔️ GerStu</div><div class="nav-links"><button class="nav-link" onclick="showView('search-hosts')">Host</button><button class="nav-link" onclick="showView('search-students')">Studenti</button><button class="nav-link" onclick="showView('home')">Come funziona</button></div><div class="nav-user" id="user-menu"></div></div>`;
  updateNav();
}

/* ============================================================
   HOME
   ============================================================ */
function renderHome(c){
  c.innerHTML=`
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-content">
    <div class="hero-badge">🏔️ Bolzano · Alto Adige</div>
    <h1 class="hero-title">Dove la<br><span class="accent">saggezza</span><br>incontra il<br><span class="accent">futuro</span></h1>
    <p class="hero-sub">Mettiamo in contatto anziani con una stanza libera e studenti che cercano una casa autentica. Una piattaforma per due generazioni che si arricchiscono a vicenda.</p>
    <div class="hero-cta">
      <button class="btn-p" onclick="showView('login',{role:'host'})">Sono un Host</button>
      <button class="btn-s" onclick="showView('login',{role:'student'})">Sono uno Studente</button>
    </div>
    <div class="hero-stats">
      <div><span class="stat-n">${HOSTS.length}</span><span class="stat-l">Host attivi</span></div>
      <div><span class="stat-n">${STUDENTS.length}</span><span class="stat-l">Studenti</span></div>
      <div><span class="stat-n">${MATCHES.length}</span><span class="stat-l">Match attivi</span></div>
    </div>
  </div>
  <div class="hero-visual">
    <div class="card-float cf1"><img src="${HOSTS[2].photo}" alt=""><div><strong>${HOSTS[2].name}</strong><small>€${HOSTS[2].price}/mese</small></div></div>
    <div class="card-float cf2"><img src="${STUDENTS[0].photo}" alt=""><div><strong>${STUDENTS[0].name}</strong><small>${STUDENTS[0].faculty}</small></div></div>
    <div class="match-float">✓ Match Perfetto!</div>
  </div>
</section>

<section class="section">
  <h2 class="section-title">Come funziona</h2>
  <div class="steps-grid">
    <div class="step"><div class="step-icon">📝</div><h3>Registrati</h3><p>Crea il tuo profilo come host o studente. Gratuito e veloce.</p></div>
    <div class="step"><div class="step-icon">🔍</div><h3>Cerca</h3><p>Esplora i profili. Filtra per prezzo, zona, disponibilità e interessi.</p></div>
    <div class="step"><div class="step-icon">🤝</div><h3>Connettiti</h3><p>Il nostro algoritmo calcola la compatibilità. Trova il tuo match perfetto.</p></div>
    <div class="step"><div class="step-icon">🏡</div><h3>Convivi</h3><p>Inizia la convivenza. Due generazioni che imparano l'una dall'altra.</p></div>
  </div>
</section>

<section class="section">
  <h2 class="section-title">Host in evidenza</h2>
  <div class="cards-grid">${HOSTS.slice(0,3).map(h=>hostCard(h,true)).join('')}</div>
  <div class="section-cta"><button class="btn-o" onclick="showView('search-hosts')">Vedi tutti gli host →</button></div>
</section>

<section class="section">
  <h2 class="section-title">Match perfetti attivi</h2>
  <div class="matches-grid">${MATCHES.map(matchCard).join('')}</div>
</section>

<section class="section">
  <h2 class="section-title">Cosa dicono di noi</h2>
  <div class="reviews-grid">${HOSTS.filter(h=>h.reviews.length>0).slice(0,3).map(h=>`
    <div class="review-card">
      <div class="rv-host"><img src="${h.photo}" alt="${h.name}"><div><strong>${h.reviews[0].student}</strong><span>su ${h.name}</span><div>${stars(h.reviews[0].rating)}</div></div></div>
      <p class="rv-text">"${h.reviews[0].text}"</p>
    </div>`).join('')}
  </div>
</section>`;
}

/* ============================================================
   CARDS
   ============================================================ */
function hostCard(h,compact){
  const m=getMatchForHost(h.id);
  return `<div class="host-card${m?' hm':''}" onclick="showView('host-profile',{id:'${h.id}'})">
    ${m?'<div class="ribbon match">Match Attivo</div>':''}
    ${!h.available?'<div class="ribbon off">Non disponibile</div>':''}
    <div class="card-img-wrap"><img class="card-img" src="${h.photo}" alt="${h.name}"><div class="card-price">€${h.price}<span>/mese</span></div></div>
    <div class="card-body">
      <div class="card-hi"><h3>${h.name}</h3><span class="card-age">${h.age} anni</span></div>
      <div class="card-loc">📍 ${h.neighborhood}, Bolzano</div>
      <div class="card-room">🛏️ ${h.room} · ${h.area}m²</div>
      ${h.rating?`<div class="card-rat">${stars(h.rating)} <small>${h.rating}/5 (${h.reviews.length} rec.)</small></div>`:''}
      ${compact?'':`<p class="card-desc">${h.description.slice(0,115)}…</p>`}
      <div class="card-amen">${h.amenities.slice(0,3).map(abadge).join('')}</div>
    </div></div>`;
}

function studentCard(s,compact){
  const m=getMatchForStudent(s.id);
  return `<div class="student-card${m?' sm':''}" onclick="showView('student-profile',{id:'${s.id}'})">
    ${m?'<div class="ribbon match">Match Attivo</div>':''}
    <div class="sc-top">
      <img class="s-photo" src="${s.photo}" alt="${s.name}">
      <div><h3 style="font-family:var(--fd);font-size:1.05rem">${s.name}</h3><span class="s-age">${s.age} anni · ${s.origin}</span><div class="s-uni">🎓 ${s.faculty} · Anno ${s.year}</div><div class="s-budget">💶 Budget: €${s.budget}/mese</div></div>
    </div>
    ${compact?'':`<p class="card-desc">${s.description.slice(0,110)}…</p>`}
    <div class="card-langs">${s.languages.map(lbadge).join('')}</div>
  </div>`;
}

function matchCard(m){
  const h=getHostById(m.hostId),s=getStudentById(m.studentId);
  return `<div class="match-card" onclick="showView('match-detail',{id:'${m.id}'})">
    <div class="mc-hdr"><span class="mc-score">${m.score}% compatibile</span><span class="mc-date">Dal ${new Date(m.date).toLocaleDateString('it-IT')}</span></div>
    <div class="mc-profiles">
      <div class="mc-profile"><img src="${h.photo}" alt=""><div><strong>${h.name}</strong><small>Host · ${h.neighborhood}</small></div></div>
      <div class="mc-conn"><div class="mc-line"></div><span>❤️</span><div class="mc-line"></div></div>
      <div class="mc-profile"><img src="${s.photo}" alt=""><div><strong>${s.name}</strong><small>${s.faculty}</small></div></div>
    </div>
    <div class="mc-reasons">${m.reasons.slice(0,2).map(r=>`<div class="reason-item">✓ ${r}</div>`).join('')}</div>
  </div>`;
}

/* ============================================================
   LOGIN / REGISTER
   ============================================================ */
function renderLogin(c,params){
  const role=(params&&params.role)||'host';
  c.innerHTML=`<div class="auth-wrap"><div class="auth-card">
    <div class="auth-logo">🏔️ GerStu</div>
    <h2>Accedi come <span class="accent">${roleLabel(role)}</span></h2>
    <div class="role-tabs">
      <button class="role-tab${role==='host'?' active':''}" onclick="showView('login',{role:'host'})">Host</button>
      <button class="role-tab${role==='student'?' active':''}" onclick="showView('login',{role:'student'})">Studente</button>
      <button class="role-tab${role==='admin'?' active':''}" onclick="showView('login',{role:'admin'})">Admin</button>
    </div>
    ${role==='admin'?`<div class="demo-info">🔑 Clicca per accedere come amministratore</div><button class="btn-p full" onclick="loginAs('admin')">Accedi come Admin</button>`:
      role==='host'?`<div class="demo-info">👇 Seleziona un host per esplorare la piattaforma</div>
      <div class="demo-profiles">${HOSTS.slice(0,5).map(h=>`<div class="demo-profile" onclick="loginAs('host','${h.id}')"><img src="${h.photo}" alt=""><span>${h.name.split(' ')[0]}</span></div>`).join('')}</div>
      <button class="btn-o full" onclick="showView('register',{role:'host'})">Registrati come nuovo Host →</button>`:
      `<div class="demo-info">👇 Seleziona uno studente per esplorare</div>
      <div class="demo-profiles">${STUDENTS.slice(0,5).map(s=>`<div class="demo-profile" onclick="loginAs('student','${s.id}')"><img src="${s.photo}" alt=""><span>${s.name.split(' ')[0]}</span></div>`).join('')}</div>
      <button class="btn-o full" onclick="showView('register',{role:'student'})">Registrati come nuovo Studente →</button>`}
    <div class="auth-footer"><button class="link-btn" onclick="showView('home')">← Torna alla home</button></div>
  </div></div>`;
}

function renderRegister(c,params){
  const role=(params&&params.role)||'host';
  c.innerHTML=`<div class="auth-wrap"><div class="auth-card wide">
    <div class="auth-logo">🏔️ GerStu</div>
    <h2>Registrati come <span class="accent">${roleLabel(role)}</span></h2>
    <div class="reg-form">
      <div class="form-row">
        <div class="form-group"><label>Nome</label><input type="text" placeholder="Mario" required></div>
        <div class="form-group"><label>Cognome</label><input type="text" placeholder="Rossi" required></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Email</label><input type="email" placeholder="mario@email.it" required></div>
        <div class="form-group"><label>Password</label><input type="password" placeholder="••••••••" required></div>
      </div>
      ${role==='host'?`<div class="form-row">
        <div class="form-group"><label>Età</label><input type="number" placeholder="70" min="60" max="100"></div>
        <div class="form-group"><label>Prezzo mensile (€)</label><input type="number" placeholder="280"></div>
      </div>
      <div class="form-group"><label>Quartiere a Bolzano</label><select><option value="">Seleziona quartiere</option><option>Centro Storico</option><option>Gries</option><option>Don Bosco</option><option>Europa-Novacella</option><option>Oltrisarco</option><option>Firmian</option><option>Rentsch</option><option>Dodiciville</option></select></div>
      <div class="form-group"><label>Descrizione camera</label><textarea placeholder="Descrivi la tua camera e l'appartamento..."></textarea></div>`:
      `<div class="form-row">
        <div class="form-group"><label>Età</label><input type="number" placeholder="22" min="18" max="35"></div>
        <div class="form-group"><label>Budget mensile (€)</label><input type="number" placeholder="300"></div>
      </div>
      <div class="form-group"><label>Facoltà</label><select><option value="">Seleziona facoltà</option><option>Informatica</option><option>Ingegneria Civile</option><option>Ingegneria Industriale</option><option>Economia e Management</option><option>Giurisprudenza</option><option>Design e Arti</option><option>Scienze della Formazione</option><option>Scienze Infermieristiche</option><option>Scienze Naturali</option></select></div>`}
      <button class="btn-p full" onclick="alert('Profilo creato! (Demo)');showView('login',{role:'${role}'})">Crea Profilo</button>
    </div>
    <div class="auth-footer"><button class="link-btn" onclick="showView('login',{role:'${role}'})">← Hai già un account? Accedi</button></div>
  </div></div>`;
}

/* ============================================================
   HOST PROFILE
   ============================================================ */
function renderHostProfile(c,params){
  const h=getHostById(params&&params.id);
  if(!h){showView('search-hosts');return}
  const m=getMatchForHost(h.id),stu=m?getStudentById(m.studentId):null;
  const sugg=bestMatches(true,h.id);
  c.innerHTML=`<div class="profile-wrap">
    <button class="btn-back" onclick="showView('search-hosts')">← Tutti gli host</button>
    <div class="profile-hero">
      <img class="profile-photo-lg" src="${h.photo}" alt="${h.name}">
      <div class="ph-info">
        <div class="pbadges"><span class="brole host">Host</span>${h.available?'<span class="bavail">Disponibile</span>':'<span class="bunavail">Non disponibile</span>'}</div>
        <h1>${h.name}</h1>
        <p class="ph-sub">${h.age} anni · ${h.neighborhood}, Bolzano</p>
        <div class="ph-price">€${h.price}<span>/mese</span></div>
        ${h.rating?`<div class="ph-rating">${stars(h.rating)} <strong>${h.rating}</strong>/5 · ${h.reviews.length} recensioni</div>`:''}
      </div>
    </div>
    <div class="profile-grid">
      <div>
        <div class="psection"><h2>Chi sono</h2><p>${h.description}</p></div>
        <div class="psection"><h2>La camera e l'appartamento</h2><p>${h.apartment}</p>
          <div class="room-details"><div class="room-detail">🛏️ ${h.room}</div><div class="room-detail">📐 ${h.area} m²</div><div class="room-detail">🏢 Piano ${h.floor===0?'Terra':h.floor}</div><div class="room-detail">📍 ${h.address}</div></div>
        </div>
        <div class="psection"><h2>Servizi inclusi</h2><div class="amen-list">${h.amenities.map(abadge).join('')}</div></div>
        <div class="psection"><h2>Regole della casa</h2><ul class="rules-list">${h.rules.map(r=>`<li>⚠️ ${r}</li>`).join('')}</ul></div>
        ${h.reviews.length?`<div class="psection"><h2>Recensioni</h2><div class="reviews-list">${h.reviews.map(r=>`<div class="review-item"><div class="review-meta"><strong>${r.student}</strong><span class="review-date">${r.date}</span>${stars(r.rating)}</div><p>"${r.text}"</p></div>`).join('')}</div></div>`:''}
      </div>
      <div class="pside">
        ${m&&stu?`<div class="match-box active">
          <div class="mb-title">✅ Match Attivo</div>
          <img class="ms-photo" src="${stu.photo}" alt="${stu.name}">
          <h3>${stu.name}</h3><p>${stu.faculty} · Anno ${stu.year}</p>
          <div class="ms-big">${m.score}%</div><div class="ms-lbl">Compatibilità</div>
          <button class="btn-p full" onclick="showView('match-detail',{id:'${m.id}'})">Vedi Match Dettagliato</button>
        </div>`:
        `<div class="match-box"><div class="mb-title suggest">💡 Studenti compatibili</div>
          ${sugg.slice(0,3).map(({profile:s,score})=>`<div class="sug-item" onclick="showView('student-profile',{id:'${s.id}'})"><img src="${s.photo}" alt=""><div><strong>${s.name}</strong><small>${s.faculty}</small></div><span class="sug-score">${score}%</span></div>`).join('')}
          <br><button class="btn-o full" onclick="showView('search-students')">Cerca studenti</button>
        </div>`}
      </div>
    </div>
  </div>`;
}

/* ============================================================
   STUDENT PROFILE
   ============================================================ */
function renderStudentProfile(c,params){
  const s=getStudentById(params&&params.id);
  if(!s){showView('search-students');return}
  const m=getMatchForStudent(s.id),h=m?getHostById(m.hostId):null;
  const sugg=bestMatches(false,s.id);
  c.innerHTML=`<div class="profile-wrap">
    <button class="btn-back" onclick="showView('search-students')">← Tutti gli studenti</button>
    <div class="profile-hero">
      <img class="profile-photo-lg" src="${s.photo}" alt="${s.name}">
      <div class="ph-info">
        <div class="pbadges"><span class="brole student">Studente</span>${m?'<span class="bavail">Match Attivo</span>':'<span class="bsearch">In cerca</span>'}</div>
        <h1>${s.name}</h1>
        <p class="ph-sub">${s.age} anni · da ${s.origin}</p>
        <div style="color:var(--text2);font-size:.9rem;margin-bottom:.4rem">🎓 ${s.faculty} · Anno ${s.year}</div>
        <div class="ph-price">€${s.budget}<span>/mese budget</span></div>
      </div>
    </div>
    <div class="profile-grid">
      <div>
        <div class="psection"><h2>Chi sono</h2><p>${s.description}</p></div>
        <div class="psection"><h2>Interessi</h2><div class="amen-list">${s.interests.map(i=>`<span class="abadge interest">${i}</span>`).join('')}</div></div>
        <div class="psection"><h2>Lingue parlate</h2><div class="amen-list">${s.languages.map(lbadge).join('')}</div></div>
      </div>
      <div class="pside">
        ${m&&h?`<div class="match-box active">
          <div class="mb-title">✅ Match Attivo</div>
          <img class="ms-photo" src="${h.photo}" alt="${h.name}">
          <h3>${h.name}</h3><p>${h.neighborhood} · €${h.price}/mese</p>
          <div class="ms-big">${m.score}%</div><div class="ms-lbl">Compatibilità</div>
          <button class="btn-p full" onclick="showView('match-detail',{id:'${m.id}'})">Vedi Match Dettagliato</button>
        </div>`:
        `<div class="match-box"><div class="mb-title suggest">💡 Host compatibili</div>
          ${sugg.slice(0,3).map(({profile:h,score})=>`<div class="sug-item" onclick="showView('host-profile',{id:'${h.id}'})"><img src="${h.photo}" alt=""><div><strong>${h.name}</strong><small>${h.neighborhood}</small></div><span class="sug-score">${score}%</span></div>`).join('')}
          <br><button class="btn-o full" onclick="showView('search-hosts')">Cerca host</button>
        </div>`}
      </div>
    </div>
  </div>`;
}

/* ============================================================
   MATCH DETAIL
   ============================================================ */
function renderMatchDetail(c,params){
  const m=MATCHES.find(x=>x.id===(params&&params.id));
  if(!m){showView('home');return}
  const h=getHostById(m.hostId),s=getStudentById(m.studentId);
  const circ=Math.round((m.score/100)*339.3);
  c.innerHTML=`<div class="md-wrap">
    <button class="btn-back" onclick="showView('home')">← Home</button>
    <div class="md-header">
      <div class="md-score">${m.score}%</div>
      <div class="md-lbl">Compatibilità</div>
      <h1>Match Perfetto</h1>
      <p>Attivo dal ${new Date(m.date).toLocaleDateString('it-IT')}</p>
    </div>
    <div class="md-profiles">
      <div class="md-profile" onclick="showView('host-profile',{id:'${h.id}'})">
        <img src="${h.photo}" alt="${h.name}">
        <div class="brole host" style="display:inline-block;margin-bottom:.5rem">Host</div>
        <h2>${h.name}</h2>
        <p>${h.age} anni · ${h.neighborhood}</p>
        <p>€${h.price}/mese</p>
        <div>${stars(h.rating)}</div>
      </div>
      <div class="md-center">
        <div class="compat-ring">
          <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" stroke-width="8"/><circle cx="60" cy="60" r="54" fill="none" stroke="var(--green)" stroke-width="8" stroke-dasharray="${circ} 339.3" stroke-linecap="round" transform="rotate(-90 60 60)"/></svg>
          <div class="cr-lbl">${m.score}%</div>
        </div>
        <div class="md-hearts">❤️</div>
      </div>
      <div class="md-profile" onclick="showView('student-profile',{id:'${s.id}'})">
        <img src="${s.photo}" alt="${s.name}">
        <div class="brole student" style="display:inline-block;margin-bottom:.5rem">Studente</div>
        <h2>${s.name}</h2>
        <p>${s.age} anni · ${s.origin}</p>
        <p>${s.faculty}</p>
        <div class="lang-list">${s.languages.map(lbadge).join('')}</div>
      </div>
    </div>
    <div class="md-reasons">
      <h2>Perché questo match funziona</h2>
      <div class="reasons-grid">${m.reasons.map(r=>`<div class="reason-card"><div class="ri">✅</div><p>${r}</p></div>`).join('')}</div>
    </div>
  </div>`;
}

/* ============================================================
   SEARCH HOSTS
   ============================================================ */
function renderSearchHosts(c){
  hostFilterMode='all';
  c.innerHTML=`<div class="search-wrap">
    <div class="search-hdr"><h1>Cerca un Host</h1><p>Trova la casa giusta per il tuo percorso universitario a Bolzano</p></div>
    <div class="search-filters">
      <div class="filter-group"><label>Disponibilità</label>
        <div class="filter-btns">
          <button class="fbtn active" onclick="filterHosts(this,'all')">Tutti</button>
          <button class="fbtn" onclick="filterHosts(this,'available')">Disponibili</button>
          <button class="fbtn" onclick="filterHosts(this,'matched')">Con Match</button>
        </div>
      </div>
      <div class="filter-group"><label>Prezzo max</label>
        <input type="range" id="price-range" min="200" max="420" value="420" step="10" oninput="document.getElementById('price-val').textContent='€'+this.value;applyHostFilters()">
        <span id="price-val">€420</span>
      </div>
      <div class="filter-group"><label>Quartiere</label>
        <select id="hood-select" onchange="applyHostFilters()">
          <option value="">Tutti</option>
          ${[...new Set(HOSTS.map(h=>h.neighborhood))].map(n=>`<option value="${n}">${n}</option>`).join('')}
        </select>
      </div>
    </div>
    <div id="hosts-results" class="cards-grid">${HOSTS.map(h=>hostCard(h,false)).join('')}</div>
  </div>`;
}

function filterHosts(btn,mode){
  hostFilterMode=mode;
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  applyHostFilters();
}

function applyHostFilters(){
  const maxP=parseInt(document.getElementById('price-range').value)||420;
  const hood=(document.getElementById('hood-select')||{}).value||'';
  const res=document.getElementById('hosts-results');
  if(!res) return;
  const f=HOSTS.filter(h=>{
    if(hostFilterMode==='available'&&!h.available) return false;
    if(hostFilterMode==='matched'&&!h.matchedWith) return false;
    if(h.price>maxP) return false;
    if(hood&&h.neighborhood!==hood) return false;
    return true;
  });
  res.innerHTML=f.length?f.map(h=>hostCard(h,false)).join(''):'<div class="no-results">Nessun risultato. Modifica i filtri.</div>';
}

/* ============================================================
   SEARCH STUDENTS
   ============================================================ */
function renderSearchStudents(c){
  studentFilterMode='all';
  c.innerHTML=`<div class="search-wrap">
    <div class="search-hdr"><h1>Cerca uno Studente</h1><p>Trova il coinquilino ideale per la tua casa a Bolzano</p></div>
    <div class="search-filters">
      <div class="filter-group"><label>Stato</label>
        <div class="filter-btns">
          <button class="fbtn active" onclick="filterStudents(this,'all')">Tutti</button>
          <button class="fbtn" onclick="filterStudents(this,'free')">Liberi</button>
          <button class="fbtn" onclick="filterStudents(this,'matched')">Con Match</button>
        </div>
      </div>
      <div class="filter-group"><label>Budget min</label>
        <input type="range" id="budget-range" min="200" max="420" value="200" step="10" oninput="document.getElementById('budget-val').textContent='€'+this.value;applyStudentFilters()">
        <span id="budget-val">€200</span>
      </div>
      <div class="filter-group"><label>Facoltà</label>
        <select id="faculty-select" onchange="applyStudentFilters()">
          <option value="">Tutte</option>
          ${[...new Set(STUDENTS.map(s=>s.faculty))].map(f=>`<option value="${f}">${f}</option>`).join('')}
        </select>
      </div>
    </div>
    <div id="students-results" class="cards-grid">${STUDENTS.map(s=>studentCard(s,false)).join('')}</div>
  </div>`;
}

function filterStudents(btn,mode){
  studentFilterMode=mode;
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  applyStudentFilters();
}

function applyStudentFilters(){
  const minB=parseInt(document.getElementById('budget-range').value)||200;
  const fac=(document.getElementById('faculty-select')||{}).value||'';
  const res=document.getElementById('students-results');
  if(!res) return;
  const f=STUDENTS.filter(s=>{
    if(studentFilterMode==='free'&&s.matchedWith) return false;
    if(studentFilterMode==='matched'&&!s.matchedWith) return false;
    if(s.budget<minB) return false;
    if(fac&&s.faculty!==fac) return false;
    return true;
  });
  res.innerHTML=f.length?f.map(s=>studentCard(s,false)).join(''):'<div class="no-results">Nessun risultato. Modifica i filtri.</div>';
}

/* ============================================================
   HOST DASHBOARD
   ============================================================ */
function renderHostDashboard(c){
  const h=currentUser,m=getMatchForHost(h.id),stu=m?getStudentById(m.studentId):null;
  const sugg=bestMatches(true,h.id);
  c.innerHTML=`<div class="dash-wrap">
    <div class="dash-hdr">
      <div class="dash-welcome"><img class="dash-avatar" src="${h.photo}" alt=""><div><h1>Ciao, ${h.name.split(' ')[0]}! 👋</h1><p>${h.available?'Il tuo profilo è attivo e visibile':'Il tuo profilo non è disponibile al momento'}</p></div></div>
      <div class="dash-actions"><button class="btn-o" onclick="showView('host-profile',{id:'${h.id}'})">Vedi Profilo</button><button class="btn-p" onclick="showView('search-students')">Cerca Studenti</button></div>
    </div>
    <div class="dash-stats">
      <div class="dsc"><div class="dsc-icon">👁️</div><div class="dsc-n">47</div><div class="dsc-l">Visualizzazioni</div></div>
      <div class="dsc"><div class="dsc-icon">💌</div><div class="dsc-n">${sugg.length}</div><div class="dsc-l">Match suggeriti</div></div>
      <div class="dsc"><div class="dsc-icon">⭐</div><div class="dsc-n">${h.rating||'N/A'}</div><div class="dsc-l">Valutazione</div></div>
      <div class="dsc"><div class="dsc-icon">💶</div><div class="dsc-n">€${h.price}</div><div class="dsc-l">Prezzo mensile</div></div>
    </div>
    ${m&&stu?`<div class="dash-section"><h2>Il tuo Match Attivo</h2>
      <div class="amb" onclick="showView('match-detail',{id:'${m.id}'})">
        <img src="${stu.photo}" alt="${stu.name}">
        <div class="amb-info"><h3>${stu.name}</h3><p>${stu.faculty} · Anno ${stu.year} · da ${stu.origin}</p><p>Budget: €${stu.budget}/mese</p></div>
        <div class="amb-score"><div class="score-circle">${m.score}%</div><small>Compatibilità</small></div>
        <button class="btn-p">Dettagli →</button>
      </div>
    </div>`:
    `<div class="dash-section"><h2>Candidati più compatibili per te</h2>
      <div class="sugg-list">${sugg.map(({profile:s,score})=>`
        <div class="sugg-row" onclick="showView('student-profile',{id:'${s.id}'})">
          <img src="${s.photo}" alt="${s.name}">
          <div class="sugg-info"><strong>${s.name}</strong><span>${s.faculty} · €${s.budget}/mese budget</span></div>
          <div class="sugg-score-wrap"><div class="sbar-wrap"><div class="sbar" style="width:${score}%"></div></div><span>${score}%</span></div>
        </div>`).join('')}
      </div>
    </div>`}
    ${h.reviews.length?`<div class="dash-section"><h2>Le tue recensioni</h2>${h.reviews.map(r=>`<div class="review-item"><div class="review-meta"><strong>${r.student}</strong><span class="review-date">${r.date}</span>${stars(r.rating)}</div><p>"${r.text}"</p></div>`).join('')}</div>`:''}
  </div>`;
}

/* ============================================================
   STUDENT DASHBOARD
   ============================================================ */
function renderStudentDashboard(c){
  const s=currentUser,m=getMatchForStudent(s.id),h=m?getHostById(m.hostId):null;
  const sugg=bestMatches(false,s.id);
  c.innerHTML=`<div class="dash-wrap">
    <div class="dash-hdr">
      <div class="dash-welcome"><img class="dash-avatar" src="${s.photo}" alt=""><div><h1>Ciao, ${s.name.split(' ')[0]}! 👋</h1><p>${s.faculty} · Anno ${s.year} · UniBO</p></div></div>
      <div class="dash-actions"><button class="btn-o" onclick="showView('student-profile',{id:'${s.id}'})">Vedi Profilo</button><button class="btn-p" onclick="showView('search-hosts')">Cerca Host</button></div>
    </div>
    <div class="dash-stats">
      <div class="dsc"><div class="dsc-icon">💶</div><div class="dsc-n">€${s.budget}</div><div class="dsc-l">Budget mensile</div></div>
      <div class="dsc"><div class="dsc-icon">🎯</div><div class="dsc-n">${sugg.length}</div><div class="dsc-l">Host compatibili</div></div>
      <div class="dsc"><div class="dsc-icon">🗣️</div><div class="dsc-n">${s.languages.length}</div><div class="dsc-l">Lingue parlate</div></div>
      <div class="dsc"><div class="dsc-icon">🎓</div><div class="dsc-n">Anno ${s.year}</div><div class="dsc-l">Anno di corso</div></div>
    </div>
    ${m&&h?`<div class="dash-section"><h2>Il tuo Match Attivo</h2>
      <div class="amb" onclick="showView('match-detail',{id:'${m.id}'})">
        <img src="${h.photo}" alt="${h.name}">
        <div class="amb-info"><h3>${h.name}</h3><p>${h.neighborhood} · €${h.price}/mese</p><p>${h.room} · ${h.area}m²</p></div>
        <div class="amb-score"><div class="score-circle">${m.score}%</div><small>Compatibilità</small></div>
        <button class="btn-p">Dettagli →</button>
      </div>
    </div>`:
    `<div class="dash-section"><h2>Host più compatibili per te</h2>
      <div class="sugg-list">${sugg.map(({profile:h,score})=>`
        <div class="sugg-row" onclick="showView('host-profile',{id:'${h.id}'})">
          <img src="${h.photo}" alt="${h.name}">
          <div class="sugg-info"><strong>${h.name}</strong><span>${h.neighborhood} · €${h.price}/mese · ${h.room}</span></div>
          <div class="sugg-score-wrap"><div class="sbar-wrap"><div class="sbar" style="width:${score}%"></div></div><span>${score}%</span></div>
        </div>`).join('')}
      </div>
    </div>`}
  </div>`;
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
function renderAdminDashboard(c){
  c.innerHTML=`<div class="admin-wrap">
    <div class="admin-sidebar">
      <div class="admin-logo">🏔️ GerStu<small>Admin Panel</small></div>
      <nav class="admin-nav">
        <button class="anb active" onclick="switchTab(this,'overview')">📊 Dashboard</button>
        <button class="anb" onclick="switchTab(this,'hosts')">🏠 Host (${HOSTS.length})</button>
        <button class="anb" onclick="switchTab(this,'students')">🎓 Studenti (${STUDENTS.length})</button>
        <button class="anb" onclick="switchTab(this,'matches')">❤️ Match (${MATCHES.length})</button>
        <button class="anb" onclick="switchTab(this,'reviews')">⭐ Recensioni</button>
        <button class="anb" onclick="switchTab(this,'settings')">⚙️ Impostazioni</button>
      </nav>
      <button class="btn-logout" onclick="logout()">Esci</button>
    </div>
    <div class="admin-main"><div id="admin-tab"></div></div>
  </div>`;
  renderTab('overview');
}

function switchTab(btn,tab){
  document.querySelectorAll('.anb').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderTab(tab);
}

function renderTab(tab){
  const t=document.getElementById('admin-tab');
  if(!t) return;
  switch(tab){
    case 'overview': t.innerHTML=tabOverview(); break;
    case 'hosts': t.innerHTML=tabHosts(); break;
    case 'students': t.innerHTML=tabStudents(); break;
    case 'matches': t.innerHTML=tabMatches(); break;
    case 'reviews': t.innerHTML=tabReviews(); break;
    case 'settings': t.innerHTML=tabSettings(); break;
  }
}

function tabOverview(){
  const totalRev=HOSTS.reduce((a,h)=>a+h.reviews.length,0);
  const ratedH=HOSTS.filter(h=>h.rating);
  const avgR=(ratedH.reduce((a,h)=>a+h.rating,0)/ratedH.length).toFixed(1);
  const avail=HOSTS.filter(h=>h.available).length;
  const matched=HOSTS.filter(h=>h.matchedWith).length;
  const free=STUDENTS.filter(s=>!s.matchedWith).length;

  const hoods=HOSTS.reduce((a,h)=>{a[h.neighborhood]=(a[h.neighborhood]||0)+1;return a},{});
  const facs=STUDENTS.reduce((a,s)=>{const k=s.faculty.split(' ').slice(0,2).join(' ');a[k]=(a[k]||0)+1;return a},{});

  return `<div class="ac">
    <h1 class="admin-title">Dashboard Generale</h1>
    <p class="admin-sub">Aggiornato: ${new Date().toLocaleString('it-IT')}</p>
    <div class="kpis">
      <div class="kpi ka"><div class="kpi-icon">🏠</div><div class="kpi-n">${HOSTS.length}</div><div class="kpi-l">Host Totali</div><div class="kpi-s">${avail} disponibili</div></div>
      <div class="kpi"><div class="kpi-icon">🎓</div><div class="kpi-n">${STUDENTS.length}</div><div class="kpi-l">Studenti</div><div class="kpi-s">${free} in cerca</div></div>
      <div class="kpi"><div class="kpi-icon">❤️</div><div class="kpi-n">${MATCHES.length}</div><div class="kpi-l">Match Attivi</div><div class="kpi-s">${matched} host occupati</div></div>
      <div class="kpi"><div class="kpi-icon">⭐</div><div class="kpi-n">${avgR}</div><div class="kpi-l">Rating medio</div><div class="kpi-s">${totalRev} recensioni</div></div>
    </div>
    <div class="charts-row">
      <div class="chart-card"><h3>Distribuzione prezzi</h3><div class="bar-chart">
        ${[['< €260',HOSTS.filter(h=>h.price<260).length],['€260–310',HOSTS.filter(h=>h.price>=260&&h.price<=310).length],['> €310',HOSTS.filter(h=>h.price>310).length]].map(([l,n])=>`<div class="bar-row"><span class="bar-label">${l}</span><div class="bar-track"><div class="bar-fill" style="width:${(n/HOSTS.length)*100}%"></div></div><span class="bar-count">${n}</span></div>`).join('')}
      </div></div>
      <div class="chart-card"><h3>Quartieri</h3><div class="bar-chart">
        ${Object.entries(hoods).map(([h,n])=>`<div class="bar-row"><span class="bar-label">${h}</span><div class="bar-track"><div class="bar-fill" style="width:${(n/HOSTS.length)*100}%"></div></div><span class="bar-count">${n}</span></div>`).join('')}
      </div></div>
      <div class="chart-card"><h3>Facoltà studenti</h3><div class="bar-chart">
        ${Object.entries(facs).map(([f,n])=>`<div class="bar-row"><span class="bar-label">${f}</span><div class="bar-track"><div class="bar-fill s" style="width:${(n/STUDENTS.length)*100}%"></div></div><span class="bar-count">${n}</span></div>`).join('')}
      </div></div>
    </div>
    <div class="admin-section-card"><h3>Match recenti</h3>
      <div class="atable"><div class="tr-hdr"><span>Host</span><span>Studente</span><span>Compatib.</span><span>Data</span><span>Azione</span></div>
        ${MATCHES.map(m=>{const h=getHostById(m.hostId),s=getStudentById(m.studentId);return`<div class="tr-row"><span class="tr-user"><img src="${h.photo}" alt=""><strong>${h.name}</strong></span><span class="tr-user"><img src="${s.photo}" alt=""><strong>${s.name}</strong></span><span><div class="compat-pill">${m.score}%</div></span><span>${new Date(m.date).toLocaleDateString('it-IT')}</span><span><button class="btn-sm" onclick="showView('match-detail',{id:'${m.id}'})">Dettagli</button></span></div>`;}).join('')}
      </div>
    </div>
  </div>`;
}

function hostsTable(list){
  return `<div class="atable"><div class="tr-hdr"><span>Host</span><span>Quartiere</span><span>Prezzo</span><span>Camera</span><span>Rating</span><span>Stato</span><span>Azioni</span></div>
    ${list.map(h=>`<div class="tr-row"><span class="tr-user"><img src="${h.photo}" alt=""><div><strong>${h.name}</strong><small>${h.age} anni</small></div></span><span>${h.neighborhood}</span><span>€${h.price}</span><span>${h.room}</span><span>${h.rating?stars(h.rating):'—'}</span><span>${h.available?'<span class="sbadge ok">Disponibile</span>':'<span class="sbadge off">Non disp.</span>'}${h.matchedWith?'<span class="sbadge match">Matched</span>':''}</span><span><button class="btn-sm" onclick="showView('host-profile',{id:'${h.id}'})">Profilo</button></span></div>`).join('')}
  </div>`;
}

function tabHosts(){
  return `<div class="ac"><h1 class="admin-title">Gestione Host</h1>
    <div class="admin-filter-bar">
      <button class="fbtn active" onclick="aFilterHosts(this,'all')">Tutti (${HOSTS.length})</button>
      <button class="fbtn" onclick="aFilterHosts(this,'available')">Disponibili (${HOSTS.filter(h=>h.available).length})</button>
      <button class="fbtn" onclick="aFilterHosts(this,'matched')">Con Match (${HOSTS.filter(h=>h.matchedWith).length})</button>
      <button class="fbtn" onclick="aFilterHosts(this,'unavailable')">Non disp. (${HOSTS.filter(h=>!h.available).length})</button>
    </div>
    <div id="ah-table">${hostsTable(HOSTS)}</div>
  </div>`;
}

function aFilterHosts(btn,mode){
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const f={all:HOSTS,available:HOSTS.filter(h=>h.available),matched:HOSTS.filter(h=>h.matchedWith),unavailable:HOSTS.filter(h=>!h.available)}[mode]||HOSTS;
  const t=document.getElementById('ah-table');
  if(t) t.innerHTML=hostsTable(f);
}

function studentsTable(list){
  return `<div class="atable"><div class="tr-hdr"><span>Studente</span><span>Provenienza</span><span>Facoltà</span><span>Budget</span><span>Lingue</span><span>Stato</span><span>Azioni</span></div>
    ${list.map(s=>`<div class="tr-row"><span class="tr-user"><img src="${s.photo}" alt=""><div><strong>${s.name}</strong><small>${s.age} anni</small></div></span><span>${s.origin}</span><span>${s.faculty}</span><span>€${s.budget}</span><span>${s.languages.map(lbadge).join('')}</span><span>${s.matchedWith?'<span class="sbadge match">Matched</span>':'<span class="sbadge search">In cerca</span>'}</span><span><button class="btn-sm" onclick="showView('student-profile',{id:'${s.id}'})">Profilo</button></span></div>`).join('')}
  </div>`;
}

function tabStudents(){
  return `<div class="ac"><h1 class="admin-title">Gestione Studenti</h1>
    <div class="admin-filter-bar">
      <button class="fbtn active" onclick="aFilterStudents(this,'all')">Tutti (${STUDENTS.length})</button>
      <button class="fbtn" onclick="aFilterStudents(this,'free')">Liberi (${STUDENTS.filter(s=>!s.matchedWith).length})</button>
      <button class="fbtn" onclick="aFilterStudents(this,'matched')">Con Match (${STUDENTS.filter(s=>s.matchedWith).length})</button>
    </div>
    <div id="as-table">${studentsTable(STUDENTS)}</div>
  </div>`;
}

function aFilterStudents(btn,mode){
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const f={all:STUDENTS,free:STUDENTS.filter(s=>!s.matchedWith),matched:STUDENTS.filter(s=>s.matchedWith)}[mode]||STUDENTS;
  const t=document.getElementById('as-table');
  if(t) t.innerHTML=studentsTable(f);
}

function tabMatches(){
  return `<div class="ac"><h1 class="admin-title">Gestione Match</h1>
    <div class="matches-admin-grid">${MATCHES.map(m=>{
      const h=getHostById(m.hostId),s=getStudentById(m.studentId);
      return`<div class="mac"><div class="mac-score">${m.score}% compatibile</div>
        <div class="mac-profiles">
          <div class="map" onclick="showView('host-profile',{id:'${h.id}'})"><img src="${h.photo}" alt=""><strong>${h.name}</strong><small>€${h.price}/mese</small></div>
          <div style="font-size:1.5rem">❤️</div>
          <div class="map" onclick="showView('student-profile',{id:'${s.id}'})"><img src="${s.photo}" alt=""><strong>${s.name}</strong><small>${s.faculty}</small></div>
        </div>
        <div class="mac-reasons">${m.reasons.map(r=>`<div class="reason-mini">✓ ${r}</div>`).join('')}</div>
        <div class="mac-footer"><span>Dal ${new Date(m.date).toLocaleDateString('it-IT')}</span><button class="btn-sm" onclick="showView('match-detail',{id:'${m.id}'})">Dettagli</button></div>
      </div>`;
    }).join('')}
    </div>
  </div>`;
}

function allReviews(){
  const arr=[];
  HOSTS.forEach(h=>h.reviews.forEach(r=>arr.push({...r,hostName:h.name,hostPhoto:h.photo,hostId:h.id})));
  return arr;
}

function reviewsList(revs){
  if(!revs.length) return '<div class="no-results">Nessuna recensione trovata.</div>';
  return revs.map(r=>`<div class="arc" onclick="showView('host-profile',{id:'${r.hostId}'})">
    <div class="arc-host"><img src="${r.hostPhoto}" alt=""><div><strong>Su ${r.hostName}</strong><small>${r.date}</small></div></div>
    <div class="arc-stars">${stars(r.rating)} ${r.rating}/5</div>
    <div class="arc-stu">Scritto da: <strong>${r.student}</strong></div>
    <p class="arc-txt">"${r.text}"</p>
  </div>`).join('');
}

function tabReviews(){
  const rev=allReviews();
  return `<div class="ac"><h1 class="admin-title">Recensioni (${rev.length} totali)</h1>
    <div class="admin-filter-bar">
      <button class="fbtn active" onclick="aFilterReviews(this,0)">Tutte</button>
      <button class="fbtn" onclick="aFilterReviews(this,5)">5 stelle ★★★★★</button>
      <button class="fbtn" onclick="aFilterReviews(this,4)">4 stelle ★★★★</button>
    </div>
    <div id="ar-list">${reviewsList(rev)}</div>
  </div>`;
}

function aFilterReviews(btn,min){
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const rev=allReviews();
  const f=min===0?rev:rev.filter(r=>r.rating===min);
  const t=document.getElementById('ar-list');
  if(t) t.innerHTML=reviewsList(f);
}

function tabSettings(){
  return `<div class="ac"><h1 class="admin-title">Impostazioni Piattaforma</h1>
    <div class="settings-grid">
      <div class="set-card"><h3>🏙️ Città coperte</h3>
        <div class="set-item"><span>Bolzano</span><span class="sbadge ok">Attiva</span></div>
        <div class="set-item"><span>Trento</span><span class="sbadge off">In arrivo</span></div>
        <div class="set-item"><span>Verona</span><span class="sbadge off">In arrivo</span></div>
        <br><button class="btn-sm">+ Aggiungi città</button>
      </div>
      <div class="set-card"><h3>⚙️ Algoritmo Match</h3>
        <div class="set-row"><label>Peso budget</label><input type="range" min="0" max="100" value="30"><span>30%</span></div>
        <div class="set-row"><label>Peso interessi</label><input type="range" min="0" max="100" value="25"><span>25%</span></div>
        <div class="set-row"><label>Peso lingue</label><input type="range" min="0" max="100" value="15"><span>15%</span></div>
        <br><button class="btn-p" onclick="alert('Impostazioni salvate! (Demo)')">Salva impostazioni</button>
      </div>
      <div class="set-card"><h3>📧 Notifiche</h3>
        <div class="set-toggle"><label>Email nuovi match</label><label class="toggle"><input type="checkbox" checked><span class="toggle-sl"></span></label></div>
        <div class="set-toggle"><label>Email nuove recensioni</label><label class="toggle"><input type="checkbox" checked><span class="toggle-sl"></span></label></div>
        <div class="set-toggle"><label>Report settimanale</label><label class="toggle"><input type="checkbox"><span class="toggle-sl"></span></label></div>
      </div>
      <div class="set-card"><h3>💰 Prezzi & Commissioni</h3>
        <div class="set-item"><span>Registrazione host</span><span class="sbadge ok">Gratuita</span></div>
        <div class="set-item"><span>Registrazione studente</span><span class="sbadge ok">Gratuita</span></div>
        <div class="set-item"><span>Commissione match</span><span>5% primo mese</span></div>
        <br><button class="btn-sm">Modifica tariffe</button>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded',function(){buildNav();showView('home')});
