/* ═══════════════════════════════════════════════════════════════
   NetBuilder Pro v3 — game.js
   - Piantine con stanze reali (boss, dipendenti, segreteria, sala aspetto)
   - ONT nel locale tecnico, AP nella sala aspetto
   - Router in zona presidiata
   - VLAN con ruoli e permessi (riflessione sulla sicurezza dati)
   - Calcolatore subnet: indirizzo rete, primo host, ultimo host, broadcast, maschera, bit
   - Livello 1: 2 VLAN (LAN + Guest/AP); Livello 2-3: VLAN multiple con telecamere
═══════════════════════════════════════════════════════════════ */
'use strict';

/* ── CATALOGO COMPONENTI ──────────────────────────────────── */
const CATALOG = [
  { id:'ont',         name:'ONT / ONU Fibra',        detail:'ZTE F670L GPON FTTH/FTTB',         icon:'🔆', price:0,   cat:'network',  multi:false, tag:'ont',      desc:'Optical Network Terminal — converte fibra ottica (ISP) in Ethernet. Fornito dall\'ISP, va in locale tecnico chiuso.' },
  { id:'router',      name:'Router SOHO',             detail:'TP-Link ER605 Gigabit VPN',        icon:'🌐', price:89,  cat:'network',  multi:false, tag:'router',   desc:'Router per piccoli uffici. NAT, DHCP, firewall SPI, gestione VLAN base. Da installare in locale NON accessibile ai clienti.' },
  { id:'router-pro',  name:'Router Pro',              detail:'MikroTik RB750Gr3 RouterOS',       icon:'🌐', price:145, cat:'network',  multi:false, tag:'router',   desc:'Router professionale con RouterOS completo. BGP, OSPF, VLAN, QoS, firewall avanzato. Richiede configurazione tecnica.' },
  { id:'switch16',    name:'Switch 16p Non-Gestito',  detail:'TP-Link TL-SG116 Gigabit',         icon:'🔀', price:59,  cat:'network',  multi:false, tag:'switch16', desc:'Switch 16 porte Gigabit plug-and-play. NON supporta VLAN 802.1Q. Adatto solo per reti flat senza segmentazione.' },
  { id:'switch24',    name:'Switch 24p Managed',      detail:'TP-Link TL-SG2224 Gigabit',        icon:'🔀', price:149, cat:'network',  multi:false, tag:'switch24', desc:'Switch 24 porte managed. VLAN 802.1Q, QoS, LACP, SNMP. Obbligatorio per reti con segmentazione VLAN. 1U rack.' },
  { id:'switch48',    name:'Switch 48p Managed',      detail:'Cisco CBS350-48T Gigabit',         icon:'🔀', price:549, cat:'network',  multi:false, tag:'switch48', desc:'Switch enterprise 48 porte Layer 3. VLAN, routing statico, PoE+. Per grandi uffici con oltre 30 dispositivi.' },
  { id:'switch8',     name:'Switch 8p Gigabit',       detail:'TP-Link TL-SG108 unmanaged',       icon:'🔀', price:29,  cat:'network',  multi:false, tag:'switch8',  desc:'Switch 8 porte non gestito. Utile come espansione locale in una stanza, non per VLAN.' },
  { id:'ap-indoor',   name:'Access Point Wi-Fi 6',    detail:'TP-Link EAP670 AX3000 PoE',        icon:'📶', price:89,  cat:'network',  multi:true,  tag:'ap',       desc:'AP ceiling-mount Wi-Fi 6. Dual-band 2.4/5 GHz. IDEALE per sala d\'aspetto e aree pubbliche. PoE 802.3af. Supporta SSID multipli per VLAN diverse.' },
  { id:'ap-outdoor',  name:'Access Point Outdoor',    detail:'Ubiquiti UAP-AC-M IP67',           icon:'📡', price:139, cat:'network',  multi:true,  tag:'ap',       desc:'AP outdoor impermeabile. Per aree esterne, parcheggi, ingressi. Non adatto a installazione in ufficio chiuso.' },
  { id:'rack-wall',   name:'Rack 9U a muro',          detail:'Digitus DN-10-09U 450×540mm',      icon:'🗄️', price:129, cat:'network',  multi:false, tag:'rack',     desc:'Armadio 9U da parete. Per locale tecnico o segreteria. Include ventole e ciabatta 8 prese. Chiudibile a chiave.' },
  { id:'rack-floor',  name:'Rack 24U a pavimento',    detail:'Digitus DN-19-24U 600×1000mm',     icon:'🗄️', price:289, cat:'network',  multi:false, tag:'rack',     desc:'Armadio rack 24U su ruote. Per server room o locale IT dedicato. Doppia serratura di sicurezza.' },
  { id:'patch-panel', name:'Patch Panel 24p Cat.6',   detail:'Digitus DN-91524S 1U rack',        icon:'🔌', price:49,  cat:'network',  multi:false, tag:'patch',    desc:'Pannello permutazione 24 porte Cat.6. Organizza il cablaggio strutturato nel rack.' },
  { id:'ups',         name:'UPS 600VA',               detail:'APC BVX600LI Line-Interactive',    icon:'🔋', price:89,  cat:'network',  multi:false, tag:'ups',      desc:'Gruppo di continuità 600VA/360W. Autonomia ~10min. Protegge da sbalzi e interruzioni di corrente.' },
  { id:'camera-ip',   name:'Telecamera IP PoE',       detail:'Dahua IPC-HDW2831T 4K PoE',        icon:'📷', price:95,  cat:'network',  multi:true,  tag:'camera',   desc:'Telecamera IP 4K con PoE 802.3af. Va su VLAN dedicata (es. VLAN40) isolata dalla rete dati. Accesso solo da NVR o postazione sicurezza.' },
  { id:'nvr',         name:'NVR Videosorveglianza',   detail:'Dahua NVR4116HS-4KS3 16ch',        icon:'🖥️', price:249, cat:'network',  multi:false, tag:'nvr',      desc:'Network Video Recorder 16 canali 4K. Gestisce registrazione telecamere. Deve stare sulla VLAN sicurezza, non sulla rete dati.' },
  { id:'pc-workst',   name:'Postazione PC',           detail:'PC i5 + monitor 24" + KVM',        icon:'🖥️', price:699, cat:'endpoint', multi:true,  tag:'pc',       desc:'Postazione lavorativa: PC desktop, monitor 24" FHD, tastiera e mouse. Cablata su VLAN LAN ufficio.' },
  { id:'laptop',      name:'Laptop Aziendale',        detail:'ThinkPad L14 Gen4 i5 16GB',        icon:'💻', price:799, cat:'endpoint', multi:true,  tag:'pc',       desc:'Laptop business. Wi-Fi 6 integrato — può connettersi sia alla VLAN LAN (cablata) che alla VLAN Wi-Fi (wireless).' },
  { id:'printer-net', name:'Stampante di Rete',       detail:'HP LaserJet Pro MFP 4101fdw',      icon:'🖨️', price:289, cat:'endpoint', multi:true,  tag:'printer',  desc:'Stampante laser multifunzione. Connessa alla VLAN LAN su IP statico per essere raggiungibile da tutti i dipendenti.' },
  { id:'phone-voip',  name:'Telefono VoIP + Cuffie',  detail:'Yealink T31P SIP + cuffie USB',    icon:'📞', price:75,  cat:'endpoint', multi:true,  tag:'phone',    desc:'Telefono IP SIP. Su VLAN VoIP dedicata con QoS (DSCP EF). PoE 802.3af. Completamente separato dalla rete dati.' },
  { id:'server-nas',  name:'NAS Server 4-bay',        detail:'Synology DS923+ 4-bay NAS',        icon:'💾', price:549, cat:'endpoint', multi:false, tag:'nas',      desc:'File server NAS aziendale RAID-5. Va su VLAN server con accesso controllato. Non accessibile dalla VLAN Guest.' },
  { id:'cat6-1m',     name:'Cavo Patch Cat.6 1m',     detail:'UTP RJ45 grigio — patch cord',     icon:'🔗', price:4,   cat:'cable',    multi:true,  tag:'cat6',     desc:'Per connessioni brevi dentro il rack (switch → patch panel, router → switch).' },
  { id:'cat6-3m',     name:'Cavo Patch Cat.6 3m',     detail:'UTP RJ45 blu — patch cord',        icon:'🔗', price:6,   cat:'cable',    multi:true,  tag:'cat6',     desc:'Per postazioni vicine. Es. scrivania → presa a parete.' },
  { id:'cat6-5m',     name:'Cavo Patch Cat.6 5m',     detail:'UTP RJ45 giallo — patch cord',     icon:'🔗', price:9,   cat:'cable',    multi:true,  tag:'cat6',     desc:'Per postazioni fino a 5m dalla presa di rete.' },
  { id:'cat6-bulk',   name:'Bobina Cat.6 305m',       detail:'Digitus DK-1614-305 UTP solid',    icon:'🧵', price:85,  cat:'cable',    multi:false, tag:'cat6bulk', desc:'Cavo solido per cablaggio fisso a parete/canalina. Obbligatorio per installazioni >10 postazioni.' },
  { id:'sfp-fiber',   name:'Modulo SFP+ Fibra LC',    detail:'OM3 multimode 10Gbps 300m',        icon:'💎', price:45,  cat:'cable',    multi:true,  tag:'sfp',      desc:'Uplink 10Gbps in fibra ottica tra switch/rack. Connettori LC duplex. Per ambienti enterprise.' },
  // Distrattori
  { id:'hub8',        name:'⚠️ Hub 8p — OBSOLETO',    detail:'Half-duplex, NO collision domain', icon:'❌', price:15,  cat:'extra',    multi:false, tag:'hub',      desc:'OBSOLETO. Un hub trasmette a tutte le porte (half-duplex): collisioni, lentezza, impossibilità di creare VLAN. Non usare mai in un progetto professionale.' },
  { id:'wifi-usb',    name:'Chiavetta Wi-Fi USB',     detail:'Adattatore USB 2.4GHz — instabile', icon:'🔌', price:12, cat:'extra',    multi:true,  tag:'wifi-usb', desc:'Adattatore Wi-Fi USB. Non gestibile centralmente, velocità bassa, sicurezza scarsa. Non adatto ad architetture professionali.' },
  { id:'coax-cable',  name:'Cavo Coassiale RG-6',     detail:'Per segnale TV/antenna — non LAN', icon:'📺', price:18,  cat:'extra',    multi:false, tag:'coax',     desc:'Cavo coassiale per TV. Incompatibile con Ethernet LAN.' },
  { id:'powerline',   name:'Adattatore Powerline',    detail:'TP-Link TL-PA7010 — instabile',    icon:'⚡', price:45,  cat:'extra',    multi:true,  tag:'powerline',desc:'Rete su rete elettrica 230V. Velocità variabile, latenza alta, sicurezza insufficiente. Non adatto ad uso professionale.' },
];

/* ══════════════════════════════════════════════════════════
   LIBRERIA SVG ARCHITETTURALE
══════════════════════════════════════════════════════════ */
const SVG = {
  C: {
    bg:'#080e1a', floor:'#0b1525', wall:'#1a3356', wallFill:'#0e1f38',
    wallStroke:'#2a4a7f', win:'rgba(96,210,255,0.6)', winGlass:'rgba(56,189,248,0.1)',
    door:'rgba(251,191,36,0.8)', doorSwing:'rgba(251,191,36,0.08)',
    grid:'rgba(56,189,248,0.04)', label:'rgba(56,189,248,0.5)',
    room:'rgba(56,189,248,0.025)', roomBord:'rgba(56,189,248,0.14)',
    desk:'rgba(52,211,153,0.08)', deskBord:'rgba(52,211,153,0.22)',
    techZone:'rgba(14,165,233,0.1)', techBord:'rgba(56,189,248,0.5)',
    bossZone:'rgba(167,139,250,0.07)', bossBord:'rgba(167,139,250,0.3)',
    waitZone:'rgba(251,191,36,0.05)', waitBord:'rgba(251,191,36,0.3)',
    staffZone:'rgba(52,211,153,0.04)', staffBord:'rgba(52,211,153,0.2)',
    secZone:'rgba(248,113,113,0.07)', secBord:'rgba(248,113,113,0.35)',
    ont:'rgba(255,120,0,0.8)', fiber:'rgba(255,120,0,0.5)',
  },
  defs(id) {
    return `<defs>
      <pattern id="g${id}" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="${this.C.grid}" stroke-width=".6"/>
      </pattern>
      <pattern id="gf${id}" width="5" height="5" patternUnits="userSpaceOnUse">
        <path d="M5 0L0 0 0 5" fill="none" stroke="rgba(56,189,248,0.018)" stroke-width=".4"/>
      </pattern>
      <filter id="glow${id}">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;
  },
  wall(x,y,w,h) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${this.C.wallFill}" stroke="${this.C.wallStroke}" stroke-width="1.5"/>`;
  },
  // Apertura porta con arco: dir = 'h' orizzontale / 'v' verticale, swing = 'cw'|'ccw'
  door(x,y,size,dir='h',swing='cw') {
    let gap='', arc='', hinge='';
    if(dir==='h'){
      gap = `<rect x="${x}" y="${y}" width="${size}" height="10" fill="${this.C.bg}"/>`;
      if(swing==='cw'){
        arc = `<path d="M${x},${y+10} A${size},${size} 0 0,1 ${x+size},${y+10}" fill="${this.C.doorSwing}" stroke="${this.C.door}" stroke-width=".8" stroke-dasharray="3,2"/>`;
        hinge = `<line x1="${x}" y1="${y}" x2="${x}" y2="${y+10}" stroke="${this.C.door}" stroke-width="2"/>`;
      } else {
        arc = `<path d="M${x+size},${y+10} A${size},${size} 0 0,0 ${x},${y+10}" fill="${this.C.doorSwing}" stroke="${this.C.door}" stroke-width=".8" stroke-dasharray="3,2"/>`;
        hinge = `<line x1="${x+size}" y1="${y}" x2="${x+size}" y2="${y+10}" stroke="${this.C.door}" stroke-width="2"/>`;
      }
    } else {
      gap = `<rect x="${x}" y="${y}" width="10" height="${size}" fill="${this.C.bg}"/>`;
      if(swing==='cw'){
        arc = `<path d="M${x+10},${y} A${size},${size} 0 0,1 ${x+10},${y+size}" fill="${this.C.doorSwing}" stroke="${this.C.door}" stroke-width=".8" stroke-dasharray="3,2"/>`;
        hinge = `<line x1="${x}" y1="${y}" x2="${x+10}" y2="${y}" stroke="${this.C.door}" stroke-width="2"/>`;
      } else {
        arc = `<path d="M${x+10},${y+size} A${size},${size} 0 0,0 ${x+10},${y}" fill="${this.C.doorSwing}" stroke="${this.C.door}" stroke-width=".8" stroke-dasharray="3,2"/>`;
        hinge = `<line x1="${x}" y1="${y+size}" x2="${x+10}" y2="${y+size}" stroke="${this.C.door}" stroke-width="2"/>`;
      }
    }
    return gap+arc+hinge;
  },
  win(x,y,size,dir='h') {
    if(dir==='h') return `
      <rect x="${x}" y="${y}" width="${size}" height="10" fill="${this.C.winGlass}" stroke="${this.C.win}" stroke-width="1.4"/>
      <line x1="${x+size/3}" y1="${y}" x2="${x+size/3}" y2="${y+10}" stroke="${this.C.win}" stroke-width=".7"/>
      <line x1="${x+size*2/3}" y1="${y}" x2="${x+size*2/3}" y2="${y+10}" stroke="${this.C.win}" stroke-width=".7"/>`;
    return `
      <rect x="${x}" y="${y}" width="10" height="${size}" fill="${this.C.winGlass}" stroke="${this.C.win}" stroke-width="1.4"/>
      <line x1="${x}" y1="${y+size/3}" x2="${x+10}" y2="${y+size/3}" stroke="${this.C.win}" stroke-width=".7"/>
      <line x1="${x}" y1="${y+size*2/3}" x2="${x+10}" y2="${y+size*2/3}" stroke="${this.C.win}" stroke-width=".7"/>`;
  },
  pillar(x,y,s=12) {
    return `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${this.C.wallFill}" stroke="${this.C.wallStroke}" stroke-width="1.5"/>`;
  },
  desk(x,y,w,h,lbl='',rot=0) {
    const cx=x+w/2, cy=y+h/2;
    const transform=rot?` transform="rotate(${rot},${cx},${cy})"`:'' ;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${this.C.desk}" stroke="${this.C.deskBord}" stroke-width="1"${transform}/>
    ${lbl?`<text x="${cx}" y="${cy+3.5}" text-anchor="middle" fill="rgba(52,211,153,0.4)" font-size="7" font-family="JetBrains Mono,monospace"${transform}>${lbl}</text>`:'' }`;
  },
  chair(x,y) {
    return `<rect x="${x-5}" y="${y-5}" width="10" height="10" rx="2" fill="rgba(52,211,153,0.06)" stroke="rgba(52,211,153,0.15)" stroke-width=".7"/>`;
  },
  roomBox(x,y,w,h,fill,stroke,rx=4) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
  },
  label(x,y,text,color,fs=9,ls=1.5) {
    return `<text x="${x}" y="${y}" text-anchor="middle" fill="${color}" font-size="${fs}" font-family="JetBrains Mono,monospace" letter-spacing="${ls}">${text}</text>`;
  },
  sublabel(x,y,text,color='rgba(56,189,248,0.3)',fs=7.5) {
    return `<text x="${x}" y="${y}" text-anchor="middle" fill="${color}" font-size="${fs}" font-family="JetBrains Mono,monospace">${text}</text>`;
  },
  ontEntry(x,y) {
    return `
      <line x1="${x}" y1="${y-36}" x2="${x}" y2="${y}" stroke="${this.C.fiber}" stroke-width="2" stroke-dasharray="5,3"/>
      <text x="${x}" y="${y-42}" text-anchor="middle" fill="rgba(255,140,0,0.75)" font-size="7.5" font-family="JetBrains Mono,monospace" font-weight="700">FIBRA ISP</text>
      <polygon points="${x-5},${y} ${x+5},${y} ${x},${y+8}" fill="${this.C.ont}"/>`;
  },
  ontBadge(x,y) {
    return `
      <rect x="${x-18}" y="${y-11}" width="36" height="22" rx="4" fill="rgba(255,90,0,0.18)" stroke="rgba(255,120,0,0.65)" stroke-width="1.5"/>
      <text x="${x}" y="${y-1}" text-anchor="middle" fill="rgba(255,150,0,0.9)" font-size="7" font-family="JetBrains Mono,monospace" font-weight="700">ONT</text>
      <text x="${x}" y="${y+8}" text-anchor="middle" fill="rgba(255,150,0,0.55)" font-size="6" font-family="JetBrains Mono,monospace">LOCALE TECNICO</text>`;
  },
  scale(x,y,label='5m (1:50)') {
    return `<line x1="${x}" y1="${y}" x2="${x+120}" y2="${y}" stroke="rgba(56,189,248,0.35)" stroke-width="1"/>
    <line x1="${x}" y1="${y-4}" x2="${x}" y2="${y+4}" stroke="rgba(56,189,248,0.35)" stroke-width="1"/>
    <line x1="${x+120}" y1="${y-4}" x2="${x+120}" y2="${y+4}" stroke="rgba(56,189,248,0.35)" stroke-width="1"/>
    <text x="${x+60}" y="${y+13}" text-anchor="middle" fill="rgba(56,189,248,0.35)" font-size="7.5" font-family="JetBrains Mono,monospace">${label}</text>`;
  },
  // Badge VLAN colorato
  vlanBadge(x,y,vlan,color) {
    return `<rect x="${x-14}" y="${y-8}" width="28" height="16" rx="3" fill="${color.replace(/[\d.]+\)$/,'0.15)')}}" stroke="${color}" stroke-width="1"/>
    <text x="${x}" y="${y+4}" text-anchor="middle" fill="${color}" font-size="7" font-family="JetBrains Mono,monospace" font-weight="700">V${vlan}</text>`;
  },
};

/* ═══ PIANTINE — tutte riscritte pulite, senza sovrapposizioni ═══
   Regole: 1 label per stanza, zone drop non toccano i label,
   niente testo duplicato, muri coerenti con le zone.
   Circolazione: [SUD ingresso] → sala attesa + segreteria
   → corridoio interno → uffici dipendenti → [NORD responsabile]
════════════════════════════════════════════════════════════════ */

/* ── helpers condivisi (non dipendono da SVG) ── */
const _W =(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0e1f38" stroke="#1a3356" stroke-width="1.5"/>`;
const _WIN=(x,y,sz,v=false)=>v
  ?`<rect x="${x}" y="${y}" width="8" height="${sz}" fill="rgba(56,189,248,.14)" stroke="rgba(56,189,248,.5)" stroke-width="1.2"/>`
  :`<rect x="${x}" y="${y}" width="${sz}" height="8" fill="rgba(56,189,248,.14)" stroke="rgba(56,189,248,.5)" stroke-width="1.2"/>`;
const _DR=(x,y,sz,v=false)=>v
  ?`<rect x="${x}" y="${y}" width="8" height="${sz}" fill="#080e1a"/>
    <path d="M${x+8},${y} A${sz},${sz} 0 0,1 ${x+8},${y+sz}" fill="rgba(251,191,36,.09)" stroke="rgba(251,191,36,.55)" stroke-width=".8" stroke-dasharray="3,2"/>
    <line x1="${x}" y1="${y}" x2="${x+8}" y2="${y}" stroke="rgba(251,191,36,.75)" stroke-width="2"/>`
  :`<rect x="${x}" y="${y}" width="${sz}" height="8" fill="#080e1a"/>
    <path d="M${x},${y+8} A${sz},${sz} 0 0,1 ${x+sz},${y+8}" fill="rgba(251,191,36,.09)" stroke="rgba(251,191,36,.55)" stroke-width=".8" stroke-dasharray="3,2"/>
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y+8}" stroke="rgba(251,191,36,.75)" stroke-width="2"/>`;
const _RM=(x,y,w,h,c,s)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${s}" stroke-width="1.2" rx="2"/>`;
const _LB=(x,y,t,col,fs=8.5)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${col}" font-size="${fs}" font-family="JetBrains Mono,monospace" letter-spacing="1">${t}</text>`;
const _SB=(x,y,t,col='rgba(56,189,248,.32)')=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${col}" font-size="6.5" font-family="JetBrains Mono,monospace">${t}</text>`;
const _DK=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="rgba(52,211,153,.07)" stroke="rgba(52,211,153,.2)" stroke-width=".8"/>`;
const _PL=(x,y)=>`<rect x="${x}" y="${y}" width="10" height="10" fill="#0e1f38" stroke="#1a3356" stroke-width="1.5"/>`;
const _GRID=(id)=>`<defs><pattern id="g${id}" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="rgba(56,189,248,.03)" stroke-width=".6"/></pattern></defs>`;
const _ONT=(x,y)=>`<line x1="${x}" y1="${y}" x2="${x}" y2="${y+14}" stroke="rgba(255,140,0,.6)" stroke-width="1.5" stroke-dasharray="3,2"/>
<text x="${x}" y="${y-3}" text-anchor="middle" fill="rgba(255,140,0,.6)" font-size="7" font-family="JetBrains Mono,monospace">FIBRA</text>
<rect x="${x-20}" y="${y+14}" width="40" height="14" rx="3" fill="rgba(255,90,0,.15)" stroke="rgba(255,120,0,.6)" stroke-width="1"/>
<text x="${x}" y="${y+23}" text-anchor="middle" fill="rgba(255,150,0,.9)" font-size="6.5" font-family="JetBrains Mono,monospace" font-weight="700">ONT</text>`;
const _SCALA=(x,y)=>`<line x1="${x}" y1="${y}" x2="${x+120}" y2="${y}" stroke="rgba(56,189,248,.3)" stroke-width="1"/>
<line x1="${x}" y1="${y-3}" x2="${x}" y2="${y+3}" stroke="rgba(56,189,248,.3)" stroke-width="1"/>
<line x1="${x+120}" y1="${y-3}" x2="${x+120}" y2="${y+3}" stroke="rgba(56,189,248,.3)" stroke-width="1"/>
<text x="${x+60}" y="${y+12}" text-anchor="middle" fill="rgba(56,189,248,.3)" font-size="7" font-family="JetBrains Mono,monospace">5 m (sc. 1:50)</text>`;
const _AP=(cx,cy)=>`<circle cx="${cx}" cy="${cy}" r="22" fill="none" stroke="rgba(56,189,248,.18)" stroke-width="1" stroke-dasharray="4,3"/>
<circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="rgba(56,189,248,.28)" stroke-width=".8"/>
<text x="${cx}" y="${cy+4}" text-anchor="middle" fill="rgba(56,189,248,.65)" font-size="10" font-family="sans-serif">📶</text>`;

/* ══════════════════════════════════════════════════════════
   PIANTINA 1 — SMALL OFFICE basata sull'immagine di riferimento
   W=840  H=580

   Layout fedele all'immagine:
   ┌──────────────┬──────────────────────┬───────────────┐
   │ UFFICIO      │   SALA ATTESA        │ LOCALE TECNICO│
   │ RESPONSABILE │   (AP a soffitto)    │ ONT+RACK+RTR  │
   │              │                      │ +SWITCH       │
   ├──────────────┴──────────────────────┴───────────────┤
   │  corridoio/distribuzione cavi (canalina a parete)   │
   ├───────────┬──────────────┬──────────────────────────┤
   │ UFFICIO 1 │  UFFICIO 2   │  UFFICIO 3  +  STAMPANTE │
   │  (PC+VoIP)│  (PC+VoIP)   │  (PC+VoIP)               │
   └───────────┴──────────────┴──────────────────────────┘
         ▲ ingresso clienti (portone frontale basso)
══════════════════════════════════════════════════════════ */
function floor1SVG() {
  const W=840, H=580;
  // Coordinate stanze (bordi interni, senza muri)
  // TOP ROW  y=26–260
  //   Responsabile:  x=22–280
  //   Sala Attesa:   x=280–560
  //   Locale Tecnico: x=560–818
  // CORRIDOIO       y=260–310
  // BOTTOM ROW      y=310–542
  //   Ufficio 1:    x=22–300
  //   Ufficio 2:    x=300–560
  //   Ufficio 3:    x=560–818
  // INGRESSO        y=542–580

  const tC  = 'rgba(14,165,233,.09)';   const tS  = 'rgba(56,189,248,.5)';   // locale tecnico
  const bC  = 'rgba(167,139,250,.06)';  const bS  = 'rgba(167,139,250,.32)';  // responsabile
  const wC  = 'rgba(251,191,36,.06)';   const wS  = 'rgba(251,191,36,.4)';    // sala attesa
  const sC  = 'rgba(52,211,153,.05)';   const sS  = 'rgba(52,211,153,.3)';    // uffici staff
  const cC  = 'rgba(56,189,248,.015)';  const cS  = 'rgba(56,189,248,.1)';    // corridoio

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
${_GRID(1)}
<rect width="${W}" height="${H}" fill="#080e1a"/>
<rect x="22" y="26" width="${W-44}" height="${H-52}" fill="#0b1525"/>
<rect x="22" y="26" width="${W-44}" height="${H-52}" fill="url(#g1)"/>

${/* ═══ SFONDI STANZE ═══ */''}
${_RM(22, 26, 258,234, bC,bS)}
${_RM(280,26, 280,234, wC,wS)}
${_RM(560,26, 258,234, tC,tS)}
${_RM(22, 260,796, 50, cC,cS)}
${_RM(22, 310,278,232, sC,sS)}
${_RM(300,310,260,232, sC,sS)}
${_RM(560,310,258,232, sC,sS)}

${/* ═══ MURI PERIMETRALI ═══ */''}
${_W(22,26,796,10)} ${_W(22,542,796,10)}
${_W(22,26,10,526)} ${_W(818,26,10,526)}

${/* ═══ FINESTRE ═══ */''}
${/* nord: responsabile */''}   ${_WIN(60,26,100)} 
${/* nord: sala attesa */''}    ${_WIN(350,26,120)}
${/* nord: locale tecnico */''}  ${_WIN(620,26,100)}
${/* sud: ufficio 1 */''}        ${_WIN(60,542,80)}
${/* sud: ufficio 2 */''}        ${_WIN(360,542,80)}
${/* sud: ufficio 3 */''}        ${_WIN(620,542,80)}
${/* ovest */''}                 ${_WIN(22,100,80,true)} ${_WIN(22,390,80,true)}
${/* est */''}                   ${_WIN(818,100,80,true)} ${_WIN(818,390,80,true)}

${/* ═══ MURI INTERNI VERTICALI ═══ */''}
${/* V1: responsabile | sala attesa */''}
${_W(280,26,10,234)}
${/* V2: sala attesa | locale tecnico */''}
${_W(560,26,10,234)}
${/* V3: ufficio 1 | ufficio 2 */''}
${_W(300,310,10,232)}
${/* V4: ufficio 2 | ufficio 3 */''}
${_W(560,310,10,232)}

${/* ═══ MURO ORIZZONTALE: top row | corridoio ═══ */''}
${/* sezione sx: responsabile - porta centrale */''}
${_W(22,260,160,10)} ${_DR(182,260,58)} ${_W(250,260,30,10)}
${/* sezione centro: sala attesa - aperta verso corridoio */''}
${_W(290,260,160,10)} ${_DR(450,260,58)} ${_W(518,260,42,10)}
${/* sezione dx: locale tecnico - porta (accesso solo staff) */''}
${_W(570,260,100,10)} ${_DR(670,260,58)} ${_W(738,260,80,10)}

${/* ═══ MURO ORIZZONTALE: corridoio | bottom row ═══ */''}
${/* porta ufficio 1 */''}
${_W(22,310,80,10)} ${_DR(102,310,56)} ${_W(168,310,132,10)}
${/* porta ufficio 2 */''}
${_W(310,310,70,10)} ${_DR(380,310,56)} ${_W(446,310,114,10)}
${/* porta ufficio 3 */''}
${_W(570,310,80,10)} ${_DR(650,310,56)} ${_W(716,310,102,10)}

${/* ═══ PILASTRI ═══ */''}
${_PL(22,26)} ${_PL(818,26)} ${_PL(22,542)} ${_PL(818,542)}
${_PL(280,26)} ${_PL(560,26)}
${_PL(300,310)} ${_PL(560,310)}

${/* ═══ MURO SUD + INGRESSO ═══ */''}
${_W(22,542,200,10)} ${_DR(222,542,80)} ${_W(312,542,496,10)}

${/* ═══ LABEL STANZE — uno solo, ben centrato, lontano dai bordi ═══ */''}
${_LB(151,108,'UFFICIO',bS,9)}
${_LB(151,122,'RESPONSABILE',bS,9)}
${_SB(151,136,'zona privata','rgba(167,139,250,.35)')}

${_LB(420,100,'SALA ATTESA','rgba(251,191,36,.7)',9)}
${_SB(420,114,'AP Wi-Fi ospiti','rgba(251,191,36,.42)')}
${_SB(420,126,'VLAN Guest (solo internet)','rgba(251,191,36,.38)')}

${_LB(689,86,'LOCALE TECNICO',tS,9)}
${_SB(689,100,'ONT · RACK · ROUTER','rgba(56,189,248,.45)')}
${_SB(689,112,'SWITCH  ·  UPS  ·  PATCH','rgba(56,189,248,.38)')}
${_SB(689,124,'(accesso solo staff)','rgba(56,189,248,.3)')}

${_LB(420,284,'CORRIDOIO  —  canalina cavi a parete',cS,7.5)}

${_LB(161,412,'UFFICIO 1',sS,9)}
${_SB(161,426,'VoIP · PC','rgba(52,211,153,.38)')}

${_LB(430,412,'UFFICIO 2',sS,9)}
${_SB(430,426,'VoIP · PC','rgba(52,211,153,.38)')}

${_LB(657,390,'UFFICIO 3  +  STAMPANTE',sS,9)}
${_SB(657,404,'VoIP · PC','rgba(52,211,153,.38)')}

${_LB(420,562,'INGRESSO  →  clienti','rgba(56,189,248,.28)',8)}

${/* ═══ ARREDI ═══ */''}
${/* Scrivania responsabile — grande, angolare */''}
${_DK(34,60,220,140)}

${/* Sala attesa: 2 divani + tavolino */''}
<rect x="294" y="50" width="145" height="70" rx="8" fill="rgba(251,191,36,.07)" stroke="${wS}" stroke-width=".8"/>
<rect x="294" y="130" width="145" height="60" rx="8" fill="rgba(251,191,36,.07)" stroke="${wS}" stroke-width=".8"/>
<rect x="460" y="80" width="60" height="55" rx="28" fill="rgba(251,191,36,.04)" stroke="rgba(251,191,36,.12)" stroke-width=".7"/>

${/* Locale tecnico: rack visuale */''}
<rect x="575" y="44" width="228" height="188" rx="4" fill="rgba(14,165,233,.06)" stroke="rgba(56,189,248,.3)" stroke-width="1"/>
<rect x="590" y="56" width="76" height="164" rx="3" fill="rgba(14,165,233,.18)" stroke="rgba(56,189,248,.5)" stroke-width="1.2"/>
<text x="628" y="116" text-anchor="middle" fill="rgba(56,189,248,.6)" font-size="7.5" font-family="JetBrains Mono,monospace">RACK</text>
${/* linee rack */''}
${[0,1,2,3,4,5].map(i=>`<line x1="592" y1="${66+i*24}" x2="664" y2="${66+i*24}" stroke="rgba(56,189,248,.2)" stroke-width=".6"/>`).join('')}
${/* Router e switch nel rack */''}
<rect x="592" y="60" width="72" height="14" rx="2" fill="rgba(14,165,233,.3)" stroke="rgba(56,189,248,.5)" stroke-width=".8"/>
<text x="628" y="70" text-anchor="middle" fill="rgba(56,189,248,.8)" font-size="6" font-family="JetBrains Mono,monospace">ROUTER</text>
<rect x="592" y="78" width="72" height="14" rx="2" fill="rgba(14,165,233,.25)" stroke="rgba(56,189,248,.4)" stroke-width=".8"/>
<text x="628" y="88" text-anchor="middle" fill="rgba(56,189,248,.7)" font-size="6" font-family="JetBrains Mono,monospace">SWITCH</text>
${/* ONT sulla parete destra del locale tecnico (muro est) */''}
<rect x="722" y="56" width="52" height="28" rx="3" fill="rgba(255,90,0,.2)" stroke="rgba(255,130,0,.7)" stroke-width="1.2"/>
<text x="748" y="67" text-anchor="middle" fill="rgba(255,160,0,.95)" font-size="7" font-family="JetBrains Mono,monospace" font-weight="700">ONT</text>
<text x="748" y="78" text-anchor="middle" fill="rgba(255,130,0,.6)" font-size="5.5" font-family="JetBrains Mono,monospace">FIBRA ISP</text>
${/* cavo dal ONT al rack */''}
<line x1="722" y1="70" x2="664" y2="70" stroke="rgba(255,130,0,.5)" stroke-width="1.5" stroke-dasharray="3,2"/>

${/* 3 uffici in basso: scrivanie e separator divisori */''}
${/* ufficio 1 */''}
${_DK(34,328,254,158)}
${/* ufficio 2 */''}
${_DK(316,328,228,158)}
${/* ufficio 3 (con stampante) */''}
${_DK(576,328,154,130)}
<rect x="576" y="464" width="90" height="70" rx="3" fill="rgba(52,211,153,.07)" stroke="rgba(52,211,153,.2)" stroke-width=".8"/>
<text x="621" y="502" text-anchor="middle" fill="rgba(52,211,153,.4)" font-size="7" font-family="JetBrains Mono,monospace">STAMPANTE</text>

${/* AP nel soffitto sala attesa — cerchi di copertura */''}
${_AP(420,190)}

${/* Canalina cavi nel corridoio */''}
<line x1="32" y1="285" x2="808" y2="285" stroke="rgba(56,189,248,.2)" stroke-width="2" stroke-dasharray="8,4"/>
<text x="420" y="298" text-anchor="middle" fill="rgba(56,189,248,.18)" font-size="6" font-family="JetBrains Mono,monospace">────── CANALINA CAVI ──────</text>

${_SCALA(34,562)}
<text x="${W/2}" y="16" text-anchor="middle" fill="rgba(56,189,248,.4)" font-size="9" font-family="JetBrains Mono,monospace" letter-spacing="2">SMALL OFFICE — PIANO TERRA — ~140 mq</text>
</svg>`;
}

function floor1Zones() {
  // Coordinate basate sulla piantina aggiornata:
  // TOP ROW  y=26–260
  //   Responsabile:   x=22–280    centro x=151
  //   Sala Attesa:    x=280–560   centro x=420
  //   Locale Tecnico: x=560–818   centro x=689
  // CORRIDOIO         y=260–310
  // BOTTOM ROW        y=310–542
  //   Ufficio 1:      x=22–300    centro x=161
  //   Ufficio 2:      x=300–560   centro x=430
  //   Ufficio 3:      x=560–818   centro x=689
  return [
    // ═══ LOCALE TECNICO (top-right, x=560–818) ═══
    // ONT sulla parete est (visivamente a x≈722), zone drop accanto al rack
    { id:'z-ont',    x:574, y:56,  w:40, h:26, accepts:['ont'],    label:'ONT',        hint:'ONT nel locale tecnico: sulla parete est dove arriva la fibra ISP. Patch cord diretto al router nel rack (max 1 metro). Stessa stanza del router.' },
    { id:'z-rack',   x:574, y:86,  w:40, h:80, accepts:['rack'],   label:'Rack 9U',    hint:'Rack 9U nel locale tecnico. Chiuso a chiave. Clienti non accedono. Contiene router, switch, patch panel, UPS.' },
    { id:'z-router', x:618, y:56,  w:80, h:36, accepts:['router'], label:'Router',     hint:'Router nel rack, stessa stanza dell\'ONT. Cavo ONT→Router WAN: 1 patch cord RJ-45. Zona presidiata, non accessibile ai clienti.' },
    { id:'z-switch', x:618, y:96,  w:80, h:36, accepts:['switch'], label:'Switch',     hint:'Switch nel rack. VLAN10 LAN per postazioni, trunk VLAN20 Guest verso l\'AP in sala attesa.' },
    { id:'z-patch',  x:618, y:136, w:80, h:24, accepts:['patch'],  label:'Patch',      hint:'Patch panel 24p: cablaggio strutturato converge qui.' },
    { id:'z-ups',    x:574, y:170, w:80, h:22, accepts:['ups'],    label:'UPS',        hint:'UPS: protegge ONT, router e switch da blackout.' },
    { id:'z-cable',  x:574, y:196, w:80, h:20, accepts:['cable'],  label:'Cat.6',      hint:'Bobina Cat.6 o patch cord per cablaggio strutturato.' },

    // ═══ UFFICIO RESPONSABILE (top-left, x=22–280) ═══
    { id:'z-boss',   x:32,  y:56,  w:228,h:140,accepts:['pc'],     label:'RESPONSABILE',hint:'PC responsabile. VLAN10 LAN. Zona privata — clienti non arrivano mai qui. Nessun apparato di rete in questa stanza.' },
    { id:'z-ph-boss',x:32,  y:200, w:90, h:32, accepts:['phone'],  label:'📞 VoIP',    hint:'Telefono VoIP responsabile. VLAN30 con QoS DSCP EF.' },

    // ═══ SALA ATTESA (top-center, x=280–560) ═══
    // Solo AP — è la zona accessibile ai clienti
    { id:'z-ap1',    x:360, y:178, w:120,h:60, accepts:['ap'],     label:'📶 AP\nSoffitto',hint:'AP a soffitto della sala attesa — unico punto Wi-Fi clienti. VLAN20 Guest → solo internet. I clienti NON vedono la LAN interna.' },

    // ═══ UFFICIO 1 (bottom-left, x=22–300) ═══
    { id:'z-stf1',   x:32,  y:328, w:254,h:120,accepts:['pc'],     label:'UFFICIO 1',  hint:'Postazione dipendente. VLAN10 LAN: accesso a risorse interne. Non raggiunge la rete Guest.' },
    { id:'z-ph-1',   x:32,  y:452, w:90, h:28, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP ufficio 1. VLAN30: condivide il cavo con il PC (passthrough sul telefono IP).' },

    // ═══ UFFICIO 2 (bottom-center, x=300–560) ═══
    { id:'z-stf2',   x:312, y:328, w:236,h:120,accepts:['pc'],     label:'UFFICIO 2',  hint:'Postazione dipendente. VLAN10 LAN.' },
    { id:'z-ph-2',   x:312, y:452, w:90, h:28, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP ufficio 2. VLAN30.' },

    // ═══ UFFICIO 3 + STAMPANTE (bottom-right, x=560–818) ═══
    { id:'z-stf3',   x:572, y:328, w:160,h:120,accepts:['pc'],     label:'UFFICIO 3',  hint:'Postazione dipendente. VLAN10 LAN.' },
    { id:'z-ph-3',   x:572, y:452, w:90, h:28, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP ufficio 3. VLAN30.' },
    { id:'z-printer',x:736, y:452, w:70, h:60, accepts:['printer'],label:'🖨️\nStampa', hint:'Stampante di rete. VLAN10 LAN. Non accessibile dalla VLAN20 Guest (sicurezza dati).' },
  ];
}

/* ══════════════════════════════════════════════════════════
   PIANTINA 2 — BUSINESS HUB (W=840 H=600)

   NORD  ┌────────────┬─────────────────────────┐ y=26
         │ SERVER ROOM│  UFFICIO DIREZIONE       │ y=26–190
         ├────────────┴─────────────────────────┤ y=190
         │        OPEN SPACE DIPENDENTI          │ y=190–380
         ├──────────┬─────────────┬─────────────┤ y=380
         │   SALA   │  RECEPTION  │   STAMPA +  │ y=380–552
         │  ATTESA  │             │   SERVIZI   │
   SUD  └──────────┴─────────────┴─────────────┘ y=552
══════════════════════════════════════════════════════════ */
function floor2SVG() {
  const W=840, H=600;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
${_GRID(2)}
<rect width="${W}" height="${H}" fill="#080e1a"/>
<rect x="22" y="26" width="${W-44}" height="${H-52}" fill="#0b1525"/>
<rect x="22" y="26" width="${W-44}" height="${H-52}" fill="url(#g2)"/>

${/* Sfondi */''}
${_RM(22,26,320,164,'rgba(14,165,233,.08)','rgba(56,189,248,.48)')}
${_RM(354,26,464,164,'rgba(167,139,250,.06)','rgba(167,139,250,.32)')}
${_RM(22,190,796,190,'rgba(52,211,153,.04)','rgba(52,211,153,.28)')}
${_RM(22,380,270,172,'rgba(251,191,36,.05)','rgba(251,191,36,.38)')}
${_RM(302,380,236,172,'rgba(56,189,248,.02)','rgba(56,189,248,.18)')}
${_RM(548,380,270,172,'rgba(52,211,153,.03)','rgba(52,211,153,.22)')}

${/* Perimetrali */''}
${_W(22,26,796,10)} ${_W(22,552,796,10)}
${_W(22,26,10,536)} ${_W(818,26,10,536)}

${/* Finestre */''}
${_WIN(70,26,80)} ${_WIN(210,26,80)} ${_WIN(450,26,100)} ${_WIN(640,26,80)} ${_WIN(750,26,60)}
${_WIN(70,552,80)} ${_WIN(290,552,80)} ${_WIN(510,552,90)} ${_WIN(700,552,80)}
${_WIN(22,80,70,true)} ${_WIN(22,300,70,true)} ${_WIN(22,460,60,true)}
${_WIN(818,80,70,true)} ${_WIN(818,300,70,true)} ${_WIN(818,460,60,true)}

${/* Muro V: server room | direzione */''}
${_W(344,26,10,164)}

${/* Muro H1: separa nord da open space */''}
${_W(22,188,174,10)} ${_DR(196,188,68)} ${_W(274,188,80,10)}
${_W(354,188,136,10)} ${_DR(490,188,68)} ${_W(568,188,250,10)}

${/* Muro H2: separa open space da zona sud */''}
${_W(22,378,82,10)} ${_DR(104,378,58)} ${_W(172,378,130,10)}
${_W(302,378,100,10)} ${_DR(402,378,58)} ${_W(470,378,78,10)}
${_W(548,378,100,10)} ${_DR(648,378,58)} ${_W(716,378,102,10)}

${/* Muri V zona bassa */''}
${_W(300,378,10,174)} ${_W(548,378,10,174)}

${/* Ingresso */''}
${_W(22,552,230,10)} ${_DR(252,552,76)} ${_W(338,552,480,10)}

${/* Pilastri */''}
${_PL(22,26)} ${_PL(818,26)} ${_PL(22,552)} ${_PL(818,552)}
${_PL(344,26)} ${_PL(344,188)} ${_PL(300,378)} ${_PL(548,378)}

${/* Label stanze */''}
${_LB(183,54,'SERVER ROOM','rgba(56,189,248,.7)',9)}
${_SB(183,68,'ONT · RACK · ROUTER · SWITCH','rgba(56,189,248,.4)')}
${_LB(586,54,'UFFICIO DIREZIONE','rgba(167,139,250,.65)',9)}
${_SB(586,68,'fondo — clienti non accedono','rgba(167,139,250,.4)')}
${_LB(420,218,'OPEN SPACE DIPENDENTI','rgba(52,211,153,.6)',9)}
${_SB(420,232,'VLAN LAN · VoIP su ogni scrivania','rgba(52,211,153,.38)')}
${_LB(161,414,'SALA ATTESA','rgba(251,191,36,.7)',9)}
${_SB(161,428,'AP Wi-Fi ospiti','rgba(251,191,36,.45)')}
${_LB(420,414,'RECEPTION','rgba(56,189,248,.55)',9)}
${_LB(683,414,'STAMPA + SERVIZI','rgba(52,211,153,.55)',8.5)}
${_LB(420,536,'CORRIDOIO / INGRESSO  →  clienti entrano qui','rgba(56,189,248,.28)',8)}

${/* Arredi */''}
<rect x="36" y="62" width="72" height="112" rx="3" fill="rgba(14,165,233,.12)" stroke="rgba(56,189,248,.32)" stroke-width="1"/>
${_LB(72,122,'RACK','rgba(56,189,248,.5)',8)}
${_DK(362,36,220,84)} ${_DK(596,36,208,84)}
${/* open space: 4 file */''}
${[0,1,2,3].map(r=>[0,1].map(c=>_DK(28+c*400,200+r*44,368,38)).join('')).join('')}
${/* sala attesa */''}
<rect x="34" y="392" width="112" height="40" rx="6" fill="rgba(251,191,36,.07)" stroke="rgba(251,191,36,.2)" stroke-width=".8"/>
<rect x="34" y="440" width="112" height="36" rx="6" fill="rgba(251,191,36,.07)" stroke="rgba(251,191,36,.2)" stroke-width=".8"/>
${/* banco reception */''}
${_DK(314,392,216,38)}
${_AP(264,490)}
${_ONT(140,26)}
${_SCALA(34,570)}
<text x="${W/2}" y="16" text-anchor="middle" fill="rgba(56,189,248,.4)" font-size="9" font-family="JetBrains Mono,monospace" letter-spacing="2">BUSINESS HUB — ~400 mq — 5 VLAN</text>
</svg>`;
}

function floor2Zones() {
  return [
    // Server room
    { id:'z-ont',    x:28,  y:56,  w:34, h:34, accepts:['ont'],    label:'ONT',        hint:'ONT nel server room. Fibra ISP → ONT → Router.' },
    { id:'z-rack',   x:28,  y:94,  w:34, h:78, accepts:['rack'],   label:'Rack 24U',   hint:'Rack a pavimento. Server room chiusa a chiave.' },
    { id:'z-router', x:118, y:56,  w:80, h:34, accepts:['router'], label:'Router Pro', hint:'Router Pro: routing inter-VLAN, firewall.' },
    { id:'z-switch', x:118, y:94,  w:80, h:34, accepts:['switch'], label:'Switch 24p', hint:'Switch 24p managed: 5 VLAN con 802.1Q.' },
    { id:'z-patch',  x:118, y:132, w:80, h:24, accepts:['patch'],  label:'Patch',      hint:'Patch panel 24p.' },
    { id:'z-ups',    x:28,  y:132, w:84, h:24, accepts:['ups'],    label:'UPS',        hint:'UPS per server room.' },
    { id:'z-nas',    x:210, y:56,  w:80, h:50, accepts:['nas'],    label:'NAS',        hint:'NAS: VLAN Server Farm isolata da Guest.' },
    { id:'z-cable',  x:210, y:110, w:80, h:24, accepts:['cable'],  label:'Cat.6',      hint:'Bobina Cat.6 305m.' },
    // NVR
    { id:'z-nvr',    x:210, y:138, w:80, h:28, accepts:['nvr'],    label:'NVR',        hint:'NVR nel server room. VLAN50 Sicurezza.' },
    // Direzione
    { id:'z-dir1',   x:354, y:36,  w:218,h:74, accepts:['pc'],     label:'DIR-01/02',  hint:'Postazioni direzione. VLAN10 LAN.' },
    { id:'z-dir2',   x:590, y:36,  w:214,h:74, accepts:['pc'],     label:'DIR-03/04',  hint:'Postazioni direzione. VLAN10 LAN.' },
    { id:'z-ph-d1',  x:354, y:118, w:70, h:20, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP DIR-01/02. VLAN30.' },
    { id:'z-ph-d2',  x:434, y:118, w:70, h:20, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP DIR-03/04. VLAN30.' },
    { id:'z-ph-d3',  x:590, y:118, w:70, h:20, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP DIR. VLAN30.' },
    { id:'z-ph-d4',  x:670, y:118, w:70, h:20, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP DIR. VLAN30.' },
    // Open space — 4 file × 2 lati
    { id:'z-st1',    x:28,  y:200, w:368,h:38, accepts:['pc'],     label:'STAFF 01–04',hint:'Fila 1 dipendenti. VLAN10 LAN.' },
    { id:'z-st2',    x:428, y:200, w:368,h:38, accepts:['pc'],     label:'STAFF 05–08',hint:'Fila 1 dx dipendenti. VLAN10 LAN.' },
    { id:'z-st3',    x:28,  y:244, w:368,h:38, accepts:['pc'],     label:'STAFF 09–12',hint:'Fila 2 dipendenti. VLAN10 LAN.' },
    { id:'z-st4',    x:428, y:244, w:368,h:38, accepts:['pc'],     label:'STAFF 13–16',hint:'Fila 2 dx. VLAN10 LAN.' },
    { id:'z-st5',    x:28,  y:288, w:368,h:38, accepts:['pc'],     label:'STAFF 17–20',hint:'Fila 3 dipendenti. VLAN10 LAN.' },
    { id:'z-st6',    x:428, y:288, w:368,h:38, accepts:['pc'],     label:'STAFF 21–24',hint:'Fila 3 dx. VLAN10 LAN.' },
    { id:'z-st7',    x:28,  y:332, w:368,h:38, accepts:['pc'],     label:'STAFF 25–28',hint:'Fila 4 dipendenti. VLAN10 LAN.' },
    { id:'z-st8',    x:428, y:332, w:368,h:38, accepts:['pc'],     label:'STAFF 29–32',hint:'Fila 4 dx. VLAN10 LAN.' },
    // VoIP per ogni fila
    { id:'z-ph-r1',  x:28,  y:190, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP fila 1. VLAN30.' },
    { id:'z-ph-r2',  x:428, y:190, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP fila 1 dx. VLAN30.' },
    { id:'z-ph-r3',  x:28,  y:234, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP fila 2. VLAN30.' },
    { id:'z-ph-r4',  x:428, y:234, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP fila 2 dx. VLAN30.' },
    { id:'z-ph-r5',  x:28,  y:278, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP fila 3. VLAN30.' },
    { id:'z-ph-r6',  x:428, y:278, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP fila 3 dx. VLAN30.' },
    // AP e stampante
    { id:'z-ap1',    x:152, y:452, w:68, h:60, accepts:['ap'],     label:'📶 AP',      hint:'AP in sala attesa: VLAN20 Guest → solo internet. VA qui!' },
    { id:'z-pr1',    x:556, y:390, w:108,h:48, accepts:['printer'],label:'🖨️ Stampa',  hint:'Stampante. VLAN10 LAN. Non da Guest.' },
    // Telecamere
    { id:'z-cam1',   x:28,  y:34,  w:28, h:26, accepts:['camera'], label:'📷 Cam',     hint:'Telecamera NW. VLAN50.' },
    { id:'z-cam2',   x:800, y:34,  w:28, h:26, accepts:['camera'], label:'📷 Cam',     hint:'Telecamera NE. VLAN50.' },
    { id:'z-cam3',   x:28,  y:528, w:28, h:26, accepts:['camera'], label:'📷 Cam',     hint:'Telecamera SW (ingresso). VLAN50.' },
  ];
}

/* ══════════════════════════════════════════════════════════
   PIANTINA 3 — ENTERPRISE FLOOR (W=880 H=640)

   NORD  ┌──────────┬─────────────────────────────┐ y=26
         │ SERVER   │   UFFICIO DIREZIONE          │ y=26–200
         │ FARM     │                              │
         ├──────────┴────────────┬─────────────────┤ y=200
         │   REPARTO IT          │  REPARTO COMM.  │ y=200–400
         ├────────────┬──────────┴─────────────────┤ y=400
         │ SALA ATTESA│ RECEPTION │ STAMPA+SERVIZI  │ y=400–564
   SUD  └────────────┴───────────┴─────────────────┘ y=564
══════════════════════════════════════════════════════════ */
function floor3SVG() {
  const W=880, H=640;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
${_GRID(3)}
<rect width="${W}" height="${H}" fill="#080e1a"/>
<rect x="22" y="26" width="${W-44}" height="${H-52}" fill="#0b1525"/>
<rect x="22" y="26" width="${W-44}" height="${H-52}" fill="url(#g3)"/>

${/* Sfondi */''}
${_RM(22,26,340,174,'rgba(248,113,113,.07)','rgba(248,113,113,.38)')}
${_RM(374,26,484,174,'rgba(167,139,250,.06)','rgba(167,139,250,.3)')}
${_RM(22,200,434,200,'rgba(56,189,248,.04)','rgba(56,189,248,.28)')}
${_RM(468,200,390,200,'rgba(251,191,36,.04)','rgba(251,191,36,.28)')}
${_RM(22,400,300,164,'rgba(251,191,36,.05)','rgba(251,191,36,.38)')}
${_RM(334,400,214,164,'rgba(56,189,248,.02)','rgba(56,189,248,.18)')}
${_RM(560,400,298,164,'rgba(52,211,153,.03)','rgba(52,211,153,.22)')}

${/* Perimetrali */''}
${_W(22,26,836,10)} ${_W(22,564,836,10)}
${_W(22,26,10,548)} ${_W(858,26,10,548)}

${/* Finestre */''}
${_WIN(70,26,80)} ${_WIN(220,26,80)} ${_WIN(430,26,100)} ${_WIN(640,26,80)} ${_WIN(770,26,70)}
${_WIN(70,564,80)} ${_WIN(290,564,90)} ${_WIN(510,564,100)} ${_WIN(720,564,80)}
${_WIN(22,80,70,true)} ${_WIN(22,300,70,true)} ${_WIN(22,460,60,true)}
${_WIN(858,80,70,true)} ${_WIN(858,300,70,true)} ${_WIN(858,460,60,true)}

${/* Muro V: server farm | direzione */''}
${_W(364,26,10,174)}

${/* Muro H1: separa zona nord dai reparti */''}
${_W(22,198,150,10)} ${_DR(172,198,68)} ${_W(250,198,114,10)}
${_W(374,198,130,10)} ${_DR(504,198,68)} ${_W(582,198,276,10)}

${/* Muro V: divide reparto IT da Commerciale */''}
${_W(456,198,10,202)}

${/* Muro H2: sopra zona bassa */''}
${_W(22,398,90,10)} ${_DR(112,398,58)} ${_W(180,398,154,10)}
${_W(334,398,100,10)} ${_DR(434,398,58)} ${_W(502,398,58,10)}
${_W(560,398,100,10)} ${_DR(660,398,58)} ${_W(728,398,130,10)}

${/* Muri V zona bassa */''}
${_W(332,398,10,166)} ${_W(558,398,10,166)}

${/* Ingresso */''}
${_W(22,564,244,10)} ${_DR(266,564,80)} ${_W(356,564,502,10)}

${/* Pilastri */''}
${_PL(22,26)} ${_PL(858,26)} ${_PL(22,564)} ${_PL(858,564)}
${_PL(364,26)} ${_PL(364,198)} ${_PL(456,198)} ${_PL(456,398)}
${_PL(332,398)} ${_PL(558,398)}

${/* Label stanze */''}
${_LB(193,54,'SERVER FARM','rgba(248,113,113,.7)',9)}
${_SB(193,68,'ONT · RACK RETE · RACK SERVER','rgba(248,113,113,.4)')}
${_LB(616,54,'UFFICIO DIREZIONE','rgba(167,139,250,.65)',9)}
${_SB(616,68,'fondo — clienti non accedono','rgba(167,139,250,.4)')}
${_LB(239,236,'REPARTO IT','rgba(56,189,248,.65)',9)}
${_SB(239,250,'VLAN LAN · VoIP su ogni scrivania','rgba(56,189,248,.38)')}
${_LB(663,236,'REPARTO COMMERCIALE','rgba(251,191,36,.65)',9)}
${_SB(663,250,'VLAN LAN · VoIP su ogni scrivania','rgba(251,191,36,.38)')}
${_LB(172,430,'SALA ATTESA','rgba(251,191,36,.7)',9)}
${_SB(172,444,'AP Wi-Fi ospiti','rgba(251,191,36,.45)')}
${_LB(441,430,'RECEPTION','rgba(56,189,248,.55)',9)}
${_LB(709,430,'STAMPA + SERVIZI','rgba(52,211,153,.55)',8.5)}
${_LB(440,548,'CORRIDOIO / INGRESSO  →  clienti entrano qui','rgba(56,189,248,.28)',8)}

${/* Arredi */''}
<rect x="36" y="60" width="68" height="120" rx="3" fill="rgba(14,165,233,.12)" stroke="rgba(56,189,248,.3)" stroke-width="1"/>
${_LB(70,122,'RACK','rgba(56,189,248,.45)',8)}
<rect x="118" y="60" width="68" height="120" rx="3" fill="rgba(248,113,113,.12)" stroke="rgba(248,113,113,.3)" stroke-width="1"/>
${_LB(152,122,'SRV','rgba(248,113,113,.45)',8)}
${_DK(380,36,232,82)} ${_DK(630,36,212,82)}
${[0,1,2,3].map(r=>[0,1].map(c=>_DK(28+c*434,210+r*44,418,38)).join('')).join('')}
<rect x="34" y="410" width="106" height="40" rx="6" fill="rgba(251,191,36,.07)" stroke="rgba(251,191,36,.2)" stroke-width=".8"/>
<rect x="34" y="458" width="106" height="38" rx="6" fill="rgba(251,191,36,.07)" stroke="rgba(251,191,36,.2)" stroke-width=".8"/>
${_DK(348,410,194,38)}
${_AP(270,504)}
${_ONT(150,26)}
${_SCALA(34,582)}
<text x="${W/2}" y="16" text-anchor="middle" fill="rgba(56,189,248,.4)" font-size="9" font-family="JetBrains Mono,monospace" letter-spacing="2">ENTERPRISE FLOOR — ~600 mq — 6 VLAN</text>
</svg>`;
}

function floor3Zones() {
  return [
    // Server farm
    { id:'z-ont',    x:28,  y:56,  w:34, h:34, accepts:['ont'],    label:'ONT',        hint:'ONT nella server farm. Fibra ISP → ONT → Router.' },
    { id:'z-rack1',  x:28,  y:94,  w:34, h:118,accepts:['rack'],   label:'Rack Rete',  hint:'Rack 1 — rete: router, switch, patch panel.' },
    { id:'z-rack2',  x:118, y:56,  w:34, h:156,accepts:['rack'],   label:'Rack Server',hint:'Rack 2 — server: NAS, UPS.' },
    { id:'z-router', x:200, y:56,  w:130,h:34, accepts:['router'], label:'Router Pro', hint:'Router enterprise: 6 VLAN, firewall, VPN.' },
    { id:'z-switch', x:200, y:94,  w:130,h:34, accepts:['switch'], label:'Switch 24p', hint:'Switch core 24p managed.' },
    { id:'z-patch',  x:200, y:132, w:130,h:24, accepts:['patch'],  label:'Patch',      hint:'Patch panel 24p.' },
    { id:'z-ups',    x:28,  y:172, w:130,h:22, accepts:['ups'],    label:'UPS',        hint:'UPS server farm.' },
    { id:'z-nas',    x:200, y:160, w:130,h:28, accepts:['nas'],    label:'NAS',        hint:'NAS VLAN Server Farm.' },
    { id:'z-cable',  x:28,  y:196, w:302,h:14, accepts:['cable'],  label:'SFP / Cat.6',hint:'SFP+ 10Gbps o bobina Cat.6.' },
    { id:'z-nvr',    x:296, y:56,  w:60, h:40, accepts:['nvr'],    label:'NVR',        hint:'NVR: VLAN50 Sicurezza.' },
    // Direzione
    { id:'z-dir1',   x:374, y:36,  w:228,h:76, accepts:['pc'],     label:'DIR 01–03',  hint:'Postazioni direzione. VLAN10 LAN.' },
    { id:'z-dir2',   x:618, y:36,  w:218,h:76, accepts:['pc'],     label:'DIR 04–06',  hint:'Postazioni direzione. VLAN10 LAN.' },
    { id:'z-ph-d1',  x:374, y:118, w:80, h:20, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP DIR. VLAN30.' },
    { id:'z-ph-d2',  x:462, y:118, w:80, h:20, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP DIR. VLAN30.' },
    { id:'z-ph-d3',  x:618, y:118, w:80, h:20, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP DIR. VLAN30.' },
    { id:'z-ph-d4',  x:706, y:118, w:80, h:20, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP DIR. VLAN30.' },
    // IT — 4 file
    { id:'z-it1',    x:28,  y:210, w:418,h:38, accepts:['pc'],     label:'IT 01–04',   hint:'PC IT fila 1. VLAN10 Management.' },
    { id:'z-it2',    x:28,  y:254, w:418,h:38, accepts:['pc'],     label:'IT 05–08',   hint:'PC IT fila 2. VLAN10 Management.' },
    { id:'z-it3',    x:28,  y:298, w:418,h:38, accepts:['pc'],     label:'IT 09–12',   hint:'PC IT fila 3. VLAN10 Management.' },
    { id:'z-it4',    x:28,  y:342, w:418,h:38, accepts:['pc'],     label:'IT 13–16',   hint:'PC IT fila 4. VLAN10 Management.' },
    { id:'z-ph-it1', x:28,  y:200, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP IT fila 1. VLAN30.' },
    { id:'z-ph-it2', x:28,  y:244, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP IT fila 2. VLAN30.' },
    { id:'z-ph-it3', x:28,  y:288, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP IT fila 3. VLAN30.' },
    { id:'z-ph-it4', x:28,  y:332, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP IT fila 4. VLAN30.' },
    // Commerciale — 4 file
    { id:'z-com1',   x:468, y:210, w:378,h:38, accepts:['pc'],     label:'COM 01–04',  hint:'PC Commerciale fila 1. VLAN10 LAN.' },
    { id:'z-com2',   x:468, y:254, w:378,h:38, accepts:['pc'],     label:'COM 05–08',  hint:'PC Commerciale fila 2. VLAN10 LAN.' },
    { id:'z-com3',   x:468, y:298, w:378,h:38, accepts:['pc'],     label:'COM 09–12',  hint:'PC Commerciale fila 3. VLAN10 LAN.' },
    { id:'z-com4',   x:468, y:342, w:378,h:38, accepts:['pc'],     label:'COM 13–16',  hint:'PC Commerciale fila 4. VLAN10 LAN.' },
    { id:'z-ph-c1',  x:468, y:200, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP Commerciale fila 1. VLAN30.' },
    { id:'z-ph-c2',  x:468, y:244, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP Commerciale fila 2. VLAN30.' },
    { id:'z-ph-c3',  x:468, y:288, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP Commerciale fila 3. VLAN30.' },
    { id:'z-ph-c4',  x:468, y:332, w:80, h:13, accepts:['phone'],  label:'📞 VoIP',    hint:'VoIP Commerciale fila 4. VLAN30.' },
    // AP
    { id:'z-ap1',    x:108, y:456, w:68, h:60, accepts:['ap'],     label:'📶 AP',      hint:'AP in sala attesa: VLAN20 Guest → solo internet. VA qui!' },
    { id:'z-ap2',    x:700, y:210, w:80, h:50, accepts:['ap'],     label:'📶 AP\nReparti',hint:'AP reparti: SSID aziendale VLAN10 LAN.' },
    // Stampante e telecamere
    { id:'z-pr1',    x:568, y:408, w:110,h:48, accepts:['printer'],label:'🖨️ Stampa',  hint:'Stampante. VLAN10 LAN.' },
    { id:'z-cam1',   x:28,  y:34,  w:28, h:26, accepts:['camera'], label:'📷 Cam',     hint:'Telecamera NW. VLAN50.' },
    { id:'z-cam2',   x:836, y:34,  w:28, h:26, accepts:['camera'], label:'📷 Cam',     hint:'Telecamera NE. VLAN50.' },
    { id:'z-cam3',   x:28,  y:538, w:28, h:26, accepts:['camera'], label:'📷 Cam',     hint:'Telecamera SW ingresso. VLAN50.' },
    { id:'z-cam4',   x:836, y:538, w:28, h:26, accepts:['camera'], label:'📷 Cam',     hint:'Telecamera SE. VLAN50.' },
    { id:'z-cam5',   x:398, y:538, w:28, h:26, accepts:['camera'], label:'📷 Cam',     hint:'Telecamera ingresso centrale. VLAN50.' },
  ];
}

const VLAN_DEFS = {
  1: [
    { id:10, name:'LAN Ufficio',  color:'rgba(52,211,153,0.85)',  desc:'Postazioni PC, stampante, NAS. Solo personale dipendente. Nessun accesso da VLAN20.',        prefix:'/24', suggested:'192.168.10.0/24' },
    { id:20, name:'Guest/Wi-Fi',  color:'rgba(251,191,36,0.85)',  desc:'Ospiti e dispositivi mobili. Accesso solo a Internet. BLOCCATO l\'accesso a VLAN10 (dati aziendali).', prefix:'/24', suggested:'192.168.20.0/24' },
  ],
  2: [
    { id:10, name:'Management',   color:'rgba(56,189,248,0.85)',  desc:'Router, switch, AP, NVR. Accessibile solo da personale IT autorizzato. Nessun accesso da altri.',       prefix:'/28', suggested:'10.10.0.0/28' },
    { id:20, name:'LAN Ufficio',  color:'rgba(52,211,153,0.85)',  desc:'PC dipendenti, stampanti, NAS. Solo personale. Bloccato da VLAN40 (guest) e VLAN50 (sicurezza).',      prefix:'/24', suggested:'10.10.20.0/24' },
    { id:30, name:'VoIP',         color:'rgba(167,139,250,0.85)', desc:'Telefoni IP. QoS priorità alta (DSCP EF). Totalmente isolato dalla rete dati. Separato anche da Guest.',prefix:'/25', suggested:'10.10.30.0/25' },
    { id:40, name:'Guest/Wi-Fi',  color:'rgba(251,191,36,0.85)',  desc:'Ospiti e dispositivi mobili. Solo Internet. Bloccato l\'accesso a VLAN20/30/50 e alla rete locale.',    prefix:'/24', suggested:'10.10.40.0/24' },
    { id:50, name:'Sicurezza/Cam',color:'rgba(248,113,113,0.85)', desc:'Telecamere IP e NVR. Completamente isolata. Solo il NVR può ricevere dai camera. Accesso vietato a tutti i PC.',prefix:'/26', suggested:'10.10.50.0/26' },
  ],
  3: [
    { id:10, name:'Management',   color:'rgba(56,189,248,0.85)',  desc:'Dispositivi di rete (router, switch, AP). Solo personale IT. Unica VLAN da cui si accede alla configurazione dei device.',  prefix:'/28', suggested:'172.16.10.0/28' },
    { id:20, name:'LAN Ufficio',  color:'rgba(52,211,153,0.85)',  desc:'PC dipendenti (Direzione, IT, Commerciale), stampanti. Accesso al NAS (VLAN60) tramite firewall rule.',   prefix:'/23', suggested:'172.16.20.0/23' },
    { id:30, name:'VoIP',         color:'rgba(167,139,250,0.85)', desc:'Telefoni IP. QoS DSCP EF, priorità massima. Segmento isolato, latenza <150ms, jitter <30ms, loss <1%.',    prefix:'/25', suggested:'172.16.30.0/25' },
    { id:40, name:'Guest/Wi-Fi',  color:'rgba(251,191,36,0.85)',  desc:'Ospiti sala aspetto. Solo accesso a Internet filtrato. Bloccato da tutte le VLAN interne. Captive portal opzionale.',prefix:'/24', suggested:'172.16.40.0/24' },
    { id:50, name:'Sicurezza/Cam',color:'rgba(248,113,113,0.85)', desc:'Telecamere IP + NVR nel locale sicurezza. Isolato da tutto. Può uscire solo verso server NVR. Non raggiungibile da PC.',  prefix:'/26', suggested:'172.16.50.0/26' },
    { id:60, name:'Server Farm',  color:'rgba(255,140,0,0.85)',   desc:'NAS, server, backup. Accessibile da VLAN20 (LAN) solo su porte specifiche (SMB 445, NFS 2049). Bloccato da Guest e VoIP.', prefix:'/25', suggested:'172.16.60.0/25' },
  ],
};

/* ══════════════════════════════════════════════════════════
   DEFINIZIONI LIVELLI
══════════════════════════════════════════════════════════ */
const LEVELS = {
  1: {
    name:'Small Office', subtitle:'Studio professionale — ~140 mq',
    description:'Uno studio professionale con: segreteria (zona tecnica), ufficio dipendenti A e B, ufficio del responsabile in fondo. Il cliente entra, trova subito la sala attesa e la segreteria. Percorrendo il corridoio raggiunge gli uffici dipendenti. Il responsabile è in fondo, irraggiungibile dai clienti. VoIP su ogni scrivania. 2 VLAN: LAN Ufficio + Guest Wi-Fi. Budget: €2.000.',
    budget:2000, xpReward:150, floorW:840, floorH:580,
    objectives:[
      { id:'o-ont',     label:'ONT nel locale tecnico (segreteria)',       check:p=>p.ont>=1 },
      { id:'o-router',  label:'Router in zona presidiata (segreteria)',    check:p=>p.router>=1 },
      { id:'o-switch',  label:'Switch nel rack segreteria',               check:p=>p.switch16>=1||p.switch24>=1 },
      { id:'o-rack',    label:'Rack a muro nel locale tecnico',            check:p=>p.rack>=1 },
      { id:'o-pc',      label:'Almeno 5 postazioni PC',                   check:p=>p.pc>=5 },
      { id:'o-phone',   label:'VoIP su ogni scrivania (almeno 4)',        check:p=>p.phone>=4 },
      { id:'o-ap',      label:'AP Wi-Fi nella sala d\'aspetto',           check:p=>p.ap>=1 },
      { id:'o-printer', label:'Stampante di rete (VLAN LAN)',             check:p=>p.printer>=1 },
      { id:'o-cable',   label:'Cablaggio con cavi Cat.6',                 check:p=>p.cat6>=1||p.cat6bulk>=1 },
    ],
    bonusRules:[
      { id:'b-ups',   label:'UPS installato (+30 XP)',      check:p=>p.ups>=1,   xp:30 },
      { id:'b-patch', label:'Patch panel usato (+20 XP)',   check:p=>p.patch>=1, xp:20 },
      { id:'b-nohub', label:'Nessun hub obsoleto (+25 XP)', check:p=>p.hub===0,  xp:25 },
    ],
    penalties:[
      { id:'p-noont',  label:'ONT mancante (-30)',          check:p=>p.ont<1,    pts:-30 },
      { id:'p-nophone',label:'Nessun telefono VoIP (-25)',  check:p=>p.phone<1,  pts:-25 },
      { id:'p-hub',    label:'Hub obsoleto usato (-40)',    check:p=>p.hub>=1,   pts:-40 },
      { id:'p-budget', label:'Budget superato (-50)',       check:(p,c)=>c>2000, pts:-50 },
    ],
    hints:[
      { trigger:'start',    text:'<strong>Regola fondamentale:</strong> l\'ONT e il router <strong>devono essere nella stessa stanza</strong> — si collegano con un semplice cavo Ethernet (patch cord). Il locale tecnico è nella <strong>segreteria</strong>: posiziona ONT, rack, router e switch tutti lì.' },
      { trigger:'hasOnt',   text:'<strong>ONT nella segreteria!</strong> Ora metti il router <strong>nello stesso rack</strong>: ONT (porta LAN) → Router (porta WAN), un patch cord da 1 metro. Il router poi gestisce VLAN10 (LAN interna) e VLAN20 (Guest Wi-Fi).' },
      { trigger:'hasRouter',text:'<strong>Ottimo!</strong> ONT e router sono nella stessa stanza — questo è corretto. L\'AP va invece nella <strong>sala attesa</strong> (zona clienti). Con le VLAN l\'AP trasmette due reti: aziendale (VLAN10) e ospiti (VLAN20, solo internet).' },
      { trigger:'hasAP',    text:'<strong>AP in sala attesa!</strong> I clienti si connettono alla VLAN Guest (solo internet), completamente isolata dalla LAN interna. Le scrivanie dei dipendenti non sono visibili dalla rete Guest.' },
      { trigger:'hasPCs',   text:'<strong>Quasi completo!</strong> Non dimenticare il <strong>VoIP su ogni scrivania</strong> (segreteria, dipendenti, responsabile). Poi configura le VLAN nella fase 2.' },
    ],
    floorSVG:floor1SVG, dropZones:floor1Zones,
    networkTopology:'<strong>Catena:</strong> ISP → ONT → Router → Switch → {VLAN10: PC ufficio, stampante} | AP → {VLAN20: Guest Wi-Fi sala aspetto}<br>VoIP su ogni scrivania → VLAN30 (QoS DSCP EF)',
    vlanDefs: VLAN_DEFS[1],
    subnetBase:'192.168.0.0',
  },
  2: {
    name:'Business Hub', subtitle:'PMI — ~400 mq — 2 reparti',
    description:'Una PMI con server room (locale tecnico, non accessibile ai clienti), ufficio direzione in fondo, open-space dipendenti nel mezzo, e sala aspetto all\'ingresso (dove il cliente arriva subito). Ogni scrivania ha un telefono VoIP. 5 VLAN: Management, LAN, VoIP, Guest, Sicurezza/TVCC. Budget: €4.500.',
    budget:4500, xpReward:280, floorW:840, floorH:600,
    objectives:[
      { id:'o-ont',    label:'ONT nella server room',                   check:p=>p.ont>=1 },
      { id:'o-router', label:'Router Pro nella server room',            check:p=>p.router>=1 },
      { id:'o-switch', label:'Switch 24p managed (richiesto per VLAN)', check:p=>p.switch24>=1 },
      { id:'o-rack',   label:'Rack a pavimento in server room',         check:p=>p.rack>=1 },
      { id:'o-patch',  label:'Patch panel installato',                  check:p=>p.patch>=1 },
      { id:'o-pc',     label:'Almeno 10 postazioni PC',                 check:p=>p.pc>=10 },
      { id:'o-ap',     label:'AP nella sala d\'aspetto',                check:p=>p.ap>=1 },
      { id:'o-printer',label:'Stampante di rete',                       check:p=>p.printer>=1 },
      { id:'o-voip',   label:'VoIP su ogni scrivania (≥8 telefoni)',   check:p=>p.phone>=8 },
      { id:'o-ups',    label:'UPS installato',                         check:p=>p.ups>=1 },
      { id:'o-vlan',   label:'5 VLAN configurate (10/20/30/40/50)',    check:(_,__,v)=>v&&v.filter(x=>x.filled).length>=5 },
    ],
    bonusRules:[
      { id:'b-nas',   label:'NAS Server (+40 XP)',                  check:p=>p.nas>=1,          xp:40 },
      { id:'b-cam',   label:'Telecamere IP installate (+35 XP)',    check:p=>p.camera>=2,       xp:35 },
      { id:'b-nvr',   label:'NVR per sorveglianza (+20 XP)',        check:p=>p.nvr>=1,          xp:20 },
      { id:'b-nohub', label:'Nessun dispositivo obsoleto (+30 XP)', check:p=>p.hub===0,         xp:30 },
    ],
    penalties:[
      { id:'p-noont',   label:'ONT mancante (-35)',                        check:p=>p.ont<1,    pts:-35 },
      { id:'p-nophone', label:'VoIP insufficienti — ogni scrivania ne ha bisogno (-30)', check:p=>p.phone<4, pts:-30 },
      { id:'p-hub',     label:'Hub usato (-50)',                           check:p=>p.hub>=1,   pts:-50 },
      { id:'p-switch16',label:'Switch non gestito (no VLAN) (-35)',        check:p=>p.switch16>=1&&p.switch24===0, pts:-35 },
      { id:'p-budget',  label:'Budget superato (-60)',                     check:(p,c)=>c>4500, pts:-60 },
    ],
    hints:[
      { trigger:'start',    text:'<strong>Circolazione corretta:</strong> cliente entra → sala aspetto (AP Guest) → reception → corridoio → uffici dipendenti → direzione in fondo. Server room: non accessibile ai clienti. VoIP su OGNI scrivania!' },
      { trigger:'hasOnt',   text:'<strong>ONT installato!</strong> 5 VLAN: VLAN10 gestione dispositivi (solo IT), VLAN20 dipendenti, VLAN30 VoIP (QoS!), VLAN40 ospiti Wi-Fi, VLAN50 telecamere/NVR isolate.' },
      { trigger:'hasSwitch',text:'<strong>Switch 24p managed obbligatorio!</strong> Ogni porta deve essere configurata: access port per PC e telefoni, trunk port per AP e router. Le telecamere (VLAN50) non devono essere raggiungibili dai PC.' },
      { trigger:'hasPCs',   text:'<strong>VoIP su ogni scrivania!</strong> Il telefono IP condivide la presa RJ-45 con il PC (porta di passthrough). Il telefono è taggato VLAN30, il PC è sulla VLAN20. Un solo cavo per entrambi.' },
    ],
    floorSVG:floor2SVG, dropZones:floor2Zones,
    networkTopology:'<strong>Catena:</strong> ISP → ONT → Router Pro → Switch 24p → {VLAN10: Mgmt | VLAN20: LAN | VLAN30: VoIP | VLAN40: Guest AP | VLAN50: Cam→NVR}',
    vlanDefs: VLAN_DEFS[2],
    subnetBase:'10.10.0.0',
  },
  3: {
    name:'Enterprise Floor', subtitle:'Azienda strutturata — ~600 mq',
    description:'Azienda con server farm, reparto IT, direzione, commerciale, sala riunioni, sala aspetto all\'ingresso, reception e locale sicurezza. Il responsabile è sempre in fondo. Ogni scrivania ha VoIP. 6 VLAN con piena separazione. Budget: €10.000.',
    budget:10000, xpReward:500, floorW:880, floorH:640,
    objectives:[
      { id:'o-ont',    label:'ONT nella server farm',                     check:p=>p.ont>=1 },
      { id:'o-router', label:'Router Pro enterprise',                     check:p=>p.router>=1 },
      { id:'o-switch', label:'Switch 24p managed core',                   check:p=>p.switch24>=1||p.switch48>=1 },
      { id:'o-rack2',  label:'2 rack (rete + server)',                    check:p=>p.rack>=2 },
      { id:'o-patch',  label:'Patch panel installato',                    check:p=>p.patch>=1 },
      { id:'o-pc',     label:'Almeno 16 postazioni PC',                   check:p=>p.pc>=16 },
      { id:'o-phone',  label:'VoIP su ogni scrivania (≥12 telefoni)',     check:p=>p.phone>=12 },
      { id:'o-ap',     label:'AP nella sala aspetto (VLAN Guest)',        check:p=>p.ap>=1 },
      { id:'o-ap2',    label:'2° AP per copertura completa reparti',      check:p=>p.ap>=2 },
      { id:'o-nas',    label:'NAS Server (VLAN Server Farm)',             check:p=>p.nas>=1 },
      { id:'o-ups',    label:'UPS per continuità',                        check:p=>p.ups>=1 },
      { id:'o-cam',    label:'Almeno 3 telecamere IP (VLAN sicurezza)',   check:p=>p.camera>=3 },
      { id:'o-nvr',    label:'NVR nel locale sicurezza',                  check:p=>p.nvr>=1 },
      { id:'o-vlan',   label:'6 VLAN configurate (10/20/30/40/50/60)',    check:(_,__,v)=>v&&v.filter(x=>x.filled).length>=6 },
    ],
    bonusRules:[
      { id:'b-sfp',   label:'Uplink SFP fibra (+35 XP)',              check:p=>p.sfp>=1,       xp:35 },
      { id:'b-5cam',  label:'5 telecamere installate (+40 XP)',        check:p=>p.camera>=5,   xp:40 },
      { id:'b-nohub', label:'Nessun dispositivo obsoleto (+40 XP)',    check:p=>p.hub===0,     xp:40 },
      { id:'b-voip',  label:'5+ telefoni VoIP (+25 XP)',              check:p=>p.phone>=5,    xp:25 },
    ],
    penalties:[
      { id:'p-noont',  label:'ONT mancante (-40)',                        check:p=>p.ont<1,   pts:-40 },
      { id:'p-hub',    label:'Hub usato (-60)',                           check:p=>p.hub>=1,  pts:-60 },
      { id:'p-novlan', label:'VLAN insufficienti (<6) (-40)',             check:(_,__,v)=>!v||v.filter(x=>x.filled).length<6, pts:-40 },
      { id:'p-budget', label:'Budget superato (-80)',                     check:(p,c)=>c>10000,pts:-80 },
    ],
    hints:[
      { trigger:'start',    text:'<strong>Enterprise:</strong> 2 rack separati — uno per la rete (router, switch, patch panel) e uno per i server (NAS, UPS). L\'ONT è nella server farm, locale sicuro e presidiato dal personale IT.' },
      { trigger:'hasOnt',   text:'<strong>6 VLAN enterprise:</strong> VLAN10 (Mgmt/IT), VLAN20 (LAN dipendenti), VLAN30 (VoIP), VLAN40 (Guest sala aspetto), VLAN50 (Telecamere/NVR locale sicurezza), VLAN60 (Server Farm). Ogni VLAN è isolata.' },
      { trigger:'hasSwitch',text:'<strong>AP sala aspetto OBBLIGATORIO:</strong> i visitatori usano VLAN40 (solo internet). I dipendenti possono connettersi wireless su VLAN20 con autenticazione 802.1X (certificato). Installa un secondo AP per la reception.' },
      { trigger:'hasPCs',   text:'<strong>Locale sicurezza:</strong> il NVR è fisicamente nel locale sicurezza (chiuso a chiave). Le telecamere sono su VLAN50 completamente isolata. SOLO il NVR riceve il flusso video. Nessun PC dipendente può accedervi.' },
    ],
    floorSVG:floor3SVG, dropZones:floor3Zones,
    networkTopology:'<strong>Catena:</strong> ISP → ONT → Router Pro → Switch 24p Core → {VLAN10: Mgmt | VLAN20: LAN | VLAN30: VoIP | VLAN40: Guest (2xAP sala asp.+reception) | VLAN50: Cam→NVR Sicurezza | VLAN60: NAS Server Farm}',
    vlanDefs: VLAN_DEFS[3],
    subnetBase:'172.16.0.0',
  },
};

/* ══════════════════════════════════════════════════════════
   CALCOLATORE SUBNET
   Dato un indirizzo base e una prefix length (/n),
   calcola: network, first host, last host, broadcast, mask, wildcard
══════════════════════════════════════════════════════════ */
const SubnetCalc = {
  // Converte IP stringa in numero a 32 bit
  ipToInt(ip) {
    return ip.split('.').reduce((acc,oct)=>(acc<<8)+parseInt(oct),0)>>>0;
  },
  // Converte numero a 32 bit in stringa IP
  intToIp(n) {
    return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join('.');
  },
  // Calcola tutti i parametri di una sottorete
  calc(networkAddr, prefix) {
    prefix = parseInt(prefix);
    const ip   = this.ipToInt(networkAddr);
    const mask = prefix===0 ? 0 : (0xFFFFFFFF << (32-prefix))>>>0;
    const net  = (ip & mask)>>>0;
    const bc   = (net | (~mask>>>0))>>>0;
    const fh   = prefix>=31 ? net : (net+1)>>>0;
    const lh   = prefix>=31 ? bc  : (bc-1)>>>0;
    const hosts= prefix>=30 ? (prefix===31?2:1) : Math.pow(2,32-prefix)-2;
    return {
      prefix,
      network:   this.intToIp(net),
      mask:      this.intToIp(mask),
      wildcard:  this.intToIp(~mask>>>0),
      firstHost: this.intToIp(fh),
      lastHost:  this.intToIp(lh),
      broadcast: this.intToIp(bc),
      hosts,
      binaryMask: mask.toString(2).padStart(32,'0'),
      cidr:`${this.intToIp(net)}/${prefix}`,
    };
  },
  // Genera riga binaria della maschera con separazione ottetti
  binaryMaskFormatted(bm) {
    return [bm.slice(0,8),bm.slice(8,16),bm.slice(16,24),bm.slice(24,32)].join('.');
  },
};

/* ══════════════════════════════════════════════════════════
   STATO APPLICAZIONE
══════════════════════════════════════════════════════════ */
const State = {
  currentLevel:null, currentLevelData:null,
  totalXP:0, levelScores:{},
  placedItems:{}, usedCounts:{},
  dragItem:null, score:0,
  hintsUsed:0, hintStep:0,
  completedLevels:new Set(),
  activeFilter:'all', searchQuery:'',
  vlanConfig:{}, // vlanId -> { networkAddr, prefix, filled }
};

/* ══════════════════════════════════════════════════════════
   APP CONTROLLER
══════════════════════════════════════════════════════════ */
const App = {

  /* ── NAVIGAZIONE ──────────────────────────────────────── */
  goToSplash()      { this._showScreen('screen-splash'); },
  goToLevelSelect() { this._updateLevelCards(); this._showScreen('screen-levels'); document.getElementById('total-xp').textContent=State.totalXP; },

  _showScreen(id) {
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  _updateLevelCards() {
    [1,2,3].forEach(n=>{
      const card=document.getElementById(`card-${n}`), status=document.getElementById(`status-${n}`);
      if(!card||!status) return;
      if(n===1||State.completedLevels.has(n-1)) {
        card.classList.remove('locked');
        if(State.completedLevels.has(n)) {
          const sc=State.levelScores[n]||0, stars=sc>=85?'⭐⭐⭐':sc>=60?'⭐⭐':'⭐';
          status.innerHTML=`<span class="status-complete">${stars} Completato — ${sc}pt</span>`;
        } else if(n>1) status.innerHTML=`<span class="status-new">SBLOCCATO!</span>`;
      } else {
        card.classList.add('locked');
        status.innerHTML=`<span class="status-locked">🔒 Completa il Livello ${n-1}</span>`;
      }
    });
  },

  /* ── AVVIO LIVELLO ────────────────────────────────────── */
  startLevel(n) {
    if(n>1&&!State.completedLevels.has(n-1)) return;
    State.currentLevel=n; State.currentLevelData=LEVELS[n];
    State.placedItems={}; State.usedCounts={}; State.score=0;
    State.hintsUsed=0; State.hintStep=0; State.activeFilter='all'; State.searchQuery='';
    State.vlanConfig={};

    const lvl=State.currentLevelData;
    document.getElementById('hud-level-name').textContent=`LIVELLO ${n}`;
    document.getElementById('hud-scenario-name').textContent=lvl.name;
    ['hud-score','hud-xp'].forEach(id=>document.getElementById(id).textContent='0');
    document.getElementById('hud-budget').textContent='€0';
    document.getElementById('floor-title').textContent=`${n===1?'🏢':n===2?'🏗️':'🏛️'} ${lvl.name} — ${lvl.subtitle}`;
    document.getElementById('mission-text').textContent=lvl.description;

    const si=document.getElementById('comp-search'); if(si){si.value='';}
    const sc=document.getElementById('search-clear'); if(sc)sc.classList.remove('visible');
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));

    this._buildComponentsList();
    this._buildFloor();
    this._buildChecklist();
    this._buildLegend();
    this._buildNetworkStatusPanel();
    this._buildVLANPanel();
    this._updateAll();
    this._setTip(0);
    this._showScreen('screen-game');
  },

  /* ── RICERCA ──────────────────────────────────────────── */
  searchComponents(q) {
    State.searchQuery=q.trim().toLowerCase();
    const cl=document.getElementById('search-clear'); if(cl)cl.classList.toggle('visible',State.searchQuery.length>0);
    this._applyFilter();
  },
  clearSearch() {
    State.searchQuery='';
    const i=document.getElementById('comp-search'); if(i)i.value='';
    const c=document.getElementById('search-clear'); if(c)c.classList.remove('visible');
    this._applyFilter();
  },
  filterComponents(cat,btn) {
    State.activeFilter=cat;
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    this._applyFilter();
  },
  _applyFilter() {
    const items=document.querySelectorAll('.component-item');
    let vis=0;
    items.forEach(el=>{
      const catOk=State.activeFilter==='all'||el.dataset.category===State.activeFilter;
      const q=State.searchQuery;
      const qOk=!q||(el.dataset.searchName||'').includes(q)||(el.dataset.searchDetail||'').includes(q)||el.dataset.category.includes(q);
      const show=catOk&&qOk;
      el.style.display=show?'':'none';
      if(show) vis++;
      const ne=el.querySelector('.comp-name'), de=el.querySelector('.comp-detail');
      if(show&&q) {
        if(ne) ne.innerHTML=this._hl(ne.dataset.orig||ne.textContent,q);
        if(de) de.innerHTML=this._hl(de.dataset.orig||de.textContent,q);
      } else {
        if(ne&&ne.dataset.orig) ne.innerHTML=ne.dataset.orig;
        if(de&&de.dataset.orig) de.innerHTML=de.dataset.orig;
      }
    });
    const nr=document.getElementById('search-no-results'); if(nr) nr.style.display=vis===0?'flex':'none';
  },
  _hl(text,q) {
    const re=new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
    return text.replace(re,'<span class="comp-highlight">$1</span>');
  },

  /* ── LISTA COMPONENTI ─────────────────────────────────── */
  _buildComponentsList() {
    const container=document.getElementById('components-list');
    container.innerHTML='';
    const n=State.currentLevel;
    const included=n===1
      ?['ont','router','switch16','switch8','hub8','ap-indoor','ap-outdoor','rack-wall','rack-floor','pc-workst','laptop','printer-net','phone-voip','patch-panel','ups','cat6-1m','cat6-3m','cat6-5m','coax-cable','wifi-usb','powerline']
      :n===2
      ?['ont','router','router-pro','switch16','switch24','switch48','hub8','ap-indoor','ap-outdoor','rack-wall','rack-floor','pc-workst','laptop','printer-net','phone-voip','server-nas','patch-panel','ups','camera-ip','nvr','cat6-3m','cat6-5m','cat6-bulk','sfp-fiber','coax-cable','powerline']
      :CATALOG.map(c=>c.id);

    included.forEach(cid=>{
      const item=CATALOG.find(c=>c.id===cid); if(!item) return;
      const el=document.createElement('div');
      el.className='component-item'+(item.multi?' multi-use':'');
      el.dataset.compId=item.id; el.dataset.category=item.cat;
      el.dataset.searchName=item.name.toLowerCase(); el.dataset.searchDetail=item.detail.toLowerCase();
      el.draggable=true; el.title=item.desc||item.detail;
      const priceHTML=item.price===0?`<span class="comp-price" style="color:var(--green);background:var(--green-dim)">ISP</span>`:`<span class="comp-price">€${item.price}</span>`;
      el.innerHTML=`<span class="comp-icon">${item.icon}</span>
        <div class="comp-info">
          <div class="comp-name" data-orig="${item.name}">${item.name}</div>
          <div class="comp-detail" data-orig="${item.detail}">${item.detail}</div>
        </div>${priceHTML}`;
      el.addEventListener('dragstart',e=>this._onDragStart(e,item));
      el.addEventListener('dragend',()=>el.classList.remove('dragging'));
      container.appendChild(el);
    });
  },

  /* ── PIANTINA ─────────────────────────────────────────── */
  _buildFloor() {
    const lvl=State.currentLevelData;
    const svg=document.getElementById('floor-svg-container');
    const layer=document.getElementById('placed-items-layer');
    const canvas=document.getElementById('floor-canvas');
    canvas.style.width=lvl.floorW+'px'; canvas.style.height=lvl.floorH+'px';
    svg.innerHTML=lvl.floorSVG(); svg.style.position='absolute'; svg.style.top='0'; svg.style.left='0';
    layer.innerHTML='';
    lvl.dropZones().forEach(z=>{
      const div=document.createElement('div');
      div.className='drop-zone'; div.id=z.id;
      div.style.left=z.x+'px'; div.style.top=z.y+'px';
      div.style.width=z.w+'px'; div.style.height=z.h+'px';
      div.dataset.accepts=JSON.stringify(z.accepts); div.dataset.hint=z.hint||'';
      div.innerHTML=`<span class="drop-zone-label">${z.label}</span>`;
      div.addEventListener('dragover',e=>this._onDragOver(e,div,z));
      div.addEventListener('dragleave',e=>this._onDragLeave(e,div));
      div.addEventListener('drop',e=>this._onDrop(e,div,z));
      layer.appendChild(div);
    });
  },

  /* ── DRAG & DROP ──────────────────────────────────────── */
  _onDragStart(e,item) { State.dragItem=item; e.currentTarget.classList.add('dragging'); e.dataTransfer.effectAllowed='copy'; },
  _acceptsTag(accepts,tag) {
    return accepts.some(a=>{
      switch(a){
        case 'ont':return tag==='ont';
        case 'router':return tag==='router';
        case 'switch':return ['switch16','switch24','switch48','switch8'].includes(tag);
        case 'rack':return tag==='rack';
        case 'pc':return tag==='pc';
        case 'ap':return tag==='ap';
        case 'printer':return tag==='printer';
        case 'phone':return tag==='phone';
        case 'ups':return tag==='ups';
        case 'patch':return tag==='patch';
        case 'nas':return tag==='nas';
        case 'camera':return tag==='camera';
        case 'nvr':return tag==='nvr';
        case 'cable':return ['cat6','cat6bulk','sfp'].includes(tag);
        default:return false;
      }
    });
  },
  _onDragOver(e,dropEl,zone) {
    e.preventDefault(); if(!State.dragItem) return;
    const ok=this._acceptsTag(JSON.parse(dropEl.dataset.accepts),State.dragItem.tag);
    dropEl.classList.toggle('drag-over',ok); dropEl.classList.toggle('wrong-item',!ok);
    e.dataTransfer.dropEffect=ok?'copy':'none';
  },
  _onDragLeave(e,dropEl) { dropEl.classList.remove('drag-over','wrong-item'); },
  _onDrop(e,dropEl,zone) {
    e.preventDefault(); dropEl.classList.remove('drag-over','wrong-item');
    if(!State.dragItem) return;
    if(dropEl.classList.contains('occupied')){ this._toast('Zona già occupata!','warning'); return; }
    const item=State.dragItem;
    if(!this._acceptsTag(JSON.parse(dropEl.dataset.accepts),item.tag)){ this._toast('Componente non adatto!','error'); return; }
    State.placedItems[zone.id]={item,zone};
    State.usedCounts[item.tag]=(State.usedCounts[item.tag]||0)+1;
    if(item.id.includes('hub')) State.usedCounts.hub=(State.usedCounts.hub||0)+1;
    dropEl.classList.add('occupied');
    dropEl.innerHTML=`<div class="placed-item" id="pi-${zone.id}">
      <div class="placed-icon-wrap"><span>${item.icon}</span>
        <span class="placed-remove" onclick="App.removePlaced('${zone.id}')">✕</span>
      </div>
      <span class="placed-label">${item.name.length>14?item.name.substring(0,13)+'…':item.name}</span>
    </div>`;
    if(!item.multi){ const le=document.querySelector(`.component-item[data-comp-id="${item.id}"]`); if(le) le.classList.add('used'); }
    if(zone.hint) this._setTipText(zone.hint);
    this._updateAll(); this._showContextTip(item.tag); State.score+=10;
    this._toast(`${item.icon} ${item.name} posizionato!`,'success');
    if(item.tag==='ont') setTimeout(()=>this._toast('🔆 ONT — fibra ISP connessa alla rete!','success'),400);
    if(item.tag==='camera') setTimeout(()=>this._toast('📷 Ricorda: le telecamere vanno su VLAN50 (sicurezza) — isolata!','warning'),500);
  },

  removePlaced(zoneId) {
    const entry=State.placedItems[zoneId]; if(!entry) return;
    const item=entry.item;
    if(State.usedCounts[item.tag]>0) State.usedCounts[item.tag]--;
    if(item.id.includes('hub')&&State.usedCounts.hub>0) State.usedCounts.hub--;
    delete State.placedItems[zoneId];
    const zone=LEVELS[State.currentLevel].dropZones().find(z=>z.id===zoneId);
    const dropEl=document.getElementById(zoneId);
    if(dropEl){
      dropEl.classList.remove('occupied');
      dropEl.innerHTML=`<span class="drop-zone-label">${zone.label}</span>`;
      dropEl.addEventListener('dragover',e=>this._onDragOver(e,dropEl,zone));
      dropEl.addEventListener('dragleave',e=>this._onDragLeave(e,dropEl));
      dropEl.addEventListener('drop',e=>this._onDrop(e,dropEl,zone));
    }
    if(!item.multi){ const le=document.querySelector(`.component-item[data-comp-id="${item.id}"]`); if(le) le.classList.remove('used'); }
    this._updateAll();
  },
  clearFloor() { Object.keys(State.placedItems).forEach(z=>this.removePlaced(z)); this._toast('Piantina pulita','warning'); },
  undoLast() { const k=Object.keys(State.placedItems); if(!k.length)return; this.removePlaced(k[k.length-1]); this._toast('Rimosso','warning'); },

  /* ── AGGIORNAMENTI ────────────────────────────────────── */
  _updateAll() { this._updateNetworkStatus(); this._updateChecklist(); this._updateMissionProgress(); this._updateBudget(); },

  _getMap() {
    const m={ont:0,router:0,switch16:0,switch24:0,switch48:0,switch8:0,rack:0,pc:0,ap:0,printer:0,phone:0,ups:0,patch:0,nas:0,camera:0,nvr:0,cat6:0,cat6bulk:0,sfp:0,hub:0,powerline:0};
    Object.values(State.placedItems).forEach(({item})=>{ if(m[item.tag]!==undefined) m[item.tag]++; });
    return m;
  },

  _updateNetworkStatus() {
    const m=this._getMap(), sw=m.switch16+m.switch24+m.switch48+m.switch8, cables=m.cat6+m.cat6bulk+m.sfp;
    const upd=(id,vid,val,ok)=>{ const e=document.getElementById(id); if(!e)return; e.className='status-item '+(ok?'ok':'pending'); const v=document.getElementById(vid); if(v)v.textContent=val; };
    upd('si-ont','sv-ont',m.ont>0?'✓':'—',m.ont>0);
    upd('si-router','sv-router',m.router>0?'✓':'—',m.router>0);
    upd('si-switch','sv-switch',sw>0?`${sw}×`:'—',sw>0);
    upd('si-pc','sv-pc',m.pc,m.pc>0); upd('si-ap','sv-ap',m.ap,m.ap>0);
    upd('si-printer','sv-printer',m.printer,m.printer>0); upd('si-phone','sv-phone',m.phone,m.phone>0);
    upd('si-cable','sv-cable',cables,cables>0);
    upd('si-cam','sv-cam',m.camera,m.camera>0); upd('si-nvr','sv-nvr',m.nvr>0?'✓':'—',m.nvr>0);
  },

  _buildNetworkStatusPanel() {
    const ns=document.getElementById('network-status'); if(!ns) return;
    ns.innerHTML=`
      <div class="status-item pending" id="si-ont"><span class="si-icon"></span><span class="si-label">ONT Fibra</span><span class="si-val" id="sv-ont">—</span></div>
      <div class="status-item pending" id="si-router"><span class="si-icon"></span><span class="si-label">Router</span><span class="si-val" id="sv-router">—</span></div>
      <div class="status-item pending" id="si-switch"><span class="si-icon"></span><span class="si-label">Switch</span><span class="si-val" id="sv-switch">—</span></div>
      <div class="status-item pending" id="si-pc"><span class="si-icon"></span><span class="si-label">PC</span><span class="si-val" id="sv-pc">0</span></div>
      <div class="status-item pending" id="si-ap"><span class="si-icon"></span><span class="si-label">Access Point</span><span class="si-val" id="sv-ap">0</span></div>
      <div class="status-item pending" id="si-printer"><span class="si-icon"></span><span class="si-label">Stampanti</span><span class="si-val" id="sv-printer">0</span></div>
      <div class="status-item pending" id="si-phone"><span class="si-icon"></span><span class="si-label">VoIP</span><span class="si-val" id="sv-phone">0</span></div>
      <div class="status-item pending" id="si-cable"><span class="si-icon"></span><span class="si-label">Cavi Cat.6</span><span class="si-val" id="sv-cable">0</span></div>
      <div class="status-item pending" id="si-cam"><span class="si-icon"></span><span class="si-label">Telecamere</span><span class="si-val" id="sv-cam">0</span></div>
      <div class="status-item pending" id="si-nvr"><span class="si-icon"></span><span class="si-label">NVR</span><span class="si-val" id="sv-nvr">—</span></div>
    `;
  },

  _buildChecklist() {
    const cl=document.getElementById('checklist'); if(!cl) return;
    cl.innerHTML='';
    State.currentLevelData.objectives.forEach(obj=>{
      const d=document.createElement('div'); d.className='checklist-item'; d.id='cli-'+obj.id;
      d.innerHTML=`<span class="check-icon"></span><span>${obj.label}</span>`;
      cl.appendChild(d);
    });
  },

  _updateChecklist() {
    const lvl=State.currentLevelData, m=this._getMap(), cost=this._calcCost();
    const vlanArr=Object.values(State.vlanConfig);
    lvl.objectives.forEach(obj=>{
      const el=document.getElementById('cli-'+obj.id); if(!el) return;
      el.className='checklist-item'+(obj.check(m,cost,vlanArr)?'done':'');
    });
  },

  _updateMissionProgress() {
    const lvl=State.currentLevelData, m=this._getMap(), cost=this._calcCost();
    const vlanArr=Object.values(State.vlanConfig);
    const done=lvl.objectives.filter(o=>o.check(m,cost,vlanArr)).length;
    const pct=Math.round(done/lvl.objectives.length*100);
    document.getElementById('mission-progress-fill').style.width=pct+'%';
    document.getElementById('mission-progress-text').textContent=pct+'%';
  },

  _calcCost() { return Object.values(State.placedItems).reduce((s,{item})=>s+item.price,0); },

  _updateBudget() {
    const cost=this._calcCost(), el=document.getElementById('hud-budget');
    el.textContent='€'+cost; el.style.color=cost>State.currentLevelData.budget?'var(--red)':'var(--cyan)';
  },

  /* ── PANNELLO VLAN ────────────────────────────────────── */
  _buildVLANPanel() {
    const lvl=State.currentLevelData;
    const container=document.getElementById('vlan-panel-body'); if(!container) return;

    container.innerHTML=`
      <div class="vlan-intro">
        <strong>Configura le sottoreti VLAN.</strong> Per ogni VLAN inserisci l'indirizzo di rete (es. <code>192.168.10.0</code>) e il prefisso CIDR (es. <code>24</code>). Il calcolatore mostrerà automaticamente: primo host, ultimo host, broadcast, subnet mask e rappresentazione binaria.
      </div>
      ${lvl.vlanDefs.map(v=>this._vlanRow(v)).join('')}
    `;
    // Init vuoto
    lvl.vlanDefs.forEach(v=>{ State.vlanConfig[v.id]={networkAddr:'',prefix:v.prefix.replace('/',''),filled:false}; });
  },

  _vlanRow(v) {
    const colors={10:'rgba(56,189,248',20:'rgba(52,211,153',30:'rgba(167,139,250',40:'rgba(251,191,36',50:'rgba(248,113,113',60:'rgba(255,140,0'};
    const col=colors[v.id]||'rgba(56,189,248';
    return `<div class="vlan-row" id="vlan-row-${v.id}">
      <div class="vlan-row-header">
        <span class="vlan-badge-label" style="background:${col},0.15);border:1px solid ${col},0.5);color:${col},0.9)">VLAN ${v.id}</span>
        <span class="vlan-name">${v.name}</span>
        <span class="vlan-desc-toggle" onclick="App.toggleVlanDesc(${v.id})" title="Info">ℹ️</span>
      </div>
      <div class="vlan-desc" id="vlan-desc-${v.id}" style="display:none">${v.desc}</div>
      <div class="vlan-inputs">
        <div class="vlan-input-group">
          <label>Indirizzo di rete</label>
          <input type="text" class="vlan-input" id="vlan-net-${v.id}" placeholder="${v.suggested.split('/')[0]}"
            oninput="App.calcVlan(${v.id})" autocomplete="off" spellcheck="false"/>
        </div>
        <div class="vlan-input-group">
          <label>Prefisso CIDR</label>
          <div class="prefix-wrap">
            <span class="prefix-slash">/</span>
            <input type="number" class="vlan-input prefix-input" id="vlan-pfx-${v.id}"
              placeholder="${v.prefix.replace('/','')}" min="1" max="30"
              oninput="App.calcVlan(${v.id})" value="${v.prefix.replace('/','')}" autocomplete="off"/>
          </div>
        </div>
      </div>
      <div class="vlan-result" id="vlan-result-${v.id}" style="display:none"></div>
    </div>`;
  },

  toggleVlanDesc(vid) {
    const d=document.getElementById(`vlan-desc-${vid}`);
    if(d) d.style.display=d.style.display==='none'?'block':'none';
  },

  calcVlan(vid) {
    const netEl=document.getElementById(`vlan-net-${vid}`);
    const pfxEl=document.getElementById(`vlan-pfx-${vid}`);
    const resEl=document.getElementById(`vlan-result-${vid}`);
    if(!netEl||!pfxEl||!resEl) return;

    const addr=netEl.value.trim();
    const prefix=parseInt(pfxEl.value)||24;
    const ipRe=/^(\d{1,3}\.){3}\d{1,3}$/;

    if(!ipRe.test(addr)) {
      resEl.style.display='none';
      State.vlanConfig[vid]={networkAddr:'',prefix,filled:false};
      this._updateChecklist(); this._updateMissionProgress();
      return;
    }
    const parts=addr.split('.').map(Number);
    if(parts.some(p=>p<0||p>255)){ resEl.style.display='none'; return; }

    try {
      const r=SubnetCalc.calc(addr,prefix);
      const bm=SubnetCalc.binaryMaskFormatted(r.binaryMask);
      const ones=r.binaryMask.split('1').length-1;
      const zeros=32-ones;

      resEl.style.display='block';
      resEl.innerHTML=`
        <table class="subnet-table">
          <tr><td>🌐 Indirizzo di rete</td><td><code>${r.network}/${r.prefix}</code></td></tr>
          <tr><td>🔑 Primo host</td><td><code>${r.firstHost}</code></td></tr>
          <tr><td>🔚 Ultimo host</td><td><code>${r.lastHost}</code></td></tr>
          <tr><td>📡 Broadcast</td><td><code>${r.broadcast}</code></td></tr>
          <tr><td>🎭 Subnet mask</td><td><code>${r.mask}</code></td></tr>
          <tr><td>🔀 Wildcard mask</td><td><code>${r.wildcard}</code></td></tr>
          <tr class="binary-row"><td>🔢 Maschera binaria</td><td><code class="binary-mask"><span class="b-ones">${bm.replace(/[01]/g,c=>c==='1'?`<span class='b1'>1</span>`:c).split('.').join('</span>.<span class="b-ones">').replace(/<span class='b1'>0<\/span>/g,"<span class='b0'>0</span>")}</span></code></td></tr>
          <tr><td>📊 Bit rete / host</td><td><code><span style="color:var(--cyan)">${ones} bit rete</span> + <span style="color:var(--green)">${zeros} bit host</span></code></td></tr>
          <tr><td>👥 Host disponibili</td><td><code>${r.hosts.toLocaleString('it-IT')}</code></td></tr>
        </table>`;

      // Genera correttamente la riga binaria colorata
      this._renderBinaryMask(resEl, r.binaryMask, r.prefix);

      State.vlanConfig[vid]={networkAddr:r.network,prefix,filled:true};
    } catch(err) {
      resEl.style.display='none';
      State.vlanConfig[vid]={networkAddr:'',prefix,filled:false};
    }
    this._updateChecklist(); this._updateMissionProgress();
  },

  _renderBinaryMask(container, bm, prefix) {
    // Trova la riga binary-mask e la riscrive correttamente
    const rows = container.querySelectorAll('.subnet-table tr');
    rows.forEach(row => {
      if(row.classList.contains('binary-row')) {
        const td = row.querySelectorAll('td')[1];
        let html = '';
        for(let i=0;i<32;i++){
          if(i>0&&i%8===0) html+='.';
          const isNet=i<prefix;
          html+=`<span class="${isNet?'b1':'b0'}">${bm[i]}</span>`;
        }
        td.innerHTML=`<code class="binary-mask">${html}</code>`;
      }
    });
  },

  _buildLegend() {
    const lvl=State.currentLevelData;
    const panel=document.getElementById('legend-panel'); if(!panel) return;
    const vlanColors={10:'rgba(56,189,248,0.8)',20:'rgba(52,211,153,0.8)',30:'rgba(167,139,250,0.8)',40:'rgba(251,191,36,0.8)',50:'rgba(248,113,113,0.8)',60:'rgba(255,140,0,0.8)'};
    panel.innerHTML=`
      <h4>LEGENDA</h4>
      ${[['🔆','ONT (ISP)'],['🌐','Router'],['🔀','Switch'],['🗄️','Rack'],['🖥️','PC/Laptop'],['📶','Access Point'],['🖨️','Stampante'],['📞','VoIP'],['🔋','UPS'],['💾','NAS'],['📷','Telecamera IP'],['🔗','Cat.6/SFP']].map(([i,l])=>`<div class="legend-item"><span class="legend-icon">${i}</span>${l}</div>`).join('')}
      <div style="margin-top:12px">
        <div style="font-size:.65rem;color:var(--text3);font-family:var(--font-mono);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">VLAN</div>
        ${lvl.vlanDefs.map(v=>`<div class="legend-item"><span style="width:22px;height:10px;border-radius:3px;background:${vlanColors[v.id]||'#888'};display:inline-block;opacity:.7"></span><span style="font-size:.72rem;color:var(--text2)">VLAN${v.id} ${v.name}</span></div>`).join('')}
      </div>
      <div class="zone-hint" style="margin-top:10px">
        🔆 ONT → locale tecnico<br>📶 AP → sala aspetto<br>🌐 Router → zona presidiata<br>🎨 Zone colorate = VLAN diverse
      </div>
      <div style="margin-top:14px;font-size:.71rem;color:var(--text2);line-height:1.7">${lvl.networkTopology}</div>`;
  },

  /* ── TIPS ─────────────────────────────────────────────── */
  _setTip(idx) {
    const h=State.currentLevelData.hints;
    const t=h[Math.min(idx,h.length-1)];
    document.getElementById('tip-text').innerHTML=t.text;
    State.hintStep=idx;
  },
  _setTipText(t) { const el=document.getElementById('tip-text'); if(el) el.innerHTML=t; },
  _showContextTip(tag) {
    const lvl=State.currentLevelData, m=this._getMap();
    let next=State.hintStep;
    if(tag==='ont'&&next===0) next=1;
    else if(tag==='router'&&next<=1) next=2;
    else if(['switch16','switch24'].includes(tag)&&next<=2) next=3;
    else if(tag==='pc'&&m.pc>=4&&next<=3) next=4;
    if(next!==State.hintStep&&lvl.hints[next]) this._setTip(next);
  },

  showHint() {
    const lvl=State.currentLevelData, m=this._getMap(), cost=this._calcCost();
    const vlanArr=Object.values(State.vlanConfig);
    State.hintsUsed++;
    const miss=lvl.objectives.find(o=>!o.check(m,cost,vlanArr));
    const text=miss?`<strong>Obiettivo corrente:</strong><br>${miss.label}<br><br>${lvl.hints[Math.min(State.hintStep,lvl.hints.length-1)].text}`:`<strong>Ottimo!</strong><br>Tutti gli obiettivi completati. Verifica e genera il report!`;
    document.getElementById('hint-title').textContent='💡 Suggerimento Guidato';
    document.getElementById('hint-body').innerHTML=text;
    document.getElementById('modal-hint').style.display='flex';
  },
  closeModal(id) { document.getElementById(id).style.display='none'; },

  /* ── VALIDAZIONE ──────────────────────────────────────── */
  validateLayout() {
    const lvl=State.currentLevelData, m=this._getMap(), cost=this._calcCost();
    const vlanArr=Object.values(State.vlanConfig);
    let pts=0; const rows=[];

    const objDone=lvl.objectives.filter(o=>o.check(m,cost,vlanArr));
    const objPts=Math.round(objDone.length/lvl.objectives.length*60);
    pts+=objPts;
    rows.push({label:`Obiettivi completati (${objDone.length}/${lvl.objectives.length})`,val:`+${objPts}`,cls:objPts>=40?'rr-ok':'rr-warn'});

    const vlanFilled=vlanArr.filter(v=>v.filled).length;
    if(vlanFilled>0){ const vp=Math.round(vlanFilled/lvl.vlanDefs.length*20); pts+=vp; rows.push({label:`VLAN configurate (${vlanFilled}/${lvl.vlanDefs.length})`,val:`+${vp}`,cls:'rr-ok'}); }

    let bonusXP=0;
    lvl.bonusRules.forEach(b=>{ if(b.check(m)){ pts+=10; bonusXP+=b.xp; rows.push({label:`🏆 ${b.label}`,val:`+10/+${b.xp}XP`,cls:'rr-ok'}); }});
    lvl.penalties.forEach(p=>{ if(p.check(m,cost,vlanArr)){ pts+=p.pts; rows.push({label:`⚠️ ${p.label}`,val:`${p.pts}`,cls:'rr-err'}); }});
    if(State.hintsUsed>=3){ const pen=5*(State.hintsUsed-2); pts-=pen; rows.push({label:`Troppi suggerimenti (${State.hintsUsed})`,val:`-${pen}`,cls:'rr-warn'}); }

    pts=Math.max(0,Math.min(100,pts));
    const xpEarned=Math.round(lvl.xpReward*(pts/100))+bonusXP;
    State.score=pts; State.totalXP+=xpEarned; State.levelScores[State.currentLevel]=pts;
    document.getElementById('hud-score').textContent=pts;
    document.getElementById('hud-xp').textContent=xpEarned;

    const stars=pts>=85?'⭐⭐⭐':pts>=60?'⭐⭐':'⭐';
    document.getElementById('result-stars').textContent=stars;
    document.getElementById('result-title').textContent=pts>=85?'Eccellente!':pts>=60?'Buon lavoro!':'Puoi migliorare!';
    document.getElementById('result-subtitle').textContent=pts>=85?'Rete e VLAN progettate ottimalmente!':pts>=60?'Buona struttura, piccoli miglioramenti possibili.':'Ricontrolla gli obiettivi e le configurazioni VLAN.';
    document.getElementById('result-xp-gain').innerHTML=`+${xpEarned} XP guadagnati`;
    document.getElementById('result-header').style.background=pts>=85?'linear-gradient(135deg,#064e3b,#065f46)':pts>=60?'linear-gradient(135deg,#1e3a5f,#1e40af)':'linear-gradient(135deg,#3b1d1d,#7f1d1d)';
    document.getElementById('result-details').innerHTML=rows.map(r=>`<div class="result-row"><span class="rr-label">${r.label}</span><span class="rr-val ${r.cls}">${r.val}</span></div>`).join('')+`<div class="result-row"><span class="rr-label"><strong>💰 Costo</strong></span><span class="rr-val ${cost>lvl.budget?'rr-err':'rr-ok'}">€${cost}</span></div><div class="result-row"><span class="rr-label"><strong>🎯 Punteggio</strong></span><span class="rr-val rr-ok" style="font-size:1.1rem">${pts}/100</span></div>`;
    document.getElementById('btn-report').style.display=pts>=50?'':'none';
    document.getElementById('btn-next-level').style.display=(pts>=60&&State.currentLevel<3)?'':'none';
    if(pts>=60) State.completedLevels.add(State.currentLevel);
    document.getElementById('modal-result').style.display='flex';
    this._showXPPopup(xpEarned);
  },

  nextLevel() { this.closeModal('modal-result'); if(State.currentLevel<3) this.startLevel(State.currentLevel+1); },
  _showXPPopup(xp) { const e=document.getElementById('xp-popup'); document.getElementById('xp-amount').textContent=xp; e.style.display='block'; setTimeout(()=>{e.style.display='none';},1500); },

  /* ── REPORT ───────────────────────────────────────────── */
  showReport() {
    this.closeModal('modal-result');
    const lvl=State.currentLevelData, n=State.currentLevel, cost=this._calcCost();
    const score=State.levelScores[n]||0, stars=score>=85?'⭐⭐⭐':score>=60?'⭐⭐':'⭐';
    const now=new Date();
    document.getElementById('report-date').textContent=now.toLocaleDateString('it-IT',{day:'2-digit',month:'long',year:'numeric'});
    document.getElementById('report-student').textContent='Relazione Tecnica — NetBuilder Pro v3';

    const placed=Object.values(State.placedItems);
    const grouped={};
    placed.forEach(({item})=>{ if(!grouped[item.id]) grouped[item.id]={item,count:0}; grouped[item.id].count++; });
    const rows=Object.values(grouped).map(({item,count})=>`<tr><td>${item.icon} ${item.name}</td><td style="font-size:.78rem">${item.detail}</td><td style="text-align:center">${count}</td><td style="text-align:right">${item.price===0?'<em>ISP (€0)</em>':'€'+item.price}</td><td style="text-align:right">€${item.price*count}</td></tr>`).join('');

    // VLAN table
    const vlanRows=lvl.vlanDefs.map(v=>{
      const cfg=State.vlanConfig[v.id];
      if(cfg&&cfg.filled){
        const r=SubnetCalc.calc(cfg.networkAddr,cfg.prefix);
        return `<tr><td><strong>${v.id}</strong></td><td>${v.name}</td><td><code>${r.cidr}</code></td><td><code>${r.mask}</code></td><td><code>${r.firstHost}</code></td><td><code>${r.lastHost}</code></td><td><code>${r.broadcast}</code></td><td>${r.hosts}</td></tr>`;
      }
      return `<tr style="color:#94a3b8"><td>${v.id}</td><td>${v.name}</td><td colspan="6"><em>Non configurata</em></td></tr>`;
    }).join('');

    // VLAN binary mask section
    const vlanBinary=lvl.vlanDefs.map(v=>{
      const cfg=State.vlanConfig[v.id];
      if(!cfg||!cfg.filled) return '';
      const r=SubnetCalc.calc(cfg.networkAddr,cfg.prefix);
      const bm=SubnetCalc.binaryMaskFormatted(r.binaryMask);
      const ones=r.binaryMask.split('1').length-1;
      return `<div class="subnet-box"><strong>VLAN ${v.id} — ${v.name}</strong>
Rete:      ${r.cidr}
Maschera:  ${r.mask} (/${r.prefix})
Binario:   ${bm}
           ${ones} bit di rete + ${32-ones} bit di host
1° host:   ${r.firstHost}
Ultimo:    ${r.lastHost}
Broadcast: ${r.broadcast}
Host max:  ${r.hosts}</div>`;
    }).join('');

    document.getElementById('report-body').innerHTML=`
<h2>1. Descrizione del Progetto</h2>
<p>${lvl.description}</p>
<p><strong>Catena di connettività:</strong> Fibra ottica ISP → <strong>ONT</strong> (locale tecnico/server room) → Router (zona presidiata) → Switch managed → VLAN separate per funzione.</p>
<p><strong>Principio architetturale:</strong> l'ONT e il router sono posizionati in zone NON accessibili ai clienti (segreteria, server room, locale IT). L'AP Wi-Fi è nella sala d'aspetto per i visitatori, su VLAN isolata dalla rete aziendale interna.</p>

<h2>2. Componenti e Costi</h2>
<table class="report-table">
<thead><tr><th>Componente</th><th>Modello</th><th>Qt.</th><th>Prezzo</th><th>Totale</th></tr></thead>
<tbody>${rows}</tbody>
<tfoot><tr class="total-row"><td colspan="4"><strong>TOTALE</strong></td><td style="text-align:right"><strong>€${cost}</strong></td></tr></tfoot>
</table>
<p><em>${cost<=lvl.budget?`✅ Budget rispettato (€${lvl.budget}).`:`⚠️ Budget di €${lvl.budget} superato di €${cost-lvl.budget}.`}</em></p>

<h2>3. Architettura VLAN — Sicurezza e Segmentazione</h2>
<p>La rete è suddivisa in VLAN distinte per garantire la <strong>separazione del traffico</strong> e la <strong>protezione dei dati aziendali</strong>. Ogni VLAN rappresenta un dominio di broadcast separato: un dispositivo in VLAN40 (Guest) non può comunicare direttamente con un dispositivo in VLAN20 (LAN ufficio) senza che il traffico transiti attraverso il router/firewall, dove le ACL bloccano gli accessi non autorizzati.</p>
<table class="report-table">
<thead><tr><th>VLAN</th><th>Nome</th><th>Descrizione e regole di accesso</th></tr></thead>
<tbody>${lvl.vlanDefs.map(v=>`<tr><td><strong>${v.id}</strong></td><td>${v.name}</td><td style="font-size:.8rem">${v.desc}</td></tr>`).join('')}</tbody>
</table>

<h2>4. Schema di Indirizzamento IP — Subnet per VLAN</h2>
<table class="report-table">
<thead><tr><th>VLAN</th><th>Nome</th><th>Rete CIDR</th><th>Subnet Mask</th><th>1° Host</th><th>Ultimo Host</th><th>Broadcast</th><th>Host max</th></tr></thead>
<tbody>${vlanRows}</tbody>
</table>

<h2>5. Calcolo Dettagliato Subnetting</h2>
${vlanBinary||'<p><em>Configura le VLAN nel pannello di gioco per visualizzare i calcoli dettagliati.</em></p>'}

<h2>6. Topologia di Rete</h2>
<p>${lvl.networkTopology}</p>
<p>Tutti i dispositivi cablati usano Cat.6 UTP (max 100m/segmento, EIA/TIA-568-C.2). Il cablaggio strutturato segue ISO/IEC 11801. Gli access point 802.11ax (Wi-Fi 6) usano SSID multipli mappati su VLAN diverse tramite tag 802.1Q su porta trunk.</p>

<h2>7. Note di Sicurezza e Raccomandazioni</h2>
<ul>
<li><strong>ONT nel locale tecnico:</strong> l'ONT non va mai in zone accessibili ai clienti. Il locale tecnico deve essere chiudibile a chiave.</li>
<li><strong>Router e switch in zona presidiata:</strong> nessun accesso fisico non autorizzato ai dispositivi di rete core.</li>
<li><strong>AP in sala aspetto:</strong> gli ospiti usano esclusivamente la VLAN Guest (solo internet). Il firewall blocca qualsiasi traffico da VLAN Guest verso VLAN interne.</li>
${n>=2?'<li><strong>Telecamere su VLAN dedicata:</strong> le telecamere IP non devono essere raggiungibili dai PC dipendenti. Solo il NVR (stesso segmento) riceve il flusso video.</li>':''}
${n>=2?'<li><strong>QoS per VoIP:</strong> DSCP EF (Expedited Forwarding) per traffico RTP/SIP. Latenza < 150ms, jitter < 30ms, packet loss < 1%.</li>':''}
<li><strong>GDPR:</strong> i dati trattati (documenti, email, registrazioni video) richiedono misure tecniche adeguate: segmentazione VLAN, crittografia (WPA3 per Wi-Fi, TLS per servizi), log degli accessi.</li>
<li><strong>Backup configurazioni:</strong> esportare e conservare in sicurezza le configurazioni di router e switch (incluse le ACL VLAN).</li>
</ul>

<h2>8. Risultato e Valutazione</h2>
<div><span class="score-badge-report">${stars} Punteggio: ${score}/100</span></div>
<p>${score>=85?'Rete e VLAN progettate in modo ottimale, rispettando tutti i requisiti di sicurezza e funzionalità.':score>=60?'Buona architettura con qualche margine di miglioramento.':'Necessaria revisione su aspetti fondamentali di sicurezza e segmentazione VLAN.'}</p>

<h2>9. Traccia per la Relazione Completa</h2>
<ul>
<li>Schema fisico (planimetria con posizione dispositivi) e schema logico (topologia con VLAN)</li>
<li>Tabella ACL firewall: quali VLAN possono comunicare tra loro e su quali porte</li>
<li>Configurazione DHCP: pool per ogni VLAN, opzione 43 (SSID per AP), option 82</li>
<li>Configurazione VoIP: server SIP (es. FreePBX), dial plan, codec G.711/G.729, QoS</li>
<li>Piano di disaster recovery e backup: UPS, RAID NAS, export config dispositivi di rete</li>
<li>Analisi TCO 3/5 anni: CAPEX (acquisto), OPEX (manutenzione, abbonamento ISP, energia)</li>
<li>Conformità normativa: GDPR art. 32 (misure tecniche), NIS2 (se PMI critica), ISO 27001</li>
</ul>`;
    this._showScreen('screen-report');
  },
  closeReport() { this._showScreen('screen-game'); },
  printReport()  { window.print(); },

  /* ── TOAST ────────────────────────────────────────────── */
  _toast(msg,type='success') {
    const c=document.getElementById('toast-container');
    const t=document.createElement('div'); t.className=`toast ${type}`;
    t.innerHTML=`<span>${{success:'✅',warning:'⚠️',error:'❌'}[type]||'ℹ️'}</span><span>${msg}</span>`;
    c.appendChild(t); setTimeout(()=>t.remove(),3200);
  },
};

/* ── INIT ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('screen-splash').classList.add('active');
  document.addEventListener('dragend',()=>{
    State.dragItem=null;
    document.querySelectorAll('.drop-zone').forEach(z=>z.classList.remove('drag-over','wrong-item'));
  });
});
