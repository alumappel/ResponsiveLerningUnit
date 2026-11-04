(() => {
  'use strict';
  const data = window.ResponsiveLesson;
  if (!data) return; // Keep the static chapter content available if the content file failed to load.
  const chapters = [...document.querySelectorAll('.chapter')];
  const navLinks = [...document.querySelectorAll('#chapter-nav a')];
  const labs = new Map();
  const progressKey = 'responsive-learning-completed-v1';
  let completed = Array(chapters.length).fill(false);
  let current = 0;
  let storageAvailable = true;

  function announce(text) {
    document.getElementById('app-status').textContent = text;
  }
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey));
    if (Array.isArray(saved)) completed = completed.map((_, i) => saved[i] === true);
  } catch (_) {
    storageAvailable = false;
    document.getElementById('storage-note').hidden = false;
  }
  function updateProgress() {
    const count = completed.filter(Boolean).length;
    const progress = document.getElementById('lesson-progress');
    progress.value = count;
    progress.textContent = `${count} מתוך ${chapters.length}`;
    document.getElementById('progress-text').textContent = `${count} מתוך ${chapters.length} פרקים`;
    navLinks.forEach((a, i) => {
      a.classList.toggle('done', completed[i]);
      const number = a.querySelector('.step-no');
      number.textContent = completed[i] ? '✓' : String(i + 1).padStart(2, '0');
      a.setAttribute('aria-label', `${i + 1}. ${a.children[1].textContent.trim()}${completed[i] ? ', סומן כהושלם' : ''}`);
    });
  }
  document.querySelectorAll('[data-complete]').forEach(input => {
    const index = Number(input.dataset.complete);
    input.checked = completed[index];
    input.addEventListener('change', () => {
      completed[index] = input.checked;
      updateProgress();
      try {
        localStorage.setItem(progressKey, JSON.stringify(completed));
      } catch (_) {
        storageAvailable = false;
        document.getElementById('storage-note').hidden = false;
      }
      announce(`סומנו ${completed.filter(Boolean).length} מתוך ${chapters.length} פרקים.${storageAvailable ? '' : ' הסימונים אינם נשמרים ברענון.'}`);
    });
  });

  // Each response stays in memory only. It is never added to localStorage or sent anywhere.
  document.querySelectorAll('[data-quiz]').forEach(host => {
    const id = host.dataset.quiz;
    const quiz = data.quizzes[id];
    if (!quiz) return;
    const section = document.createElement('section');
    section.className = 'quiz';
    section.setAttribute('aria-labelledby', `question-${id}`);
    const count = document.createElement('p');
    count.className = 'quiz-count';
    count.textContent = `בדיקת הבנה ${quiz.number} מתוך 12`;
    const title = document.createElement('h2');
    title.id = `question-${id}`;
    title.textContent = quiz.title;
    const choices = document.createElement('div');
    choices.className = 'quiz-options';
    choices.setAttribute('role', 'group');
    choices.setAttribute('aria-labelledby', title.id);
    const feedback = document.createElement('p');
    feedback.className = 'quiz-feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'btn btn-outline-primary quiz-reset';
    reset.textContent = 'ניסיון חדש';
    reset.hidden = true;
    quiz.answers.forEach((answer, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.setAttribute('aria-pressed', 'false');
      const letter = document.createElement('span');
      letter.className = 'option-letter';
      letter.setAttribute('aria-hidden', 'true');
      letter.textContent = ['א', 'ב', 'ג'][i];
      const text = document.createElement('span');
      text.textContent = answer;
      button.append(letter, text);
      button.addEventListener('click', () => {
        [...choices.children].forEach((option, index) => option.setAttribute('aria-pressed', String(index === i)));
        feedback.textContent = quiz.feedback[i] + (i === quiz.correct ? '' : ' נסו תשובה נוספת.');
        feedback.className = 'quiz-feedback ' + (i === quiz.correct ? 'positive' : 'retry');
        reset.hidden = false;
      });
      choices.append(button);
    });
    reset.addEventListener('click', () => {
      [...choices.children].forEach(option => option.setAttribute('aria-pressed', 'false'));
      feedback.textContent = '';
      reset.hidden = true;
      choices.firstElementChild.focus();
    });
    section.append(count, title, choices, feedback, reset);
    host.append(section);
  });

  const demoBaseCss = `
    * { box-sizing: border-box; }
    [hidden] { display: none !important; }
    html { font-size: 16px; }
    body { margin: 0; padding: 24px; font-family: "Segoe UI", Arial, sans-serif;
      line-height: 1.7; color: #172b41; background: white; }
    h1 { font-size: 1.5rem; line-height: 1.3; margin: 0 0 20px; }
    h2 { font-size: 1.15rem; margin: 8px 0; }
    p { margin: 0 0 16px; }
    a { color: #104da6; text-underline-offset: 4px; }
    button { font: inherit; padding: 10px 16px; border: 1px solid #8ca7c9;
      color: #164a8f; background: white; border-radius: 8px; cursor: pointer; }
    :focus-visible { outline: 3px solid #ab5700; outline-offset: 3px; }
  `;
  function escapeClosingTag(code, tag) {
    return code.replace(new RegExp('</' + tag, 'gi'), '<\\/' + tag);
  }
  function composeDocument(code, title, bridge = '') {
    // The opaque sandbox and CSP isolate code from the unit and disallow network requests.
    const csp = "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'";
    const safeTitle = title.replace(/[<>&"]/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[char]));
    return `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<title>${safeTitle}</title>
<style>/* סגנון בסיס משותף להדגמות */\n${demoBaseCss}\n/* ה־CSS שלכם */\n${escapeClosingTag(code.css, 'style')}</style>
${bridge ? `<script>${bridge}</script>` : ''}</head>
<body>${code.html}
<script>${escapeClosingTag(code.js, 'script')}</script>
</body></html>`;
  }
  function createLab(host) {
    const id = host.dataset.lab;
    const original = data.labs[id];
    if (!original) return;
    const wrapper = document.createElement('section');
    wrapper.className = 'lab';
    wrapper.setAttribute('aria-labelledby', `lab-title-${id}`);
    wrapper.innerHTML = `
      <div class="lab-title"><span aria-hidden="true">&lt;/&gt;</span><h3 id="lab-title-${id}"></h3></div>
      <p class="lab-help" id="lab-help-${id}">ערכו לשונית אחת או יותר ולחצו ״הרצת הקוד״. לשונית HTML מכילה את תוכן ה־body בלבד. תגית viewport וסגנונות הבסיס כבר כלולים בהדגמה. לחיצה על Tab מעבירה את המיקוד לפקד הבא. לחיצה על Ctrl+Enter או ⌘+Enter בתוך העורך מריצה את הקוד.</p>
      <div class="editor-tabs" role="tablist" aria-label="שפות הקוד" dir="ltr"></div>
      <div class="editor-panels"></div>
      <div class="lab-actions">
        <button class="btn btn-primary" type="button" data-action="run">הרצת הקוד <span aria-hidden="true">▶</span></button>
        <button class="btn btn-outline-primary" type="button" data-action="reset">איפוס הדוגמה</button>
        <button class="btn btn-outline-primary" type="button" data-action="download">הורדת הקוד</button>
        <p class="dirty-label" role="status" hidden>יש שינויים שעדיין לא הורצו.</p>
      </div>
      <p class="lab-status" role="status">הדוגמה מוכנה להרצה.</p>
      <p class="lab-error" role="status" hidden></p>
      <div class="viewport-tools">
        <label for="width-number-${id}">רוחב הדף שבהדגמה (פיקסלי CSS)</label>
        <div class="width-controls">
          <input type="range" class="form-range" min="280" max="1200" step="1" value="360" id="width-range-${id}" aria-label="רוחב התצוגה בהדגמה">
          <input type="number" class="form-control width-number" min="280" max="1200" step="1" value="360" id="width-number-${id}" inputmode="numeric" dir="ltr">
        </div>
        <div class="width-presets" role="group" aria-label="בחירה מהירה של רוחב התצוגה"></div>
        <p class="viewport-note" id="viewport-note-${id}">אם התצוגה רחבה מהמקום הזמין, גללו בתוך אזור ההדגמה. זו הדמיית רוחב בלבד; היא אינה מדמה מכשיר או משנה את ה־viewport של היחידה.</p>
      </div>
      <div class="preview-scroll" tabindex="0" role="region" aria-label="תוצאת הקוד, ניתן לגלול לרוחב" aria-describedby="viewport-note-${id}">
        <iframe class="preview-frame" sandbox="allow-scripts" referrerpolicy="no-referrer" style="width:360px"></iframe>
      </div>
      <p class="preview-caption">רוחב: <bdi dir="ltr" class="width-value">360px</bdi> · התוצאה מתעדכנת בהרצה; שינוי רוחב פועל מיד.</p>
      <details class="lab-skeleton"><summary>מבנה המסמך וסגנונות הבסיס של ההדגמה</summary><p>כל הדגמה כוללת מסמך HTML בעברית, תגית viewport וסגנונות בסיס לגופן ולריווח, וכן את ההגדרה box-sizing: border-box. אפשר לשנות את הערכים בלשונית CSS. קוד ההדגמה פועל במסגרת נפרדת; קבצים וקישורים חיצוניים אינם נטענים.</p><pre></pre></details>`;
    wrapper.querySelector('h3').textContent = original.title;
    wrapper.querySelector('.lab-skeleton pre').textContent = demoBaseCss.trim();
    const frame = wrapper.querySelector('iframe');
    frame.title = `תוצאה חיה: ${original.title}`;
    const tabs = wrapper.querySelector('.editor-tabs');
    const panels = wrapper.querySelector('.editor-panels');
    const editors = {};
    const tabButtons = [];
    const panelElements = [];
    const status = wrapper.querySelector('.lab-status');
    const error = wrapper.querySelector('.lab-error');
    const dirty = wrapper.querySelector('.dirty-label');
    const number = wrapper.querySelector('.width-number');
    const range = wrapper.querySelector('.form-range');
    let token = '';
    let hasRun = false;
    let hasError = false;
    let timeoutId;

    function selectTab(index, focus = true) {
      tabButtons.forEach((button, i) => {
        button.setAttribute('aria-selected', String(i === index));
        button.tabIndex = i === index ? 0 : -1;
        panelElements[i].hidden = i !== index;
      });
      if (focus) tabButtons[index].focus();
    }
    ['html', 'css', 'js'].forEach((language, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'editor-tab';
      button.id = `tab-${id}-${language}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', `panel-${id}-${language}`);
      button.textContent = language.toUpperCase();
      const panel = document.createElement('div');
      panel.id = `panel-${id}-${language}`;
      panel.className = 'editor-panel';
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', button.id);
      const editor = document.createElement('textarea');
      editor.className = 'editor';
      editor.value = original[language];
      editor.dir = 'ltr';
      editor.spellcheck = false;
      editor.autocapitalize = 'off';
      editor.setAttribute('autocorrect', 'off');
      editor.setAttribute('wrap', 'off');
      editor.setAttribute('aria-label', `${language.toUpperCase()} — ${original.title}`);
      editor.setAttribute('aria-describedby', `lab-help-${id}`);
      editor.addEventListener('input', () => { dirty.hidden = false; });
      editor.addEventListener('keydown', event => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          run();
        }
      });
      button.addEventListener('click', () => selectTab(i));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (i + 1) % 3;
        if (event.key === 'ArrowLeft') next = (i + 2) % 3;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = 2;
        if (next !== undefined) { event.preventDefault(); selectTab(next); }
      });
      editors[language] = editor;
      panel.append(editor);
      tabButtons.push(button);
      panelElements.push(panel);
      tabs.append(button);
      panels.append(panel);
    });
    selectTab(1, false);

    function getCode() {
      return Object.fromEntries(Object.entries(editors).map(([language, editor]) => [language, editor.value]));
    }
    function run() {
      hasRun = true;
      hasError = false;
      clearTimeout(timeoutId);
      token = `${id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const bridge = `(() => {
        const token = ${JSON.stringify(token)};
        const send = (type, message) => parent.postMessage({ responsiveLab: token, type, message }, '*');
        addEventListener('error', e => send('error', e.message || 'JavaScript error'));
        addEventListener('unhandledrejection', e => send('error', String(e.reason)));
        addEventListener('DOMContentLoaded', () => send('ready', ''));
      })();`;
      error.hidden = true;
      error.textContent = '';
      status.textContent = 'מריצים את הקוד…';
      dirty.hidden = true;
      frame.srcdoc = composeDocument(getCode(), original.title, bridge);
      timeoutId = setTimeout(() => {
        status.textContent = 'לא התקבל אישור מהתצוגה. בדקו אם היא נטענה; אפשר לאפס את הדוגמה ולהריץ שוב.';
      }, 6000);
    }
    wrapper.querySelector('[data-action="run"]').addEventListener('click', run);
    wrapper.querySelector('[data-action="reset"]').addEventListener('click', () => {
      for (const language of Object.keys(editors)) editors[language].value = original[language];
      run();
      status.textContent = 'הדוגמה אופסה והקוד המקורי הורץ מחדש.';
    });
    wrapper.querySelector('[data-action="download"]').addEventListener('click', () => {
      const blob = new Blob([composeDocument(getCode(), original.title)], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `responsive-${id}.html`;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      status.textContent = 'הוכן קובץ HTML שמכיל את הקוד הנוכחי מכל הלשוניות, כולל שינויים שטרם הורצו. חפשו אותו בתיקיית ההורדות.';
    });
    const presets = wrapper.querySelector('.width-presets');
    const presetButtons = [];
    function setWidth(value) {
      const width = Math.max(280, Math.min(1200, Math.round(Number(value) || 360)));
      frame.style.width = `${width}px`;
      range.value = String(width);
      number.value = String(width);
      wrapper.querySelector('.width-value').textContent = `${width}px`;
      range.setAttribute('aria-valuetext', `${width} פיקסלים`);
      presetButtons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.width) === width)));
    }
    [[360, '360 · צר'], [767, '767'], [768, '768'], [1024, '1024 · רחב']].forEach(([width, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.width = String(width);
      button.textContent = label;
      button.setAttribute('aria-label', `תצוגה ברוחב ${width} פיקסלים`);
      button.addEventListener('click', () => setWidth(width));
      presetButtons.push(button);
      presets.append(button);
    });
    range.addEventListener('input', () => setWidth(range.value));
    number.addEventListener('change', () => setWidth(number.value));
    number.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); setWidth(number.value); }
    });
    setWidth(360);
    host.append(wrapper);
    labs.set(id, {
      frame,
      ensureRunning: () => { if (!hasRun) run(); },
      receive(message) {
        if (message.responsiveLab !== token) return;
        clearTimeout(timeoutId);
        if (message.type === 'error') {
          hasError = true;
          const detail = typeof message.message === 'string' ? message.message.slice(0, 600) : 'שגיאה בקוד';
          error.textContent = `שגיאת JavaScript: ${detail}\nבדקו את לשונית JS ואת הסוגריים והאיות. אפשר ללחוץ על ״איפוס הדוגמה״ כדי לחזור לקוד שעובד.`;
          error.hidden = false;
          status.textContent = 'נמצאה שגיאה. אפשר לתקן ולהריץ שוב.';
        } else if (message.type === 'ready' && !hasError) {
          status.textContent = 'הקוד הורץ. בדקו את התוצאה ושנו את רוחב התצוגה. הדפדפן עשוי להתעלם מכללי CSS שגויים בלי להציג הודעת שגיאה.';
        }
      }
    });
  }
  document.querySelectorAll('[data-lab]').forEach(createLab);
  window.addEventListener('message', event => {
    if (!event.data || typeof event.data !== 'object') return;
    for (const lab of labs.values()) {
      if (event.source === lab.frame.contentWindow) { lab.receive(event.data); break; }
    }
  });

  function indexFromHash() {
    const index = chapters.findIndex(chapter => `#${chapter.id}` === location.hash);
    if (index >= 0) return index;
    const anchor = document.getElementById(location.hash.slice(1));
    const owner = anchor?.closest('.chapter');
    return owner ? chapters.indexOf(owner) : current;
  }
  function showChapter(index, focus = true) {
    if (index < 0 || index >= chapters.length) return;
    current = index;
    chapters.forEach((chapter, i) => { chapter.hidden = i !== index; });
    navLinks.forEach((a, i) => {
      if (i === index) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
    chapters[index].querySelectorAll('[data-lab]').forEach(host => labs.get(host.dataset.lab)?.ensureRunning());
    const heading = chapters[index].querySelector('h1');
    const chapterTitle = [...heading.childNodes].map(node => node.nodeName === 'BR' ? ' ' : node.textContent).join('').replace(/\s+/g, ' ').trim();
    document.title = index === 0 ? 'פיתוח אתרים רספונסיביים' : `${chapterTitle} | פיתוח אתרים רספונסיביים`;
    if (focus) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      const mainTop = document.getElementById('lesson-main').getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, mainTop - 18), behavior: 'instant' });
    }
  }
  function navigate(index) {
    if (index < 0 || index >= chapters.length) return;
    const hash = '#' + chapters[index].id;
    if (location.hash !== hash) {
      try { history.pushState(null, '', hash); } catch (_) { location.hash = hash; }
    }
    showChapter(index);
  }
  // Intercept only links to chapter roots. Links within a chapter keep their normal behavior.
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const target = chapters.findIndex(chapter => `#${chapter.id}` === a.getAttribute('href'));
    if (target >= 0) a.addEventListener('click', event => { event.preventDefault(); navigate(target); });
  });
  document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => navigate(current + 1)));
  document.querySelectorAll('[data-prev]').forEach(button => button.addEventListener('click', () => navigate(current - 1)));
  window.addEventListener('popstate', () => {
    const index = indexFromHash();
    if (index !== current) showChapter(index);
  });
  window.addEventListener('hashchange', () => {
    if (location.hash === '#lesson-main') return;
    // Preserve anchors such as #first-demo inside the active chapter.
    const index = chapters.findIndex(chapter => `#${chapter.id}` === location.hash);
    if (index >= 0 && index !== current) showChapter(index);
  });
  updateProgress();
  document.documentElement.classList.add('enhanced');
  showChapter(indexFromHash(), false);
})();
