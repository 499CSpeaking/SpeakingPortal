(function(_ds){var window=this;var Dna=function(a){const b=a.jd;var c=a.ds;a='<div class="devsite-recommendations-sidebar-heading" role="heading" aria-level="2"><a href="#recommendations-link" class="devsite-nav-title devsite-recommendations-sidebar-heading-link" data-category="Site-Wide Custom Events" data-label="devsite-recommendation side-nav title" data-action="click" data-tooltip="'+_ds.$v("See content recommendations");a+='"><svg class="devsite-recommendations-sidebar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d=\'M12.5,8.5L10,3L7.5,8.5L2,11l5.5,2.5L10,19l2.5-5.5L18,11L12.5,8.5z M18,13l-1.25,2.75L14,17l2.75,1.25L18,21l1.25-2.75 L22,17l-2.75-1.25L18,13z\'/></svg><span class="devsite-nav-text devsite-nav-title">'+
_ds.R(c)+'</span></a></div><ul class="devsite-nav-list">';c=b.length;for(let d=0;d<c;d++)a+=Cna(b[d]);return(0,_ds.Q)(a+"</ul>")},Cna=function(a){let b="";const c=[a.getTitle(),_ds.t(a,3),_ds.t(a,4)];b+='<li role="option" class="devsite-nav-item"><a href="'+_ds.W(_ds.tw(a.getUrl()+"?"+_ds.t(a,8)))+'" class="devsite-nav-title devsite-recommendations-sidebar-title" data-category="Site-Wide Custom Events" data-label="devsite-recommendation side-nav link" data-action="click"><span class="devsite-nav-text" tooltip="">'+
_ds.R(c.filter(d=>0<(""+_ds.U(d)).length)[0])+'</span></a><div class="significatio-card-meta">Updated <span class="significatio-date" date="'+_ds.W(_ds.wc(a,_ds.RQ,7).getSeconds())+'"></span></div></li>';return(0,_ds.Q)(b)};var Ena=function(a){a.eventHandler.listen(a,"click",b=>{b.target.classList.contains("devsite-nav-title")&&(b=b.target,a.m&&a.m.classList.remove("devsite-nav-active"),b.classList.add("devsite-nav-active"),a.m=b)});a.eventHandler.listen(document,"devsite-on-recommendations",b=>{b=b.Ja;if(null==b?0:b.detail)if(b=b.detail,3===_ds.Jf(b,5)){a.render(b);a.h.h();if(b=null==b?void 0:_ds.QV(b)){for(const c of b)if(b=_ds.wc(c,_ds.NV,10))b={targetPage:c.getUrl(),targetRank:_ds.Ff(b,2),targetType:_ds.Jf(b,3),
targetIdenticalDescriptions:_ds.Ff(b,4),targetTitleWords:_ds.Ff(b,5),targetDescriptionWords:_ds.Ff(b,6),experiment:_ds.t(b,7)},b={category:"Site-Wide Custom Events",action:"recommended-right-nav",label:c.getUrl(),nonInteraction:!0,additionalParams:{recommendations:b}},a.dispatchEvent(new CustomEvent("devsite-analytics-observation",{detail:b,bubbles:!0}));a.o.h()}else a.o.j("empty");a.classList.add("recommendations-rendered")}else a.h.h()});a.eventHandler.listen(document.body,"devsite-recommendations-disconnected",
()=>{_ds.bj(a);a.classList.remove("recommendations-rendered")})},Fna=class extends _ds.Vh{constructor(a){super();this.timeZone=a;this.eventHandler=new _ds.x(this);this.h=new _ds.am;this.loaded=this.h.promise;this.o=new _ds.am;this.m=null}connectedCallback(){Ena(this)}disconnectedCallback(){_ds.A(this.eventHandler);this.h.j("Disconnected")}render(a){this.isConnected&&(_ds.I(this,Dna,{jd:_ds.QV(a),ds:_ds.t(a,6)}),this.formatDates())}formatDates(){var a=Array.from(this.querySelectorAll(".significatio-date"));
for(const b of a){a=b.getAttribute("date");try{b.textContent=(new Date(1E3*Number(a))).toLocaleDateString("default",{month:"short",year:"numeric",day:"numeric",timeZone:this.timeZone})}catch(c){}}}};try{window.customElements.define("devsite-recommendations-sidebar",Fna)}catch(a){console.warn("Unrecognized DevSite custom element - DevsiteRecommendationsSidebar",a)};})(_ds_www);
