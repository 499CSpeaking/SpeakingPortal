(function(_ds){var window=this;var pda=function(a,b=a.devsiteExperimentIdList){b.length&&DevsiteApp.hasMendelFlagAccess("Cloud","enable_cloudx_experiment_ids")&&a.j.set("FACET_EXPERIMENT_IDS_DEVSITE",b)},SX=class extends _ds.Lu{constructor(){super();this.j=new _ds.Vw(document);this.eventHandler=new _ds.x;this.h=new _ds.Dy;this.devsiteExperimentIdList="";this.userCountry="ZZ"}connectedCallback(){super.connectedCallback();pda(this,this.devsiteExperimentIdList);this.eventHandler.listen(document.body,"devsite-analytics-sent-pageview",
a=>{"trackPageview"===a.Ja.detail.event&&(a={type:"experiment",name:"devsite_experiment",metadata:{activeExperiments:_ds.Bp(),userCountry:this.userCountry}},this.h.h(a))})}};_ds.u([_ds.D({type:String}),_ds.v("design:type",Object)],SX.prototype,"devsiteExperimentIdList",void 0);_ds.u([_ds.D({type:String}),_ds.v("design:type",Object)],SX.prototype,"userCountry",void 0);try{window.customElements.define("cloudx-experiment-ids",SX)}catch(a){console.warn("devsite.app.tenants.cloud.static.components.CloudxExperimentIds",a)};})(_ds_www);