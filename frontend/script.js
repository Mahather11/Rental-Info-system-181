try{var th=localStorage.getItem("fyr-theme");if(th)document.documentElement.dataset.theme=th}catch(x){}
var ROOMS=24,OCC=19,PREV=[38400,41200,39800,44100,42600];
var MON=["Jun","Jul","Aug","Sep","Oct","Nov"];
var T=[
{id:1,n:"Angel Dimaporo",r:"Bldg A · Room 3",a:2500,d:"Nov 5",s:"pending",ref:"GC-48213377",h:215},
{id:2,n:"Jomar Salik",r:"Bldg A · Room 5",a:2500,d:"Nov 5",s:"paid",h:160},
{id:3,n:"Nurhaina Macapundag",r:"Bldg B · Room 1",a:3200,d:"Nov 10",s:"pending",ref:"MY-90021145",h:330},
{id:4,n:"Rey Lumapas",r:"Bldg B · Room 4",a:3200,d:"Nov 10",s:"overdue",h:25},
{id:5,n:"Princess Ampatuan",r:"Bldg A · Room 8",a:2500,d:"Nov 5",s:"paid",h:280},
{id:6,n:"Kevin Sinsuat",r:"Bldg C · Room 2",a:2800,d:"Nov 15",s:"overdue",h:45},
{id:7,n:"Aisha Guiamel",r:"Bldg C · Room 6",a:2800,d:"Nov 15",s:"paid",h:190},
{id:8,n:"Mark Tamayo",r:"Bldg B · Room 7",a:3200,d:"Nov 10",s:"paid",h:100}
];
var F="all",Q="",cur=null,page="Dashboard";
var L={paid:["chk","Paid"],pending:["clk","Awaiting review"],overdue:["alr","Overdue"],rejected:["rtn","Resubmit needed"]};
var NAV=[["Dashboard","grid"],["Buildings","bld"],["Requests","inb"],["Payments","wal"],["QR code","qr"],["Profile","user"]];
var $=function(i){return document.getElementById(i)};
var peso=function(n){return "₱"+n.toLocaleString("en-PH")};
var ini=function(n){return n.split(" ").map(function(w){return w[0]}).slice(0,2).join("")};
var ic=function(k){return '<svg class="i" aria-hidden="true"><use href="#'+k+'"/></svg>'};
function toast(t){var e=$("toast");e.textContent=t;e.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove("on")},2200)}
function nav(){
 var pend=T.filter(function(t){return t.s==="pending"}).length;
 var cur=function(x){return page===x[0]?' aria-current="page"':''};
 $("navb").innerHTML=NAV.map(function(x){return '<button class="nav" data-p="'+x[0]+'" title="'+x[0]+'"'+cur(x)+'>'+ic(x[1])+'<span class="lbl">'+x[0]+'</span>'+(x[0]==="Payments"||x[0]==="Requests"?badge(x[0],pend):'')+'</button>'}).join("");
 $("botb").innerHTML=NAV.slice(0,4).map(function(x){return '<button data-p="'+x[0]+'"'+cur(x)+'>'+ic(x[1])+x[0]+'</button>'}).join("");
 [].forEach.call(document.querySelectorAll(".tnav .n"),function(e){var k=e.parentNode.dataset.p;if(lastBd[k]!=null&&lastBd[k]!==e.textContent)e.classList.add("bump");lastBd[k]=e.textContent});
 if(lastNP!==null&&lastNP!==page)[].forEach.call(document.querySelectorAll('[aria-current="page"] svg'),function(s){s.classList.add("ipop")});
 lastNP=page;
 var prof=$("me");if(prof)prof.toggleAttribute("aria-current",page=== "Profile");
 var onP=page=== "Profile";$("nav").classList.toggle("off",onP);$("bot").classList.toggle("off",onP);
 if(onP)$("me").setAttribute("aria-current","page");else $("me").removeAttribute("aria-current");
 if(window.LT)syncLights();
}
function render(){
 var paid=T.filter(function(t){return t.s==="paid"}),pend=T.filter(function(t){return t.s==="pending"}),over=T.filter(function(t){return t.s==="overdue"});
 var sum=function(a){return a.reduce(function(x,t){return x+t.a},0)};
 sync();var pct=ROOMS?Math.round(OCC/ROOMS*100):0;
 var pl=function(n,a,b){return n+" "+(new Intl.PluralRules("en").select(n)==="one"?a:b)};
 count($("occ"),pct,function(n){return n+"%"});$("occT").textContent=OCC+" of "+pl(ROOMS,"room","rooms")+" filled";$("qc").textContent="· "+pl(pend.length,"receipt","receipts");
 $("ring").setAttribute("stroke-dasharray",(2*Math.PI*42*pct/100).toFixed(1)+" 264");
 var got=sum(paid)+30000;
 count($("inc"),got,peso);
 $("incT").textContent=peso(sum(pend))+" waiting for review · "+peso(sum(over))+" overdue";
 var vals=PREV.concat([got]),mx=Math.max.apply(null,vals);
 $("bars").innerHTML=vals.map(function(v,i){return '<div tabindex="0" data-v="'+peso(v)+'"><i style="height:'+Math.round(v/mx*100*.72)+'%"></i>'+MON[i]+'</div>'}).join("");
 $("queue").innerHTML=pend.length?pend.map(function(t){return '<li><span class="av" style="--h:'+t.h+'">'+ini(t.n)+'</span><span class="t"><b>'+t.n+'</b><span class="small">'+t.r+' · '+peso(t.a)+'</span></span><button class="link" data-id="'+t.id+'">Review</button></li>'}).join(""):'<li class="small">All caught up. No receipts waiting.</li>';
 var tabs=[["all","All"],["pending","Awaiting review"],["overdue","Overdue"],["rejected","Resubmit needed"],["paid","Paid"]];
 $("tabs").innerHTML=tabs.map(function(k){return '<button aria-pressed="'+(F===k[0])+'" data-k="'+k[0]+'">'+k[1]+'</button>'}).join("");tabInd();
 var q=Q.toLowerCase();
 var list=T.filter(function(t){return(F==="all"||t.s===F)&&(!q||(t.n+" "+t.r).toLowerCase().indexOf(q)>-1)});
 $("rows").innerHTML=list.length?list.map(function(t){
  return '<div class="row'+(t.id===flashId?' flash':'')+'"><div class="who"><span class="av" style="--h:'+t.h+'">'+ini(t.n)+'</span><div><b>'+t.n+'</b><span class="small">'+t.r+'</span></div></div>'+
  '<div class="am amt">'+peso(t.a)+'</div><div class="du small">Due '+t.d+'</div>'+
  '<div class="st"><span class="chip '+t.s+'">'+ic(L[t.s][0])+L[t.s][1]+'</span></div>'+
  '<div class="ac">'+(t.s==="pending"?'<button class="btn sm" data-id="'+t.id+'">Review</button>':'')+'</div></div>'
 }).join(""):'<div class="empty">No tenants match. Try another filter or search.</div>';
 nav();
}
document.addEventListener("click",function(e){
 var b=e.target.closest("button");if(!b)return;
 if(b.dataset.a){act(b.dataset.a,b.dataset,b);return}
 if(b.id==="svp"){var an=$("an").value.trim(),ac=$("ac").value.replace(/\D/g,""),pe=$("perr");
  if(!an)return bad($("an"),pe,"Enter the account name students should see.");
  if(ac.length<10||ac.length>13)return bad($("ac"),pe,"Account number should be 10 to 13 digits.");
  pe.textContent="";b.classList.add("busy");b.innerHTML='<span class="sp"></span>Saving';
  setTimeout(function(){PAY={w:$("wt").value,name:an,num:ac.replace(/^(\d{4})(\d{3})(\d+)$/,"$1 $2 $3")};b.classList.remove("busy");b.classList.add("ok");b.innerHTML=ic("chk")+"Saved";$("an").value=PAY.name;$("ac").value=PAY.num;$("upn").textContent="Details saved. Students see this when they pay."},600);
  setTimeout(function(){b.classList.remove("ok");b.disabled=true},2000);return}
 if(b.id==="me"){if(page!=="Profile"){var pv=page;page="Profile";nav();showView("Profile",pv)}return}
 if(b.id==="svpf"){saveProf(b);return}
 if(b.id==="updp"){savePw(b);return}
 if(b.id==="lo"){dlgOpen('<h3>Log out of Find Your Room?</h3><p class="small">You\u2019ll need to sign in again to manage your dormitory.</p><div class="acts"><button class="btn sec" data-a="cx">Stay signed in</button><button class="btn dng" id="lo2">Log Out</button></div>');return}
 if(b.id==="lo2"){morph(b,"Logging out","Logged out",function(){toast("Logged out. Redirecting to login...")});return}
 if(b.id==="clr"){$("s").value="";Q="";$("s").parentNode.classList.remove("has");render();$("s").focus();return}
 if(b.dataset.rq){var rid=+b.dataset.rid,r=REQ.filter(function(x){return x.id===rid})[0],row=b.closest(".rq"),ap=b.dataset.rq==="approve";if(r.d)return;r.d=1;if(ap)occupy(r);
  row.querySelector(".ra").innerHTML='<span class="chip pop '+(ap?"paid":"rejected")+'">'+ic(ap?"chk":"alr")+(ap?"Approved":"Declined")+'</span>';
  nav();toast(ap?"Request approved. Room marked occupied.":"Request declined. Student notified.");
  setTimeout(function(){row.classList.add("gone");var left=REQ.filter(function(x){return!x.d}).length;$("rqe").hidden=left>0;document.querySelector("#v-Requests .sub").textContent=left?plu(left,"student","students")+" waiting for a reply.":"You’re all caught up."},850);return}
 if(b.id==="up"){if(b.dataset.st)return;b.dataset.st=1;b.classList.add("busy");b.innerHTML='<span class="sp"></span>Uploading';$("qr").classList.add("swap");
  setTimeout(function(){qrSeed++;$("qr").innerHTML=qrSvg(qrSeed);$("qr").classList.remove("swap");b.classList.remove("busy");b.classList.add("ok");b.innerHTML=ic("chk")+"QR updated";$("upn").textContent="Last updated just now."},1400);
  setTimeout(function(){b.classList.remove("ok");b.dataset.st="";b.textContent="Replace QR image"},3300);return}
 if(b.dataset.p){var prev=page;page=b.dataset.p;nav();showView(page,prev);return}
 if(b.dataset.k){F=b.dataset.k;render();return}
 if(b.dataset.id){
  cur=T.filter(function(t){return t.id==b.dataset.id})[0];
  $("db").innerHTML='<div class="who"><span class="av" style="--h:'+cur.h+'">'+ini(cur.n)+'</span><div><h3>'+cur.n+'</h3><span class="small">'+cur.r+' · November rent</span></div></div>'+
  '<div class="rc"><div class="shot">Receipt photo uploaded by the student</div><div class="kv"><span>Amount due</span><b>'+peso(cur.a)+'</b></div><div class="kv"><span>Reference no.</span><b>'+cur.ref+'</b></div></div>'+
  '<label for="why" class="small">Reason (required if you reject)</label><textarea id="why" placeholder="e.g. Amount does not match the rent"></textarea><div class="err" id="err" role="alert"></div>'+
  '<div class="acts"><button class="btn sec" id="rej">Reject</button><button class="btn" id="ver">Verify payment</button></div>';
  $("dlg").showModal();return}
 if(b.id==="ver"){if(b.dataset.st)return;b.dataset.st=1;b.parentNode.classList.add("lock");b.classList.add("busy");b.innerHTML='<span class="sp"></span>Verifying';
  setTimeout(function(){b.classList.remove("busy");b.classList.add("ok");b.innerHTML=ic("chk")+"Verified"},650);
  setTimeout(function(){cur.s="paid";flashId=cur.id;$("dlg").close();render();refresh();toast("Payment verified. Ledger updated.")},1300)}
 if(b.id==="rej"){if(!$("why").value.trim()){$("err").textContent="Add a reason so the student knows what to fix.";$("why").focus();return}
  cur.s="rejected";flashId=cur.id;$("dlg").close();render();refresh();toast("Receipt rejected. Student can resubmit.")}
});
$("s").addEventListener("input",function(e){Q=e.target.value;e.target.parentNode.classList.toggle("has",!!Q);render()});
$("dlg").addEventListener("click",function(e){if(e.target===$("dlg"))$("dlg").close()});
/* moving light: one spring per end, soft tail, stiff head */
function Light(box,el,kind){
 var s={L:0,R:0,lv:0,rv:0,tL:0,tR:0,dir:1,trip:1,raf:0,init:0,w0:0},last=0;
 function ease(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)}
 function tg(b){var o=box.getBoundingClientRect(),r=b.getBoundingClientRect(),l=r.left-o.left,h=r.right-o.left;if(kind==="ring"){var c=(l+h)/2;l=c-27;h=c+27}return[l,h]}
 function draw(){var w=Math.max(8,s.R-s.L),sq=Math.min(.34,Math.max(0,(w-s.w0)/520));el.style.width=w+"px";el.style.transform="translateX("+s.L+"px) scaleY("+(1-sq)+")";el.style.setProperty("--g",Math.min(1,sq*3).toFixed(2))}
 function step(ts){
  var h=Math.min(.032,(ts-last)/1000||.016),n=4,dt=h/n;last=ts;
  for(var i=0;i<n;i++){
   var hr=s.dir>0,hp=hr?s.R:s.L,ht=hr?s.tR:s.tL,home=1-ease(Math.abs(hp-ht)/s.trip),KB=62+155*home,CB=2*Math.sqrt(KB)*.72;
   var kL=hr?KB:235,cL=hr?CB:22,kR=hr?235:KB,cR=hr?22:CB;
   s.lv+=(-kL*(s.L-s.tL)-cL*s.lv)*dt;s.L+=s.lv*dt;
   s.rv+=(-kR*(s.R-s.tR)-cR*s.rv)*dt;s.R+=s.rv*dt}
  draw();
  if(Math.abs(s.L-s.tL)>.2||Math.abs(s.R-s.tR)>.2||Math.abs(s.lv)>.5||Math.abs(s.rv)>.5)s.raf=requestAnimationFrame(step);
  else{s.L=s.tL;s.R=s.tR;s.lv=s.rv=0;draw();s.raf=0}}
 function go(b,inst){
  var t=tg(b);s.w0=t[1]-t[0];
  if(inst||!s.init||matchMedia("(prefers-reduced-motion:reduce)").matches){cancelAnimationFrame(s.raf);s.raf=0;s.L=s.tL=t[0];s.R=s.tR=t[1];s.lv=s.rv=0;s.init=1;draw();return}
  if(Math.abs(t[0]-s.tL)<.5&&Math.abs(t[1]-s.tR)<.5)return;
  s.dir=t[0]>=s.tL?1:-1;s.tL=t[0];s.tR=t[1];
  var hp=s.dir>0?s.R:s.L,ht=s.dir>0?s.tR:s.tL;s.trip=Math.max(1,Math.abs(ht-hp));
  if(!s.raf){last=performance.now();s.raf=requestAnimationFrame(step)}}
 return{go:go}}
var LT={top:Light($("nav"),$("nav").querySelector(".lt"),"pill"),bot:Light($("bot"),$("bot").querySelector(".lt"),"ring")};
function syncLights(inst){["nav","bot"].forEach(function(id,i){var b=$(id).querySelector('[aria-current="page"]');if(b)(i?LT.bot:LT.top).go(b,inst)})}
/* drag the light along the bar */
["nav","bot"].forEach(function(id,i){
 var box=$(id),lt=i?LT.bot:LT.top,sx=0,drag=false,down=false,cur=null;
 box.addEventListener("pointerdown",function(e){if(e.button>0)return;down=true;drag=false;sx=e.clientX;cur=null});
 box.addEventListener("pointermove",function(e){
  if(!down)return;
  if(!drag&&Math.abs(e.clientX-sx)>8){drag=true;try{box.setPointerCapture(e.pointerId)}catch(x){}}
  if(!drag)return;
  var bs=box.querySelectorAll("button"),pick=null;
  bs.forEach(function(b){var r=b.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right)pick=b});
  if(!pick)pick=e.clientX<bs[0].getBoundingClientRect().left?bs[0]:bs[bs.length-1];
  if(pick!==cur){cur=pick;lt.go(pick,false)}});
 box.addEventListener("pointerup",function(){if(down&&drag&&cur){var c=cur;setTimeout(function(){c.click()},0)}down=false;drag=false;cur=null});
 box.addEventListener("pointercancel",function(){down=false;drag=false;cur=null;syncLights(false)});
});
window.addEventListener("resize",function(){syncLights(true)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){syncLights(true)});
/* swipe-down to dismiss: tracks the finger 1:1, carries release speed */
(function(){var g=$("grab"),d=$("dlg"),y0=0,dy=0,ly=0,lt=0,vy=0,on=false;
 g.addEventListener("pointerdown",function(e){on=true;y0=ly=e.clientY;lt=e.timeStamp;dy=0;vy=0;g.setPointerCapture(e.pointerId)});
 g.addEventListener("pointermove",function(e){if(!on)return;
  var dt=Math.max(1,e.timeStamp-lt);vy=.6*vy+.4*((e.clientY-ly)/dt*1000);ly=e.clientY;lt=e.timeStamp;
  var raw=e.clientY-y0;
  if(raw<0){var over=Math.max(0,-raw-12);dy=-64*(over/(over+150))}else dy=raw;
  d.style.transform="translateY("+dy+"px)"});
 function end(){if(!on)return;on=false;var out=dy>110||vy>700;
  spring(dy,out?innerHeight:0,vy,function(x){d.style.transform="translateY("+x+"px)"},function(){if(out)HTMLDialogElement.prototype.close.call(d);d.style.transform=""})}
 g.addEventListener("pointerup",end);g.addEventListener("pointercancel",end)})();
/* views, counters, morphing states */
var flashId=0,tp=null,qrSeed=1,shown="Dashboard";
var B=[
{id:"A",n:"Building A",a:"Rizal St., Midsayap",rooms:[{id:1,no:"1",cap:2,rate:2500,st:"available"},{id:2,no:"2",cap:2,rate:2500,st:"available"},{id:3,no:"3",cap:2,rate:2500,st:"occupied"},{id:4,no:"5",cap:2,rate:2500,st:"occupied"},{id:5,no:"8",cap:3,rate:2500,st:"occupied"}]},
{id:"B",n:"Building B",a:"Quezon Ave., Midsayap",rooms:[{id:6,no:"1",cap:2,rate:3200,st:"occupied"},{id:7,no:"4",cap:2,rate:3200,st:"occupied"},{id:8,no:"5",cap:3,rate:3200,st:"available"},{id:9,no:"7",cap:2,rate:3200,st:"occupied"}]},
{id:"C",n:"Building C",a:"Bula Road, Midsayap",rooms:[{id:10,no:"2",cap:2,rate:2800,st:"occupied"},{id:11,no:"4",cap:2,rate:2800,st:"available"},{id:12,no:"6",cap:2,rate:2800,st:"occupied"}]}];
var REQ=[{id:1,n:"Hadji Pendatun",r:"Bldg A · Room 2",h:20},{id:2,n:"Sittie Abdul",r:"Bldg C · Room 4",h:300},{id:3,n:"Dan Villareal",r:"Bldg B · Room 5",h:140}];
var vid=function(p){return "v-"+p.replace(" ","-")};
var PIDX={Dashboard:0,Buildings:1,Requests:2,Payments:3,"QR code":4,Profile:5};
var PROF={name:"Liza Macapagal",email:"liza@example.com",phone:"0917 123 4821"};
VIEWS.Profile=function(){return hd("Profile","Manage your account details and security.")+'<div class="bento">'+
 '<section class="card c6"><h2>Edit profile</h2><div class="pf"><div class="pid"><span class="av" style="--h:215">'+ini(PROF.name)+'</span><div><b>'+esc(PROF.name)+'</b><span class="small" style="display:block">Manager · Sampaguita Dormitory</span></div></div>'+
 fld("pn","Full name",PROF.name,'autocomplete="name"')+fld("pe","Email address",PROF.email,'type="email" inputmode="email" autocomplete="email"')+fld("pp","Phone number",PROF.phone,'type="tel" inputmode="tel" autocomplete="tel"')+
 '<div class="err" id="perr2" role="alert"></div><button class="btn" id="svpf" disabled>Save Changes</button></div></section>'+
 '<section class="card c6"><h2>Security</h2><div class="pf"><p class="small" style="margin:0">Choose a password with at least 8 characters.</p>'+
 fld("cp","Current password","",'type="password" autocomplete="current-password"')+fld("np","New password","",'type="password" autocomplete="new-password"')+
 '<div class="err" id="serr" role="alert"></div><button class="btn" id="updp">Update Password</button></div></section>'+
 '<section class="card c12 dz"><h2>Account actions</h2><div class="acc"><div><b>Log out</b><p class="small" style="margin:2px 0 0">You will need to sign in again to manage your dormitory.</p></div><button class="btn dng" id="lo">Log Out</button></div></section></div>'};
function plu(n,a,b){return n+" "+(new Intl.PluralRules("en").select(n)==="one"?a:b)}
function badge(n,p){var c=n==="Payments"?p:REQ.filter(function(r){return!r.d}).length;return c?'<span class="n">'+c+'</span>':''}
function hd(t,s){return '<div class="top"><div><h1>'+t+'</h1><p class="sub">'+s+'</p></div></div>'}
function count(el,to,fmt){var from=el._v==null?0:el._v;el._v=to;cancelAnimationFrame(el._r);
 if(matchMedia("(prefers-reduced-motion:reduce)").matches||from===to){el.textContent=fmt(to);return}
 var t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/600),e=1-Math.pow(1-p,4);el.textContent=fmt(Math.round(from+(to-from)*e));if(p<1)el._r=requestAnimationFrame(f)})(t0)}
function tabInd(){var box=$("tabs"),on=box.querySelector('[aria-pressed="true"]');if(!on||!box.offsetWidth)return;
 var i=document.createElement("i");i.className="tind";box.appendChild(i);
 var to={l:on.offsetLeft,t:on.offsetTop,w:on.offsetWidth,h:on.offsetHeight},fr=tp||to;
 var sty=function(o){i.style.cssText="left:0;top:0;width:"+o.w+"px;height:"+o.h+"px;transform:translate("+o.l+"px,"+o.t+"px)"};
 sty(fr);if(tp&&(tp.l!==to.l||tp.t!==to.t||tp.w!==to.w)){void i.offsetWidth;sty(to)}tp=to}
function qrSvg(sd){var s="",y,x;for(y=0;y<21;y++)for(x=0;x<21;x++){var fx=x<7?0:x>13?14:-1,fy=y<7?0:y>13?14:-1,on;
  if(fx>=0&&fy>=0&&!(fx===14&&fy===14)){var a=x-fx,c=y-fy;on=a===0||a===6||c===0||c===6||(a>1&&a<5&&c>1&&c<5)}
  else if(x===7||y===7||x===13&&y<8||y===13&&x<8)on=false;
  else on=(x*7+y*13+x*y*sd)%5<2;
  if(on)s+='<rect x="'+x+'" y="'+y+'" width="1" height="1"/>'}
 return '<svg viewBox="0 0 21 21" role="img" aria-label="Sample payment QR code" shape-rendering="crispEdges">'+s+'</svg>'}
function trow(t){return '<div class="row"><div class="who"><span class="av" style="--h:'+t.h+'">'+ini(t.n)+'</span><div><b>'+t.n+'</b><span class="small">'+t.r+'</span></div></div><div class="am amt">'+peso(t.a)+'</div><div class="du small">Due '+t.d+'</div><div class="st"><span class="chip '+t.s+'">'+ic(L[t.s][0])+L[t.s][1]+'</span></div><div class="ac">'+(t.s==="pending"?'<button class="btn sm" data-id="'+t.id+'">Review</button>':'')+'</div></div>'}
var VIEWS={
 Buildings:function(){return hd("Buildings",plu(ROOMS,"room","rooms")+".")+'<div class="bento">'+B.map(function(b){var p=Math.round(b[2]/b[3]*100);return '<section class="card c4"><h2>'+b[0]+'</h2><div class="big">'+p+'%</div><div class="small">'+b[2]+' of '+plu(b[3],"room","rooms")+' filled</div><div class="meter"><i style="width:'+p+'%"></i></div><p class="small" style="margin:0">'+b[1]+'</p></section>'}).join("")+'</div>'},
 Requests:function(){var o=REQ.filter(function(r){return!r.d}).length;return hd("Requests",o?plu(o,"student","students")+" waiting for a reply.":"You’re all caught up.")+'<section class="card" style="padding:6px 24px">'+REQ.map(function(r){return '<div class="rq'+(r.d?' gone':'')+'"><div class="rqi"><div class="rqr"><div class="who"><span class="av" style="--h:'+r.h+'">'+ini(r.n)+'</span><div><b>'+r.n+'</b><span class="small">'+r.r+'</span></div></div><div class="ra"><button class="btn sec sm" data-rq="decline" data-rid="'+r.id+'">Decline</button><button class="btn sm" data-rq="approve" data-rid="'+r.id+'">Approve</button></div></div></div></div>'}).join("")+'<div class="empty" id="rqe"'+(o?' hidden':'')+'>No pending requests. New ones show up here.</div></section>'},
 Payments:function(){var pe=T.filter(function(t){return t.s==="pending"}).length;return hd("Payments",pe?plu(pe,"receipt","receipts")+" waiting for review.":"Every receipt is reviewed.")+'<section class="card" style="padding:0;overflow:hidden">'+T.map(trow).join("")+'</section>'},
 "QR code":function(){return hd("Payment QR","Students see this when they pay rent.")+'<section class="card qrc"><div class="qrl"><div class="qr" id="qr">'+qrSvg(qrSeed)+'</div><button class="btn sec sm" id="up">Replace QR image</button></div><div class="qside"><div class="fld"><label for="wt">Wallet type</label><select id="wt">'+["GCash","Maya"].map(function(w){return '<option'+(w===PAY.w?' selected':'')+'>'+w+'</option>'}).join("")+'</select></div><div class="fld"><label for="an">Account name</label><input id="an" value="'+esc(PAY.name)+'" autocomplete="off"></div><div class="fld"><label for="ac">Account number</label><input id="ac" inputmode="numeric" value="'+esc(PAY.num)+'" autocomplete="off"></div><div class="err" id="perr" role="alert"></div><button class="btn" id="svp" disabled>Save details</button><p class="small" id="upn" style="margin:0">Sample QR for the prototype. Edit a field to enable saving.</p></div></section>'}
};
/* CRUD, payments tabs, payment details */
var nid=200,PT="rec",bsel=null,SW=0,ARCH=[],PAY={w:"GCash",name:"Liza Macapagal",num:"0917 123 4821"};
var RS={available:["av","chk","Available"],occupied:["oc","hom","Occupied"],maintenance:["mt","alr","Maintenance"]};
L.due=["clk","Due next month"];
var sw=function(){return SW?" sw":""};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function sync(){ROOMS=0;OCC=0;B.forEach(function(b){b.rooms.forEach(function(r){ROOMS++;if(r.st==="occupied")OCC++})})}
function rl(label){var p=label.split(" · "),bb=B.filter(function(b){return b.n.replace("Building","Bldg")===p[0]})[0];if(!bb)return null;var no=p[1].replace("Room ","");return bb.rooms.filter(function(r){return r.no===no})[0]||null}
function occupy(r){var rm=rl(r.r);if(rm)rm.st="occupied";T.push({id:nid++,n:r.n,r:r.r,a:rm?rm.rate:2500,d:"Dec 1",s:"due",h:r.h})}
function bcard(b){var oc=b.rooms.filter(function(r){return r.st==="occupied"}).length,n=b.rooms.length,p=n?Math.round(oc/n*100):0;
 return '<section class="card c4"><div class="bch"><h2>'+esc(b.n)+'</h2><div class="ib"><button class="ibtn" data-a="editb" data-i="'+b.id+'" aria-label="Edit '+esc(b.n)+'" title="Edit">'+ic("pen")+'</button><button class="ibtn dng" data-a="delb" data-i="'+b.id+'" aria-label="Delete '+esc(b.n)+'" title="Delete">'+ic("trs")+'</button></div></div><div class="big">'+p+'%</div><div class="small">'+oc+' of '+plu(n,"room","rooms")+' filled</div><div class="meter"><i style="width:'+p+'%"></i></div><p class="small" style="margin:0 0 14px">'+esc(b.a)+'</p><button class="btn sec sm" data-a="openb" data-i="'+b.id+'">Manage rooms</button></section>'}
function bdetail(b){
 var rows=b.rooms.length?b.rooms.map(function(r){var s=RS[r.st];return '<div class="rrow"><b>Room '+esc(r.no)+'</b><span class="small">Sleeps '+r.cap+'</span><span class="amt">'+peso(r.rate)+'</span><span class="chip '+s[0]+'">'+ic(s[1])+s[2]+'</span><span class="ib"><button class="ibtn" data-a="editr" data-i="'+b.id+'" data-r="'+r.id+'" aria-label="Edit room '+esc(r.no)+'" title="Edit">'+ic("pen")+'</button><button class="ibtn dng" data-a="delr" data-i="'+b.id+'" data-r="'+r.id+'" aria-label="Delete room '+esc(r.no)+'" title="Delete">'+ic("trs")+'</button></span></div>'}).join(""):'<div class="empty">No rooms yet. Add the first room for this building.</div>';
 return '<div class="top"><div><button class="back" data-a="backb">'+ic("bk")+'Buildings</button><h1>'+esc(b.n)+'</h1><p class="sub">'+esc(b.a)+' · '+plu(b.rooms.length,"room","rooms")+'</p></div><button class="btn" data-a="addr" data-i="'+b.id+'">'+ic("plus")+'Add New Room</button></div><section class="card'+sw()+'" style="padding:0;overflow:hidden">'+rows+'</section>'}
VIEWS.Buildings=function(){var b=B.filter(function(x){return x.id===bsel})[0];if(b)return bdetail(b);bsel=null;
 return '<div class="top"><div><h1>Buildings</h1><p class="sub">'+plu(B.reduce(function(n,x){return n+x.rooms.length},0),"room","rooms")+' across '+plu(B.length,"building","buildings")+'.</p></div><button class="btn" data-a="addb">'+ic("plus")+'Add New Building</button></div>'+(B.length?'<div class="bento'+sw()+'">'+B.map(bcard).join("")+'</div>':'<div class="card empty">No buildings yet. Add your first one to start listing rooms.</div>')};
function arow(t){return '<div class="row arow"><div class="who"><span class="av" style="--h:'+t.h+'">'+ini(t.n)+'</span><div><b>'+esc(t.n)+'</b><span class="small">'+esc(t.r)+'</span></div></div><div class="am amt">'+peso(t.a)+'<span class="small"> /mo</span></div><div class="du small">Due '+t.d+'</div><div class="st"><span class="chip act">'+ic("chk")+'Active</span></div><div class="ac"><button class="btn dng sm" data-a="endt" data-i="'+t.id+'">End Tenancy (Move-out)</button></div></div>'}
VIEWS.Payments=function(){var pe=T.filter(function(t){return t.s==="pending"}).length,ten=PT==="ten";
 return hd("Payments",pe?plu(pe,"receipt","receipts")+" waiting for review.":"Every receipt is reviewed.")+'<div class="tabs seg" role="group" aria-label="Payments view"><button data-a="pt" data-i="rec" aria-pressed="'+!ten+'">Receipts</button><button data-a="pt" data-i="ten" aria-pressed="'+ten+'">Active tenants<span class="cn">'+T.length+'</span></button></div><section class="card'+sw()+'" style="padding:0;overflow:hidden">'+(ten?(T.length?T.map(arow).join(""):'<div class="empty">No active tenants right now.</div>')+(ARCH.length?'<p class="small" style="margin:0;padding:14px 24px">'+plu(ARCH.length,"tenant","tenants")+' moved out and archived.</p>':''):T.map(trow).join(""))+'</section>'};
VIEWS["QR code"]=function(){return hd("Payment QR","Students see this when they pay rent.")+'<section class="card qrc"><div class="qrl"><div class="qr" id="qr">'+qrSvg(qrSeed)+'</div><button class="btn sec sm" id="up">Replace QR image</button></div><div class="qside"><div class="fld"><label for="wt">Wallet type</label><select id="wt">'+["GCash","Maya"].map(function(w){return '<option'+(w===PAY.w?' selected':'')+'>'+w+'</option>'}).join("")+'</select></div><div class="fld"><label for="an">Account name</label><input id="an" value="'+esc(PAY.name)+'" autocomplete="off"></div><div class="fld"><label for="ac">Account number</label><input id="ac" inputmode="numeric" value="'+esc(PAY.num)+'" autocomplete="off"></div><div class="err" id="perr" role="alert"></div><button class="btn" id="svp" disabled>Save details</button><p class="small" id="upn" style="margin:0">Sample QR for the prototype. Edit a field to enable saving.</p></div></section>'};
function dirty(){var s=$("svp");if(!s||s.classList.contains("busy")||s.classList.contains("ok"))return;s.disabled=$("wt").value===PAY.w&&$("an").value.trim()===PAY.name&&$("ac").value.replace(/\D/g,"")===PAY.num.replace(/\D/g,"")}
function pbad(f,m,t){if(typeof bad==="function")bad(f,m,t);else{m.textContent=t;f.focus()}}function profDirty(){var s=$("svpf");if(!s||s.classList.contains("busy")||s.classList.contains("ok"))return;s.disabled=$("pn").value.trim()===PROF.name&&$("pe").value.trim()===PROF.email&&$("pp").value.trim()===PROF.phone}
document.addEventListener("click",function(e){
 var b=e.target.closest("button");if(!b)return;
 if(b.id=== "me"){if(page!== "Profile"){var pv=page;page="Profile";nav();showView("Profile",pv)}return}
 if(b.id=== "svpf"){saveProf(b);return}
 if(b.id=== "updp"){savePw(b);return}
 if(b.id=== "lo"){dlgOpen('<h3>Log out of Find Your Room?</h3><p class="small">You\u2019ll need to sign in again to manage your dormitory.</p><div class="acts"><button class="btn sec" data-a="cx">Stay signed in</button><button class="btn dng" id="lo2">Log Out</button></div>');return}
 if(b.id=== "lo2"){morph(b,"Logging out","Logged out",function(){toast("Logged out. Redirecting to login...")});return}
});
document.addEventListener("input",function(e){if(e.target.closest&&e.target.closest("#v-Profile")){profDirty();var f=e.target.closest(".pf"),m=f&&f.querySelector(".err");if(m)m.textContent=""}});
function btnFlow(b,busy,done,fn,label){b.classList.add("busy");b.innerHTML='<span class="sp"></span>'+busy;
 setTimeout(function(){b.classList.remove("busy");b.classList.add("ok");b.innerHTML=ic("chk")+done;fn()},650);
 setTimeout(function(){b.classList.remove("ok");b.textContent=label},2000)}
function saveProf(b){var n=$("pn").value.trim(),em=$("pe").value.trim(),ph=$("pp").value.trim(),er=$("perr2");
 if(!n)return pbad($("pn"),er,"Enter your full name.");
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em))return pbad($("pe"),er,"Enter a valid email address.");
 if(ph.replace(/\D/g,"").length<10)return pbad($("pp"),er,"Phone number should have at least 10 digits.");
 btnFlow(b,"Saving","Saved",function(){PROF={name:n,email:em,phone:ph};document.querySelector("#me .av").textContent=ini(n);document.querySelector("#v-Profile .pid .av").textContent=ini(n);document.querySelector("#v-Profile .pid b").textContent=n;toast("Profile updated successfully.")},"Save Changes");
 setTimeout(function(){b.disabled=true},2000)}
function savePw(b){var cp=$("cp"),np=$("np"),er=$("serr");
 if(!cp.value)return pbad(cp,er,"Enter your current password.");
 if(np.value.length<8)return pbad(np,er,"New password needs at least 8 characters.");
 if(np.value===cp.value)return pbad(np,er,"Choose a password different from the current one.");
 btnFlow(b,"Updating","Updated",function(){cp.value="";np.value="";toast("Password updated.")},"Update Password")}
