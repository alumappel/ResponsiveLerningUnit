(() => {
  'use strict';
  const key = 'video-course-lesson03-progress-v1';
  const stages = [...document.querySelectorAll('.stage')];
  const links = [...document.querySelectorAll('#step-nav a')];
  const defaults = () => ({completed: Array(7).fill(false), checks: Array(6).fill(false), goal: null, content: ['', '', ''], order: [2, 0, 3, 1], decisions: [null, null, null]});
  let state = defaults();
  try {
    const raw = JSON.parse(localStorage.getItem(key));
    if (raw && typeof raw === 'object') {
      for (const name of ['completed', 'checks']) if (Array.isArray(raw[name])) state[name] = state[name].map((_, i) => raw[name][i] === true);
      if ([0,1,2].includes(raw.goal)) state.goal = raw.goal;
      if (Array.isArray(raw.content)) state.content = state.content.map((_, i) => ['essential','outside','other'].includes(raw.content[i]) ? raw.content[i] : '');
      if (Array.isArray(raw.order) && raw.order.length === 4 && new Set(raw.order).size === 4 && raw.order.every(n => [0,1,2,3].includes(n))) state.order = raw.order;
      if (Array.isArray(raw.decisions)) state.decisions = state.decisions.map((_, i) => typeof raw.decisions[i] === 'boolean' ? raw.decisions[i] : null);
    }
  } catch (_) { /* Progress is optional. All learning content remains usable. */ }
  function save() { try { localStorage.setItem(key, JSON.stringify(state)); } catch (_) {} }
  function say(message) { document.querySelector('#app-status').textContent = message; }
  function progress() {
    const count = state.completed.filter(Boolean).length;
    document.querySelector('#progress').value = count;
    document.querySelector('#progress-text').textContent = `${count} מתוך 7`;
    links.forEach((link, i) => link.classList.toggle('done', state.completed[i]));
  }
  let current = 0;
  function go(index, focus = true) {
    if (!Number.isInteger(index) || index < 0 || index >= stages.length) index = 0;
    current = index;
    stages.forEach((stage, i) => stage.classList.toggle('active', i === current));
    links.forEach((link, i) => { if (i === current) link.setAttribute('aria-current','step'); else link.removeAttribute('aria-current'); });
    const hash = '#' + stages[current].id;
    if (location.hash !== hash) { try { history.replaceState(null, '', hash); } catch (_) {} }
    if (focus) {
      const heading = stages[current].querySelector('h1');
      heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true});
      const top = document.querySelector('main').getBoundingClientRect().top + window.scrollY;
      window.scrollTo({top: Math.max(0, top - 18), behavior: 'instant'});
    }
    document.title = stages[current].querySelector('h1').textContent.trim().replace(/\s+/g,' ') + ' | מפגש 3';
  }
  links.forEach((link, i) => link.addEventListener('click', e => { e.preventDefault(); go(i); }));
  document.querySelector('.brand').addEventListener('click', e => { e.preventDefault(); go(0); });
  document.querySelectorAll('.stage-end').forEach((end, i) => {
    if (i === 0) return;
    const previous = document.createElement('button'); previous.type = 'button'; previous.className = 'secondary previous'; previous.textContent = '→ לשלב הקודם';
    previous.addEventListener('click', () => go(i - 1));
    end.insertBefore(previous, end.querySelector('button'));
  });
  document.querySelectorAll('.next').forEach(button => button.addEventListener('click', () => go(current + 1)));
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => go(Number(button.dataset.go))));
  window.addEventListener('hashchange', () => go(Math.max(0, stages.findIndex(s => '#' + s.id === location.hash))));
  document.querySelectorAll('[data-complete]').forEach(input => {
    const i = Number(input.dataset.complete); input.checked = state.completed[i];
    input.addEventListener('change', () => {state.completed[i] = input.checked; save(); progress();});
  });

  const goalQuiz = document.querySelector('[data-quiz="goal"]');
  const goalMessages = [
    'המטרה רחבה מהפער. העובדים כבר מכירים את המושג פישינג. הסרטון צריך לתמוך בבדיקה ובהחלטה לפני פעולה. נסו שוב.',
    'נכון. זו מטרה שאפשר לבדוק על הודעה חדשה: האם הצופה בודק, בוחר פעולה ומנמק? היא תואמת לפער שהוגדר.',
    'התרשמות אינה מספיקה כדי לדעת אם העובדים יבדקו לפני פעולה. נסחו מטרה שמאפשרת לראות מה הם יודעים לעשות. נסו שוב.'
  ];
  function showGoal() {
    if (state.goal === null) return;
    goalQuiz.querySelectorAll('button').forEach(b => b.classList.toggle('selected', Number(b.dataset.answer) === state.goal));
    const out = goalQuiz.querySelector('.feedback'); out.textContent = goalMessages[state.goal]; out.className = 'feedback ' + (state.goal === 1 ? 'positive':'retry');
  }
  goalQuiz.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {state.goal = Number(b.dataset.answer); save(); showGoal();}));
  showGoal();

  const contentItems = [
    {text:'מה לבדוק בשם השולח, בהבטחות ובקישור לפני פעולה', answer:'essential', why:'נחוץ לסרטון הזה: אלה פרטי הבדיקה שמשרתים את המטרה.'},
    {text:'קישור לקריאה נוספת על סוגי פישינג שונים', answer:'outside', why:'אפשר מחוץ לסרטון: ההרחבה עשויה להועיל, אך אינה צריכה לדחות את ההדגמה.'},
    {text:'איך להגדיר כללי סינון דואר במערכת הארגונית', answer:'other', why:'שייך למטרה אחרת: הגדרת המערכת אינה הבדיקה לפני פעולה במסרון שבטלפון האישי.'}
  ];
  const contentHost = document.querySelector('#content-sort');
  contentItems.forEach((item, i) => {
    const row = document.createElement('div'); row.className='sort-item';
    const label = document.createElement('label'); label.htmlFor='content-'+i; label.textContent=item.text;
    const select = document.createElement('select'); select.id=label.htmlFor;
    [['','בחרו היכן מתאים'],['essential','נחוץ לסרטון הזה'],['outside','אפשר מחוץ לסרטון'],['other','שייך למטרה אחרת']].forEach(([value,text]) => {const opt=document.createElement('option');opt.value=value;opt.textContent=text;select.append(opt);});
    select.value=state.content[i]; select.addEventListener('change',()=>{state.content[i]=select.value;save();document.querySelector('#content-feedback').textContent='';});
    row.append(label,select); contentHost.append(row);
  });
  document.querySelector('#check-content').addEventListener('click',()=>{
    const out=document.querySelector('#content-feedback');
    if(state.content.some(x=>!x)){out.textContent='בחרו תשובה לכל אחד משלושת הפריטים ואז לחצו שוב על בדיקת הבחירות.';out.className='feedback retry';return;}
    const count=contentItems.filter((item,i)=>item.answer===state.content[i]).length;
    out.textContent=`${count} מתוך 3 בחירות תואמות לתכנון הדוגמה.\n\n`+contentItems.map((item,i)=>`${i+1}. ${item.why}`).join('\n\n')+'\n\nבפרויקט שלכם ההחלטה תלויה בקהל ובמטרה שהגדרתם.';
    out.className='feedback '+(count===3?'positive':'retry');
  });

  const sequenceItems=['פתיחה: הצעה מפתה לפנסיה, עצירה והסתייגות','בדיקה מודרכת: שם שולח, הבטחות, ביטויי אמון וקישורים','דרכי פעולה: בירור עצמאי והגנה על פרטים','סיום: עוצרים, בודקים ורק אז פועלים'];
  function renderSequence(focusIndex) {
    const list=document.querySelector('#sequence-sort'); list.replaceChildren();
    state.order.forEach((id,i)=>{
      const li=document.createElement('li'); const txt=document.createElement('span');txt.className='sort-text';txt.textContent=sequenceItems[id];
      const controls=document.createElement('div');controls.className='sort-controls';
      [['↑',-1,'העלאת'],['↓',1,'הורדת']].forEach(([symbol,delta,verb])=>{
        const button=document.createElement('button');button.type='button';button.textContent=symbol;button.disabled=i+delta<0||i+delta>=state.order.length;
        button.setAttribute('aria-label',`${verb} החלק: ${sequenceItems[id]}`);
        button.addEventListener('click',()=>{[state.order[i],state.order[i+delta]]=[state.order[i+delta],state.order[i]];save();renderSequence(i+delta);document.querySelector('#sequence-feedback').textContent='';say(`החלק הועבר למקום ${i+delta+1}`);});controls.append(button);
      });li.append(txt,controls);list.append(li);
    });
    if(Number.isInteger(focusIndex))list.children[focusIndex].querySelector('button:not(:disabled)')?.focus();
  }
  renderSequence();
  document.querySelector('#check-sequence').addEventListener('click',()=>{
    const correct=state.order.every((value,i)=>value===i);const out=document.querySelector('#sequence-feedback');
    out.className='feedback '+(correct?'positive':'retry');
    out.textContent=correct?'זהו הרצף בדוגמה: מעלים את הצורך, מדגימים בדיקה, מראים דרכי פעולה ומסיימים בכלל הפעולה. התרגול על מקרה חדש מתקיים לאחר הצפייה.':'בדוגמה מתחילים בהצעה ובהחלטה לעצור, עוברים לבדיקה המודרכת, מציגים דרכי פעולה ומסיימים בכלל קצר. נסו לסדר שוב. רצף אחר אפשרי אם הוא מנומק ביחס למטרה.';
  });

  [['reveal-line','line-model'],['reveal-narration','narration-model']].forEach(([buttonId,modelId])=>{
    const button=document.getElementById(buttonId),model=document.getElementById(modelId);
    button.addEventListener('click',()=>{model.hidden=!model.hidden;button.setAttribute('aria-expanded',String(!model.hidden));});
  });
  const aiCases=[
    {text:'במקום ״סימן מחשיד״, ציינו בדיוק ששם השולח הוא הפרט שיודגש.',answer:true,why:'מקבלים. ההצעה הופכת את התיאור לברור וניתן להפקה, בלי לשנות את מטרת הלמידה.'},
    {text:'הוסיפו: ״אם שם השולח מוכר, אפשר לסמוך על ההודעה״.',answer:false,why:'דוחים. שם מוכר אינו מאמת זהות. ההצעה מוסיפה מסקנה שאינה מוצדקת ועלולה לפגוע במטרת ההדרכה.'},
    {text:'כדי לקצר, הציגו את התשובה יחד עם שאלת היישום.',answer:false,why:'דוחים בדוגמה הזו. הצופה צריך זמן לחשוב ולבחור לפני שמוצג משוב. אפשר לצמצם תוכן אחר בלי למחוק את ההזדמנות להחליט.'}
  ];
  function renderAICases(){
    const host=document.querySelector('#ai-decisions');host.replaceChildren();
    aiCases.forEach((item,i)=>{
      const card=document.createElement('div');card.className='ai-card';const p=document.createElement('p');p.textContent=`${i+1}. ${item.text}`;const choices=document.createElement('div');choices.className='choices';
      [true,false].forEach(value=>{const b=document.createElement('button');b.type='button';b.textContent=value?'מקבלים':'דוחים';b.setAttribute('aria-label',`${b.textContent} את הצעה ${i+1}`);b.classList.toggle('selected',state.decisions[i]===value);b.addEventListener('click',()=>{state.decisions[i]=value;save();renderAICases();const btn=host.children[i].querySelectorAll('button')[value?0:1];btn.focus({preventScroll:true});});choices.append(b);});
      const out=document.createElement('p');out.setAttribute('role','status');out.className='feedback';
      if(state.decisions[i]!==null){const correct=state.decisions[i]===item.answer;out.classList.add(correct?'positive':'retry');out.textContent=(correct?'נכון. ':'בדקו שוב את השיקול. ')+item.why;}
      card.append(p,choices,out);host.append(card);
    });
  }renderAICases();
  document.querySelector('#copy-prompt').addEventListener('click',async()=>{
    const text=document.querySelector('#ai-prompt').textContent;const out=document.querySelector('#copy-status');
    try{await navigator.clipboard.writeText(text);out.textContent='הבקשה הועתקה. הדביקו אותה בכלי ה־AI והוסיפו מהמסמך שלכם קהל, מטרה, תוכן בדוק וסצנה אחת.';}
    catch(_){const range=document.createRange();range.selectNodeContents(document.querySelector('#ai-prompt'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);out.textContent='הטקסט סומן. לחצו Ctrl+C להעתקה (ב־Mac: Command+C), ואז הדביקו בכלי ה־AI. אפשר גם להעתיק באמצעות התפריט בלחיצה ימנית.';}
  });
  const checks=['הרצף כולו מוביל למטרת הלמידה שהגדרנו.','אדם אחר יכול להבין מה להציג ומה לומר בכל סצנה.','הטענות נבדקו מול מקורות והקריינות ברורה בהקראה.','יש זמן לראות את הפרט החשוב, לחשוב ולהחליט כשצריך.','כל הסצנות מפורטות ומשך הסרטון הכולל הוא 120–180 שניות.','אפשר להפיק את המידע החזותי החשוב, או שיש חלופה מתאימה.'];
  checks.forEach((text,i)=>{const label=document.createElement('label');label.className='review-label';const input=document.createElement('input');input.type='checkbox';input.checked=state.checks[i];input.addEventListener('change',()=>{state.checks[i]=input.checked;save();});label.append(input,document.createTextNode(text));document.querySelector('#review-checks').append(label);});
  let running=false,elapsed=0,started=0,interval=null;
  const timer=document.querySelector('#timer-display'),toggle=document.querySelector('#timer-toggle');
  function drawTimer(){const ms=elapsed+(running?performance.now()-started:0);const secs=Math.floor(ms/1000);timer.textContent=String(Math.floor(secs/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0');}
  toggle.addEventListener('click',()=>{if(running){elapsed+=performance.now()-started;running=false;clearInterval(interval);toggle.textContent='המשך מדידה';}else{started=performance.now();running=true;interval=setInterval(drawTimer,200);toggle.textContent='עצירת מדידה';}drawTimer();});
  document.querySelector('#timer-reset').addEventListener('click',()=>{clearInterval(interval);running=false;elapsed=0;toggle.textContent='התחלת מדידה';drawTimer();});
  const assignment=window.LESSON_CONFIG?.assignmentUrl;
  if(typeof assignment==='string'&&assignment.trim()){
    try{const url=new URL(assignment);if(url.protocol==='https:'||url.protocol==='http:'){const a=document.querySelector('#assignment-link');a.href=url.href;a.hidden=false;}}
    catch(_){ /* Use the visible Moodle course instructions when unset or invalid. */ }
  }
  document.documentElement.classList.add('js');
  go(Math.max(0,stages.findIndex(stage=>'#'+stage.id===location.hash)),false);
  progress();
})();
