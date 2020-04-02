
const aceEditor = {
  template: `<pre :id=ID :style=theStyle @keyup="$emit('save')"></pre>`,
  sync:['lang', 'uid'],
    props: {
      font : { default: '20px' },
      code : { default: ''},
    },

    data: () => ({
      ID    : null,
      editor: null,
      theStyle:'',
    }),

    created() {
      var ID   = this.random_id_name();
      this.ID  = ID;
      this.uid = ID;
    },

    mounted () {
      var self    = this;
      var element = this.$el;
      this.registerAceEditor();
      element.style.fontSize = this.font;
      element.style.zIndex = 0;
      window.addEventListener("keyup", function(e) {
        var code = self.editor.getValue();
        self.code = code;
        self.$emit('update:code', code)
      }.bind(this));
      this.theStyle = `width:100%; height:100%; overflow: hidden; margin-bottom:`;
      this.editor.setValue( this.code );
    },
    computed:{
    },

    methods: {
      random_id_name(){
        function random(size=32, choices="0123456789abcdefghijklmnopqrstuvwxyz") {
          var text = "";
          var possible = choices;
          for (var i = 0; i < size; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
        };
        return `${ this.lang }-${ random() }`;
      },
      registerAceEditor: function(){
        var langTools = ace.require("ace/ext/language_tools");
        this.editor   = ace.edit( this.ID );
        this.editor.setTheme("ace/theme/monokai");
        this.editor.getSession().setMode(`ace/mode/${ this.lang }`);
        this.editor.setOptions({enableLiveAutocompletion: true});
      },
    },
  
};


const abzSideTop = {
  template: `<v-app-bar app clipped-left clipped-right dark dense fixed id=app-bar><v-spacer></v-spacer><v-btn @click="[ (active='fullstack') ]"><v-icon class=mr-1> mdi-package-variant </v-icon> Fullstack </v-btn><v-btn @click="[ (active='snippets') ]"><v-icon class=mr-1> mdi-clipboard-list-outline </v-icon> Snippets </v-btn><v-btn @click="[ (active='settings') ]"><v-icon class=mr-1> mdi-application-export </v-icon> Exp/Import </v-btn><v-spacer></v-spacer><v-btn @click="right = !right" color=white icon v-show="([ 'fullstack-editor', 'snippets-editor' ].includes( active ))"><v-icon dark> mdi-code-braces-box </v-icon></v-btn></v-app-bar>`,
  sync: [ 'active', 'right' ],
    props: {
    },

    data: () => ({
    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
    },

    methods: {
    },
  
};


const abzSideBottom = {
  template: `<v-footer app dark><div class=text-center style=width:100%;> Amda-M </div></v-footer>`,
  props: {
    },

    data: () => ({
    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
    },

    methods: {
    },
  
};


const tableBase = {
  template: `<v-data-table :headers=theHeaders :items=items :search=search :sort-by=sortBy.col :sort-desc=sortBy.desc class=elevation-4 fixed-header height=350px hide-default-footer><template v-slot:top><v-dialog v-model=dialog_delete width=500><v-card><v-card-text class=pt-5> Are you sure you want to delete ( <span class=black--text> ID: </span><strong class="red--text accent-4"> {{ active_id }} </strong> — <strong class="red--text accent-4"> {{ active_name }} </strong> ) ? </v-card-text><v-divider></v-divider><v-card-actions class=black><v-spacer></v-spacer><v-btn @click="[(dialog_delete = false)]" color=red text> no </v-btn><v-btn @click="[(dialog_delete = false), $emit('delete', active_id)]" color=green text> yes </v-btn></v-card-actions></v-card></v-dialog></template><template v-slot:item.actions="{ item }"><v-btn @click="$emit('update', item.id)" color=blue icon x-small><v-icon dark> mdi-pencil </v-icon></v-btn><v-icon @click="deleteItem(item.id, item.name)" class=ml-3 color="red accent-4" small> mdi-delete </v-icon></template></v-data-table>`,
  sync:['search', 'sort'],

    props:{
      items         : { type: Array, default: [] },
      show          : { type: Array, default: null },
      hide          : { type: Array, default: null },
      headers       : { type: Object, default: null },
      headerClass   : { type: String, default: 'blue dark' }
    },

    data: () => ({
      active_id  : null,
      active_name: null,
      dialog_delete: false,
    }),

    created () {
    },

    mounted() {
    },

    computed: {
      sortBy(){
        return {
          desc: this.sort.startsWith('-'),
          col : this.sort.replace('-','')
        }
      },
      theHeaders(){
        var output = []
        if(this.headers){
          this.headers.forEach(col => {
            col.class = this.headerClass;
          });
          output.push(...this.headers);
          output.push({
            value   : 'actions',
            text    : 'Actions',
            sortable: false,
            class   : this.headerClass,
          });
          return output
        }else if(this.show){
          this.show.forEach(key => {
            output.push({
              value   : key,
              text    : (key==='id') ? $ablaze.filter.upper(key) : $ablaze.filter.title(key),
              class   : this.headerClass,
            });
          });
          output.push({
            value   : 'actions',
            text    : 'Actions',
            sortable: false,
            class   : this.headerClass,
          });
          return output
        }
      }
    },

    methods: {
      deleteItem: function(id, name){
        this.active_id     = id;
        this.active_name   = name;
        this.dialog_delete = true;
      },

    },
  
};


const DynamicTable = {
  template: `<v-container fluid><v-toolbar flat><v-icon class="mt-1 mr-2" color=black large> {{ icon }} </v-icon><v-toolbar-title class="display-1 font-weight-black"> {{ title }} </v-toolbar-title><v-btn :color=headerColor :dark=dark @click="$emit('create')" class="mx-2 ml-4" fab x-small><v-icon dark> mdi-plus </v-icon></v-btn><v-spacer></v-spacer><v-text-field append-icon=mdi-magnify hide-details label=Search single-line v-model=search></v-text-field></v-toolbar><table-base :header-class=headerClass :search.sync=search :sort.sync=sort @delete="id=>$emit('delete', id)" @update="id=>$emit('update', id)" class="mt-5 table-row-ablaze" item-key=id v-bind=$attrs></table-base></v-container>`,
  sync:['sort'],
    props: {
      icon: String,
      title: String,
      headerColor: String,
      dark: {type:Boolean, default: false },
    },

    data: () => ({
      search:"",
      items : [],
      headers:[
        {
          value : 'name',
          text  : 'Dessert (100g serving)',
          align : 'start',
        },
        {
          value : 'calories',
          text  : 'Calories',
        },
        {
          value   : 'fat',
          text    : 'Fat (g)',
        },
        {
          value   : 'carbs',
          text    : 'Carbs (g)',
        },
        {
          value   : 'protein',
          text    : 'Protein (g)',
        },
      ]
    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
      headerClass(){
        return `${ this.headerColor } ${ this.dark ? 'dark' : '' }`
      }
    },

    methods: {
    },
  
};


const abzSnackbar = {
  template: `<v-snackbar :bottom="snackbar.y === 'bottom'" :color=snackbar.color :left="snackbar.x === 'left'" :multi-line="snackbar.mode === 'multi-line'" :right="snackbar.x === 'right'" :timeout=snackbar.timeout :top="snackbar.y === 'top'" :vertical="snackbar.mode === 'vertical'" v-model=snackbar.active> {{ snackbar.text }} <v-btn :color=snackbar.close.color @click="snackbar.active = false" text> {{ snackbar.close.text }} </v-btn></v-snackbar>`,
  props: {
    },

    data: () => ({
    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{

    },

    methods: {
    },
  
};


const abzFullstackLog = {
  template: `<div class=text-center><v-dialog fullscreen persistent scrollable v-model=dialog><v-card><v-card-title class="purple darken-4 white--text" primary-title><v-spacer></v-spacer><span :style="(server ? '' : 'text-decoration: underline;')"> {{ server ? ('Server at ') : 'Server-Log' }} </span><a :href=url class="ml-3 white--text" v-show=server> {{ url }} </a><v-spacer></v-spacer><v-btn @click="dialog = false" class=ml-3 color=white outlined> Close </v-btn></v-card-title><iframe :src=url style="width:100%; height:100%;" v-if=server></iframe><v-card-text class=text-left v-else><template v-for="item in items"> {{ item }} <v-divider></v-divider></template></v-card-text></v-card></v-dialog></div>`,
  sync: ['dialog', 'server', 'port'],
    props: {
    },

    data: () => ({
      live_log : "",
    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
      items(){
        var log = this.log();
        if(log){
          return log.split('\n')
        }else{
          return []
        }
      },
      url(){
        return this.live_py_url(this.port)
      }
    },

    methods: {
      log(){
        var self = this;
        axios.get( this.api.live_log ).then(response=>{
          var data = response.data;
          self.live_log = data;
        })
        return this.live_log
      }
    },
  
};


const abzFullstackEditors = {
  template: `<div><ace-editor :code.sync=codes.python :uid.sync=py_live @save="$emit('save')" lang=python v-show="isActive('py-live')"></ace-editor><ace-editor :code.sync=codes.javascript :uid.sync=js_live @save="$emit('save')" lang=javascript v-show="isActive('js-live')"></ace-editor><ace-editor :code.sync=codes.js.vue :uid.sync=js_vue @save="$emit('save')" lang=javascript v-show="isActive('js-vue')"></ace-editor><ace-editor :code.sync=codes.html.live :uid.sync=html_live @save="$emit('save')" lang=html v-show="isActive('html-live')"></ace-editor><ace-editor :code.sync=codes.html.server :uid.sync=html_server @save="$emit('save')" lang=html v-show="isActive('html-server')"></ace-editor><ace-editor :code.sync=codes.sh.live :uid.sync=sh_live @save="$emit('save')" lang=sh v-show="isActive('sh-live') "></ace-editor><ace-editor :code.sync=codes.sh.script :uid.sync=sh_script @save="$emit('save')" lang=sh v-show="isActive('sh-script') "></ace-editor><ace-editor :code.sync=codes.py.sanic :uid.sync=py_sanic @save="$emit('save')" lang=python v-show="isActive('py-sanic')"></ace-editor><ace-editor :code.sync=codes.py.cherrypy :uid.sync=py_cherrypy @save="$emit('save')" lang=python v-show="isActive('py-cherrypy')"></ace-editor><ace-editor :code.sync=codes.py.quartpy :uid.sync=py_quartpy @save="$emit('save')" lang=python v-show="isActive('py-quartpy')"></ace-editor></div>`,
  sync: [ 'selected', 'codes', 'ids' ],
    props: {
    },

    data: () => ({
      js_live     : null,
      js_vue      : null,
      py_live     : null,
      py_cherrypy : null,
      py_quartpy  : null,
      py_sanic    : null,
      html_server : null,
      html_live   : null,
      sh_script   : null,
      sh_live     : null,
    }),

    created() {
    },

    mounted () {
      this.ids={
        'js-live'     : this.js_live,
        'js-vue'      : this.js_vue,
        'py-live'     : this.py_live,
        'py-cherrypy' : this.py_cherrypy,
        'py-quartpy'  : this.py_quartpy,
        'py-sanic'    : this.py_sanic,
        'html-server' : this.html_server,
        'html-live'   : this.html_live,
        'sh-script'   : this.sh_script,
        'sh-live'     : this.sh_live,
      }
      var element = this.$el;
    },

    computed:{
    },

    methods: {
    },
  
};


const abzFullstackBar = {
  template: `<v-toolbar dense><v-radio-group class=mt-5 row v-model=selected.js v-show="(selected.lang==='javascript')"><v-icon :color=colors.js class=mr-2> {{ icons.js }} </v-icon><v-radio :color=colors.js label=Live value=live></v-radio><v-radio :color=colors.js label=Vue value=vue></v-radio></v-radio-group><v-radio-group class=mt-5 row v-model=selected.py v-show="(selected.lang==='python')"><v-icon :color=colors.py class=mr-2> {{ icons.py }} </v-icon><template v-if=linux><v-radio :color=colors.py label=Live value=live></v-radio><v-radio :color=colors.py label=Sanic value=sanic></v-radio></template><v-radio :color=colors.py label=Cherrypy value=cherrypy></v-radio><v-radio :color=colors.py label=Quart value=quartpy></v-radio></v-radio-group><v-radio-group class=mt-5 row v-model=selected.html v-show="(selected.lang==='html')"><v-icon :color=colors.html class=mr-2> {{ icons.html }} </v-icon><v-radio :color=colors.html label=Live value=live></v-radio><v-radio :color=colors.html label=Server value=server></v-radio></v-radio-group><v-radio-group class=mt-5 row v-model=selected.sh v-show="(selected.lang==='sh')"><v-icon :color=colors.sh class=mr-2> {{ icons.sh }} </v-icon><v-radio :color=colors.sh label=Live value=live></v-radio><v-radio :color=colors.sh label=Script value=script></v-radio></v-radio-group><v-spacer></v-spacer><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn :color=colors.py @click="setSelectedLang('python')" icon v-on=on><v-icon> {{ icons.py }} </v-icon></v-btn></template><span> Python </span></v-tooltip><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn :color=colors.js @click="setSelectedLang('javascript')" icon v-on=on><v-icon> {{ icons.js }} </v-icon></v-btn></template><span> Javascript </span></v-tooltip><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn :color=colors.html @click="setSelectedLang('html')" icon v-on=on><v-icon> {{ icons.html }} </v-icon></v-btn></template><span> HTML </span></v-tooltip><v-tooltip bottom v-if=linux><template v-slot:activator="{ on }"><v-btn :color=colors.sh @click="setSelectedLang('sh')" icon v-on=on><v-icon> {{ icons.sh }} </v-icon></v-btn></template><span> Shell </span></v-tooltip><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="dialog=true" color="grey darken-3" icon v-on=on><v-icon> {{ icons.info }} </v-icon></v-btn></template><span> Script Details </span></v-tooltip></v-toolbar>`,
  sync:['selected', 'linux', 'dialog'],
    props: {
    },

    data: () => ({
      icons:{
        py  : 'mdi-language-python',
        js  : 'mdi-language-javascript',
        html: 'mdi-language-html5',
        sh  : 'mdi-code-greater-than-or-equal',
        info: 'mdi-information-outline',
      },
      colors:{
        py  : 'blue',
        js  : 'yellow darken-3',
        html: 'deep-orange darken-2',
        sh  : 'light-green darken-4',
      },
    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
    },

    methods: {
      setSelectedLang: function(lang){
        this.selected.lang = lang;
      },
    },

  
};


const abzFullstackRun = {
  template: `<v-card class=mx-auto max-width=145px style="position: absolute; left:50%; top:0px; z-index: 10;"><v-toolbar dense flat><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="$emit('copy')" color="purple accent-4" icon v-on=on><v-icon> mdi-content-copy </v-icon></v-btn></template><span> Copy </span></v-tooltip><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="$emit('run')" color="green accent-4" icon v-on=on><v-icon> mdi-play </v-icon></v-btn></template><span> Run </span></v-tooltip><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="$emit('stop')" color="red accent-4" icon v-on=on><v-icon> mdi-stop </v-icon></v-btn></template><span> Stop </span></v-tooltip></v-toolbar></v-card>`,
  props: {
    },

    data: () => ({
    }),

    created() {
    },

    mounted () {
    },

    computed:{
    },

    methods: {
    },
  
};


const abzFullstackInfo = {
  template: `<v-dialog max-width=100% persistent scrollable v-model=dialog><abz-fullstack-links :dialog.sync=links_dialog :items.sync=links></abz-fullstack-links><v-card><v-card-title class="black white--text"><span class=headline> Script Details </span><v-spacer></v-spacer><v-tooltip left><template v-slot:activator="{ on }"><v-btn @click="links_dialog=true" color="light-blue darken-1" icon v-on=on><v-icon> mdi-file-link-outline </v-icon></v-btn></template><span><strong> Resources </strong> - <small> URLs of Tutorials, etc... </small></span></v-tooltip></v-card-title><v-card-text><v-text-field label=Name required v-model=form.name></v-text-field><v-combobox chips disable-lookup hide-selected label=Tags multiple small-chips v-model=form.tags></v-combobox><v-textarea label=Info no-resize outlined rows=2 v-model=form.info></v-textarea><v-textarea label=Notes no-resize outlined rows=5 v-model=form.notes></v-textarea></v-card-text><v-card-actions class="black white--text"><v-spacer></v-spacer><v-btn @click=closeAndSave color=green text> Save </v-btn></v-card-actions></v-card></v-dialog>`,
  sync:['dialog', 'form', 'links'],

    data: () => ({
      links_dialog: false,
    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
    },

    methods: {
      closeAndSave: function(){
        this.dialog=false;
        this.$emit('save');
      },
    },
  
};


const abzFullstackOutput = {
  template: `<div style=height:100%;><h1 v-show=active_live><span style="text-decoration: underline;"> The Output: </span><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="$emit('copy')" color="purple accent-4" icon v-on=on><v-icon> mdi-content-copy </v-icon></v-btn></template><span> Copy </span></v-tooltip></h1><v-card class="mx-auto overflow-y-auto text-left pa-5" elevation=4 max-width=95% style="max-height: 450px;" v-show="active_live && console_log.length > 0"><template v-for="item in console_log"> {{ item }} <v-divider></v-divider></template></v-card><div class=mt-1 v-show=active_example><h1><span style="text-decoration: underline;"> Example: </span><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="copyText( activeExample )" color="purple accent-4" icon v-on=on><v-icon> mdi-content-copy </v-icon></v-btn></template><span> Copy </span></v-tooltip></h1><div class=mt-2 style=width:100%; v-show="['py-sanic','py-cherrypy','py-quartpy'].includes(activeEditor)"><v-text-field dense label=Port outlined style="width: 80px; display: inline-block;" v-model=server_port></v-text-field><v-btn @click="[(dialog_log=true),(dialog_log_server=false)]" color=primary small text><span style="text-decoration: underline;"> Log </span><v-icon small> mdi-open-in-new </v-icon></v-btn><v-btn @click="[(dialog_log=true),(dialog_log_server=true)]" color=primary small text><span style="text-decoration: underline;"> Server </span><v-icon small> mdi-open-in-new </v-icon></v-btn></div><abz-fullstack-log :dialog.sync=dialog_log :key=Date.now() :port.sync=server_port :server.sync=dialog_log_server></abz-fullstack-log><v-card class="ml-2 mr-2" elevation=4 v-show="['py-sanic'].includes( activeEditor )"><pre :class=preExampleClass style="max-height: 375px">{{ sanicExample }}</pre></v-card><v-card class="ml-2 mr-2 mt-2" elevation=4 v-show="['py-cherrypy'].includes( activeEditor )"><pre :class=preExampleClass style="max-height: 375px">{{ cherryExample }}</pre></v-card><v-card class="ml-2 mr-2 mt-2" elevation=4 v-show="['py-quartpy'].includes( activeEditor )"><pre :class=preExampleClass style="max-height: 375px">{{ quartExample }}</pre></v-card><v-card class="ml-2 mr-2 mt-2" elevation=4 v-show="['js-vue'].includes( activeEditor )"><pre :class=preExampleClass style="max-height: 375px">{{ vueExample }}</pre></v-card></div><component :key=Date.now() class=text-left v-bind:is=htmlVueLive v-show="(['html-live'].includes(activeEditor) && code.html.live)"></component><div class=mt-5 v-show="(['html-live'].includes(activeEditor) && !code.html.live)"><h1><span style="text-decoration: underline;"> Design Component: </span></h1><code @click="copyText( activeExample )" class=mt-5 style="font-size : 20px; width : 260px; cursor: pointer;"> &lt;h1&gt;Click Me&lt;/h1&gt; </code></div><div class="text-center pa-5" style="font-size:18px; width:100%;" v-show="( ['html-server'].includes(activeEditor) )"><span class=mr-5><strong style="text-decoration: underline;"> Setup </strong></span><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="htmlDialog('head')" color=primary v-on=on><v-icon> mdi-less-than </v-icon> Head <v-icon> mdi-greater-than </v-icon></v-btn></template><span> Setup Custom HTML &lt;head&gt;&lt;/head&gt; </span></v-tooltip><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="htmlDialog('body')" class=ml-5 color=primary v-on=on><v-icon> mdi-less-than </v-icon> Scripts <v-icon> mdi-greater-than </v-icon></v-btn></template><span> Setup Custom HTML Scripts &lt;body&gt;&lt;/body&gt; </span></v-tooltip><abz-fullstack-custom-html :dialog.sync=custom_html_dialog :html.sync=code.html :part.sync=custom_html_part></abz-fullstack-custom-html><pre class="pink--text text-left mt-5" style="font-size:12px; border: 2px solid grey; padding:4px;" v-html=htmlServerExample></pre></div></div>`,
  sync: [ 'selected', 'html' , 'code' ],

    props: {
    },

    data: () => ({
      custom_html_dialog : false,
      custom_html_part   : null,
      dialog_log         : false,
      dialog_log_server  : true,
      server_port        : 8013,
    }),

    created() {
    },

    mounted () {
    },

    methods: {
      htmlDialog(part){
        this.custom_html_dialog=true;
        this.custom_html_part=part;
      },
    },

    computed:{
      preExampleClass(){
        return 'pa-2 pink--text darken-2 text-left overflow-y-auto'
      },
      active_live(){
        return ['sh-script', 'sh-live', 'js-live', 'py-live'].includes( this.activeEditor )
      },
      active_example(){
        return ['py-sanic', 'py-cherrypy', 'py-quartpy', 'js-vue' ].includes( this.activeEditor )
      },



      htmlVueLive(){
        var obj = {};
        var vue_obj;
        try {
          vue_obj = eval(`(function(){ return ${ this.code.js.vue.replace('const', '',1) } })();`);
        } catch (e) {
          vue_obj = {};
        }
        obj = Object.assign(obj, vue_obj);
        try {
          obj = Object.assign(obj, { template : this.code.html.live });
        } catch (e) {
        }
        return obj
    },

      activeExample(){
        switch (this.activeEditor) {
          case 'py-sanic':
            return this.sanicExample;
            break;
          case 'py-cherrypy':
            return this.cherryExample;
            break;
          case 'py-quartpy':
            return this.quartExample;
            break;
          case 'js-vue':
            return this.vueExample;
            break;
          case 'html-live':
            return `<h1>Click Me</h1>`;
            break;
          default:
            return ''
        }
      },


      sanicExample(){
        return `from sanic import Sanic
from sanic import response
from sanic_cors import CORS

app = Sanic('test_sanic')
CORS(app, automatic_options=True, supports_credentials=True)

@app.route('/')
async def app_root(request):
    return response.json({ 'message': 'Hello World < Sanic >!' })

@app.post('/create')
async def app_create(request):
    return response.json({ 'data': request.json })

@app.post('/update')
async def app_update(request):
    return response.json({ 'data': request.json })

@app.post('/delete')
async def app_delete(request):
    return response.json({ 'data': request.json })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8013)`
    },

    cherryExample(){
      return `import cherrypy
import cherrypy_cors

class app(object):
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def index(self, **params):
        return {"message": "Hello World < CherryPY >!"}

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def json(self, **params):
        data = cherrypy.request.json
        return data

    # DO NOT ERASE
    @classmethod
    def run(cls, host='0.0.0.0', port=8013):
        cherrypy_cors.install()
        cherrypy.config.update({
            'server.socket_host': host,
            'server.socket_port': port,
        })
        config = {
            '/': {
                'cors.expose.on': True,
            },
        }
        cherrypy.quickstart(cls(), config=config)


app.run(host='0.0.0.0', port=8013)`},

    quartExample(){
      return `from quart import Quart, websocket, request
from quart_cors import cors

app = Quart('test_quart')
app = cors(
    app,
    allow_origin="http://localhost:8012",
    allow_methods=["GET", "POST"],
    allow_credentials=True,
)

@app.route("/")
async def app_root():
    return {"message": "Hello World < Quart >!"}

@app.route('/create', methods=['POST'])
async def app_create():
    request_json =  await request.get_json()
    return { 'data': request_json }

@app.route('/update', methods=['POST'])
async def app_update():
    request_json =  await request.get_json()
    return { 'data': request_json }

@app.route('/delete', methods=['POST'])
async def app_delete():
    request_json =  await request.get_json()
    return { 'data': request_json }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8013)`
        },

    vueExample(){
      return `const Component = {
  props:[],

  data: () => ({
    msg : "",
  }),

  created() {
  },

  mounted () {
    // this.axiosNoCredits();
    // this.axiosCredits();
  },

  computed:{
  },

  methods: {
    axiosNoCredits: function(){
      var self = this;
      axios.get('http://localhost:8013').then(res=>{
          self.msg = res.data.message
      });
    },
    axiosCredits: function(){
      var self = this;
      $http.get('http://localhost:8013').then(res=>{
          self.msg = res.data.message
      });
    },
  },
}`},

      htmlServerExample(){
        return `&lt;!doctype html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  <span style="font-size:15px;">&lt;!-- [<strong>START HEAD EXAMPLE</strong>] --&gt;</span>

  &lt;meta charset="utf-8"&gt;
  &lt;link href="css/styles.css?v=1.0" rel="stylesheet"&gt;

  <span style="font-size:15px;">&lt;!-- [<strong>END HEAD EXAMPLE</strong>] --&gt;</span>

&lt;/head&gt;

&lt;body&gt;

  <span style="font-size:15px;">&lt;!-- [<strong>START SCRIPTS EXAMPLE</strong>] --&gt;</span>

  &lt;script src="js/scripts.js"&gt;&lt;/script&gt;

  <span style="font-size:15px;">&lt;!-- [<strong>END SCRIPTS EXAMPLE</strong>] --&gt;</span>
&lt;/body&gt;
&lt;/html&gt;`
      },
    },

  
};


const abzFullstackLinks = {
  template: `<v-dialog persistent scrollable v-model=dialog width=700><v-card><v-card-title class="light-blue darken-1 white--text"><v-btn @click="( ((action !== 'edit') && (items.length > 0)) ? (action = 'edit') : (action = 'view') )" class=mr-2 dark icon text><v-icon dark> {{ (action !== 'edit') ? 'mdi-marker' : 'mdi-eye' }} </v-icon></v-btn> Resources <small class=ml-2> {{ (action === 'edit') ? '( Editing )' : '' }} </small><v-spacer></v-spacer><v-btn @click=closeAndSave dark icon text><v-icon dark> mdi-close </v-icon></v-btn></v-card-title><v-card-text><v-list v-show="(action === 'view')"><template v-for="(item, index) in items"><v-list-item :key=item.id @click="actionEdit( item.id )"><v-list-item-content><v-list-item-subtitle><strong class=black--text> {{ item.title }} </strong> — <span class=blue--text> {{ item.link }} </span></v-list-item-subtitle></v-list-item-content></v-list-item><v-divider></v-divider></template></v-list><v-list v-show="(action === 'edit')"><template v-for="(item, index) in items"><v-list-item :key=item.id @click="actionEdit( item.id )"><v-list-item-content><v-list-item-subtitle><strong class=black--text> {{ item.title }} </strong> — <span class=blue--text> {{ item.link }} </span></v-list-item-subtitle></v-list-item-content></v-list-item><v-divider></v-divider></template></v-list></v-card-text><v-divider></v-divider><v-card-actions><v-text-field @keyup=autoUpdate label=Title outlined placeholder="Give the link a Title." style=width:25%; v-model=form.title></v-text-field><v-text-field @keyup=autoUpdate class="ml-1 mr-1" label=Link outlined placeholder="For example -> http://github.com" style=width:65%; v-model=form.link></v-text-field><v-spacer></v-spacer><v-btn :color="( (action === 'edit') ? 'red darken-1' : 'light-blue darken-1' )" @click=createDelete dark fab small style=margin-top:-25px;><v-icon dark> {{ (action === 'edit') ? 'mdi-minus' : 'mdi-plus' }} </v-icon></v-btn><v-spacer></v-spacer></v-card-actions></v-card></v-dialog>`,
  sync:['dialog', 'items'],
    props: {
    },

    data: () => ({
      action: 'view',
      form :{
        id: null,
        title: '',
        link : '',
      },
    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
    },

    methods: {
      closeAndSave: function(){
        this.dialog = false;
      },
      autoUpdate: function(){
        return (this.form.id && (this.action === 'edit')) ? this.actionSave() : null
      },
      createDelete: function(){
        return (this.action === 'edit') ? this.actionDelete() : this.actionCreate()
      },
      actionCreate: function(){
        if(this.form.link !== ""){
          var self    = this;
          var id      = $ablaze.random.alphanum(16);
          var records = AblazeRecords( this.items ).by('id');
          var created = false;
          function newRecord(_id){
            self.items.push({
              id    : _id,
              title : self.form.title,
              link  : self.form.link,
            });
            self.form.title = "";
            self.form.link  = "";
          }
          while (!created) {
            if(!records[ id ]){
              newRecord( id );
              created = true;
            }else{
              id = $ablaze.random.alphanum(16);
            }
          }
        }
      },
      actionEdit  : function(id){
        var records     = AblazeRecords( this.items ).by('id');
        var item        = records[ id ];
        this.form.id    = id;
        this.form.title = item.title;
        this.form.link  = item.link;
      },
      actionSave  : function(){
        var records = AblazeRecords( this.items ).by('id');
        if(this.form.id){
          var item     = records[ this.form.id ];
          item.title   = this.form.title;
          item.link    = this.form.link;
          this.items   = Object.values( records );
          }
      },
      actionDelete: function(){
        var records = AblazeRecords( this.items ).by('id');
        delete records[ this.form.id ];
        this.items      = Object.values( records );
        this.form.id    = null;
        this.form.title = null;
        this.form.link  = null;
      },
    },
  
};


const abzFullstackCustomHtml = {
  template: `<div><v-dialog fullscreen v-model=dialog><v-card><v-card-title class="deep-purple darken-4 white--text" primary-title> Setup scripts inside... <v-spacer></v-spacer> &lt;{{ part }}&gt;&lt;/{{ part }}&gt; <v-spacer></v-spacer><v-btn @click="dialog = false" color=white outlined> Save </v-btn></v-card-title><v-card-text class=mt-4 style=height:500px;><ace-editor :code.sync=html.head class=mt-5 lang=html style="height:100%; width:100%;" v-show="(part==='head')"></ace-editor><ace-editor :code.sync=html.script class=mt-5 lang=html v-show="(part==='body')"></ace-editor></v-card-text></v-card></v-dialog></div>`,
  sync:["dialog", "part", "html"],
    props: {
    },

    data: () => ({
    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
    },

    methods: {
    },
  
};


const abzFullstack = {
  template: `<div style="width:100%; height:100%; overflow: hidden;"><div style="overflow:hidden; height:50px;"><abz-fullstack-bar :dialog.sync=info_dialog :linux.sync=linux :selected.sync=selected></abz-fullstack-bar><abz-fullstack-run @copy="copyText( copyActiveEditor )" @run=runCode @stop=stopCode></abz-fullstack-run></div><abz-fullstack-editors :codes.sync=form.snippets :ids.sync=ids :selected.sync=selected @save="$emit('save')" class="ml-2 mr-2 mt-1" style="overflow:hidden; height:89%;"></abz-fullstack-editors><abz-fullstack-info :dialog.sync=info_dialog :form.sync=form :links.sync=form.links @save="$emit('save')"></abz-fullstack-info><v-dialog fullscreen v-model=html_live_dialog><v-card style="height:100%; overflow:hidden"><v-card-title class="ma-0 pa-0 black white--text" style=height:5%;><div class=text-center style=width:100%;> HTML - Live <v-btn @click="html_live_dialog=false" class=ml-3 color=red outlined style=margin-top:-5.5px; x-small> close </v-btn></div></v-card-title><v-card-text :key="new Date().getTime()" class="ma-0 pa-0" style=height:95%;><iframe :src=api.html_view style="width:100%; height:100%;"></iframe></v-card-text></v-card></v-dialog></div>`,
  sync: [ 'selected', 'linux', 'form'],
    props: {
    },

    data: () => ({
      ids               : {},
      html_live_dialog  : false,
      info_dialog       : false,
      web_worker        : undefined,
      checklivepy       : null,
    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
      copyActiveEditor(){
        if( this.isActive('py-live') ){
          return this.form.snippets.python
        }
        else if( this.isActive('py-sanic') ){
          return this.form.snippets.py.sanic
        }
        else if( this.isActive('py-cherrypy') ){
          return this.form.snippets.py.cherrypy
        }
        else if( this.isActive('py-quartpy') ){
          return this.form.snippets.py.quartpy
        }
        else if( this.isActive('js-live') ){
          return this.form.snippets.javascript
        }
        else if( this.isActive('js-vue') ){
          return this.form.snippets.js.vue
        }
        else if( this.isActive('sh-live') ){
          return this.form.snippets.sh.live
        }
        else if( this.isActive('sh-script') ){
          return this.form.snippets.sh.script
        }
        else if( this.isActive('html-live') ){
          return this.form.snippets.html.live
        }
        else if( this.isActive('html-server') ){
          return this.form.snippets.html.server
        }
        else if( this.isActive('html-head') ){
          return this.form.snippets.html.head
        }
        else if( this.isActive('html-script') ){
          return this.form.snippets.html.script
        }
      },
    },

    methods: {
      runCode: function(){
        let url_run  = ( action ) => `${ this.api.py_run }/${ action }`
        let url_html = `${ this.api.html_run }`
        this.console_log = [];

        if (this.isActive('js-live')) {
          var code  = this.form.snippets.javascript;
          try {
            eval( `console.log=console.print; ${ code }` );
            eval( `console.log=console._log;` );
          } catch (e) {
            var err = `Error at line[${ e.lineNumber }]: ${ e.message }`;
            console.print(err)
          }
        }
        else if (this.isActive('html-server')) {
          var self    = this;
          var code    = {
            head   : this.form.snippets.html.head,
            body   : this.form.snippets.html.server,
            scripts: this.form.snippets.html.script,
          }
          axios.post(url_html, { data : code }).then(response=>{
            self.html_live_dialog=true;
          });
        }
        else if (this.isActive('py-live')) {
          var self    = this;
          var action  = "live";
          var code    = this.form.snippets.python;
          axios.post(url_run(action), { data : code }).then(response=>{
            self.console_log = ( response.data )
          });
        }
        else if (this.isActive('py-sanic')) {
          var self    = this;
          var action  = "sanic";
          var code    = this.form.snippets.py.sanic;
          axios.post(url_run(action), { data : code }).then(response=>{
          });
        }
        else if (this.isActive('py-cherrypy')) {
          var self    = this;
          var action  = "cherrypy";
          var code    = this.form.snippets.py.cherrypy;
          axios.post(url_run(action), { data : code }).then(response=>{
          });
        }
        else if (this.isActive('py-quartpy')) {
          var self    = this;
          var action  = "quart";
          var code    = this.form.snippets.py.quartpy;
          axios.post(url_run(action), { data : code }).then(response=>{
          });
        }
        else if (this.isActive('sh-live')) {
          var self    = this;
          var action  = "shell";
          var code    = this.form.snippets.sh.live;
          axios.post(url_run(action), { data : code }).then(response=>{
            self.console_log = ( response.data )
          });
        }
        else if (this.isActive('sh-script')) {
          var self    = this;
          var action  = "sh";
          var code    = this.form.snippets.sh.script;
          axios.post(url_run(action), { data : code }).then(response=>{
            self.console_log = ( response.data )
          });
        }

      },

      stopCode: function(){
        let url  = ( action ) => `${ this.api.py_stop }/${ action }`

        if (this.isActive('py-live')) {
          axios.get(url('live')).then(response=>{ });
        }
        else if ( this.isActive('py-sanic') || this.isActive('py-cherrypy') || this.isActive('py-quartpy') ) {
          axios.get(url('server')).then(response=>{ });
        }
        else if (this.isActive('sh-live') || this.isActive('sh-script')) {
          axios.get(url('shell')).then(response=>{ });
        }

      },

    },
  
};


const abzSnippetBar = {
  template: `<v-toolbar><v-spacer v-show="!(['javascript', 'python', 'sh'].includes( selected ))"></v-spacer><div v-show="['javascript', 'python', 'sh'].includes( selected )"><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="$emit('copy')" color="purple accent-4" icon v-on=on><v-icon> mdi-content-copy </v-icon></v-btn></template><span> Copy </span></v-tooltip><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="$emit('run')" color="green accent-4" icon v-on=on><v-icon> mdi-play </v-icon></v-btn></template><span> Run </span></v-tooltip><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="$emit('stop')" color="red accent-4" icon v-on=on><v-icon> mdi-stop </v-icon></v-btn></template><span> Stop </span></v-tooltip></div><v-spacer></v-spacer><v-autocomplete :items=allowed_langs color=white hide-details label=Language v-model=selected></v-autocomplete><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="dialog=true" color="grey darken-3" icon v-on=on><v-icon> mdi-information-outline </v-icon></v-btn></template><span> Script Details </span></v-tooltip></v-toolbar>`,
  sync:['selected', 'dialog'],
    props: {
    },

    data: () => ({
      allowed_langs:[],
      langs : [
          "javascript",
          "html",
          "sh",
          "css",
          "json",
          "mysql",
          "pgsql",
          "sql",
          "batchfile",
          "powershell",
          "makefile",
          "nginx",
          "dockerfile",
          "markdown",
          "text",
      ]
    }),

    created() {
      if(isLinux){
        this.allowed_langs.push('python')
      }
      this.allowed_langs.push(...(this.langs));
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
    },

    methods: {
    },

  
};


const abzSnippetOutput = {
  template: `<div><h1 v-show="['python','javascript','sh'].includes(selected)"><span style="text-decoration: underline;"> The Output: </span><v-tooltip bottom><template v-slot:activator="{ on }"><v-btn @click="$emit('copy')" color="purple accent-4" icon v-on=on><v-icon> mdi-content-copy </v-icon></v-btn></template><span> Copy </span></v-tooltip></h1><h1 v-show="['html'].includes(selected)"><span style="text-decoration: underline;"> Design: </span></h1><component :key=Date.now() class=text-left v-bind:is=htmlVueLive v-show="(['html'].includes(selected) && code)"></component><v-card class="mx-auto overflow-y-auto text-left pa-5" elevation=4 max-width=95% style="max-height: 450px;" v-show="['python','javascript','sh'].includes(selected) && console_log.length > 0"><template v-for="item in console_log"> {{ item }} <v-divider color=blue></v-divider></template></v-card></div>`,
  sync:['selected', 'code'],
    props: {
    },

    data: () => ({
    }),

    created() {
    },

    mounted () {
    },

    computed:{
      htmlVueLive(){
        var obj = {};
        try {
          obj = Object.assign(obj, { template : this.code });
        } catch (e) {
        }
        return obj
      },
    },

    methods: {
    },
  
};


const abzSnippet = {
  template: `<div style="overflow:hidden; height:100%;"><abz-snippet-bar :dialog.sync=info_dialog :selected.sync=selected @copy="copyText( form.snippet )" @run=runCode @stop=stopCode></abz-snippet-bar><div class="ml-2 mr-2 mt-1" style="overflow:hidden; height:86%;"><ace-editor :code.sync=form.snippet :key=selected :lang.sync=selected @save="$emit('save')"></ace-editor></div><abz-fullstack-info :dialog.sync=info_dialog :form.sync=form :links.sync=form.links @save="$emit('save')"></abz-fullstack-info></div>`,
  sync: ['selected', 'form'],
    props: {
    },

    data: () => ({
      info_dialog : false,
    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
    },

    methods: {
      isActive: function(name){
        return this.selected === name;
      },
      runCode: function(){
        let url_run  = ( action ) => `${ this.api.py_run }/${ action }`
        let url_html = `${ this.api.html_run }`
        var code     = this.form.snippet;

        if (this.isActive('javascript')) {
          try {
            eval( `console.log=console.print; ${ code }` );
            eval( `console.log=console._log;` );
          } catch (e) {
            var err = `Error at line[${ e.lineNumber }]: ${ e.message }`;
            console.print(err)
          }
        }
        else if (this.isActive('python')) {
          var self    = this;
          var action  = "live";
          axios.post(url_run(action), { data : code }).then(response=>{
            self.console_log = ( response.data )
          });
        }
        else if (this.isActive('sh')) {
          var self    = this;
          var action  = "shell";
          axios.post(url_run(action), { data : code }).then(response=>{
            self.console_log = ( response.data )
          });
        }

      },

      stopCode: function(){
        let url  = ( action ) => `${ this.api.py_stop }/${ action }`

        if (this.isActive('py-live')) {
          axios.get(url('live')).then(response=>{ });
        }
        else if ( this.isActive('py-sanic') || this.isActive('py-cherrypy') || this.isActive('py-quartpy') ) {
          axios.get(url('server')).then(response=>{ });
        }
        else if (this.isActive('sh-live') || this.isActive('sh-script')) {
          axios.get(url('shell')).then(response=>{ });
        }

      },
    },
  
};


const fullstackTable = {
  template: `<dynamic-table :items=theItems :sort.sync=sort @create=createItem @delete="id=>deleteItem(id)" @update="id=>editItem(id)" dark header-color=black icon=mdi-package-variant title=Fullstack v-bind=$attrs></dynamic-table>`,
  sync:['page_active', 'active'],

    props: {
    },

    data: () => ({
      sort  : "-name",
      items:[],
    }),

    created() {
      this.getItems();
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
      theItems(){
        var form;
        var fake = [];
        this.items.forEach((item, i) => {
          form = JSON.parse( JSON.stringify(item) );
          if(form.info){
            form.info = $ablaze.filter.cut(form.info, 2);
          }
          fake.push( form );
        });
        return fake
      }
    },

    methods: {
      createItem: function(){
        var url = this.api.crud.fullstack +'/create';
        var form = {
          id  :null,
          name:"Untitled",
          tags:null,
          info:null,
          notes:null,
          links: [],
          snippets:{
            python    : '',
            javascript: '',
            html:{
              live    : '',
              server  : '',
              script : '',
              head   : '',
            },
            js:{
              vue     : '',
            },
            py:{
              sanic     : '',
              cherrypy  : '',
              quartpy   : '',
            },
            sh:{
              live      : '',
              script    : '',
            },
          }
        };

        axios.post(url, form).then(response=>{
          this.items = response.data.data;
        })
      },
      editItem: function(id){
        var items = $ablaze.records( this.items ).by('id');
        this.active = items[ id ]
        this.page_active = "fullstack-editor"
      },
      deleteItem: function(id){
        var url = this.api.crud.fullstack +'/delete';
        axios.post(url,{
          id  : id,
        }).then(response=>{
          this.items = response.data.data;
        })
      },
      getItems: function(){
        var url = this.api.crud.fullstack +'/all';
        axios.post(url,{}).then(response=>{
          this.items = response.data.data;
        })
      }
    },
  
};


const snippetsTable = {
  template: `<dynamic-table :items=theItems :sort.sync=sort @create=createItem @delete="id=>deleteItem(id)" @update="id=>editItem(id)" dark header-color=black icon=mdi-clipboard-list-outline title=Snippets v-bind=$attrs></dynamic-table>`,
  sync:['page_active', 'active'],

    props: {
    },

    data: () => ({
      sort  : "-name",
      items:[],
    }),

    created() {
      this.getItems();
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
      theItems(){
        var form;
        var fake = [];
        this.items.forEach((item, i) => {
          form = JSON.parse( JSON.stringify(item) );
          if(form.info){
            form.info = $ablaze.filter.cut(form.info, 85);
          }
          fake.push( form );
        });
        return fake
      }
    },

    methods: {
      createItem: function(){
        var url = this.api.crud.snippet +'/create';
        var form = {
          id   : null,
          lang : "python",
          name : "Untitled",
          tags : null,
          info : null,
          notes: null,
          links: [],
          snippet:'',
        }
        axios.post(url, form).then(response=>{
          this.items = response.data.data;
        })
      },
      editItem: function(id){
        var items = $ablaze.records( this.items ).by('id');
        this.active = items[ id ]
        this.page_active = "snippets-editor"
      },
      deleteItem: function(id){
        var url = this.api.crud.snippet +'/delete';
        axios.post(url,{
          id  : id,
        }).then(response=>{
          this.items = response.data.data;
        })
      },
      getItems: function(){
        var url = this.api.crud.snippet +'/all';
        axios.post(url,{}).then(response=>{
          this.items = response.data.data;
        })
      }
    },
  
};


const appEditor = {
  template: `<v-app><abz-snackbar></abz-snackbar><abz-side-top :active.sync=page_active :right.sync=right_active></abz-side-top><v-navigation-drawer app clipped mobile-break-point=0 right style=overflow:hidden; v-if="( page_active==='fullstack-editor' )" v-model=right_active width=825px><abz-fullstack :form.sync=fullstack :linux.sync=linux :selected.sync=selected @save="$emit('fullstack')"></abz-fullstack></v-navigation-drawer><v-navigation-drawer app clipped mobile-break-point=0 right style=overflow:hidden; v-if="( page_active==='snippets-editor' )" v-model=right_active width=825px><abz-snippet :form.sync=snippet :selected.sync=snippet.lang @save="$emit('snippet')"></abz-snippet></v-navigation-drawer><v-content class="fill-height text-center" style="overflow: hidden;"><abz-fullstack-output :code.sync=fullstack.snippets :html.sync=fullstack.snippets.html :selected.sync=selected @copy="copyText( consoleLog )" v-if="( page_active==='fullstack-editor' )"></abz-fullstack-output><abz-snippet-output :code.sync=snippet.snippet :selected.sync=snippet.lang @copy="copyText( consoleLog )" v-if="( page_active==='snippets-editor' )"></abz-snippet-output></v-content><abz-side-bottom></abz-side-bottom></v-app>`,
  sync:['fullstack', 'snippet', 'page_active', 'linux'],
    props: {
    },

    data: () => ({
      right_active: true,
      selected: {
        lang      : 'javascript',
        py        : isLinux ? 'live' : 'cherrypy',
        js        : 'live',
        html      : 'live',
        sh        : 'live',
      },

    }),

    created() {
      if(!this.snippet.lang){
        this.snippet.lang = "python"
      }
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
      consoleLog(){
        return this.console_log.join('\n')
      }
    },

    methods: {
    },
  
};


const appListing = {
  template: `<v-app><abz-snackbar></abz-snackbar><abz-side-top :active.sync=page_active></abz-side-top><v-content class="fill-height text-center" fluid style="overflow: hidden;"><fullstack-table :active.sync=fullstack :key=Date.now() :page_active.sync=page_active :show="['id', 'name', 'tags', 'info']" v-if="(page_active==='fullstack')"></fullstack-table><snippets-table :active.sync=snippet :key=Date.now() :page_active.sync=page_active :show="['id', 'name', 'lang', 'tags', 'info']" v-if="(page_active==='snippets')"></snippets-table><v-container v-if="(page_active==='settings')"><v-file-input label=Import show-size style="width: 300px; margin-left:auto; margin-right:auto;" v-model=files></v-file-input><v-btn @click=upload color=blue outlined> Import <v-icon> mdi-application-import </v-icon></v-btn><v-btn @click=download class=ml-3 color=blue dark> Export <v-icon> mdi-application-export </v-icon></v-btn><h3 class=mt-4> File is too big? </h3><h5 class="red--text accent-3 mt-3"> Here is the path to the database. </h5><h5 @click=copyText(db_path) class="blue--text accent-4 mt-3" style="cursor: pointer; text-decoration: underline;"> {{ db_path }} </h5></v-container></v-content><abz-side-bottom></abz-side-bottom></v-app>`,
  sync: ['page_active', 'fullstack', 'snippet'],
    props: {
    },

    data: () => ({
      db_path: "",
      files: ""
    }),

    created() {
      var self = this;
      axios.get(this.api.crud.db.path).then(response=>{
        var path = response.data;
        self.db_path = String(path);
      });
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
    },

    methods: {
      download: function(){
        var name = "database.db"
        var link = document.createElement('a');
        link.download = name;
        link.href = this.api.crud.db.export;
        link.click();
        document.body.removeChild(link);
      },
      upload: function(){
        var self = this;
        let formData = new FormData();
        formData.append('file', this.files);
        if(this.files){
          axios.post(this.api.crud.db.import,
            formData,
            {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
            }
          ).then(function(){
            self.snackbar = { color:"green", text: 'Successfully uploaded!', active: true, timeout: 2000 };
            self.files = ""
          })
          .catch(function(){
            console.log('FAILURE!!');
          });
        }
      },
      upload_multiple: function(){
        let formData = new FormData();
        for( var i = 0; i < this.files.length; i++ ){
          let file = this.files[i];
          formData.append('files[' + i + ']', file);
        }
        axios.post(this.api.crud.db.import,
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        ).then(function(){
          console.log('SUCCESS!!');
        })
        .catch(function(){
          console.log('FAILURE!!');
        });
      },
    },
  
};


const theApp = {
  template: `<div><div style="margin:0; padding:0; max-height:0px; max-width:0px; postion:fixed; top:0"><textarea id=ABLAZE_COPY_TEXT_ID></textarea></div><app-editor :fullstack.sync=fullstack :linux.sync=linux :page_active.sync=active :snippet.sync=snippet @fullstack=updateFullstack @snippet=updateSnippet v-if="['fullstack-editor', 'snippets-editor'].includes(active)"></app-editor><app-listing :fullstack.sync=fullstack :page_active.sync=active :snippet.sync=snippet v-if="['settings', 'fullstack', 'snippets'].includes(active)"></app-listing></div>`,
  props: {
    },

    data: () => ({
      active    : 'fullstack',
      linux     : isLinux,
      fullstack : {},
      snippet   : {},

    }),

    created() {
    },

    mounted () {
      var element = this.$el;
    },

    computed:{
    },

    methods: {
      updateFullstack: $ablaze.throttle(function(){
        var url  = this.api.crud.fullstack + '/update';
        var form = JSON.parse(JSON.stringify(this.fullstack));
        axios.post(url, form).then(response=>{
          let data = response.data;
        })
      }, 3000),
      updateSnippet: $ablaze.throttle(function(){
        var url  = this.api.crud.snippet + '/update';
        var form = JSON.parse(JSON.stringify(this.snippet));
        axios.post(url, form).then(response=>{
          let data = response.data;
        })
      }, 3000),
    },
  
};
