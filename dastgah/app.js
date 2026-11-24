(function(){
"use strict";
var BASE="../goftar-dastgah/";
/* نمونهٔ ساز (اختیاری): اگر برای هر مورد فایلی در پوشهٔ dastgah/nemune/ گذاشتید، نامش را اینجا بنویسید.
   مثال: shur:"nemune/shur.mp3". مورد خالی نمایش داده نمی‌شود. */
var SAMPLES={};
var PREFACE={id:"pishgoftar",f:"01-pishgoftar.mp3",t:"پیش‌گفتار",s:"آشنایی با دستگاه‌ها و آوازهای موسیقی ایرانی"};
var DASTGAHS=[
 {id:"shur",f:"02-shur.mp3",t:"دستگاه شور"},
 {id:"mahur",f:"03-mahur.mp3",t:"دستگاه ماهور"},
 {id:"homayun",f:"04-homayun.mp3",t:"دستگاه همایون"},
 {id:"segah",f:"05-segah.mp3",t:"دستگاه سه‌گاه"},
 {id:"chahargah",f:"06-chahargah.mp3",t:"دستگاه چهارگاه"},
 {id:"nava",f:"07-nava.mp3",t:"دستگاه نوا"},
 {id:"rast-panjgah",f:"08-rast-panjgah.mp3",t:"دستگاه راست‌پنجگاه"}
];
var AVAZES=[
 {id:"abuata",f:"09-abuata.mp3",t:"آواز ابوعطا",s:"از شاخه‌های دستگاه شور"},
 {id:"bayat-tork",f:"10-bayat-tork.mp3",t:"آواز بیات ترک",s:"از شاخه‌های دستگاه شور"},
 {id:"afshari",f:"11-afshari.mp3",t:"آواز افشاری",s:"از شاخه‌های دستگاه شور"},
 {id:"dashti",f:"12-dashti.mp3",t:"آواز دشتی",s:"از شاخه‌های دستگاه شور"},
 {id:"bayat-esfahan",f:"13-bayat-esfahan.mp3",t:"آواز بیات اصفهان",s:"از شاخه‌های دستگاه همایون"}
];
var D="۰۱۲۳۴۵۶۷۸۹";
function fa(n){return String(n).replace(/\d/g,function(d){return D[d]})}
function fmt(s){if(!isFinite(s))return fa("0:00");var m=Math.floor(s/60),x=Math.floor(s%60);return fa(m+":"+(x<10?"0":"")+x)}
var au=document.getElementById("au"),app=document.getElementById("app");
var items=[],cur=null,autoNext=false;
var ICON_PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
var ICON_PAUSE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}

function build(it,label,hero,sub){
 var c=el("div","card"+(hero?" hero":""));
 var n=el("div","num",label);n.setAttribute("aria-hidden","true");
 var info=el("div","info");
 info.appendChild(el("h3",null,it.t));
 if(sub)info.appendChild(el("div","sub",sub));
 var bar=el("div","bar");bar.tabIndex=0;bar.setAttribute("role","slider");bar.setAttribute("aria-label","پیشرفت پخش "+it.t);bar.setAttribute("aria-valuemin","0");bar.setAttribute("aria-valuemax","100");bar.setAttribute("aria-valuenow","0");
 var fill=el("i");bar.appendChild(fill);
 var tm=el("div","time");var a=el("span",null,fa("0:00")),b=el("span",null,"");tm.appendChild(a);tm.appendChild(b);
 info.appendChild(bar);info.appendChild(tm);
 var btn=el("button","play",ICON_PLAY);btn.type="button";btn.setAttribute("aria-label","پخش "+it.t);
 c.appendChild(n);c.appendChild(info);c.appendChild(btn);
 var o={it:it,card:c,btn:btn,fill:fill,bar:bar,a:a,b:b};
 btn.addEventListener("click",function(){toggle(o)});
 function seek(x){if(cur!==o||!au.duration)return;var r=bar.getBoundingClientRect();var p=Math.min(1,Math.max(0,(x-r.left)/r.width));au.currentTime=p*au.duration}
 bar.addEventListener("click",function(e){seek(e.clientX)});
 bar.addEventListener("keydown",function(e){if(cur!==o||!au.duration)return;if(e.key==="ArrowRight"){au.currentTime=Math.min(au.duration,au.currentTime+5);e.preventDefault()}else if(e.key==="ArrowLeft"){au.currentTime=Math.max(0,au.currentTime-5);e.preventDefault()}});
 items.push(o);return o;
}
function setUI(o,playing){
 o.card.classList.toggle("on",playing||cur===o);
 o.btn.innerHTML=playing?ICON_PAUSE:ICON_PLAY;
 o.btn.setAttribute("aria-label",(playing?"توقف ":"پخش ")+o.it.t);
}
function reset(o){o.fill.style.width="0";o.a.textContent=fa("0:00");o.card.classList.remove("on");setUI(o,false);o.bar.setAttribute("aria-valuenow","0")}
function toggle(o){
 if(cur===o){if(au.paused)au.play();else au.pause();return}
 if(cur)reset(cur);
 cur=o;au.src=BASE+o.it.f;o.card.classList.add("on");
 var p=au.play();if(p&&p.catch)p.catch(function(){setUI(o,false)});
}
au.addEventListener("play",function(){if(cur)setUI(cur,true)});
au.addEventListener("pause",function(){if(cur&&!au.ended)setUI(cur,false)});
au.addEventListener("loadedmetadata",function(){if(cur)cur.b.textContent=fmt(au.duration)});
au.addEventListener("timeupdate",function(){
 if(!cur||!au.duration)return;var p=au.currentTime/au.duration*100;
 cur.fill.style.width=p+"%";cur.a.textContent=fmt(au.currentTime);cur.bar.setAttribute("aria-valuenow",String(Math.round(p)));
});
au.addEventListener("ended",function(){
 if(!cur)return;var i=items.indexOf(cur);setUI(cur,false);cur.card.classList.remove("on");
 if(autoNext&&i>=0&&i<items.length-1){var nx=items[i+1];cur=null;toggle(nx);nx.card.scrollIntoView({behavior:"smooth",block:"center"})}
});
au.addEventListener("error",function(){if(cur){cur.b.textContent="خطا";setUI(cur,false)}});

function render(){
 app.appendChild(build(PREFACE,"آغاز",true,PREFACE.s).card);
 var ctrl=el("div","ctrl");
 var ch=el("button","chip","پخش پیاپی گفتارها");ch.type="button";ch.setAttribute("aria-pressed","false");
 ch.addEventListener("click",function(){autoNext=!autoNext;ch.setAttribute("aria-pressed",String(autoNext))});
 ctrl.appendChild(ch);app.appendChild(ctrl);

 app.appendChild(el("h2","sec-title","هفت دستگاه"));
 DASTGAHS.forEach(function(d,i){app.appendChild(build(d,fa(i+1),false,"دستگاه").card)});

 app.appendChild(el("h2","sec-title","پنج آواز"));
 app.appendChild(el("p","sec-sub","آوازها از شاخه‌های دستگاه‌ها هستند و هر یک حال‌وهوای ویژهٔ خود را دارد."));
 AVAZES.forEach(function(d,i){app.appendChild(build(d,fa(i+1),false,d.s).card)});

 /* نمونهٔ ساز فقط در صورت وجود فایل نشان داده می‌شود */
 var ids=Object.keys(SAMPLES);
 if(ids.length){
  app.appendChild(el("h2","sec-title","نمونهٔ ساز"));
  ids.forEach(function(k){
   var all=DASTGAHS.concat(AVAZES).filter(function(x){return x.id===k})[0];if(!all)return;
   var it={id:k+"-nemune",f:"",t:all.t+" (نمونهٔ ساز)"};
   var o=build(it,"ساز",false,"");
   o.it.f="../dastgah/"+SAMPLES[k];app.appendChild(o.card);
  });
 }
 app.appendChild(el("p","note","گفتارها به‌صورت جداگانه بارگیری می‌شوند و تا زمانی که دکمهٔ پخش را نزنید، دادهٔ اینترنت مصرف نمی‌شود."));
}
render();
})();
