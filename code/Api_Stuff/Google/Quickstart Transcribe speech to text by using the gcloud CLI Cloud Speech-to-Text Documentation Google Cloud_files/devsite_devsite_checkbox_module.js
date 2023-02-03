(function(_ds){var window=this;var jja=_ds.su(['input[type=checkbox]:after,input[type=checkbox]:before{-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;text-transform:none;word-wrap:normal}input[type=checkbox],label{color:var(--devsite-secondary-text-color)}input[type=checkbox]{-webkit-appearance:none;background:var(--devsite-background-1);border-radius:var(--devsite-checkbox-border-radius);cursor:pointer;height:var(--devsite-checkbox-size);margin-block:var(--devsite-checkbox-margin-block);margin-inline:var(--devsite-checkbox-margin-inline);outline:0;position:relative;-webkit-transition:color .2s;transition:color .2s;vertical-align:middle;width:var(--devsite-checkbox-size)}input[type=checkbox]:focus:before{background:var(--devsite-background-4)}input[type=checkbox]:checked,input[type=checkbox]:indeterminate{color:var(--devsite-link-color)}input[type=checkbox]:checked:focus:before,input[type=checkbox]:indeterminate:focus:before{background:var(--devsite-input-background-focus,var(--devsite-link-background))}input[type=checkbox]:after{content:"check_box_outline_blank";font:24px/1 Material Icons;-webkit-font-feature-settings:"liga";-moz-font-feature-settings:"liga";font-feature-settings:"liga";-webkit-font-smoothing:antialiased;position:relative;right:var(--devsite-checkbox-offset-x);top:var(--devsite-checkbox-offset-y);z-index:1}:host-context([dir=rtl]) input[type=checkbox]:after,[dir=rtl] input[type=checkbox]:after{left:var(--devsite-checkbox-offset-x);right:auto}input[type=checkbox]:checked:after{content:"check_box"}input[type=checkbox]:indeterminate:after{content:"indeterminate_check_box"}input[type=checkbox]:before{border-radius:var(--devsite-checkbox-icon-canvas-border-radius);content:"";display:block;font:24px/1 Material Icons;-webkit-font-feature-settings:"liga";-moz-font-feature-settings:"liga";font-feature-settings:"liga";-webkit-font-smoothing:antialiased;height:var(--devsite-checkbox-icon-canvas-size);position:absolute;top:var(--devsite-checkbox-icon-canvas-offset-y);-webkit-transition:background .2s;transition:background .2s;width:var(--devsite-checkbox-icon-canvas-size)}:host-context([dir=ltr]) input[type=checkbox]:before,[dir=ltr] input[type=checkbox]:before{left:var(--devsite-checkbox-icon-canvas-offset-x)}:host-context([dir=rtl]) input[type=checkbox]:before,[dir=rtl] input[type=checkbox]:before{right:var(--devsite-checkbox-icon-canvas-offset-x)}input:disabled+label,input[type=checkbox]:disabled{color:var(--devsite-input-color-disabled,var(--devsite-tertiary-text-color));cursor:default}input+label{color:var(--devsite-primary-text-color);display:inline;font-size:16px}label[for]{cursor:pointer}:host{--devsite-checkbox-icon-canvas-offset-x:-10px;--devsite-checkbox-icon-canvas-offset-y:-8px;--devsite-checkbox-offset-x:4px;--devsite-checkbox-offset-y:-2px;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-inline-box;display:-webkit-inline-flex;display:-moz-inline-box;display:-ms-inline-flexbox;display:inline-flex;gap:10px}label{display:block;font-size:12px;-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1}']);var w4=class extends _ds.Lu{constructor(){super(...arguments);this.checked=!1;this.checkboxId=null;this.disabled=!1;this.value=this.labelText=null;this.ariaDisabled=this.ariaChecked="false"}static get styles(){return jja}connectedCallback(){super.connectedCallback();this.setAttribute("ready","")}disconnectedCallback(){super.disconnectedCallback();this.removeAttribute("ready")}render(){this.ariaChecked=this.checked.toString();this.ariaDisabled=this.disabled.toString();return(0,_ds.O)`
          <input type="checkbox"
              id="${this.checkboxId?this.checkboxId:"default-id"}"
              ?checked="${this.checked}"
              ?disabled="${this.disabled}"
              @click="${this.h}">
          ${this.labelText?(0,_ds.O)`<label for="${this.checkboxId?`${this.checkboxId}`:"default-id"}">
                  ${this.labelText}
                </label>`:""}`}h(){this.checked=!this.checked;this.dispatchEvent(new CustomEvent("devsite-checkbox-change",{detail:{checked:this.checked,value:this.value,checkboxId:this.checkboxId},bubbles:!0}))}};_ds.u([_ds.D({Oa:!0,type:Boolean}),_ds.v("design:type",Object)],w4.prototype,"checked",void 0);_ds.u([_ds.D({Oa:!0,type:String}),_ds.v("design:type",Object)],w4.prototype,"checkboxId",void 0);_ds.u([_ds.D({Oa:!0,type:Boolean}),_ds.v("design:type",Object)],w4.prototype,"disabled",void 0);
_ds.u([_ds.D({Ea:"label-text",type:String}),_ds.v("design:type",Object)],w4.prototype,"labelText",void 0);_ds.u([_ds.D({type:String}),_ds.v("design:type",Object)],w4.prototype,"value",void 0);_ds.u([_ds.D({Ea:"aria-checked",Oa:!0,type:String}),_ds.v("design:type",Object)],w4.prototype,"ariaChecked",void 0);_ds.u([_ds.D({Ea:"aria-disabled",Oa:!0,type:String}),_ds.v("design:type",Object)],w4.prototype,"ariaDisabled",void 0);try{window.customElements.define("devsite-checkbox",w4)}catch(a){console.warn("Unrecognized DevSite custom element - DevsiteCheckbox",a)};})(_ds_www);
