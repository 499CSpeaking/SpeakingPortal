(function(_ds){var window=this;var dia=function(){return(0,_ds.Q)('<button class="devsite-book-nav-toggle" aria-haspopup="menu"><span class="material-icons devsite-book-nav-toggle-icon"></span></button>')},eia=function(){return(0,_ds.Q)('<div class="devsite-book-nav-blur"></div>')},fia=function(a){a=a.zH;a=_ds.BS(new _ds.xS("{NUMBER_OF_MATCHING_DESCENDANTS,plural,=1{{XXX_1} match}other{{XXX_2} matches}}"),{NUMBER_OF_MATCHING_DESCENDANTS:a,XXX_1:_ds.R(_ds.xq(1,_ds.NF[void 0]||1)),XXX_2:_ds.R(_ds.xq(a,_ds.NF[void 0]||1))});return(0,_ds.Q)('<span class="devsite-nav-filter-match-count"> (<mark>'+
a+"</mark>)</span>")};var gia="onpointerover"in window?"pointerover":"mouseover",v3=function(a){const b=0<a.querySelectorAll(".devsite-nav-item").length,c=document.querySelector("#devsite-hamburger-menu");c&&(b?c.removeAttribute("visually-hidden"):_ds.w(a,"visually-hidden","",c))},jia=function(a){a.eventHandler.listen(a,"click",b=>void w3(a,b));a.eventHandler.listen(a,"keypress",b=>{13===b.keyCode&&w3(a,b)});a.eventHandler.listen(a,[gia,"focusin"],b=>void hia(a,b));a.eventHandler.listen(document.body,"devsite-sitemask-hidden",
()=>{a.m&&(x3(a,"_book")?a.removeAttribute("top-level-nav"):_ds.w(a,"top-level-nav",""))});a.eventHandler.listen(document.body,"devsite-page-loaded",()=>void a.Ca.cb());a.eventHandler.listen(a,"devsite-content-updated",()=>{a.Ca.cb()});a.eventHandler.listen(a,"scroll",()=>{_ds.w(a,"user-scrolled","")});a.eventHandler.listen(a.Ac,"click",()=>{iia(a)});a.h&&(a.eventHandler.listen(a.h,"keyup",()=>void a.Fa.cb()),a.eventHandler.listen(a.h,"focus",()=>void a.ya("focus")));a.oa&&a.eventHandler.listen(a.oa,
["click","keydown"],b=>{if("click"===b.type||13===b.keyCode||27===b.keyCode){a.h&&(a.h.value="",a.h.focus());let c;null==(c=a.oa)||c.classList.add("hidden");y3(a);z3(a);a.ya(b.type)}})},A3=function(a,b=a,c=!0){b=Array.from(b.querySelectorAll(".devsite-nav-title"));a.ea=new Set(b);if(!_ds.Fj().hash&&c)kia(a,a.ea);else{c=new _ds.PS;for(const d of a.ea)_ds.OS(c,d)}},B3=async function(a){const b=await _ds.r();for(const c of a.ea)b.unregisterIntersectionForElement(c)},w3=function(a,b){if(!b.defaultPrevented){var c=
b.target;"devsite-close-nav"===c.getAttribute("id")&&(b.preventDefault(),b.stopPropagation(),a.scrollTop=0,a.hasAttribute("top-level-nav")?a.dispatchEvent(new CustomEvent("devsite-sitemask-hide",{bubbles:!0})):_ds.w(a,"top-level-nav",""));if(c.hasAttribute("menu")){var d=c.getAttribute("menu");d&&x3(a,d)&&(b.preventDefault(),b.stopPropagation(),a.scrollTop=0,a.removeAttribute("top-level-nav"))}var e=c.closest(".devsite-expandable-nav");if(e&&(d=c.closest(".devsite-nav-title, .devsite-nav-toggle"))){let f=
b.target,g,h;if(!(null==(g=f)?0:null==(h=g.closest(".devsite-nav-title"))?0:h.hasAttribute("href"))){for(b="click"===b.type||"touchend"===b.type;f&&f!==e;){if(f.classList.contains("devsite-nav-title-no-path")&&b){f.blur();break}f=f.parentNode}e.querySelector(".devsite-nav-section")&&(b=e.classList.toggle("expanded"),(e=e.querySelector(".devsite-nav-title"))&&_ds.w(a,"aria-expanded",`${b}`,e))}if(d.matches(".devsite-nav-toggle"))return}c.closest(".devsite-nav-title-no-path")||(a.m&&(d=a.m.querySelector("[menu=_book]"))&&
d.contains(c)&&a.dispatchEvent(new CustomEvent("devsite-sitemask-hide",{bubbles:!0})),(c=c.closest("a.devsite-nav-title"))&&!c.classList.contains("devsite-nav-has-children")&&a.dispatchEvent(new CustomEvent("devsite-sitemask-hide",{bubbles:!0})))}},hia=function(a,b){b.defaultPrevented||(b=_ds.Aj(b.target,c=>c instanceof HTMLAnchorElement&&c.hasAttribute("href")||c===a,!0),b!==a&&_ds.cd(b,_ds.ud(_ds.Bk(b.href).href)))},iia=async function(a){var b=document.documentElement.scrollHeight-document.documentElement.clientHeight;
const c=b?document.documentElement.scrollTop/b:0;_ds.$l(a.eventHandler,a,_ds.Zf,()=>{a.removeAttribute("animatable");a.background.removeAttribute("animatable");a.o.removeAttribute("animatable")});_ds.w(a,"animatable","");b=_ds.gd(a.j`animatable`);b(a.background,"animatable","");b(a.o,"animatable","");a.hasAttribute("collapsed")?(_ds.w(a,"aria-expanded","true",a.Ac),_ds.w(a,"aria-label","Hide side navigation",a.Ac),_ds.w(a,"data-title","Hide side navigation",a.Ac),a.removeAttribute("collapsed"),C3(a,
"Expanded book nav")):(a.Ac.removeAttribute("aria-expanded"),_ds.w(a,"aria-label","Show side navigation",a.Ac),_ds.w(a,"data-title","Show side navigation",a.Ac),_ds.w(a,"collapsed",""),C3(a,"Collapsed book nav"));await _ds.Jk();b=document.documentElement.scrollHeight-document.documentElement.clientHeight;document.documentElement.scrollTop=Math.round(c*b)},D3=function(a){a.xa=Array.from(a.querySelectorAll(".devsite-mobile-nav-bottom .devsite-nav-list[menu=_book] .devsite-nav-item:not(.devsite-nav-heading)"))},
F3=function(a){const b=_ds.Fj().searchParams.get("nf");a.h&&b&&(a.h.value=b,E3(a))},E3=function(a){if(a.xa.length){y3(a);z3(a);var b,c,d=null==(b=a.h)?void 0:null==(c=b.value)?void 0:c.trim().toLowerCase();if(d){var e;null==(e=a.oa)||e.classList.remove("hidden");for(const g of a.xa){c=g.querySelectorAll(".devsite-nav-text");b=g.classList.contains("devsite-nav-expandable");var f=e=!1;a=0;let h,k;if(d&&b&&(null==(h=g.querySelector(".devsite-nav-text"))?0:null==(k=h.textContent)?0:k.toLowerCase().includes(d)))f=
e=!0;else for(const l of c){let p;d&&(null==(p=l.textContent)?0:p.toLowerCase().includes(d))&&(e=!0,++a)}if(!0===e){g.classList.remove("hidden");if(f){c=Array.from(g.querySelectorAll(".devsite-nav-item"));for(const l of c){l.classList.remove("hidden");let p;d&&(null==(p=l.textContent)?0:p.toLowerCase().includes(d))&&++a}}c=void 0;(f=g.querySelector(".devsite-nav-text"))&&(e=null==(c=f.textContent)?void 0:c.replace(new RegExp(`(${d})`,"ig"),"<mark>$1</mark>"))&&_ds.ed(f,_ds.Bd(e))}b&&0<a&&(b=g.querySelector(".devsite-nav-text"))&&
(a=_ds.J(fia,{zH:a}),b.appendChild(a))}}else null==(f=a.oa)||f.classList.add("hidden")}},y3=function(a){for(const b of a.xa){let c;b.classList.toggle("hidden",!(null==(c=a.h)||!c.value))}},z3=function(a){if(a.querySelector("mark")){var b=[...a.querySelectorAll(".devsite-nav-text > .devsite-nav-filter-match-count")];for(const c of b)c.remove();a=[...a.querySelectorAll(".devsite-nav-text > mark")];for(const c of a){a=c.parentElement;let d;b=null==(d=a)?void 0:d.textContent;a&&b&&_ds.ed(a,_ds.Bd(b))}}},
kia=async function(a,b){if(a.connected){var c=await _ds.r(),d=new _ds.PS,e=f=>{f=f.target;_ds.OS(d,f);a.ea.delete(f);c.unregisterIntersectionForElement(f)};for(const f of b)try{c.registerIntersectionForElement(f,e)}catch(g){e({target:f})}}},x3=function(a,b){let c=!1;if(a.m)for(const d of a.m.querySelectorAll("[menu]"))d.getAttribute("menu")===b?(d.removeAttribute("hidden"),c=!0):_ds.w(a,"hidden","",d);return c},G3=function(a,b=a){b||(b=a);for(const c of b.querySelectorAll(".devsite-nav-active"))c.classList.remove("devsite-nav-active");
a=_ds.Qk(_ds.Fj().pathname);a=`[href="${_ds.Bk(a).href}"], [href="${a}"],
        [alt-paths~="${a}"]`;for(const c of b.querySelectorAll(a))c.classList.add("devsite-nav-active")},H3=function(a,b=a){b||(b=a);if(a=b.querySelector(".devsite-mobile-nav-bottom"))for(a=a.querySelector(".devsite-nav-active");a&&a.parentElement&&a.parentElement!==b;)a.matches(".devsite-expandable-nav:not(.expanded)")&&a.classList.add("expanded"),a=a.parentElement},lia=async function(a){a.connected&&(a.removeAttribute("user-scrolled"),await _ds.Jk(),await I3(a),await a.Ha,await _ds.r(),await _ds.Jk(),
await I3(a))},I3=async function(a){if(a.connected&&a.m){await _ds.r();var b=a.m.querySelector(".devsite-nav-active");b&&(a.hasAttribute("user-scrolled")||await mia(a,b))}},mia=async function(a,b){if(a.connected){var c=a.hasAttribute("user-scrolled");a.scrollTop=_ds.qm(b,a,!0).y;await _ds.Jk();c&&_ds.w(a,"user-scrolled","")}},C3=function(a,b){a.dispatchEvent(new CustomEvent("devsite-analytics-observation",{detail:{category:"Site-Wide Custom Events",action:"click",label:b},bubbles:!0}))},J3=class extends _ds.Vh{static get observedAttributes(){return["collapsed",
"fixed","hidden"]}constructor(){super();this.connected=!1;this.oa=this.h=this.ra=this.m=null;this.xa=[];this.eventHandler=new _ds.x;this.Da=()=>{};this.ea=new Set;this.Aa=this.Ga=!1;this.background=document.createElement("div");this.background.classList.add("devsite-book-nav-bg");this.Ac=_ds.J(dia);this.o=_ds.J(eia);this.Ha=new Promise(a=>{this.Da=a});this.Ca=new _ds.Vl(()=>{this.connected&&v3(this)},20);this.Fa=new _ds.Vl(()=>{E3(this)},20)}async connectedCallback(){this.connected=!0;_ds.Rh(this,
this.j`animatable`,this.j`aria-expanded`,this.j`aria-label`,this.j`collapsed`,this.j`data-title`,this.j`fixed`,this.j`has-book-nav`,this.j`hidden`,this.j`top-level-nav`,this.j`user-scrolled`,this.j`visually-hidden`);_ds.cj(this.background,this);this.hasAttribute("hidden")&&(_ds.w(this,"hidden","",this.Ac),_ds.w(this,"hidden","",this.o));const a=await _ds.r();if(this.Ga=a.hasMendelFlagAccess("BookNav","enable_collapsible_book_nav")){let b;null==(b=this.parentElement)||b.insertBefore(this.Ac,this.nextSibling);
_ds.w(this,"aria-label","Hide side navigation",this.Ac);_ds.w(this,"data-title","Hide side navigation",this.Ac);_ds.w(this,"aria-expanded","true",this.Ac);let c;null==(c=this.parentElement)||c.insertBefore(this.o,this.nextSibling)}if(this.Aa=a.hasMendelFlagAccess("BookNav","enable_book_nav_filtering"))if(this.ra=this.querySelector(".devsite-book-nav-filter"))this.h=this.ra.querySelector("input[type=text]"),this.oa=this.ra.querySelector(".filter-clear-button"),D3(this),F3(this);v3(this);jia(this);
await this.init();A3(this)}disconnectedCallback(){this.connected=!1;_ds.A(this.eventHandler);B3(this);this.ea.clear();var a=document.querySelector("#devsite-hamburger-menu");a&&_ds.w(this,"visually-hidden","",a);a=[this.background,this.Ac,this.o];for(const b of a)b&&_ds.ej(b);this.removeAttribute("animatable");this.background.removeAttribute("animatable");this.o.removeAttribute("animatable");this.o.style.removeProperty("--devsite-js-book-nav-scrollbar-width")}attributeChangedCallback(a){"hidden"===
a&&this.dispatchEvent(new CustomEvent(this.hasAttribute("hidden")?"devsite-element-hidden":"devsite-element-visible",{bubbles:!0}));if("hidden"===a||"collapsed"===a){var b=document.querySelector(".devsite-main-content");b&&(this.hasAttribute("collapsed")||this.hasAttribute("hidden")?b.removeAttribute("has-book-nav"):_ds.w(this,"has-book-nav","",b))}if("fixed"===a||"hidden"===a||"collapsed"===a){b=this.hasAttribute(a);const c=[this.background,this.Ac,this.o];for(const d of c)d&&(b?_ds.w(this,a,"",
d):d.removeAttribute(a))}"fixed"===a&&this.Da()}async init(a=!0){if(this.connected){this.o.style.setProperty("--devsite-js-book-nav-scrollbar-width",`${this.offsetWidth-this.clientWidth}px`);this.m=this.querySelector(".devsite-mobile-nav-bottom");_ds.w(this,"top-level-nav","");this.m&&this.m.querySelector("[menu=_book]")&&this.removeAttribute("top-level-nav");0===this.children.length&&_ds.w(this,"hidden","");if(this.background)for(const b of["hidden","fixed","animatable"])this.hasAttribute(b)&&_ds.w(this,
b,"",this.background);!this.hasAttribute("hidden")&&a?(G3(this),H3(this),await lia(this)):(await _ds.Jk(),await I3(this))}}async jc(a){a?(a=a.querySelector("nav")||null,G3(this,a),H3(this,a),a&&(await B3(this),this.ea.clear(),A3(this,a,!1)),_ds.Uh(this,this.querySelector("nav"),a)):_ds.bj(this);if(this.Aa&&(D3(this),this.h)){this.h.value="";let b;null==(b=this.oa)||b.classList.add("hidden");F3(this)}await _ds.Jk();await this.init(!1)}ya(a){this.dispatchEvent(new CustomEvent("devsite-analytics-observation",
{detail:{category:"Site-Wide Custom Events",action:a,label:"focus"===a?"devsite-book-nav-filter input":"devsite-book-nav-filter filter-clear-button"},bubbles:!0}))}};J3.prototype.updateContent=J3.prototype.jc;J3.prototype.attributeChangedCallback=J3.prototype.attributeChangedCallback;J3.prototype.disconnectedCallback=J3.prototype.disconnectedCallback;J3.prototype.connectedCallback=J3.prototype.connectedCallback;var nia=class extends J3{async ya(a){super.ya(a);a={eventData:JSON.stringify({type:"devsite-nav-filter",name:"focus"===a?"inputEntered":"filterCleared"})};this.dispatchEvent(new CustomEvent("devsite-analytics-observation-cloudtrack",{detail:a,bubbles:!0}))}};try{window.customElements.define("devsite-book-nav",nia)}catch(a){console.warn("Unrecognized DevSite custom element - CloudBookNav",a)};})(_ds_www);
