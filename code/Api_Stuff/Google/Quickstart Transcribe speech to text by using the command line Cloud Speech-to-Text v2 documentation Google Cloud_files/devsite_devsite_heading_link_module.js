(function(_ds){var window=this;var ala=function(a){return(0,_ds.Q)('<span class="devsite-heading" role="heading" aria-level="'+_ds.W(a.level)+'"></span>')},bla=function(a){const b=a.id;a=a.label;return(0,_ds.Q)('<button type="button" class="devsite-heading-link button-flat material-icons" aria-label="'+_ds.W(a)+'" data-title="'+_ds.W(a)+'" data-id="'+_ds.W(b)+'"></button>')};var k6=async function(a){a.m=Array.from(document.querySelectorAll("h1.add-link[id],h2:not(.no-link)[id],h3:not(.no-link)[id],h4:not(.no-link)[id],h5:not(.no-link)[id],h6:not(.no-link)[id]"));const b=await _ds.r();for(const c of a.m)b.registerIntersectionForElement(c,()=>{var d=c;if(!d.querySelector(".devsite-heading-link")&&(d.classList.contains("add-link")||!("full"===document.body.getAttribute("layout")||_ds.Bj(d,"devsite-dialog",null,3)||_ds.Bj(d,"devsite-selector",null,6)||_ds.Bj(d,"table",null,
4)))){var e=d.textContent||d.dataset.text;if(e&&d.id){const f="Copy link to this section: "+e,g=_ds.J(ala,{level:d.tagName[1]});for(const h of Array.from(d.childNodes))g.append(h);d.append(g);e=_ds.J(bla,{id:d.id,label:e?f:"Copy link to this section"});d.appendChild(e);d.setAttribute("role","presentation");d.removeAttribute("tabindex")}}b.unregisterIntersectionForElement(c)})},dla=function(a){a.eventHandler.listen(document.body,"devsite-page-changed",()=>{k6(a)});a.eventHandler.listen(document,"click",
b=>{b=b.target;if(b.classList.contains("devsite-heading-link")){var c=_ds.Bj(b,"devsite-expandable",null,3),d=c?c.id:b.dataset.id;d&&(c=_ds.Fj(),c.hash=d,d=document.createElement("div"),d.innerText=c.href,_ds.ts(a,[d]),cla(a,b))}})},cla=async function(a,b){if(a.h){const c=b.getAttribute("aria-label");b.setAttribute("aria-label","Link to this section was copied to the clipboard");_ds.$l(a.eventHandler,a.h,_ds.Zf,()=>{_ds.$l(a.eventHandler,a.h,_ds.Zf,()=>{b.setAttribute("aria-label",c)})})}},ela=class extends _ds.Vh{constructor(){super();
this.eventHandler=new _ds.x;this.h=null;this.m=[]}async connectedCallback(){await k6(this);dla(this);this.h=document.querySelector("devsite-snackbar")}async disconnectedCallback(){const a=await _ds.r();for(const b of this.m)a.unregisterIntersectionForElement(b);_ds.A(this.eventHandler)}};try{window.customElements.define("devsite-heading-link",ela)}catch(a){console.warn("Unrecognized DevSite custom element - DevsiteHeadingLink",a)};})(_ds_www);
