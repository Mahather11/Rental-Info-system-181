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
var NAV=[["Dashboard","grid"],["Buildings","bld"],["Requests","inb"],["Payments","wal"],["QR code","qr"]];
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
  setTimeout(function(){b.classList.remove("ok");b.textContent="Save details";b.disabled=true},2000);return}
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
var PIDX={Dashboard:0,Buildings:1,Requests:2,Payments:3,"QR code":4};
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
 "QR code":function(){return hd("Payment QR","Students see this when they pay rent.")+'<section class="card qrc"><div class="qr" id="qr">'+qrSvg(qrSeed)+'</div><div class="qside"><div class="kv"><span>Wallet</span><b>GCash</b></div><div class="kv"><span>Account</span><b>Liza M. · 0917 ••• 4821</b></div><button class="btn" id="up">Replace QR image</button><p class="small" id="upn" style="margin:0">Sample QR for the prototype.</p></div></section>'}};
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
document.addEventListener("input",function(e){if(e.target.closest&&e.target.closest("#v-QR-code"))dirty()});
document.addEventListener("change",function(e){if(e.target.closest&&e.target.closest("#v-QR-code"))dirty()});
$("dlg").addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target.tagName==="INPUT"){var s=$("sv");if(s)s.click()}});
function dlgOpen(h){$("db").innerHTML=h;$("dlg").showModal()}
function fld(id,l,v,ex){return '<div class="fld"><label for="'+id+'">'+l+'</label><input id="'+id+'" value="'+esc(v)+'" '+(ex||"")+'></div>'}
function morph(b,a,k,fn){if(b.dataset.st)return;b.dataset.st=1;b.parentNode.classList.add("lock");b.classList.add("busy");b.innerHTML='<span class="sp"></span>'+a;
 setTimeout(function(){b.classList.remove("busy");b.classList.add("ok");b.innerHTML=ic("chk")+k},550);setTimeout(function(){$("dlg").close();fn()},1050)}
function bform(b){dlgOpen('<h3>'+(b?"Edit building":"Add new building")+'</h3>'+fld("fn","Building name",b?b.n:"",'placeholder="e.g. Building D" autocomplete="off"')+fld("fa","Address",b?b.a:"",'placeholder="Street, barangay" autocomplete="off"')+'<div class="err" id="ferr" role="alert"></div><div class="acts"><button class="btn sec" data-a="cx">Cancel</button><button class="btn" id="sv" data-a="svb" data-i="'+(b?b.id:"")+'">'+(b?"Save changes":"Add building")+'</button></div>');setTimeout(function(){$("fn").focus()},60)}
function rform(b,r){var oc=r&&r.st==="occupied";dlgOpen('<h3>'+(r?"Edit room":"Add new room")+'</h3><p class="small" style="margin:-8px 0 0">'+esc(b.n)+'</p>'+fld("fn","Room number",r?r.no:"",'placeholder="e.g. 6" autocomplete="off"')+'<div class="two">'+fld("rc","Capacity",r?r.cap:2,'type="number" min="1" inputmode="numeric"')+fld("rr","Monthly rate (₱)",r?r.rate:"",'type="number" min="1" inputmode="numeric" placeholder="2500"')+'</div><div class="fld"><label for="rs">Status</label><select id="rs"'+(oc?' disabled':'')+'>'+["available","occupied","maintenance"].map(function(s){return '<option value="'+s+'"'+((r?r.st:"available")===s?' selected':'')+(s==="occupied"&&!oc?' disabled':'')+'>'+RS[s][2]+'</option>'}).join("")+'</select></div><div class="err" id="ferr" role="alert"></div><div class="acts"><button class="btn sec" data-a="cx">Cancel</button><button class="btn" id="sv" data-a="svr" data-i="'+b.id+'" data-r="'+(r?r.id:"")+'">'+(r?"Save changes":"Add room")+'</button></div>');setTimeout(function(){$("fn").focus()},60)}
function confirmDel(k,b,r){var oc=k==="b"?b.rooms.filter(function(x){return x.st==="occupied"}).length:(r.st==="occupied"?1:0),nm=k==="b"?b.n:"Room "+r.no;
 if(oc){dlgOpen('<h3>Can’t delete '+esc(nm)+'</h3><p class="small">'+(k==="b"?plu(oc,"room is","rooms are"):"This room is")+' occupied. End the tenancy first, then delete.</p><div class="acts"><button class="btn" data-a="cx">Got it</button></div>');return}
 dlgOpen("<h3>Delete "+esc(nm)+"?</h3><p class=\"small\">This can’t be undone.</p><div class=\"acts\"><button class=\"btn sec\" data-a=\"cx\">Cancel</button><button class=\"btn dng\" data-a=\"cfd\" data-k=\""+k+"\" data-i=\""+b.id+"\"></button></div>")}
function endDlg(id){var t=T.filter(function(x){return x.id===id})[0];dlgOpen('<h3>End tenancy for '+esc(t.n)+'?</h3><p class="small">'+esc(t.r)+' becomes available right away. Payment history stays in the archive.</p><div class="acts"><button class="btn sec" data-a="cx">Keep tenant</button><button class="btn dng" data-a="cfe" data-i="'+id+'">End tenancy</button></div>')}
function act(a,d,btn){var b=B.filter(function(x){return x.id===d.i})[0],rm=b&&d.r?b.rooms.filter(function(x){return String(x.id)===d.r})[0]:null;
 if(a==="addb")bform();
 else if(a==="editb")bform(b);
 else if(a==="delb")confirmDel("b",b);
 else if(a==="openb")swapB(d.i,btn.closest(".card"))
 else if(a==="backb")swapB(null,$("v-Buildings").querySelector("section.card"))
 else if(a==="addr")rform(b);
 else if(a==="editr")rform(b,rm);
 else if(a==="delr")confirmDel("r",b,rm);
 else if(a==="cx")$("dlg").close();
 else if(a==="pt"){PT=d.i;SW=1;refresh();SW=0}
 else if(a==="endt")endDlg(+d.i);
 else if(a==="svb"){var n=$("fn").value.trim(),ad=$("fa").value.trim(),e=$("ferr");
  if(!n)return bad($("fn"),e,"Enter a building name.");
  if(!ad)return bad($("fa"),e,"Enter the address so students can find it.");
  morph(btn,"Saving","Saved",function(){if(b){b.n=n;b.a=ad}else B.push({id:"b"+nid++,n:n,a:ad,rooms:[]});refresh();toast(b?"Building updated.":"Building added.")})}
 else if(a==="svr"){var no=$("fn").value.trim(),cap=parseInt($("rc").value,10),rate=parseFloat($("rr").value),er=$("ferr");
  if(!no)return bad($("fn"),er,"Enter a room number.");
  if(b.rooms.some(function(x){return x.no===no&&x!==rm}))return bad($("fn"),er,"This building already has a room "+no+".");
  if(!(cap>=1))return bad($("rc"),er,"Capacity must be at least 1.");
  if(!(rate>0))return bad($("rr"),er,"Enter the monthly rate.");
  var st=$("rs").value;
  morph(btn,"Saving","Saved",function(){if(rm){rm.no=no;rm.cap=cap;rm.rate=rate;rm.st=st}else b.rooms.push({id:nid++,no:no,cap:cap,rate:rate,st:st});refresh();toast(rm?"Room updated.":"Room added.")})}
 else if(a==="cfd"){morph(btn,"Deleting","Deleted",function(){if(d.k==="b"){B.splice(B.indexOf(b),1);if(bsel===b.id)bsel=null}else b.rooms.splice(b.rooms.indexOf(rm),1);refresh();toast(d.k==="b"?"Building deleted.":"Room deleted.")})}
 else if(a==="cfe"){var id=+d.i,k=T.map(function(x){return x.id}).indexOf(id),t=T[k];
  morph(btn,"Ending","Tenancy ended",function(){var r2=rl(t.r);if(r2)r2.st="available";T.splice(k,1);ARCH.push(t);render();refresh();toast("Tenancy ended. "+t.r+" is available.")})}
}
/* button + icon micro-interactions, screen-to-screen motion */
var lastBd={},lastNP=null,RM="(prefers-reduced-motion:reduce)";
function stag(n){n.querySelectorAll(".top,.card").forEach(function(e,i){e.style.setProperty("--i",Math.min(i,7))});n.classList.add("enter");setTimeout(function(){n.classList.remove("enter")},900)}
function swapB(sel,from){var prev=bsel,vb=$("v-Buildings");
 var go=function(){bsel=sel;refresh();var el=null;
  if(sel)el=vb.querySelector("section.card");
  else{var ob=vb.querySelector('[data-a="openb"][data-i="'+prev+'"]');el=ob?ob.closest(".card"):null}
  if(el&&document.startViewTransition)el.style.viewTransitionName="bcard"};
 if(!document.startViewTransition||matchMedia(RM).matches){SW=1;go();SW=0;return}
 if(from)from.style.viewTransitionName="bcard";
 document.startViewTransition(go).finished.then(function(){vb.querySelectorAll("*").forEach(function(e){e.style.viewTransitionName=""})},function(){})}
document.addEventListener("pointerdown",function(e){var b=e.target.closest&&e.target.closest(".btn:not(:disabled)");if(!b||matchMedia(RM).matches)return;
 var r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*1.6,i=document.createElement("i");i.className="rip";
 i.style.cssText="width:"+s+"px;height:"+s+"px;left:"+(e.clientX-r.left-s/2)+"px;top:"+(e.clientY-r.top-s/2)+"px";b.appendChild(i);setTimeout(function(){i.remove()},560)});
(function(){var d=$("dlg"),orig=d.close.bind(d);d.close=function(){if(!d.open||matchMedia(RM).matches){orig();return}d.classList.add("out");setTimeout(function(){d.classList.remove("out");orig()},160)}})();
function fill(p,el){if(p==="Dashboard"){render();return}el.innerHTML=VIEWS[p]()}
function refresh(){if(shown!=="Dashboard")fill(shown,$(vid(shown)))}
/* spatial depth zoom: panes of glass stacked on the Z axis */
function showView(p,prev){
 var all=[].slice.call(document.querySelectorAll(".vw"));
 all.forEach(function(v){v.getAnimations().forEach(function(a){a.cancel()});v.style.cssText="";v.hidden=v.id!==vid(shown)});
 if(p===shown)return;
 var o=$(vid(shown)),n=$(vid(p)),fwd=PIDX[p]>=PIDX[shown],E="cubic-bezier(.23,1,.32,1)";
 window.scrollTo(0,0);
 fill(p,n);
 if(matchMedia(RM).matches){o.hidden=true;n.hidden=false;shown=p;if(p==="Dashboard")tabInd();return}
 o.style.cssText="position:absolute;top:"+o.offsetTop+"px;left:"+o.offsetLeft+"px;width:"+o.offsetWidth+"px;z-index:1;pointer-events:none;transform-origin:50% 160px";
 n.style.cssText="position:relative;z-index:2;transform-origin:50% 160px";
 n.hidden=false;shown=p;if(p==="Dashboard")tabInd();stag(n);
 var out=o.animate([{opacity:1,transform:"scale(1)",filter:"blur(0px)"},{opacity:0,transform:"scale("+(fwd?.94:1.05)+")",filter:"blur(4px)"}],{duration:420,easing:E,fill:"forwards"});
 n.animate([{opacity:0,transform:"scale("+(fwd?1.04:.95)+")",filter:"blur(5px)"},{opacity:1,transform:"scale(1)",filter:"blur(0px)"}],{duration:460,easing:E});
 out.onfinish=function(){o.hidden=true;out.cancel();o.style.cssText="";n.style.cssText=""}}
function showViewOld(p,prev){
 var all=[].slice.call(document.querySelectorAll(".vw"));
 all.forEach(function(v){v.getAnimations().forEach(function(a){a.cancel()});v.hidden=v.id!==vid(shown)});
 if(p===shown)return;
 var o=$(vid(shown)),n=$(vid(p)),dir=PIDX[p]>=PIDX[shown]?1:-1,E="cubic-bezier(.23,1,.32,1)";
 fill(p,n);
 if(matchMedia("(prefers-reduced-motion:reduce)").matches){o.hidden=true;n.hidden=false;shown=p;return}
 var out=o.animate([{opacity:1,transform:"none",filter:"blur(0px)"},{opacity:0,transform:"translateX("+(-dir*18)+"px)",filter:"blur(2px)"}],{duration:140,easing:E,fill:"forwards"});
 out.onfinish=function(){o.hidden=true;out.cancel();shown=p;n.hidden=false;window.scrollTo(0,0);stag(n);
  n.animate([{opacity:0,transform:"translateX("+(dir*18)+"px)",filter:"blur(2px)"},{opacity:1,transform:"none",filter:"blur(0px)"}],{duration:280,easing:E})}}
/* 3. shake on error */
function bad(f,m,t){m.textContent=t;f.classList.add("error");f.focus();
 if(!matchMedia(RM).matches)f.animate({translate:["0px","-10px","10px","-6px","6px","-3px","3px","0px"]},{duration:360,easing:"ease-out"})}
document.addEventListener("input",function(e){if(e.target.classList)e.target.classList.remove("error")});

/* 4. directional slide between two steps */
function slideSwap(host,dir,change){
 var old=host.querySelector("section.card");
 if(!old||matchMedia(RM).matches){change();return}
 var hr=host.getBoundingClientRect(),r=old.getBoundingClientRect(),ghost=old.cloneNode(true);
 change();
 var nw=host.querySelector("section.card");if(!nw)return;
 host.style.position="relative";host.style.overflowX="clip";
 ghost.style.cssText="position:absolute;top:"+(r.top-hr.top)+"px;left:"+(r.left-hr.left)+"px;width:"+r.width+"px;margin:0;pointer-events:none";
 host.appendChild(ghost);
 var o={duration:350,easing:"cubic-bezier(.77,0,.175,1)"};
 ghost.animate({translate:["0px 0px",(-dir*100)+"% 0px"]},o).onfinish=function(){ghost.remove();host.style.position="";host.style.overflowX=""};
 nw.animate({translate:[(dir*100)+"% 0px","0px 0px"]},o)}

/* 7. instant theme switch + remember the choice */
$("theme").addEventListener("click",function(){
 var r=document.documentElement,dark=r.dataset.theme?r.dataset.theme=== "dark":matchMedia("(prefers-color-scheme:dark)").matches,next=dark?"light":"dark";
 r.classList.add("theme-switching");r.dataset.theme=next;try{localStorage.setItem("fyr-theme",next)}catch(x){}
 requestAnimationFrame(function(){requestAnimationFrame(function(){r.classList.remove("theme-switching")})})});

/* 8. tooltip: 600ms to open, then neighbours open instantly for 300ms */
var tip=document.createElement("div");tip.id="tip";tip.setAttribute("role","tooltip");document.body.appendChild(tip);
var tipT=0,tipLast=0,tipOn=false,TIP_DELAY=600,TIP_SKIP=300;
function tipEl(t){var el=t.closest&&t.closest("[title],[data-tip]");if(el&&el.hasAttribute("title")){el.dataset.tip=el.getAttribute("title");el.removeAttribute("title")}return el&&el.dataset.tip?el:null}
function tipShow(el,instant){tip.textContent=el.dataset.tip;var r=el.getBoundingClientRect();tip.classList.toggle("instant",instant);tip.style.left=Math.min(innerWidth-8,Math.max(8,r.left+r.width/2))+"px";tip.style.top=(r.bottom+8)+"px";tip.classList.add("on");tipOn=true}
function tipHide(){clearTimeout(tipT);if(tipOn)tipLast=performance.now();tipOn=false;tip.classList.remove("on")}
function tipGo(el){clearTimeout(tipT);if(tipOn||performance.now()-tipLast<TIP_SKIP)tipShow(el,true);else tipT=setTimeout(function(){tipShow(el,false)},TIP_DELAY)}
document.addEventListener("pointerover",function(e){if(e.pointerType=== "touch")return;var el=tipEl(e.target);if(el&&!(e.relatedTarget&&el.contains(e.relatedTarget)))tipGo(el)});
document.addEventListener("pointerout",function(e){var el=e.target.closest&&e.target.closest("[data-tip]");if(el&&!(e.relatedTarget&&el.contains(e.relatedTarget)))tipHide()});
document.addEventListener("pointerdown",tipHide);
document.addEventListener("focusin",function(e){if(e.target.matches&&e.target.matches(" :focus-visible")){var el=tipEl(e.target);if(el)tipShow(el,true)}});
document.addEventListener("focusout",tipHide);

/* 9. velocity spring (bounce 0, about 0.5s) that keeps the finger's speed */
function spring(from,to,v,step,done){var k=158,c=25,x=from,last=performance.now();
 (function f(now){var h=Math.min(.032,(now-last)/1000);last=now;for(var i=0;i<4;i++){var dt=h/4;v+=(-k*(x-to)-c*v)*dt;x+=v*dt}step(x);
  if(Math.abs(x-to)>.4||Math.abs(v)>8)requestAnimationFrame(f);else{step(to);if(done)done()}})(last)}

render();
syncLights(true);
