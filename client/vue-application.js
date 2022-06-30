const AdminLogin = window.httpVueLoader("./components/AdminLogin.vue");
const LoginUser = window.httpVueLoader("./components/LoginUser.vue");
const Catalogue = window.httpVueLoader("./components/Catalogue.vue");
const Panier = window.httpVueLoader("./components/Panier.vue");
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
    livres: [],
    currentuser: [],
    listeelectorale: [],
    villeselected: null,
  },
  async mounted() {
    //const res = await axios.get('/api/livres')
    this.livres = null;
    this.listeelectorale = null;
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

      // if (res.data[0] == -1) {
      //   alert("Mot de passe incorrect");
      // } else if (res.data[0] == 0) {
      //   alert("Email incorrect");
      // } else {
      //   alert("Connexion réussie");
      //   this.$data.currentuser = res.data[1];
      //   const res2 = await axios.post(
      //     "/api/listeelectorale",
      //     this.$data.currentuser[0]
      //   );
      //   console.log(res2);
      //   this.$data.listeelectorale = res2.data;

      //   router.push("/catalogue");
      // }
    },
    async setvilleSelected(ville) {
      this.$data.villeselected = ville;
    },
    async inscriptionUser(user) {
      const res = await axios.post("/api/inscription", user);

      if (res.data) {
        alert("Inscription réussie");
      } else {
        alert("Email déjà présent");
      }
    },
    async addPanier(object) {
      const res = await axios.post("/api/addpanier", object);

      if (res.data) {
        alert("Livre ajouté au panier");
        //actualise le panier
        const res2 = await axios.post("/api/panier", this.$data.currentuser[0]);
        this.$data.panier.livres = res2.data;
      } else {
        alert("Livre déjà ajouté au panier");
      }
    },
    async deleteLivre(object) {
      const res = await axios.post("/api/deletelivre", object);
      //actualise la liste de livre
      const res2 = await axios.get("/api/livres");
      this.$data.livres = res2.data;
    },
    async addLivre(livre) {
      const res = await axios.post("/api/addlivre", livre);
      const res2 = await axios.get("/api/livres");
      this.$data.livres = res2.data;
    },
    async addCitoyen(citoyen) {
      console.log(citoyen);
      const res = await axios.post("api/addCitoyen", citoyen);
      console.log(res);
      if (res.data[0] == 400) {
        alert("Erreur dans la saisie ajout");
      }
    },
    async updateCitoyen(citoyen) {
      console.log(citoyen);
      const res = await axios.post("api/updateCitoyen", citoyen);
      console.log("response :");
      console.log(res);
      if (res.data[0] == 400) {
        alert("Erreur dans la saisie");
      }
    },
    async deleteLPanier(object) {
      const res = await axios.post("api/deletelpanier", object);
      //actualise le panier
      const res2 = await axios.post("/api/panier", this.$data.currentuser[0]);
      this.$data.panier.livres = res2.data;
    },
    async validatePanier(object) {
      const res = await axios.post("api/validatepanier", object);
      if (res) {
        //panier valider et vider
        alert("Panier validé avec succès");
        //actualise le panier
        const res2 = await axios.post("/api/panier", this.$data.currentuser[0]);
        this.$data.panier.livres = res2.data;
        //actualise la liste de livre car qte = qte -1
        const res3 = await axios.get("/api/livres");
        this.$data.livres = res3.data;
      }
    },
    async refreshUser() {
      const res = await axios.get("api/user");
      this.$data.currentuser = res.data;
    },
    async refreshPanier() {
      //actualise le panier
      const res2 = await axios.post("/api/panier", this.$data.currentuser[0]);
      this.$data.panier.livres = res2.data;
    },
    async deleteCitoyen(citoyen) {
      const res = await axios.post("/api/deletecitoyen", citoyen);
      console.log(res);
    },
  },
});
