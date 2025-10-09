// public/js/app.js

window.APP = (function(){
  const ThemeKey = 'ep-theme';

  // Theme Toggle with Lever
  function initThemeToggle(btnId){
    const btn = document.getElementById(btnId);
    if (!btn) return;

    // Create lever button
    btn.innerHTML = `<div class="theme-lever"><div class="lever-circle"></div></div>`;
    btn.classList.add('theme-btn');
    
    const circle = btn.querySelector('.lever-circle');

    const saved = localStorage.getItem(ThemeKey) || 'light';
    setTheme(saved);
    updateLever();

    btn.addEventListener('click', ()=>{
      const next = document.body.classList.contains('dark') ? 'light' : 'dark';
      setTheme(next);
      updateLever();
    });

    function setTheme(name){
      if(name==='dark') document.body.classList.add('dark');
      else document.body.classList.remove('dark');
      localStorage.setItem(ThemeKey,name);
    }

    function updateLever(){
      const dark = document.body.classList.contains('dark');
      circle.style.left = dark ? '26px' : '2px';
      btn.style.background = dark ? 'linear-gradient(90deg,#4f46e5,#6366f1)' : '#e5e7eb';
    }
  }

  // Active navigation highlighting
  function setActive(pageName){
    document.querySelectorAll('[data-page]').forEach(el=>{
      el.classList.toggle('active', el.getAttribute('data-page')===pageName);
    });
    document.querySelectorAll('.nav-link').forEach(a=>{
      a.classList.toggle('active', a.href.includes(pageName));
    });
  }

  // Target storage
  const TargetKey = 'ep-target';
  function saveTarget(v){ localStorage.setItem(TargetKey,String(v)); }
  function loadTarget(){ const v = localStorage.getItem(TargetKey); return v ? Number(v) : 1500; }

  // Badge logic
  function badgeForRatio(r){
    if(r>=0.9) return { text:'Gold', cls:'badge-style', style:`background: linear-gradient(90deg,#f59e0b,#f97316); color:#08203a;`};
    if(r>=0.6) return { text:'Silver', cls:'badge-style', style:`background: linear-gradient(90deg,#a3a3ff,#7c3aed); color:#fff;`};
    return { text:'Bronze', cls:'badge-style', style:`background: linear-gradient(90deg,#fca5a5,#f97316); color:#2b0b03;`};
  }

  // Chart helpers
  let timeseriesChart = null;
  let categoryChart = null;

  function renderTimeseries(ctx, points){
    if(!ctx) return;
    const labels = points.map(p=>p.label);
    const data = points.map(p=>p.amount);
    if(timeseriesChart) timeseriesChart.destroy();
    timeseriesChart = new Chart(ctx,{
      type:'bar',
      data:{ labels, datasets:[{ data, borderRadius:8, backgroundColor:'rgba(79,70,229,0.9)', maxBarThickness:36 }]},
      options:{ responsive:true, plugins:{ legend:{ display:false }}, scales:{ y:{ beginAtZero:true }}}
    });
  }

  function renderCategories(ctx, cats){
    if(!ctx) return;
    const labels = cats.map(c=>c.name);
    const data = cats.map(c=>c.amount);
    const colors = ['#60a5fa','#f97316','#34d399','#f472b6','#a78bfa'];
    if(categoryChart) categoryChart.destroy();
    categoryChart = new Chart(ctx,{
      type:'doughnut',
      data:{ labels, datasets:[{ data, backgroundColor: colors }]},
      options:{ responsive:true, plugins:{ legend:{ position:'bottom' } } }
    });
  }

  return { initThemeToggle, setActive, saveTarget, loadTarget, badgeForRatio, renderTimeseries, renderCategories };
})();
