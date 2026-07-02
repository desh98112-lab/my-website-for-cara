// ambient petals
  const field = document.getElementById('petalField');
  const petalCount = window.innerWidth < 640 ? 10 : 18;
  for(let i=0;i<petalCount;i++){
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random()*100 + 'vw';
    p.style.animationDuration = (10 + Math.random()*10) + 's';
    p.style.animationDelay = (Math.random()*10) + 's';
    p.style.background = Math.random() > 0.5 ? 'var(--blush)' : 'var(--rose)';
    p.style.opacity = 0.3 + Math.random()*0.35;
    field.appendChild(p);
  }

  // scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('visible'); }
    });
  }, { threshold: 0.15 });
  reveals.forEach(r => io.observe(r));

  // dodging "not yet" button + growing "yes" button
  const area = document.getElementById('buttonArea');
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const celebration = document.getElementById('celebration');
  let dodges = 0;
  const maxScale = 1.5;

  function dodge(){
    const rect = area.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();

    const maxX = Math.max(rect.width - noRect.width, 0);
    const maxY = Math.max(rect.height - noRect.height, 0);

    // "yes" button's box relative to the area, padded with a safety margin
    // so "not yet" can never land under it or even brush against it
    const margin = 18;
    const yesLeft = (yesRect.left - rect.left) - margin;
    const yesRight = (yesRect.right - rect.left) + margin;
    const yesTop = (yesRect.top - rect.top) - margin;
    const yesBottom = (yesRect.bottom - rect.top) + margin;

    function overlapsYes(x, y){
      return x < yesRight && x + noRect.width > yesLeft &&
             y < yesBottom && y + noRect.height > yesTop;
    }

    let x, y, placed = false;
    for(let i = 0; i < 40; i++){
      x = Math.random() * maxX;
      y = Math.random() * maxY;
      if(!overlapsYes(x, y)){ placed = true; break; }
    }

    // fallback: if random sampling couldn't find a free spot (tiny screens),
    // walk the four corners and pick the first that's clear
    if(!placed){
      const corners = [[0,0],[maxX,0],[0,maxY],[maxX,maxY]];
      for(const [cx, cy] of corners){
        if(!overlapsYes(cx, cy)){ x = cx; y = cy; placed = true; break; }
      }
    }
    // last resort: push it to whichever corner is farthest from "yes" center
    if(!placed){
      const yesCx = (yesLeft + yesRight) / 2;
      const yesCy = (yesTop + yesBottom) / 2;
      x = yesCx < rect.width / 2 ? maxX : 0;
      y = yesCy < rect.height / 2 ? maxY : 0;
    }

    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';

    dodges = Math.min(dodges + 1, 8);
    const scale = 1 + (dodges / 8) * (maxScale - 1);
    yesBtn.style.fontSize = (1.05 * scale) + 'rem';
    yesBtn.style.padding = (16 * scale) + 'px ' + (34 * scale) + 'px';
  }

  noBtn.addEventListener('mouseenter', dodge);
  noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); dodge(); }, { passive:false });
  noBtn.addEventListener('click', (e) => { e.preventDefault(); dodge(); });

  // place "not yet" just below "yes" as a safe, non-overlapping starting spot
function setInitialPosition(){
  const rect = area.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  let x = (yesRect.left - rect.left) + (yesRect.width - noRect.width) / 2;
  x = Math.max(0, Math.min(x, rect.width - noRect.width));

  let y = (yesRect.bottom - rect.top) + 18;
  y = Math.min(y, rect.height - noRect.height);
  y = Math.max(0, y);

  noBtn.style.left = x + 'px';
  noBtn.style.top = y + 'px';
}

setInitialPosition();
window.addEventListener('load', setInitialPosition);
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  if(dodges === 0){
    resizeTimer = setTimeout(setInitialPosition, 150);
  }
});
  function launchConfetti(){
    const emojis = ['🌸','💛','✨','🌷'];
    const count = window.innerWidth < 640 ? 22 : 40;
    for(let i=0;i<count;i++){
      const c = document.createElement('div');
      c.className = 'confetti';
      c.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      c.style.left = Math.random()*100 + 'vw';
      c.style.animationDuration = (2.5 + Math.random()*2.5) + 's';
      c.style.animationDelay = (Math.random()*1.2) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 6000);
    }
  }

  yesBtn.addEventListener('click', () => {
    celebration.classList.add('show');
    launchConfetti();
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      setTimeout(launchConfetti, 700);
    }
  });