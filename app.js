const courses = [
  {title:"اصول فقه ۲", teacher:"استاد بهشتی‌نژاد", count:"حدود ۱۰۰ جلسه", code:"اص", n:"۰۱"},
  {title:"فقه ۱", teacher:"استاد رنجبر", count:"حدود ۱۰۰ جلسه", code:"ف", n:"۰۲"},
  {title:"فلسفه اسلامی ۱", teacher:"استاد نجمی‌نژاد", count:"حدود ۱۰۰ جلسه", code:"ف۱", n:"۰۳"},
  {title:"خانواده در اسلام", teacher:"استاد عرب‌زاده", count:"حدود ۱۰۰ جلسه", code:"خ", n:"۰۴"},
  {title:"مفاهیم", teacher:"استاد نامشخص", count:"حدود ۱۰۰ جلسه", code:"م", n:"۰۵"},
  {title:"بلاغت", teacher:"استاد رحیمی", count:"حدود ۱۰۰ جلسه", code:"ب", n:"۰۶"},
  {title:"تجزیه و ترکیب ۲", teacher:"استاد کریمی", count:"حدود ۱۰۰ جلسه", code:"ت", n:"۰۷"}
];

const grid = document.getElementById("courseGrid");
const search = document.getElementById("searchInput");
const toast = document.getElementById("toast");

function render(items=courses){
  grid.innerHTML = items.length ? items.map(c => `
    <article class="course-card">
      <span class="num">${c.n}</span>
      <div class="symbol">${c.code}</div>
      <h3>${c.title}</h3>
      <p>${c.teacher}</p>
      <div class="meta"><span>${c.count}</span><span>جلسه ۴۰ دقیقه‌ای</span></div>
      <span class="arrow">←</span>
    </article>`).join("") :
    `<div style="grid-column:1/-1;text-align:center;padding:35px;color:var(--muted)">درسی با این مشخصات پیدا نشد.</div>`;
}
render();

search?.addEventListener("input", e=>{
  const q=e.target.value.trim().toLowerCase();
  render(courses.filter(c=>(c.title+" "+c.teacher).toLowerCase().includes(q)));
});

function showToast(message){
  toast.textContent=message; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2200);
}
document.getElementById("resumeBtn")?.addEventListener("click",()=>showToast("پخش‌کننده در مرحله بعد به فایل‌های صوتی وصل می‌شود."));
document.getElementById("heroPlay")?.addEventListener("click",()=>showToast("پخش‌کننده در مرحله بعد به فایل‌های صوتی وصل می‌شود."));

const themeBtn=document.getElementById("themeBtn");
themeBtn?.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  const dark=document.body.classList.contains("dark");
  themeBtn.textContent=dark?"☀":"☾";
  localStorage.setItem("kowsar-theme",dark?"dark":"light");
});
if(localStorage.getItem("kowsar-theme")==="dark"){
  document.body.classList.add("dark"); themeBtn.textContent="☀";
}
