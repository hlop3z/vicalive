const store  = new Vuex.Store({});

const VuexKeyValue={install(Vue,options){const DynamicValue={namespaced:!0,state(){return{value:{}}},mutations:{setValue(state,value){state.value=value}},actions:{value:function(context,value){context.commit("setValue",value)}},getters:{value(state){return state.value}}};class AblazeVuex{constructor(model){this.model=model}
get value(){return options.store.getters[`abz-${ this.model }/value`]}
set value(value){options.store.dispatch(`abz-${ this.model }/value`,value)}
get items(){return options.store.getters[`abz-${ this.model }/value`]}
set items(value){options.store.dispatch(`abz-${ this.model }/value`,value)}
keys(){return Object.keys(options.store.getters[`abz-${ this.model }/value`])}
values(){return Object.values(options.store.getters[`abz-${ this.model }/value`])}}
Vue.prototype.$abz={};Vue.store_abz=function(model,value={}){options.store.registerModule(`abz-${ model }`,DynamicValue);Vue.prototype.$abz[model]=new AblazeVuex(model);options.store.dispatch(`abz-${ model }/value`,value);
return Vue.prototype.$abz[model]}}};

const VueDevice = {
  install(Vue, options={}) {
    const getDeviceSize = function(e) {
      var out;
      var size = window.innerWidth;
      if(size <= 600){
        out = 'xs'
      }
      else if(600 < size && size < 960){
        out = 'sm'
      }
      else if(960 < size && size < 1264){
        out = 'md'
      }
      else if(1264 < size && size < 1904){
        out = 'lg'
      }
      else if(size > 1904){
        out = 'xl'
      }
      return out
    };
    const getDeviceSizeId = function(size) {
      if(size==='xs'){
        return 1
      }
      else if(size==='sm'){
        return 2
      }
      else if(size==='md'){
        return 3
      }
      else if(size==='lg'){
        return 4
      }
      else if(size==='xl'){
        return 5
      }
    };
    const deviceLte = function(size) {
      var target  = getDeviceSizeId( size );
      var current = getDeviceSizeId( getDeviceSize() );
      return parseInt(target) >= parseInt(current)
    };
    const deviceGte= function(size) {
      var target  = getDeviceSizeId( size );
      var current = getDeviceSizeId( getDeviceSize() );
      return parseInt(target) <= parseInt(current)
    };
    const deviceLt = function(size) {
      var target  = getDeviceSizeId( size );
      var current = getDeviceSizeId( getDeviceSize() );
      return parseInt(target) > parseInt(current)
    };
    const deviceGt= function(size) {
      var target  = getDeviceSizeId( size );
      var current = getDeviceSizeId( getDeviceSize() );
      return parseInt(target) < parseInt(current)
    };
    const deviceEq= function(size) {
      var target  = getDeviceSizeId( size );
      var current = getDeviceSizeId( getDeviceSize() );
      return parseInt(target) === parseInt(current)
    };
    Vue.prototype.$device = {};
    Vue.prototype.$device.size = function( ){ return getDeviceSize() };
    Vue.prototype.$device.is   = function(s){ return deviceEq(s) };
    Vue.prototype.$device.lte  = function(s){ return deviceLte(s) };
    Vue.prototype.$device.gte  = function(s){ return deviceGte(s) };
    Vue.prototype.$device.lt   = function(s){ return deviceLt(s) };
    Vue.prototype.$device.gt   = function(s){ return deviceGt(s) };

    Vue.mixin({
    	beforeCreate(){
      	const sync = this.$options.sync
      	if(sync){
        	if(!this.$options.computed){
          	this.$options.computed = {}
          }
          const attrs = Object.keys(this.$attrs)
          sync.forEach(key => {
          	if(!attrs.includes(key)){
            	Vue.util.warn(`Missing required sync-prop: "${key}"`, this)
            }
            this.$options.computed[key] = {
            	get(){
              	return this.$attrs[key]
              },
              set(val){
              	this.$emit('update:' + key, val)
              }
            }
          })
        }
      }
    });

  }
}


Vue.use(VuexKeyValue, { store });
Vue.use(VueDevice);

/*
Vue.store_abz('test', {
  id      : null,
  name    : null,
  color   : null,
  bgcolor : null,
  text    : null,
  other   : null,
})
*/
Vue.store_abz('test', [1,2]);
Vue.store_abz('forms'  , []);
Vue.store_abz('dialogs', []);
