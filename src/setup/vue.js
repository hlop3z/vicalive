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
axios.defaults.withCredentials = false

const $http = axios.create({
  withCredentials: true,
});

Vue.use(Vuetify, {
  iconfont: 'mdi',
})


new Vue({
  el: '#app',
  //router,
  store,
  vuetify: new Vuetify()
});
