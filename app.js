
const loginScreen=document.getElementById("loginScreen");
const accessCode=document.getElementById("accessCode");
const loginBtn=document.getElementById("loginBtn");
const loginError=document.getElementById("loginError");
const logoutBtn=document.getElementById("logoutBtn");

function showLibrary(){loginScreen.classList.add("hidden");}
function hideLibrary(){loginScreen.classList.remove("hidden"); accessCode.value=""; accessCode.focus();}
function tryLogin(){
  if(accessCode.value === ACCESS_CODE){
    sessionStorage.setItem("library_unlocked","1");
    loginError.textContent="";
    showLibrary();
  }else{
    loginError.textContent="کد واردشده صحیح نیست.";
    accessCode.select();
  }
}
loginBtn.addEventListener("click",tryLogin);
accessCode.addEventListener("keydown",e=>{if(e.key==="Enter")tryLogin()});
logoutBtn.addEventListener("click",()=>{sessionStorage.removeItem("library_unlocked");hideLibrary()});
if(sessionStorage.getItem("library_unlocked")==="1") showLibrary(); else hideLibrary();

const grid=document.getElementById("classGrid"), list=document.getElementById("lessonList"), title=document.getElementById("lessonTitle"), search=document.getElementById("search"), back=document.getElementById("backBtn"), audio=document.getElementById("audio"), nowTitle=document.getElementById("nowTitle"), nowClass=document.getElementById("nowClass");
let selected=null;
document.getElementById("classCount").textContent=toFa(CLASSES.length);
document.getElementById("lessonCount").textContent=toFa(CLASSES.reduce((a,c)=>a+c.lessons.length,0));
function toFa(n){return String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d])}
function renderClasses(q=""){
  const s=q.trim().toLowerCase();
  grid.innerHTML=CLASSES.filter(c=>(c.title+" "+c.desc).toLowerCase().includes(s)).map(c=>`
    <article class="class-card" style="--accent:${c.accent}" onclick="openClass('${c.id}')">
      <div class="class-icon">${c.icon}</div><h3>${c.title}</h3><p>${c.desc} • ${toFa(c.lessons.length)} جلسه</p>
    </article>`).join("");
}
function renderLessons(c){
  title.textContent=c.title;
  back.hidden=false;
  list.innerHTML=c.lessons.map((l,i)=>`
    <article class="lesson">
      <button class="play" onclick="playLesson('${c.id}',${i})">▶</button>
      <div><b>${l.title}</b><small>${c.title} • جلسه ${toFa(i+1)}</small></div>
      <span class="duration">پخش آنلاین</span>
    </article>`).join("");
  document.getElementById("lessons").scrollIntoView({behavior:"smooth",block:"start"});
}
function openClass(id){selected=CLASSES.find(c=>c.id===id);renderLessons(selected)}
function playLesson(id,i){
  const c=CLASSES.find(x=>x.id===id), l=c.lessons[i];
  nowTitle.textContent=l.title; nowClass.textContent=c.title;
  audio.src=l.file; audio.play().catch(()=>{});
  document.getElementById("player").scrollIntoView({behavior:"smooth",block:"end"});
}
back.onclick=()=>{selected=null;title.textContent="آخرین تدریس‌ها";back.hidden=true;renderAllLessons();document.getElementById("lessons").scrollIntoView({behavior:"smooth"})};
function renderAllLessons(){
  const all=CLASSES.flatMap(c=>c.lessons.map((l,i)=>({c,l,i}))).slice(0,12);
  list.innerHTML=all.map(x=>`<article class="lesson"><button class="play" onclick="playLesson('${x.c.id}',${x.i})">▶</button><div><b>${x.l.title}</b><small>${x.c.title}</small></div><span class="duration">پخش آنلاین</span></article>`).join("");
}
search.oninput=()=>renderClasses(search.value);
document.getElementById("themeBtn").onclick=()=>document.body.classList.toggle("dark");
renderClasses(); renderAllLessons();
