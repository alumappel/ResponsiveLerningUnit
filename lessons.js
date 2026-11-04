/* Lesson content. Vanilla CSS/JS examples; Bootstrap is used only by the outer interface. */
window.ResponsiveLesson = {
  version: '20261103.2',
  labs: {
    fluid: {
      title: 'רוחב קבוע מול רוחב גמיש',
      html: `<h1>אותו תוכן, שתי קופסאות</h1>
<p>צמצמו את רוחב התצוגה והשוו.</p>
<div class="fixed">רוחב קבוע: 600px</div>
<div class="fluid">רוחב גמיש: 100%, עד 600px</div>`,
      css: `.fixed, .fluid {
  padding: 24px;
  margin-block: 16px;
  border: 2px solid #1455ba;
  border-radius: 12px;
}
.fixed {
  width: 600px;
  background: #fff0d8;
}
.fluid {
  width: 100%;
  max-width: 600px;
  background: #eaf2ff;
}`,
      js: '// בהדגמה הזו אין צורך ב־JavaScript.'
    },
    flex: {
      title: 'מיכל Flex וילדים ישירים',
      html: `<h1>סדנאות בקמפוס</h1>
<nav aria-label="ניווט לדוגמה">
  <ul class="links">
    <li><a href="#intro">על הסדנאות</a></li>
    <li><a href="#topics">נושאים</a></li>
    <li><a href="#contact">יצירת קשר</a></li>
  </ul>
</nav>
<p id="intro">ההוראות נכתבות על המיכל ul.</p>
<p id="topics">הילדים הישירים שלו הם שלושת רכיבי li.</p>
<p id="contact">הקישורים עצמם נשארים נגישים למקלדת.</p>`,
      css: `.links {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  list-style: none;
  padding: 16px;
  background: #102e53;
  border-radius: 12px;
}
.links a {
  display: block;
  padding: 12px;
  color: white;
  background: #254a77;
  border-radius: 6px;
}`,
      js: '// שנו את הגדרות ה־CSS, ואז הריצו.'
    },
    queries: {
      title: 'נקודת שבירה ב־768 פיקסלים',
      html: `<h1>בוחרים סדנה</h1>
<p class="query-state" aria-live="polite"></p>
<div class="cards">
  <article><span>01</span><h2>צילום</h2><p>מגלים נקודת מבט.</p></article>
  <article><span>02</span><h2>עיצוב</h2><p>נותנים צורה לרעיון.</p></article>
  <article><span>03</span><h2>קוד</h2><p>גורמים לדברים לעבוד.</p></article>
</div>`,
      css: `.cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cards article {
  flex: 1;
  min-width: 0;
  padding: 20px;
  border: 1px solid #aec5e2;
  border-radius: 12px;
  background: #eaf2ff;
}
.query-state::before {
  content: "כללי הבסיס: כרטיסים בעמודה";
}
@media (min-width: 768px) {
  .cards { flex-direction: row; }
  .query-state::before {
    content: "השאילתה פעילה: כרטיסים בשורה";
  }
}`,
      js: '// השאילתה מופעלת בידי הדפדפן, ללא JavaScript.'
    },
    navigation: {
      title: 'תפריט מתקפל ונגיש',
      html: `<header>
  <strong>סדנאות בקמפוס</strong>
  <button id="nav-button" type="button"
    aria-controls="main-nav" aria-expanded="false" hidden>
    תפריט ☰
  </button>
  <nav id="main-nav" aria-label="תפריט הסדנאות">
    <a href="#about">על הסדנאות</a>
    <a href="#workshops">הסדנאות</a>
    <a href="#signup">הרשמה</a>
  </nav>
</header>
<main>
  <h1 id="about">מידע על הסדנאות</h1>
  <p id="workshops">במסך צר פותחים את הקישורים בכפתור.</p>
  <p id="signup">במסך רחב הם מוצגים תמיד.</p>
</main>`,
      css: `header { padding: 16px; background: #eaf2ff; }
#nav-button { display: none; margin-block: 16px; }
#main-nav { display: flex; flex-direction: column; gap: 8px; }
#main-nav a { padding: 12px; background: white; border-radius: 6px; }

/* ההסתרה חלה רק אחרי שה־JS הכין את הכפתור */
.nav-ready #nav-button { display: block; }
.nav-ready #main-nav { display: none; }
.nav-ready #main-nav.is-open { display: flex; }

@media (min-width: 768px) {
  #nav-button, .nav-ready #nav-button { display: none; }
  #main-nav, .nav-ready #main-nav {
    display: flex;
    flex-direction: row;
    margin-block-start: 16px;
  }
}`,
      js: `const button = document.querySelector('#nav-button');
const nav = document.querySelector('#main-nav');
const wide = window.matchMedia('(min-width: 768px)');

function setOpen(open) {
  nav.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', String(open));
}
button.addEventListener('click', () => {
  setOpen(button.getAttribute('aria-expanded') !== 'true');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !wide.matches &&
      button.getAttribute('aria-expanded') === 'true') {
    setOpen(false);
    button.focus();
  }
});
wide.addEventListener('change', () => {
  const focusWasInNav = nav.contains(document.activeElement);
  const focusWasOnButton = document.activeElement === button;
  setOpen(false);
  if (!wide.matches && focusWasInNav) button.focus();
  if (wide.matches && focusWasOnButton) nav.querySelector('a').focus();
});
button.hidden = false;
document.documentElement.classList.add('nav-ready');`
    },
    media: {
      title: 'תמונה בתוך גבולות המיכל',
      html: `<h1>דוגמה לתמונה רספונסיבית</h1>
<figure>
  <img width="900" height="400"
    src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="400" viewBox="0 0 900 400"><rect width="900" height="400" fill="#d8e8fc"/><circle cx="730" cy="95" r="48" fill="#f6bc54"/><path d="M0 320 240 85 490 320Z" fill="#759bc4"/><path d="m280 400 330-310 290 310Z" fill="#254a77"/><path d="M0 345h900v55H0z" fill="#102e53"/></svg>')}"
    alt="איור נוף: שני הרים כחולים ושמש צהובה">
  <figcaption>לתמונה יחס ממדים מקורי של 900:400.</figcaption>
</figure>`,
      css: `figure {
  margin: 0;
  padding: 12px;
  border: 2px dashed #1455ba;
  border-radius: 12px;
}
img {
  display: block;
  max-width: 100%;
  height: auto;
}
figcaption { margin-block-start: 12px; }`,
      js: '// התאמת התמונה נעשית ב־CSS בלבד.'
    },
    type: {
      title: 'גודל שורש ויחידות rem',
      html: `<h1>כותרת בגודל 2rem</h1>
<p>פסקה בגודל 1rem. שינוי גודל השורש משפיע על שניהם.</p>
<div class="fixed-label">התווית הזו בגודל 16px.</div>
<div class="relative-box">גם הריווח שלי מוגדר ב־rem.</div>`,
      css: `html { font-size: 16px; }
h1 { font-size: 2rem; }
p { font-size: 1rem; }
.fixed-label {
  font-size: 16px;
  border-inline-start: 3px solid #1455ba;
  padding-inline-start: 12px;
}
.relative-box {
  padding: 1rem;
  margin-block-start: 1rem;
  background: #eaf2ff;
  border-radius: 0.75rem;
}`,
      js: '// אפשר גם להוסיף Media Query ולשנות בה את גודל השורש.'
    }
  },
  quizzes: {
    viewport: {
      explanationId: 'viewport-explanation',
      number: 1, title: 'הוספנו את תגית ה־viewport. מה היא עושה?', correct: 1,
      answers: ['מסדרת אוטומטית את כל הרכיבים בעמודה בנייד', 'מנחה את הדפדפן להשתמש ברוחב המכשיר ובקנה מידה התחלתי של 1', 'קובעת לכל רכיב בדף רוחב של 100%'],
      feedback: ['התגית אינה מסדרת את הרכיבים. את הפריסה מגדירים בכללי CSS.', 'נכון. width=device-width קובע את רוחב אזור התצוגה לפי המכשיר, ו־initial-scale=1 קובע את קנה המידה ההתחלתי. עדיין נדרש CSS מתאים לפריסה.', 'התגית מתייחסת לאזור התצוגה של הדף. את הרוחב של רכיב מסוים מגדירים ב־CSS.']
    },
    fluid: {
      explanationId: 'fluid-explanation',
      number: 2, title: 'מיכל צר מ־600px מכיל קופסה עם width: 600px. מה כדאי לשנות כדי שתתאים למיכל, עד תקרה של 600px?', correct: 2,
      answers: ['להקטין את גודל הגופן בלבד', 'להוסיף לתגית viewport איסור על הגדלה', 'להגדיר width: 100% וגם max-width: 600px'],
      feedback: ['שינוי גודל הגופן אינו משנה את הרוחב הקבוע של הקופסה. היא עדיין עלולה לחרוג מהמיכל.', 'איסור על הגדלה אינו משנה את רוחב הקופסה. יש להתאים את הרוחב ב־CSS ולהשאיר אפשרות להגדיל את הדף.', 'נכון. width: 100% מתאים את הרוחב למיכל, ו־max-width: 600px מגביל את הרוחב המרבי ל־600 פיקסלים.']
    },
    'flex-items': {
      explanationId: 'flex-items-explanation',
      number: 3, title: 'ברשימה שבה ul מכיל רכיבי li, ובכל li יש קישור a, הגדרנו display: flex על ה־ul. מי הם פריטי ה־Flex שלו?', correct: 0,
      answers: ['רכיבי ה־li הישירים', 'כל הקישורים a, גם אם הם בתוך li', 'כל הצאצאים בכל העומקים'],
      feedback: ['נכון. Flex מסדר את הילדים הישירים של המיכל: כאן אלה רכיבי li.', 'הקישורים נמצאים בתוך li. רכיבי li הם הילדים הישירים, ולכן הם הפריטים של ה־ul.', 'ההגדרה אינה הופכת את כל עץ ה־HTML לפריטי Flex. היא חלה על הילדים הישירים.']
    },
    grow: {
      explanationId: 'flex-grow-explanation',
      number: 4, title: 'לשני פריטים מוגדר flex-grow ביחס 4 ל־1. נותרו 100 פיקסלים פנויים לחלוקה. מה תהיה תוספת הרוחב לכל פריט?', correct: 1,
      answers: ['50 פיקסלים לכל אחד', '80 פיקסלים לראשון ו־20 פיקסלים לשני', 'הראשון יהיה ברוחב כולל של 80 פיקסלים, בלי קשר לגודל הבסיס שלו'],
      feedback: ['חלוקה שווה מתאימה לגורמי גדילה שווים. כאן היחס הוא 4 ל־1, ולכן התוספות שונות.', 'נכון. המקום הפנוי מחולק לחמישה חלקים: הראשון מקבל ארבעה חלקים, 80 פיקסלים, והשני חלק אחד, 20 פיקסלים. אלה תוספות לגודל הבסיס.', '80 פיקסלים הם התוספת שהפריט הראשון מקבל מהמקום הפנוי. כדי לקבל את הרוחב הכולל צריך להביא בחשבון גם את גודל הבסיס שלו.']
    },
    boundary: {
      explanationId: 'breakpoint-explanation',
      number: 5, title: 'כלל הבסיס הוא column, והשינוי ל־row נמצא ב־@media (min-width: 768px). מה נראה ב־768px בדיוק?', correct: 0,
      answers: ['שורה, כי התנאי כולל 768px', 'עמודה, כי צריך לפחות 769px', 'הכרטיסים יוסתרו ברוחב זה'],
      feedback: ['נכון. min-width כולל את ערך הגבול. ברוחב 768 ומעלה הכלל שבשאילתה משנה את הכיוון ל־row.', 'min-width כולל את הגבול עצמו: 768 מספיק. ברוחב 767 חל כיוון העמודה וב־768 כיוון השורה.', 'הכלל משנה רק את flex-direction. הוא אינו מסתיר את הכרטיסים. ברוחב 768 הם מוצגים בשורה.']
    },
    'mobile-first': {
      explanationId: 'mobile-first-explanation',
      number: 6, title: 'איזה תכנון מתאים לגישת Mobile first?', correct: 2,
      answers: ['כותבים את כל כללי הבסיס לתצוגה רחבה בלי להגדיר פריסה לתצוגה צרה', 'כותבים את הפריסה לתצוגה צרה רק בתוך min-width: 768px', 'כותבים בסיס לתצוגה צרה ומוסיפים התאמות לרוחב גדול באמצעות min-width'],
      feedback: ['בגישת Mobile first כללי הבסיס מיועדים תחילה לתצוגה צרה. אחריהם מוסיפים את השינויים לתצוגה רחבה.', 'תנאי min-width: 768px חל מ־768 ומעלה. הפריסה הצרה צריכה להופיע בכללי הבסיס, כדי שתחול גם ברוחבים קטנים יותר.', 'נכון. כללי הבסיס מגדירים את הפריסה הצרה, והשאילתה מוסיפה או משנה הגדרות כשהרוחב גדל.']
    },
    'nav-css': {
      explanationId: 'navigation-explanation',
      number: 7, title: 'בתפריט שבהדגמה, מי אחראי לתגובה לרוחב ומי אחראי ללחיצה?', correct: 1,
      answers: ['HTML מבצע את שניהם לבדו', 'CSS ו־Media Query מגיבים לרוחב; JavaScript משנה את מצב הפתיחה בלחיצה', 'JavaScript חייב לחשב בכל רגע את מיקום כל קישור'],
      feedback: ['HTML נותן את המבנה ואת הכפתור. בהדגמה CSS ו־JavaScript משלימים את הפריסה וההתנהגות.', 'נכון. תנאי הרוחב שייך ל־CSS; הלחיצה משנה מחלקה ומעדכנת גם את המצב הנגיש.', 'Flexbox מסדר את הקישורים; Media Query משנה את הפריסה. אין צורך לחשב את המיקום של כל קישור.']
    },
    'nav-accessible': {
      explanationId: 'expanded-explanation',
      number: 8, title: 'לחיצה פתחה את התפריט. מה צריך לעדכן מלבד המחלקה שמציגה אותו?', correct: 0,
      answers: ['את aria-expanded של הכפתור ל־true', 'את aria-controls בכל לחיצה למזהה חדש', 'את גודל הטקסט ל־0 כדי להסתיר את שם הכפתור'],
      feedback: ['נכון. כך גם טכנולוגיה מסייעת מקבלת את מצב הפתיחה הנוכחי. aria-controls ממשיך להפנות לאותו ניווט.', 'aria-controls מחבר את הכפתור למזהה הניווט הקבוע. המצב המשתנה הוא aria-expanded.', 'לכפתור צריך להיות שם ברור. את מצב הפתיחה מתאר aria-expanded, בלי להעלים את הטקסט.']
    },
    'image-max': {
      explanationId: 'image-sizing-explanation',
      number: 9, title: 'מה עושה max-width: 100% לתמונה עם רוחב טבעי של 200px, במיכל של 500px, בלי הגדרת רוחב נוספת?', correct: 2,
      answers: ['מגדיל אותה בהכרח ל־500px', 'חותך אותה לריבוע', 'מגביל את הרוחב המרבי, אך מאפשר לה להישאר ברוחב 200px'],
      feedback: ['זו הגדרת תקרה. width: 100% היה מגדיר רוחב שימלא את המיכל; max-width לבדו אינו מחייב זאת.', 'ההגדרה אינה חותכת את התמונה ואינה קובעת יחס ממדים חדש.', 'נכון. תמונה גדולה תוכל להצטמצם כדי להיכנס למיכל; תמונה קטנה אינה חייבת להימתח.']
    },
    'image-ratio': {
      explanationId: 'image-ratio-explanation',
      number: 10, title: 'תמונה מקורית היא 900×400. הקטנו את רוחבה עם max-width. איך נשמור על הפרופורציות?', correct: 1,
      answers: ['נשאיר תמיד גובה CSS קבוע של 400px', 'נשתמש ב־height: auto', 'נגדיר את גובה התמונה כ־100% מרוחב המיכל'],
      feedback: ['אם הרוחב קטן והגובה נשאר קבוע, היחס בין הרוחב לגובה משתנה והתמונה עלולה להתעוות.', 'נכון. כשהגובה אוטומטי, הוא מותאם לרוחב תוך שמירה על יחס הממדים המקורי. למשל, ברוחב 450 פיקסלים הגובה יהיה 200 פיקסלים.', 'התאמת הגובה לרוחב המיכל אינה שומרת בהכרח על היחס המקורי של התמונה. height: auto מחשב את הגובה לפי רוחב התמונה ויחס הממדים שלה.']
    },
    rem: {
      explanationId: 'rem-explanation',
      number: 11, title: 'גודל הגופן ב־html הוא 20px. כמה הם 2rem בכותרת?', correct: 0,
      answers: ['40px', '32px תמיד', '2% מרוחב המסך'],
      feedback: ['נכון. 2 × 20 = 40 פיקסלי CSS. היחידה תלויה בגודל השורש.', '32px מתקבלים כשהשורש הוא 16px. כאן שינינו אותו ל־20px.', 'rem מתייחס לגודל הגופן בשורש. יחידה שמתייחסת לרוחב ה־viewport היא vw.']
    },
    units: {
      explanationId: 'units-explanation',
      number: 12, title: 'מה נכון לגבי יחידות יחסיות?', correct: 2,
      answers: ['1rem הוא תמיד 1% מרוחב המסך', 'width: 50% תמיד מתייחס לגובה החלון', '1vw הוא 1% מרוחב ה־viewport; ‏1rem תלוי בגודל הגופן בשורש'],
      feedback: ['rem תלוי בגופן השורש; vw תלוי ברוחב ה־viewport.', 'ב־width האחוזים מתייחסים בדרך כלל לרוחב המיכל המכיל, ולא לגובה החלון.', 'נכון. בחירת יחידה היא בחירה במה הגודל יהיה תלוי. גם אחרי הבחירה צריך לבדוק את הפריסה בפועל.']
    }
  }
};
