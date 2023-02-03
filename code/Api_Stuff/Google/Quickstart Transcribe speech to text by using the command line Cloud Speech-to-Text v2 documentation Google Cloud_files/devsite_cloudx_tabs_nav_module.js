(function(_ds){var window=this;var Bfa=class{constructor(){this.m=0;this.h=[];this.ra=[];this.oa=this.ea=0}get j(){return this.ea}set j(a){0>a?a=0:a>this.h.length-1&&(a=this.h.length-1);this.ea=a}set o(a){0<a&&(a=0);this.oa=a}get o(){return this.oa}};var f2=function(a,b){a.target.dispatchEvent(new CustomEvent("scroll-nav",{bubbles:!0,composed:!0,detail:b}))},Cfa=function(a){return(0,_ds.O)`
      <style>
        .overflow-cover {
          background-color: white;
          height: 100%;
          position: absolute;
          top: 0;
          z-index: 100;
        }

        .overflow-cover.left-overflow {
          left: -360px;
          width: 360px;
        }

        .overflow-cover.right-overflow {
          right: -710px;
          width: 700px;
        }

        button.scroll-button {
          background-color: white;
          border: none;
          color: var(--scroll-button-color);
          cursor: pointer;
          display: none;
          font-family: 'Material Icons';
          /* Make these buttons take up the same vertical space as a normal full
          line of text. (since they will be sitting next to text). */
          font-size: var(--scroll-button-font-size);
          height: 100%;
          padding: 0;
          position: absolute;
          top: 0;
          z-index: 101;
        }

        button.scroll-button:hover,
        button.scroll-button:focus {
            color: var(--scroll-button-hover-color);
            outline: none;
        }

        button.scroll-button.scroll-left {
          /* Pull the left scroll button slightly behind the content so that it
          doesn't sit too close to text. */
          left: -8px;
        }

        button.scroll-button.scroll-left::after {
          content: 'chevron_left';
        }

        button.scroll-button.scroll-right {
          /* Pull the right scroll button slightly ahead of content so that it
          doesn't sit too close to text. */
          right: -8px;
        }

        button.scroll-button.scroll-right::after {
          content: 'chevron_right';
        }

        button.scroll-button.visible {
          display: block;
        }
      </style>
      <div class="overflow-cover left-overflow"></div>
      <button class="scroll-button scroll-left ${0<a.j?"visible":""}"
              @click="${b=>{f2(b,"left")}}"
              aria-label="${"Scroll to previous navigation items"}">
      </button>
      <slot></slot>
      <button class="scroll-button scroll-right ${a.j<a.h.length-1?"visible":""}"
              @click="${b=>{f2(b,"right")}}"
              aria-label="${"Scroll to more navigation items"}">
      </button>
      <div class="overflow-cover right-overflow"></div>
    `},Dfa=class{};var g2=function(a,b,c,d,e){const {width:f}=a.getBoundingClientRect();0===f&&32>d?window.requestAnimationFrame(()=>{g2(a,b,c,d+1,e)}):32<=d?c("Exceeded max paint retries."):b(f)},Efa=function(a){return new Promise((b,c)=>{g2(a,b,c,0,32)})};var i2=async function(a,b,c){a.state.o=-b[c];a.state.j=c;await h2(a,a.state)},Ffa=async function(a){await h2(a,a.state);document.body.dispatchEvent(new CustomEvent("cloud-tabs-loaded"))},h2=async function(a,b){await Gfa(a,b);a.render(Cfa(b),a.Na)},Gfa=async function(a,b){return new Promise(c=>{a.Aa.style.setProperty("--scroll-offset",`${b.o}px`);window.setTimeout(()=>{c()},250)})},Hfa=class extends _ds.iP{constructor(){super();this.La=new _ds.Dy;this.element=this;this.Ta=Dfa;this.render=_ds.mu;this.Ga=
a=>{let b=this.state.j;b+="right"===a.detail?1:-1;i2(this,this.state.h,b)};this.state=new Bfa;this.Aa=this.element.querySelector(".devsite-tabs-wrapper");this.Aa.style.setProperty("--scroll-animation-duration","250ms");this.Na=this.element.attachShadow({mode:"open"});Ffa(this);this.element.querySelectorAll(".devsite-tabs-dropdown a").forEach(a=>{a.addEventListener("click",()=>{_ds.bP(this)})})}ra(a){super.ra(a);a.target instanceof Node&&_ds.wy(this.La,a.target)}connectedCallback(){super.connectedCallback();
this.element.addEventListener("scroll-nav",this.Ga)}disconnectedCallback(){super.disconnectedCallback();this.element.removeEventListener("scroll-nav",this.Ga)}async Ma(a){return a.hasAttribute("generated-tab-menu")}async ya(){try{const a=await Efa(this.Aa);if(this.state.m!==a){this.state.m=a;const b=Array.from(this.element.querySelectorAll("tab"));this.state.ra=b.map(c=>({element:c,Oj:c?c.offsetWidth:0}));this.state.h=_ds.jP(this.state.ra,this.state.m);await i2(this,this.state.h,0)}}catch(a){await i2(this,
this.state.h,0)}}};try{window.customElements.define("cloudx-tabs-nav",Hfa)}catch(a){console.warn("devsite.app.tenants.cloud.static.components.CloudxTabsNav",a)};})(_ds_www);
