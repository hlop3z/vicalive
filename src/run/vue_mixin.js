Vue.mixin({
  data: () => ({
    api         : {
      html_run : `${ window.location.protocol }//${ window.location.hostname }:8012/html_live/run`,
      html_view: `${ window.location.protocol }//${ window.location.hostname }:8012/html_live/view`,
      py_run   : `${ window.location.protocol }//${ window.location.hostname }:8012/pylive`,
      py_stop  : `${ window.location.protocol }//${ window.location.hostname }:8012/pylive/stop`,

    },
  }),

  created() {
  },

  mounted () {
  },

  computed:{
    activeEditor(){
      var lang = this.selected.lang;
      var py   = this.selected.py;
      var js   = this.selected.js;
      var sh   = this.selected.sh;
      var html = this.selected.html;
      if(lang==='python'){
        return `py-${ py }`
      }
      else if (lang==='javascript') {
        return `js-${ js }`
      }
      else if (lang==='html') {
        return `html-${ html }`
      }
      else if (lang==='sh') {
        return `sh-${ sh }`
      }
    },
    getConsoleLog(){
      return this.$store.getters[`abz-console_log/value`]
    }
  },

  methods: {
    isActive: function(value){
      return this.activeEditor === value;
    },
    setConsoleLog: async function(code){
      var items = [];
      eval( `console._log  = console.log;` );
      eval( `console.log  = function(msg){ items.push( msg ) };` );
      try {
        eval( `${ code }` );
      } catch (e) {
        var err = `Error at line[ ${ e.lineNumber } ]: ${ e.message }`;
        items.push( err );
      }
      eval( `console.log  = console._log;` );
      this.$store.dispatch(`abz-console_log/value`, items)
    },
    setConsoleLogApi: function(msg){
      var items     = [];
      msg.split('\n').forEach((item, i) => {
        items.push( item );
      });
      this.$store.dispatch(`abz-console_log/value`, items)
    }
  },
});
/*
const routes = [
    {
        path: "/",
        name: "home",
    },
];

const router = new VueRouter({
    routes,
    mode:''
});
*/
axios.defaults.withCredentials = true

Vue.use(Vuetify, {
  iconfont: 'mdi',
})


new Vue({
  el: '#app',
  //router,
  store,
  vuetify: new Vuetify()
});
