const AdminLogin = window.httpVueLoader("./components/AdminLogin.vue");
const LoginUser = window.httpVueLoader("./components/LoginUser.vue");
const Temp = window.httpVueLoader("./components/Temp.vue");
const Home = window.httpVueLoader("./components/Home.vue");
const AdminPage = window.httpVueLoader("./components/AdminPage.vue");
const UserPage = window.httpVueLoader("./components/UserPage.vue");

const routes = [
  { path: "/", component: Home },
  { path: "/LoginUser", component: LoginUser },
  { path: "/AdminLogin", component: AdminLogin },
  { path: "/AdminPage", component: AdminPage },
  { path: "/UserPage", component: UserPage },
];

const router = new VueRouter({
  routes,
});

var app = new Vue({
  router,
  el: "#app",
  data: {
    currentuser: [],
    listeelectorale: [],
    villeselected: null,
  },
  methods: {
    async loginAdmin(user) {
      const res = await axios.post("/api/loginAdmin", user);
      if (res.data[0] == -1) {
        alert("Mot de passe incorrect");
      } else if (res.data[0] == 0) {
        alert("Email incorrect");
      } else {
        //stockage de l'admin dans le storage du navigateur
        localStorage.admin = JSON.stringify(res.data[1][0]);
        alert("Connexion réussie");
        router.push("/AdminPage");
      }
    },
    async loginUser(citoyen) {
      const res = await axios.post("/api/loginUser", citoyen);

      if (res.data[0] == 400) {
        alert("Ce compte n'existe pas");
      } else if (res.data[0] == 200) {
        localStorage.citoyen = JSON.stringify(res.data[1][0]);
        router.push("/UserPage");
      }
    },
    async refreshUser(citoyen) {
      const res = await axios.post("/api/refreshUser", citoyen);
      localStorage.citoyen = JSON.stringify(res.data[1][0]);
      console.log("res :");
      console.log(res.data);
    },
    async setvilleSelected(ville) {
      this.$data.villeselected = ville;
    },
    async addCitoyen(citoyen) {
      const res = await axios.post("api/addCitoyen", citoyen);
      if (res.data[0] == 400) {
        alert("Erreur dans la saisie ajout");
      }
    },
    async updateCitoyen(citoyen) {
      const res = await axios.post("api/updateCitoyen", citoyen);
      if (res.data[0] == 400) {
        alert("Erreur dans la saisie");
      }
    },
    async deleteCitoyen(citoyen) {
      const res = await axios.post("/api/deletecitoyen", citoyen);
    },
    async vote(citoyen, candidat) {
      const res = await axios.post("api/vote", { citoyen, candidat });
      console.log(res.data);
    },
  },
});
