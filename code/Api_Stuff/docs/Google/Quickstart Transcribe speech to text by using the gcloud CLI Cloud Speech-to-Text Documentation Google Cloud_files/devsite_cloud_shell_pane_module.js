(function(_ds){var window=this;var Baa=async function(){const a=(await _ds.r()).getStaticPath(!0);return(0,_ds.O)`<img src="${a}/images/cloud-shell-cta-art.png">`};var eW=function(a,b,c){a.xa.h({type:"cloudShell",name:b.toString(),metadata:c})},fW=class extends _ds.Lu{constructor(){super(...arguments);this.isDogfood=this.isResizing=!1;this.offset=0;this.o="";this.xa=new _ds.Dy;this.h=a=>{this.isResizing&&this.m&&(a=Math.floor(this.m.bottom-a.clientY+this.offset).toString(),this.resizer.setAttribute("aria-valuenow",a),this.style.height=a+"px")};this.j=()=>{this.isResizing=!1;window.removeEventListener("pointermove",this.h);window.removeEventListener("pointerup",
this.j);this.style.pointerEvents="auto";eW(this,"pane_resize",{vU:!0})};this.Ga=()=>{document.body.setAttribute("no-scroll","")};this.Da=()=>{document.body.hasAttribute("no-scroll")&&document.body.removeAttribute("no-scroll")}}ib(){return this}render(){this.isDogfood||this.setAttribute("height-visual-offset","24");return(0,_ds.O)`
      <div class="resizer" role="separator" aria-valuemin="0" aria-valuemax="0"
        @pointerdown='${this.ea}'>
        ${this.isDogfood?(0,_ds.O)`
    <div class="dogfood-notice">
      <a href="http://goto.google.com/cgc-cloud-shell-known-issues">
        <span class="material-icons">pets</span>
        <span class="notice-text">Dogfood Version - Internal Only</span>
      </a>
    </div>`:""}
        <div class="grabber-focus">
          <div class="grabber"></div>
        </div>
      </div>
      <devsite-shell
        @pointerover='${this.Ga}'
        @pointerout='${this.Da}'
        @devsite-shell-opened='${this.Ma}'
        @devsite-shell-closed='${this.Fa}'
        @devsite-shell-resized='${this.La}'
        @devsite-shell-maximized='${this.Ha}'>
      </devsite-shell>
      ${(0,_ds.O)`
      <div class="free-trial-banner">
        <a @click='${this.Aa}'
          class="close-btn button-white material-icons" aria-label="${"Close Cloud Shell"}">close</a>
        <div class="banner-text">
          <h3>${"Welcome to Cloud Shell"}</h3>
          <p>${"Cloud Shell is a development environment that you can use in the browser:"}</p>
          <ul>
            <li>${"Activate Cloud Shell to explore Google Cloud with a terminal and an editor"}</li>
            <li>${"Start a free trial to get $300 in free credits"}</li>
          </ul>
          <div class="row">
            <button @click='${this.ya}'
              class="button-blue">${"Activate Cloud Shell"}
            </button>
            <button @click='${this.oa}'>
              ${"Start a free trial"}</button>
          </div>
        </div>
        ${(0,_ds.XE)(Baa(),"")}
      </div>`}
      `}La(a){if(null==a?0:a.detail)a=(a.detail.qH+this.resizer.offsetHeight).toString(),this.resizer.setAttribute("aria-valuenow",a),this.style.height=a+"px",this.removeAttribute("devsite-size"),this.cp.isMaximized=!1,eW(this,"pane_resize",{isManual:!1})}get Na(){return window.sessionStorage.getItem("hide_cloudshell_fte_banner")}Ma(){"true"===this.Na&&this.removeAttribute("enable-fte-user-flow");this.classList.add("opened");eW(this,"pane_open")}Fa(){this.classList.remove("opened");eW(this,"pane_close");
this.hasAttribute("devsite-size")&&(this.removeAttribute("devsite-size"),this.cp.isMaximized=!1,this.style.height=this.o);document.body.hasAttribute("no-scroll")&&document.body.removeAttribute("no-scroll")}Ha(){_ds.ka("CrOS")&&this.setAttribute("cr-os","");this.o=this.style.height;this.setAttribute("devsite-size","content-area");this.style.height="100%"}ea(a){this.isResizing=!0;this.m=this.getBoundingClientRect();window.addEventListener("pointermove",this.h);window.addEventListener("pointerup",this.j);
this.offset=a.offsetY;this.style.pointerEvents="none"}Aa(){if(this.cp){var a=this.cp;a.h.isOpen&&a.h.close()}}ya(){this.Ow&&this.Ow.classList.add("hidden")}oa(){eW(this,"pane_free_trial_click");const a=new URL("https://console.cloud.google.com/freetrial");a.searchParams.set("redirectPath",window.location.href);a.searchParams.set("utm_source","ext");a.searchParams.set("utm_medium","partner");a.searchParams.set("utm_campaign","CDR_cma_gcp_cloudshell_freetrial_020222");a.searchParams.set("utm_content",
"-");_ds.md(window.location,_ds.Zc(a.toString()))}};_ds.u([_ds.ip(".free-trial-banner"),_ds.v("design:type",HTMLElement)],fW.prototype,"Ow",void 0);_ds.u([_ds.ip(".resizer"),_ds.v("design:type",HTMLElement)],fW.prototype,"resizer",void 0);_ds.u([_ds.ip("devsite-shell"),_ds.v("design:type",_ds.IE)],fW.prototype,"cp",void 0);_ds.u([_ds.D({Ea:"is-resizing",Oa:!0,type:Boolean}),_ds.v("design:type",Object)],fW.prototype,"isResizing",void 0);
_ds.u([_ds.D({Ea:"cloudshell-dogfood",type:Boolean}),_ds.v("design:type",Object)],fW.prototype,"isDogfood",void 0);try{window.customElements.define("cloud-shell-pane",fW)}catch(a){console.warn("Unrecognized DevSite custom element - CloudShellPane",a)};})(_ds_www);
