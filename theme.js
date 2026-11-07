(function(){
 const theme=localStorage.getItem('bf_theme')||'dark';
 const lang=localStorage.getItem('bf_lang')||'fa';
 document.documentElement.dataset.theme=theme;
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==='fa'?'rtl':'ltr';
 window.BlockForgeSettings={
  setTheme:function(v){localStorage.setItem('bf_theme',v);document.documentElement.dataset.theme=v;},
  setLanguage:function(v){localStorage.setItem('bf_lang',v);document.documentElement.lang=v;document.documentElement.dir=v==='fa'?'rtl':'ltr';}
 };
 const translations={
  'خانه':'Home','مودها':'Mods','اسکین‌ها':'Skins','اسکین ها':'Skins','مپ‌ها':'Maps','مپ ها':'Maps',
  'شیدرها':'Shaders','تکسچرها':'Textures','کامندها':'Commands','سرورها':'Servers','راهنما':'Help',
  'تنظیمات':'Settings','کانال روبیکا':'Rubika channel','پرمیوم':'Premium','جستجو':'Search',
  'دانلود':'Download','بازگشت':'Back','بازگشت به خانه':'Back to home',
  'ذخیره':'Save','ذخیره‌شده‌ها':'Saved items','مودهای برتر':'Top mods','اسکین‌های برتر':'Top skins',
  'مپ‌های برتر':'Top maps','آیتم‌های مرتبط':'Related items','تاریخچه نسخه‌ها':'Version history',
  'حالت نمایش':'Appearance','زبان برنامه':'App language','لایت مود':'Light mode','دارک مود':'Dark mode',
  'ظاهر و زبان برنامه را مدیریت کنید.':'Manage the app appearance and language.',
  'زبان رابط کاربری':'Interface language','تنظیمات روی همین مرورگر ذخیره می‌شوند.':'Settings are saved in this browser.',
  '← بازگشت به خانه':'← Back to home','← بازگشت':'← Back'
 };
 function translate(root){
  if(lang!=='en'||!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(n=>{const key=n.nodeValue.trim();if(translations[key])n.nodeValue=n.nodeValue.replace(key,translations[key]);});
  root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{
   ['placeholder','aria-label','title'].forEach(a=>{const v=el.getAttribute(a);if(translations[v])el.setAttribute(a,translations[v]);});
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>translate(document.body));else translate(document.body);
 const observer=new MutationObserver(records=>{if(lang!=='en')return;records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===Node.ELEMENT_NODE)translate(n);else if(n.nodeType===Node.TEXT_NODE){const v=n.nodeValue.trim();if(translations[v])n.nodeValue=n.nodeValue.replace(v,translations[v]);}}));});
 if(document.body)observer.observe(document.body,{childList:true,subtree:true});
})();