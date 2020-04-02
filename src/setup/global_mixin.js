let BASE_URL    = `${ window.location.protocol }//${ window.location.hostname }:8012`
let THE_URL = `${ window.location.protocol }//${ window.location.hostname }`


Vue.store_abz('snackbar-copy', {
  color     : '',
  text      : '',
  mode      : '',
  active    : false,
  timeout   : 6000,
  x         : null,
  y         : 'top',
  close     : {
    color : "white",
    text  : "Close",
  },
});

Vue.store_abz('console_log', []);
console.print = function( msg ){
  var items = store.getters[`abz-console_log/value`];
  items.push( msg )
  store.dispatch(`abz-console_log/value`, items);
}

Vue.mixin({
  data: () => ({
    api         : {
      crud:{
        fullstack : `${ BASE_URL }/api/fullstack`,
        snippet   : `${ BASE_URL }/api/snippet`,
        db        :{
          path  : `${ BASE_URL }/database/export`,
          export: `${ BASE_URL }/database/database.db`,
          import: `${ BASE_URL }/database/import`,
        }
      },
      html_run : `${ BASE_URL }/html_live/run`,
      html_view: `${ BASE_URL }/html_live/view`,
      py_run   : `${ BASE_URL }/pylive/start`,
      py_stop  : `${ BASE_URL }/pylive/stop`,
      live_log : `${ BASE_URL }/pylive/view`,
    },
  }),

  created() {
  },

  mounted () {
  },

  computed:{

    console_log: {
      get: function () {
        return this.$abz.console_log.value
      },
      set: function (newValue) {
        var items     = [];
        if(typeof newValue === 'string'){
          items = newValue.split('\n');
        }else{
          items = newValue;
        }
        this.$abz.console_log.value = items;
      }
    },

    snackbar: {
      get: function () {
        return this.$abz['snackbar-copy'].value
      },
      set: function (newValue) {
        var form = this.$abz['snackbar-copy'].value;
        Object.keys(newValue).forEach(key => {
          form[key] = newValue[key]
        });
        this.$abz['snackbar-copy'].value = form;
      }
    },

    activeEditor: function(){
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

  },

  methods: {
    live_py_url : function(port){
      return `${ THE_URL }:${ port }`
    },
    copyText: function(text) {
      var node = document.getElementById("ABLAZE_COPY_TEXT_ID");
      node.innerHTML = text;
      node.select();
      document.execCommand("copy");
      node.innerHTML = "";
      this.snackbar = { color:"green", text: 'Successfully copied!', active: true, timeout: 1000 };
    },
    copyTextId: function(id) {
      var node = document.getElementById(id);
      this.copyText( node.innerHTML );
    },

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
  },
});
