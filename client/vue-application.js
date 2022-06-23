const Accueil = window.httpVueLoader("./components/Accueil.vue");
const Catalogue = window.httpVueLoader("./components/Catalogue.vue");
const Panier = window.httpVueLoader("./components/Panier.vue");
const Temp = window.httpVueLoader("./components/Temp.vue");
const Home = window.httpVueLoader("./components/Home.vue");

const routes = [
  { path: "/", component: Home },
  { path: "/Accueil", component: Accueil },
  { path: "/catalogue", component: Temp },
  { path: "/panier", component: Panier },
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
  },
  async mounted() {
    //const res = await axios.get('/api/livres')
    this.livres = null;
  },
  methods: {
    async loginAdmin(user) {
      const res = await axios.post("/api/loginAdmin", user);
      if (res.data[0] == -1) {
        alert("Mot de passe incorrect");
      } else if (res.data[0] == 0) {
        alert("Email incorrect");
      } else {
        alert("Connexion réussie");
        this.$data.currentuser = res.data[1];
        const res2 = await axios.post(
          "/api/listeelectorale",
          this.$data.currentuser[0]
        );
        console.log(res2);
        this.$data.listeelectorale = res2.data;

        router.push("/catalogue");
      }
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
  },
});