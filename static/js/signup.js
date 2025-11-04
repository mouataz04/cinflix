const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

const particles = [];
const particleCount = 50;
const colors = ['#F48C06','#FFA726','#FFB74D'];

for(let i=0;i<particleCount;i++){
  particles.push({
    x:Math.random()*w,
    y:Math.random()*h,
    r:Math.random()*2+1.5,
    vx:(Math.random()-0.5)*0.3,
    vy:(Math.random()-0.5)*0.3,
    color: colors[Math.floor(Math.random()*colors.length)]
  });
}

function distance(p1,p2){
  return Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
}

function animate(){
  ctx.clearRect(0,0,w,h);

  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=w; if(p.x>w)p.x=0;
    if(p.y<0)p.y=h; if(p.y>h)p.y=0;

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=p.color;
    ctx.shadowColor=p.color;
    ctx.shadowBlur=5;
    ctx.fill();
  });

  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      let d = distance(particles[i],particles[j]);
      if(d<120){
        ctx.beginPath();
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle = `rgba(244,140,6,${1-d/120})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', ()=>{
  w=canvas.width=window.innerWidth;
  h=canvas.height=window.innerHeight;
});
