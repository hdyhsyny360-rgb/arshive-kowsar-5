const $ = s => document.querySelector(s);
const loginView=$('#loginView'), appView=$('#appView'), coursesGrid=$('#coursesGrid'), coursePanel=$('#coursePanel');
const lessonsList=$('#lessonsList'), courseTitle=$('#courseTitle'), courseIcon=$('#courseIcon');
let activeCourse=null, filteredLessons=[];

function login(){
  if($('#codeInput').value===SITE_CONFIG.ACCESS_CODE){
    sessionStorage.setItem('kowsar5_auth','1'); loginView.classList.add('hidden'); appView.classList.remove('hidden'); renderCourses();
  } else $('#loginError').textContent='کد واردشده صحیح نیست.';
}
function logout(){sessionStorage.removeItem('kowsar5_auth');location.reload();}
function keyFor(course, lesson){return `kowsar5-progress-${course.id}-${lesson.number}`;}
function getProgress(course, lesson){return JSON.parse(localStorage.getItem(keyFor(course,lesson))||'null');}
function saveProgress(course, lesson, audio){
  if(!audio || !isFinite(audio.currentTime) || audio.currentTime<3)return;
  localStorage.setItem(keyFor(course,lesson), JSON.stringify({time:audio.currentTime,duration:audio.duration||0,updated:Date.now()}));
}
function formatTime(sec){
  sec=Math.max(0,Math.floor(sec||0)); const m=Math.floor(sec/60), s=sec%60;
  return `${m}:${String(s).padStart(2,'0')}`;
}
function courseResume(course){
  for(const lesson of course.lessons){
    const p=getProgress(course,lesson);
    if(p && p.time>5 && (!p.duration || p.time<p.duration-20)) return {lesson,p};
  }
  return null;
}
function renderCourses(filter=''){
  const q=filter.trim().toLowerCase();
  const list=COURSES.filter(c=>c.title.toLowerCase().includes(q)||c.teacher.toLowerCase().includes(q));
  coursesGrid.innerHTML=list.map(c=>{
    const r=courseResume(c);
    return `<article class="course-card" data-id="${c.id}">
      <div class="card-top"><div class="course-icon">${c.icon}</div><span class="arrow">←</span></div>
      <h3>${c.title}</h3><p>${c.teacher}</p>
      <div class="course-meta"><span>🎧 ۱۰۰ جلسه</span><span>≈ ۴۰ دقیقه</span></div>
      ${r?`<div class="resume-mini">ادامه جلسه ${r.lesson.number} · ${formatTime(r.time)}</div>`:''}
    </article>`;
  }).join('') || '<div class="empty">درسی پیدا نشد.</div>';
  document.querySelectorAll('.course-card').forEach(e=>e.onclick=()=>openCourse(e.dataset.id));
}
function openCourse(id){
  activeCourse=COURSES.find(c=>c.id===id); if(!activeCourse)return;
  courseTitle.textContent=activeCourse.title; courseIcon.textContent=activeCourse.icon;
  $('#courseTeacher').textContent=activeCourse.teacher;
  coursesGrid.classList.add('hidden');$('.hero').classList.add('hidden');$('.search-wrap').classList.add('hidden');$('.section-intro').classList.add('hidden');coursePanel.classList.remove('hidden');
  $('#lessonSearch').value=''; $('#lessonNumber').value=''; filteredLessons=activeCourse.lessons; renderLessons(); renderResume();
}
function renderResume(){
  const r=courseResume(activeCourse), box=$('#resumeBox');
  if(!r){box.classList.add('hidden');return;}
  box.classList.remove('hidden');
  box.innerHTML=`<div><span>▶</span><div><strong>ادامه شنیدن</strong><small>جلسه ${r.lesson.number} · از ${formatTime(r.time)}</small></div></div><button id="resumeBtn">ادامه</button>`;
  $('#resumeBtn').onclick=()=>{
    const el=document.querySelector(`.lesson[data-number="${r.lesson.number}"]`);
    if(el){el.scrollIntoView({behavior:'smooth',block:'center'}); const a=el.querySelector('audio'); if(a){a.dataset.resume='1'; if(a.readyState>=1) a.currentTime=r.time; a.play().catch(()=>{});}}
  };
}
function renderLessons(){
  const q=$('#lessonSearch').value.trim(), num=$('#lessonNumber').value;
  filteredLessons=activeCourse.lessons.filter(l=>(!q||l.title.includes(q))&&(!num||String(l.number)===num));
  $('#lessonCount').textContent=`${filteredLessons.length} جلسه`;
  lessonsList.innerHTML=filteredLessons.map(l=>{
    const p=getProgress(activeCourse,l);
    return `<article class="lesson" data-number="${l.number}">
      <button class="play" ${l.audio?'':'disabled'} title="${l.audio?'پخش':'فایل هنوز اضافه نشده'}">${l.audio?'▶':'○'}</button>
      <div class="lesson-main"><div class="lesson-title">جلسه ${l.number}</div>
      <div class="lesson-sub">${l.title} · ${l.duration}</div>
      ${p?`<div class="progress-label">آخرین توقف: ${formatTime(p.time)}</div>`:''}
      <div class="audio-slot">${l.audio?`<audio controls preload="metadata" src="${l.audio}"></audio>`:'فایل صوتی هنوز به این جلسه متصل نشده است'}</div></div>
    </article>`;
  }).join('') || '<div class="empty">جلسه‌ای مطابق جستجو پیدا نشد.</div>';
  lessonsList.querySelectorAll('.lesson').forEach(card=>{
    const lesson=activeCourse.lessons.find(x=>x.number==card.dataset.number), audio=card.querySelector('audio'), btn=card.querySelector('.play');
    if(audio){
      const p=getProgress(activeCourse,lesson);
      audio.addEventListener('loadedmetadata',()=>{if(p&&p.time<audio.duration-5) audio.currentTime=p.time;});
      audio.addEventListener('timeupdate',()=>saveProgress(activeCourse,lesson,audio));
      audio.addEventListener('pause',()=>{saveProgress(activeCourse,lesson,audio);renderResume();});
      audio.addEventListener('ended',()=>{localStorage.removeItem(keyFor(activeCourse,lesson));renderResume();});
      btn.onclick=()=>audio.paused?audio.play():audio.pause();
    }
  });
}
$('#loginBtn').onclick=login;$('#codeInput').onkeydown=e=>{if(e.key==='Enter')login()};
$('#logoutBtn').onclick=logout;$('#searchInput').oninput=e=>renderCourses(e.target.value);
$('#lessonSearch').oninput=renderLessons;$('#lessonNumber').oninput=renderLessons;
$('#backBtn').onclick=()=>{coursePanel.classList.add('hidden');coursesGrid.classList.remove('hidden');$('.hero').classList.remove('hidden');$('.search-wrap').classList.remove('hidden');$('.section-intro').classList.remove('hidden');renderCourses($('#searchInput').value)};
if(sessionStorage.getItem('kowsar5_auth')==='1'){loginView.classList.add('hidden');appView.classList.remove('hidden');renderCourses();}
