// ── Digital twin SVG animation ────────────────────────────────────────────────
function mkTwinSVG(ptId) {
  const d  = patientData[ptId];
  const hC = d.risk==='cr'?'#fb7185':d.risk==='hi'?'#fbbf24':'#5eead4';
  const hr = parseInt(d.vitals.hr.val)||72;
  const bMs = Math.round(60000/hr);
  const s  = 'tw'+ptId;

  return `<svg class="twin-svg" viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
<defs>
  <!-- Directional gradients — light source upper-left -->
  <radialGradient id="${s}gh" cx="38%" cy="32%" r="55%">
    <stop offset="0%"   stop-color="#2a62a8"/><stop offset="50%" stop-color="#0d2040"/>
    <stop offset="100%" stop-color="#030810"/>
  </radialGradient>
  <radialGradient id="${s}gt" cx="36%" cy="20%" r="68%">
    <stop offset="0%"   stop-color="#1e4d8c"/><stop offset="55%" stop-color="#0a1c38"/>
    <stop offset="100%" stop-color="#020810"/>
  </radialGradient>
  <!-- Cylindrical — left limb (lit on inner/right edge) -->
  <linearGradient id="${s}gl" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"  stop-color="#020810"/><stop offset="32%" stop-color="#183972"/>
    <stop offset="62%" stop-color="#0f2444"/><stop offset="100%" stop-color="#020810"/>
  </linearGradient>
  <!-- Cylindrical — right limb (lit on inner/left edge) -->
  <linearGradient id="${s}gr" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"  stop-color="#020810"/><stop offset="38%" stop-color="#183972"/>
    <stop offset="68%" stop-color="#0f2444"/><stop offset="100%" stop-color="#020810"/>
  </linearGradient>
  <filter id="${s}gf"><feGaussianBlur stdDeviation="2.8" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <style>
    .${s}p{animation:${s}pa 5s ease-in-out infinite}
    @keyframes ${s}pa{0%,100%{filter:brightness(.9)}50%{filter:brightness(1.1)}}
    .${s}hb{fill:${hC};animation:${s}hba ${bMs}ms ease-in-out infinite}
    @keyframes ${s}hba{0%,100%{r:4}18%{r:6.5}36%{r:4}}
    .${s}r1{animation:${s}ri ${bMs}ms ease-out infinite}
    .${s}r2{animation:${s}ri ${bMs}ms ease-out ${Math.round(bMs*.38)}ms infinite}
    @keyframes ${s}ri{0%{r:6;opacity:.8;stroke-width:1.2}100%{r:26;opacity:0;stroke-width:.2}}
    .${s}sc{animation:${s}sca 4s linear infinite}
    @keyframes ${s}sca{0%{transform:translateY(-2px);opacity:0}4%{opacity:.48}90%{opacity:.15}100%{transform:translateY(422px);opacity:0}}
    .${s}eq{stroke-dasharray:128 256;stroke-dashoffset:128;animation:${s}eqa ${bMs}ms linear infinite}
    @keyframes ${s}eqa{to{stroke-dashoffset:-256}}
    .${s}nd{animation:${s}nda 3s ease-in-out infinite}
    @keyframes ${s}nda{0%,100%{opacity:.95}50%{opacity:.2}}
  </style>
</defs>

<!-- Ground shadow -->
<ellipse cx="100" cy="414" rx="56" ry="7" fill="rgba(56,189,248,.1)"/>

<!-- ═══ ARMS (behind torso) ═══ -->
<ellipse cx="42"  cy="148" rx="13" ry="40" fill="url(#${s}gl)" transform="rotate(-9,42,148)"  class="${s}p"/>
<ellipse cx="158" cy="148" rx="13" ry="40" fill="url(#${s}gr)" transform="rotate(9,158,148)"  class="${s}p"/>
<ellipse cx="30"  cy="226" rx="11" ry="40" fill="url(#${s}gl)" transform="rotate(6,30,226)"   class="${s}p" opacity=".92"/>
<ellipse cx="170" cy="226" rx="11" ry="40" fill="url(#${s}gr)" transform="rotate(-6,170,226)" class="${s}p" opacity=".92"/>
<ellipse cx="25"  cy="275" rx="9"  ry="16" fill="url(#${s}gl)" class="${s}p" opacity=".88"/>
<ellipse cx="175" cy="275" rx="9"  ry="16" fill="url(#${s}gr)" class="${s}p" opacity=".88"/>

<!-- ═══ TORSO ═══ -->
<path d="M70,96 Q54,110 54,128 Q56,154 64,178 Q60,198 58,216 L142,216 Q140,198 136,178 Q144,154 146,128 Q146,110 130,96 Z" fill="url(#${s}gt)" class="${s}p"/>

<!-- Shoulder spheres (raised over torso) -->
<ellipse cx="53"  cy="107" rx="22" ry="18" fill="url(#${s}gh)" transform="rotate(-14,53,107)"  class="${s}p"/>
<ellipse cx="147" cy="107" rx="22" ry="18" fill="url(#${s}gh)" transform="rotate(14,147,107)"  class="${s}p"/>

<!-- Torso anatomical detail -->
<path d="M70,96 Q85,88 100,86 Q115,88 130,96" fill="none" stroke="#38bdf8" stroke-width="1"  opacity=".28"/>
<line x1="100" y1="96"  x2="100" y2="210" stroke="#38bdf8" stroke-width=".4" opacity=".09"/>
<line x1="76"  y1="138" x2="124" y2="138" stroke="#38bdf8" stroke-width=".4" opacity=".12"/>
<line x1="74"  y1="156" x2="126" y2="156" stroke="#38bdf8" stroke-width=".4" opacity=".11"/>
<line x1="72"  y1="174" x2="128" y2="174" stroke="#38bdf8" stroke-width=".4" opacity=".10"/>
<ellipse cx="88" cy="118" rx="26" ry="18" fill="rgba(56,189,248,.06)" transform="rotate(-10,88,118)"/>

<!-- ═══ NECK ═══ -->
<path d="M88,76 Q83,82 83,96 Q90,97 100,97 Q110,97 117,96 Q117,82 112,76 Q107,83 100,83 Q93,83 88,76 Z" fill="url(#${s}gt)" class="${s}p"/>

<!-- ═══ LEGS ═══ -->
<ellipse cx="80"  cy="294" rx="21" ry="72" fill="url(#${s}gl)" transform="rotate(-4,80,294)"  class="${s}p"/>
<ellipse cx="120" cy="294" rx="21" ry="72" fill="url(#${s}gr)" transform="rotate(4,120,294)"  class="${s}p"/>
<ellipse cx="76"  cy="372" rx="14" ry="54" fill="url(#${s}gl)" transform="rotate(-2,76,372)"  class="${s}p"/>
<ellipse cx="124" cy="372" rx="14" ry="54" fill="url(#${s}gr)" transform="rotate(2,124,372)"  class="${s}p"/>
<ellipse cx="73"  cy="403" rx="19" ry="9"  fill="#0b1d38" transform="rotate(-8,73,403)"/>
<ellipse cx="127" cy="403" rx="19" ry="9"  fill="#0b1d38" transform="rotate(8,127,403)"/>

<!-- ═══ HEAD ═══ -->
<circle cx="100" cy="48" r="32" fill="url(#${s}gh)" class="${s}p"/>
<!-- Chin softening -->
<ellipse cx="100" cy="76" rx="15" ry="5" fill="#040c1e" opacity=".32"/>
<!-- Brow -->
<path d="M80,40 Q90,36 100,37 Q110,36 120,40" fill="none" stroke="#38bdf8" stroke-width=".7" opacity=".28"/>
<!-- Eye sockets -->
<ellipse cx="87"  cy="46" rx="8"   ry="5.5" fill="#050e20" opacity=".75"/>
<ellipse cx="113" cy="46" rx="8"   ry="5.5" fill="#050e20" opacity=".75"/>
<!-- Irises -->
<circle  cx="87"  cy="46" r="4.5" fill="#1a50a0" opacity=".92"/>
<circle  cx="113" cy="46" r="4.5" fill="#1a50a0" opacity=".92"/>
<!-- Pupils -->
<circle  cx="87"  cy="46" r="2.4" fill="#040b1a"/>
<circle  cx="113" cy="46" r="2.4" fill="#040b1a"/>
<!-- Specular glints -->
<circle  cx="89"  cy="44" r="1.5" fill="#92d8f8" opacity=".88"/>
<circle  cx="115" cy="44" r="1.5" fill="#92d8f8" opacity=".88"/>
<!-- Nose bridge -->
<path d="M97,53 L95,63 Q100,67 105,63 L103,53" fill="none" stroke="#38bdf8" stroke-width=".7" opacity=".2"/>
<!-- Mouth -->
<path d="M92,71 Q100,76 108,71" fill="none" stroke="#38bdf8" stroke-width="1" opacity=".28"/>
<!-- Forehead highlight -->
<ellipse cx="86" cy="34" rx="12" ry="9" fill="rgba(110,190,255,.1)" transform="rotate(-15,86,34)"/>
<!-- Rim light (right edge) -->
<path d="M124,27 Q138,47 128,70" fill="none" stroke="#5eead4" stroke-width="1.4" opacity=".2"/>

<!-- ═══ BODY EDGE GLOWS ═══ -->
<circle cx="100" cy="48" r="32" fill="none" stroke="#38bdf8" stroke-width=".8" opacity=".5" filter="url(#${s}gf)"/>
<path d="M70,96 Q54,110 54,128 Q56,154 64,178 Q60,198 58,216 L142,216 Q140,198 136,178 Q144,154 146,128 Q146,110 130,96 Z" fill="none" stroke="#38bdf8" stroke-width=".8" opacity=".42" filter="url(#${s}gf)"/>
<ellipse cx="80"  cy="294" rx="21" ry="72" fill="none" stroke="#38bdf8" stroke-width=".5" opacity=".28" transform="rotate(-4,80,294)"/>
<ellipse cx="120" cy="294" rx="21" ry="72" fill="none" stroke="#38bdf8" stroke-width=".5" opacity=".28" transform="rotate(4,120,294)"/>
<ellipse cx="42"  cy="148" rx="13" ry="40" fill="none" stroke="#38bdf8" stroke-width=".5" opacity=".25" transform="rotate(-9,42,148)"/>
<ellipse cx="158" cy="148" rx="13" ry="40" fill="none" stroke="#38bdf8" stroke-width=".5" opacity=".25" transform="rotate(9,158,148)"/>
<!-- Rim lights body sides -->
<path d="M146,112 Q158,136 144,180" fill="none" stroke="#5eead4" stroke-width="1" opacity=".18"/>
<path d="M54,112  Q42,136  56,180"  fill="none" stroke="#38bdf8" stroke-width="1" opacity=".14"/>

<!-- ═══ HEART PULSE ═══ -->
<circle cx="84" cy="132" r="6"  fill="none" stroke="${hC}" class="${s}r1"/>
<circle cx="84" cy="132" r="6"  fill="none" stroke="${hC}" class="${s}r2"/>
<circle cx="84" cy="132" r="4"  class="${s}hb" filter="url(#${s}gf)"/>
<!-- ECG across chest -->
<polyline points="52,150 68,150 74,138 80,162 84,142 89,152 94,150 148,150"
  fill="none" stroke="${hC}" stroke-width="1.3" class="${s}eq" opacity=".82"/>

<!-- ═══ SCANNING LINE ═══ -->
<rect x="0" y="0" width="200" height="2" fill="rgba(56,189,248,.42)" class="${s}sc"/>

<!-- ═══ VITALS ═══ -->
<text x="154" y="127" font-family="monospace" font-size="8.5" fill="${hC}"     opacity=".92">${d.vitals.hr.val}</text>
<text x="154" y="136" font-family="monospace" font-size="6.5" fill="${hC}"     opacity=".52">bpm</text>
<text x="154" y="147" font-family="monospace" font-size="8.5" fill="#38bdf8"   opacity=".85">${d.vitals.spo2.val}%</text>
<text x="154" y="156" font-family="monospace" font-size="6.5" fill="#38bdf8"   opacity=".42">SpO₂</text>

<!-- ═══ JOINT NODES ═══ -->
<circle cx="53"  cy="107" r="3.5" fill="#38bdf8" class="${s}nd"                          filter="url(#${s}gf)"/>
<circle cx="147" cy="107" r="3.5" fill="#38bdf8" class="${s}nd" style="animation-delay:.5s" filter="url(#${s}gf)"/>
<circle cx="27"  cy="275" r="2.5" fill="#38bdf8" class="${s}nd" style="animation-delay:.9s"/>
<circle cx="173" cy="275" r="2.5" fill="#38bdf8" class="${s}nd" style="animation-delay:1.4s"/>
<circle cx="76"  cy="228" r="2.5" fill="#38bdf8" class="${s}nd" style="animation-delay:.6s"/>
<circle cx="124" cy="228" r="2.5" fill="#38bdf8" class="${s}nd" style="animation-delay:1.1s"/>
<circle cx="75"  cy="368" r="2.5" fill="#38bdf8" class="${s}nd" style="animation-delay:1.8s"/>
<circle cx="125" cy="368" r="2.5" fill="#38bdf8" class="${s}nd" style="animation-delay:2.3s"/>
</svg>`;
}
