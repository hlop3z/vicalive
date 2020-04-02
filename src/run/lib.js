const $ablaze   = {};
$ablaze.is      = {};
$ablaze.json    = {};
$ablaze.number  = {};
$ablaze.field   = {};
$ablaze.filter  = {};
$ablaze.cookie  = {};
$ablaze.storage = {};
$ablaze.storage.session = {};
$ablaze.storage.local = {};

$ablaze.cookie.set=function(e,t,i){var o=new Date();o.setTime(o.getTime()+24*i*60*60*1e3);var n="expires="+o.toUTCString();document.cookie=e+"="+t+";"+n+";path=/"}
$ablaze.cookie.get=function(t){for(var n=t+"=",r=document.cookie.split(";"),e=0;e<r.length;e++){for(var i=r[e];" "===i.charAt(0);)i=i.substring(1);if(0===i.indexOf(n))return i.substring(n.length,i.length)} return""}
$ablaze.cookie.delete=function(t){document.cookie=t + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"};
$ablaze.storage.local.set=function(k,v){localStorage.setItem(k,JSON.stringify(v))};
$ablaze.storage.local.get=function(k){return JSON.parse(localStorage.getItem(k))}
$ablaze.storage.local.remove=function(k){localStorage.removeItem(k)};
$ablaze.storage.local.clear=function(){localStorage.clear()};
$ablaze.storage.session.set=function(k,v){sessionStorage.setItem(k,JSON.stringify(v))};
$ablaze.storage.session.remove=function(k){sessionStorage.removeItem(k)};
$ablaze.storage.session.clear=function(){sessionStorage.clear()};

$ablaze.loop=(count,action,...params)=>{for(var i=0;i<count;i++){action(...params)}}
$ablaze.debounce=function(func,wait,immediate){var timeout;return function(){var context=this,args=arguments;var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(function(){timeout=null;if(!immediate){func.apply(context,args)}},wait);if(callNow)func.apply(context,args)}}
$ablaze.throttle=function(func,wait,options){var context,args,result;var timeout=null;var previous=0;if(!options)options={};var later=function(){previous=options.leading===!1?0:Date.now();timeout=null;result=func.apply(context,args);if(!timeout)context=args=null};return function(){var now=Date.now();if(!previous&&options.leading===!1)previous=now;var remaining=wait-(now-previous);context=this;args=arguments;if(remaining<=0||remaining>wait){if(timeout){clearTimeout(timeout);timeout=null}
previous=now;result=func.apply(context,args);if(!timeout)context=args=null}else if(!timeout&&options.trailing!==!1){timeout=setTimeout(later,remaining)}; return result}}



$ablaze.reverse=str=>{var splitString=str.split("");var reverseArray=splitString.reverse();var joinArray=reverseArray.join("");return joinArray}

$ablaze.is.function = function(v) {
  return "function" == typeof v;
};
$ablaze.is.obj = function(v) {
  return v && "object" == typeof v && v.constructor === Object;
};
$ablaze.is.str = function isString(n) {
  return "string" == typeof n || n instanceof String;
};
$ablaze.is.num = function(v) {
  return "number" == typeof v && isFinite(v);
};
$ablaze.is.list = function(v) {
  return v && "object" == typeof v && v.constructor === Array;
};
$ablaze.is.null = function(v) {
  return null === v;
};
$ablaze.is.undefined = function(v) {
  return void 0 === v;
};
$ablaze.is.boolean = function(v) {
  return "boolean" == typeof v;
};
$ablaze.is.date = function(v) {
  return v instanceof Date;
};
$ablaze.is.regex = function(v) {
  return v && "object" == typeof v && v.constructor === RegExp;
};
$ablaze.is.error = function(v) {
  return v instanceof Error && void 0 !== v.message;
};
$ablaze.is.symbol = function(v) {
  return "symbol" == typeof v;
};

$ablaze.json.download=function(exportObj,exportName){var dataStr="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(exportObj));var downloadAnchorNode=document.createElement("a");downloadAnchorNode.setAttribute("href",dataStr);downloadAnchorNode.setAttribute("download",exportName+".json");downloadAnchorNode.click();downloadAnchorNode.remove()}

$ablaze.filter.capitalize=function(t){return t?(t=(t=t.toString()).toLowerCase()).charAt(0).toUpperCase()+t.slice(1):""}
$ablaze.filter.caps = $ablaze.filter.capitalize;
$ablaze.filter.title=function(t){return t?t.toLowerCase().split(" ").map(function(t){return t.charAt(0).toUpperCase()+t.slice(1)}).join(" "):""}
$ablaze.filter.lower = function(t) {
  return t ? t.toLowerCase() : "";
};
$ablaze.filter.upper = function(t) {
  return t ? t.toUpperCase() : "";
};
var __ablaze_filter_cut__ = function(t, z) {
  return t ? t.substring(0, z) : "";
};
$ablaze.filter.cut=function(v,s,t=!0){var end="";if(v.length>s&&t===!0){end="..."}
return `${__ablaze_filter_cut__(v, s)}${end}`}

$ablaze.lorem=function(e,t){var lorem=["Lorem Ipsum is simply dummy text of the printing and typesetting industry.","Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.","An unknown printer took a galley of type and scrambled it to make a type specimen book.","It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.","It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.","Lorem Ipsum is simply dummy text of the printing and typesetting industry."];var list=[];var len=lorem.length;switch(e[0]){case "w":for(var i=0;i<t;i++){var rand=Math.floor(len*Math.random());var words=lorem[rand].trim().split(" ");list.push(words[Math.floor(len*Math.random())])}
break;case "s":for(var i=0;i<t;i++){var rand=Math.floor(len*Math.random());list.push(lorem[rand])}
break}
return list.join(" ")}

$ablaze.lorem.word = function(e) {
  return $ablaze.filter.capitalize($ablaze.lorem("w", e));
};
$ablaze.lorem.sentence = function(e) {
  return $ablaze.filter.capitalize($ablaze.lorem("s", e));
};
$ablaze.lorem.w = $ablaze.lorem.words;
$ablaze.lorem.s = $ablaze.lorem.sentence;

$ablaze.has = {};
$ablaze.has.value=function(value){if(value&&value!=""&&value!=" "&&typeof value!=="undefined"){return!0}else{return!1}};
$ablaze.has.value.not_zero=function(value){if(value&&value!=0&&value!=""&&value!=" "&&typeof value!=="undefined"){return!0}else{return!1}}

$ablaze.number.commas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
$ablaze.number.float=function(e,t=2){var a,s;return((e=String(e).replace(/[^0-9\.\,]+/g,"").replace(/\,{1,}/g,",").replace(/\.{1,}/g,".").replace(/,/g,"")),(amount=parseFloat(e).toFixed(t)),(e=amount.replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1,")),(cc=e.split(".")),(coins=cc[0]),(cents=String(cc[1]).replace(/,/g,"").replace(/[0]{1,}$/g,"")),(a=0===parseInt(cents)?`${coins}`:`${coins}.${cents}`),(s=0===parseInt(cents)?`${parseInt(coins.replace(/,/g, ""))}`:`${parseInt(coins.replace(/,/g, ""))}.${cents}`),(out={display:""===a.split(".")[1]?`${a.split(".")[0]}.${Array(t + 1).join("0")}`:a,value:parseFloat(s)}),out,(""!==out.display.split(".")[1]&&"undefined"!==out.display.split(".")[1])||(out.display=out.display.split(".")[0]),out)};
$ablaze.number.currency = function(d) {
  return $ablaze.number.float(d, 2);
};

$ablaze.string = {};
$ablaze.string.lowercase = "abcdefghijklmnopqrstuvwxyz";
$ablaze.string.uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
$ablaze.string.digits = "0123456789";
$ablaze.string.hexdigits = "0123456789abcdefABCDEF";
$ablaze.string.others = "-._~";

$ablaze.random = function(size, choices) {
  var text = "";
  var possible = choices;
  for (var i = 0; i < size; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};
$ablaze.random.letters = function(s) {
  return $ablaze.random(s, $ablaze.string.lowercase + $ablaze.string.uppercase);
};
$ablaze.random.alphanum = function(s) {
  return $ablaze.random(
    s,
    $ablaze.string.lowercase + $ablaze.string.uppercase + $ablaze.string.digits
  );
};
$ablaze.random.lowercase = function(s) {
  return $ablaze.random(s, $ablaze.string.lowercase);
};
$ablaze.random.uppercase = function(s) {
  return $ablaze.random(s, $ablaze.string.uppercase);
};
$ablaze.random.digits = function(s) {
  return $ablaze.random(s, $ablaze.string.digits);
};
$ablaze.random.hexdigits = function(s) {
  return $ablaze.random(s, $ablaze.string.hexdigits);
};
$ablaze.random.all = function(s) {
  return $ablaze.random(
    s,
    $ablaze.string.lowercase +
      $ablaze.string.uppercase +
      $ablaze.string.digits +
      $ablaze.string.hexdigits +
      $ablaze.string.others
  );
};

$ablaze.field.letters = function(e) {
  return e.replace(/((?!([a-zA-Z])).)/g, "");
};
$ablaze.field.letters.lower = function(e) {
  return e.toLowerCase().replace(/((?!([a-z])).)/g, "");
};
$ablaze.field.letters.upper = function(e) {
  return e.toUpperCase().replace(/((?!([A-Z])).)/g, "");
};
$ablaze.field.alphanum = function(e) {
  return e.replace(/((?!([a-zA-Z0-9])).)/g, "");
};
$ablaze.field.alphanum.lower = function(e) {
  return e.toLowerCase().replace(/((?!([a-z0-9])).)/g, "");
};
$ablaze.field.alphanum.upper = function(e) {
  return e.toUpperCase().replace(/((?!([A-Z0-9])).)/g, "");
};
$ablaze.field.zipcode = function(e) {
  return e.toUpperCase().replace(/((?!([A-Z0-9\-])).)/g, "");
};

$ablaze.field.username=function(e){return e.toLowerCase().replace(/((?!([a-z0-9_])).)/g,"").replace(/_{1,}/g,"_").replace(/^\d+$/,"")}
$ablaze.field.username.dot=function(e){return e.toLowerCase().replace(/\.{1,}/g,".").replace(/((?!([a-z0-9_\.])).)/g,"").replace(/_{1,}/g,"_").replace(/\.{1,}/g,".").replace(/_\.{0,}/g,"_").replace(/\._{0,}/g,".").replace(/^\d+$/,"")}
$ablaze.field.phone=function(e){return e.replace(/((?!(^[\+?]|[0-9])).)/g,"")}
$ablaze.field.phone.custom=function(e,c){return e.replace(/((?!(^[\+?]|[0-9])).)/g,"").replace(/(\+)/g,"").slice(0,c)}

$ablaze.field.email=function(e){return((e=(e=e.replace(/\.{1,}/g,".").replace(/@{1,}/g,"@").replace(/@\./g,"@").replace(/\.@/g,".").replace(/-{1,}/g,"-").replace(/_{1,}/g,"_").replace(/-\./g,"-").replace(/\.-/g,".").replace(/_\./g,"_").replace(/\._/g,".")).replace(/-@/g,"@").replace(/@-/g,"@")),(f=e.split("@")),f.length>2&&((b=f.slice(-1).pop()),(a=f.slice(0,f.length-1)),(e=`${a.join("")}@${b}`)),(e=e.replace(/\._/g,".").replace(/_\./g,"_")).replace(/\.{1,}/g,".").replace(/@{1,}/g,"@").replace(/@\./g,"@").replace(/\.@/g,".").replace(/-{1,}/g,"-").replace(/_{1,}/g,"_").replace(/-\./g,"-").replace(/\.-/g,".").replace(/_\./g,"_").replace(/\._/g,".").replace(/_-/g,"_").replace(/-_/g,"-"))}
$ablaze.field.slug=function(e){return e.toLowerCase().replace(/((?!([a-z0-9-])).)/g,"").replace(/-{1,}/g,"-").replace(/^-/,"").replace(/^\d+$/,"")}
$ablaze.field.tags=function(e){return[...new Set(e.toLowerCase().replace(/((?!([a-z,])).)/g,"").replace(/,{1,}/g,",").replace(/^\d+$/,"").replace(/,$/,"").split(","))]}
$ablaze.field.hashtags=function(e){return[...new Set(e.toLowerCase().replace(/((?!([a-z#\s])).)/g,"").replace(/#{1,}/g,"#").replace(/^\d+$/,"").split(" "))].filter(e=>{return e.startsWith("#")}).map(e=>{return e.replace("#","")})}
$ablaze.field.attags=function(e){return[...new Set(e.toLowerCase().replace(/((?!([a-z0-9_@\s])).)/g,"").replace(/_{1,}/g,"_").replace(/@{1,}/g,"@").replace(/^\d+$/,"").split(" "))].filter(e=>{return e.startsWith("@")}).map(e=>{return e.replace("@","")})}
$ablaze.field.attags.dot=function(e){return[...new Set(e.toLowerCase().replace(/((?!([a-z0-9_\.@\s])).)/g,"").replace(/_{1,}/g,"_").replace(/\.{1,}/g,".").replace(/_\.{0,}/g,"_").replace(/\._{0,}/g,".").replace(/@{1,}/g,"@").replace(/^\d+$/,"").split(" "))].filter(e=>{return e.startsWith("@")}).map(e=>{return e.replace("@","")})}

$ablaze.field.int=function(e){return((e=(e=(e=e.split(".")[0]).replace(/((?!(^[-?]|[0-9])).)/g,"")).replace(/^[0]/,"")),(e=parseInt(e).toString()).replace(/^-0/,"-"))}
$ablaze.field.int.positive=function(e){return(e=(e=String(e)).replace(/^0/,"")).replace(/((?!([0-9])).)/g,"")};
$ablaze.field.int.negative=function(e){return((e=String(e)).length>0&&(e=(e=(e=e.replace(/^/,"-")).replace(/-{1,}/,"-")).replace(/^-0{1,}/,"-")),1==e.length&&(e=e.replace(/-/,"")),e.replace(/((?!(^[-?]|[0-9])).)/g,""))}
$ablaze.field.number=function(field,decimal){l=String(String(field).split(".")[1]).length;if(l&&!decimal){decimal=l} return $ablaze.number.float(field,decimal)}
$ablaze.field.float = function(field, decimal = 4) {
  return $ablaze.number.float(field, decimal).value;
};
$ablaze.field.currency = function(field) {
  return $ablaze.field.number(field, 2);
};
$ablaze.field.money = function(field) {
  return $ablaze.field.number(field, 2);
};
$ablaze.field.list = function(field, size = 10) {
  return field
    .reverse()
    .slice(0, size)
    .reverse();
};const AblazeMakeRecords = (t, e) => e.reduce((e, r) => ((e[r[t]] = r), e), {});
(AblazeMakeRecords.dynamicSort = (t) => {
  let e = 1;
  return (t[0] === '-' && ((e = -1), (t = t.substr(1))), function(r, _) {
    return (r[t] < _[t] ? -1 : r[t] > _[t] ? 1 : 0) * e
  })
}), (AblazeMakeRecords.dynamicSortMultiple = (...t) => function(e, r) {
  for (var _ = 0, n = 0, s = t.length; n === 0 && _ < s;)(n = AblazeMakeRecords.dynamicSort(t[_])(e, r)), _++;
  return n
}),
(AblazeMakeRecords.search_by = (t, e, r, _) => (_ ? t.filter((t) => String(t[e]).startsWith(String(r))) : t.filter((t) => String(t[e]).toLowerCase().includes(String(r).toLowerCase())))), (AblazeMakeRecords.search_by_not = (t, e, r, _) => (_ ? t.filter((t) => !String(t[e]).startsWith(String(r))) : t.filter((t) => !String(t[e]).toLowerCase().includes(String(r).toLowerCase()), ))),
(AblazeMakeRecords.group_by = function(t, e) {
  return t.reduce((t, r) => ((t[r[e]] = t[r[e]] || []).push(r), t), {})
});
AblazeMakeRecords.updates_only = function(e, t) {
  let r;
  let _;
  let n;
  let s;
  let i;
  if (JSON.stringify(e) === JSON.stringify(t)) return !1;
  for (r = [], _ = s = 0, i = t.length; s < i; _ = ++s)(n = t[_]), JSON.stringify(n) !== JSON.stringify(e[_]) && r.push(n);
  return r
};
AblazeMakeRecords.updated_values = function(original, updates) {
  const UPDATED = {};
  Object.keys(original).forEach((k) => {
    if (original[k] !== updates[k]) {
      UPDATED[k] = updates[k]
    }
  });
  return UPDATED
};
class AblazeBaseRecords {
  constructor(t) {
    this.list = t
  }
  get keys() {
    const t = this.list;
    return t.length > 0 ? Object.keys(t[0]) : []
  }
  head(t = 10) {
    return this.list.slice(0, t)
  }
  tail(t = 10) {
    return this.list.reverse().slice(0, t).reverse()
  }
  by(t = 'id') {
    return AblazeMakeRecords(t, this.list)
  }
  sort(...t) {
    return this.list.sort(AblazeMakeRecords.dynamicSortMultiple(...t), )
  }
  group_by(t = 'account_id') {
    return AblazeMakeRecords.group_by(this.list, t)
  }
  find(t, e) {
    return this.list.filter((r) => r[t] === e)
  }
  find_not(t, e) {
    return this.list.filter((r) => r[t] !== e)
  }
  search(t, e, r = !1) {
    let _ = [];
    return (t && typeof t === 'object' && t.constructor === Array ? t.forEach((t) => {
      _ = _.concat(AblazeMakeRecords.search_by(this.list, t, e, r), )
    }) : (_ = AblazeMakeRecords.search_by(this.list, t, e, r)), _)
  }
  search_not(t, e, r = !1) {
    let _ = [];
    return (t && typeof t === 'object' && t.constructor === Array ? t.forEach((t) => {
      _ = _.concat(AblazeMakeRecords.search_by_not(this.list, t, e, r), )
    }) : (_ = AblazeMakeRecords.search_by_not(this.list, t, e, r, )), _)
  }
  dirty(t) {
    const e = this.list;
    return AblazeMakeRecords.updates_only(e, t)
  }
  dirty_form(e, t) {
    return AblazeMakeRecords.updated_values(e, t)
  }
};
const AblazeRecords = (e = []) => new AblazeBaseRecords(e, null);

$ablaze.records = AblazeRecords;const store  = new Vuex.Store({});

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