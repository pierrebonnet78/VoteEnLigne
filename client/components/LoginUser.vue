<template>
  <div class="body" v-if="villeselected">
    <h1>Portail Electeur ville de {{villeselected.NomVille}} </h1>
    <form>
      <div id="input-grp">
        <input
          type="text"
          v-model="citoyen.nom"
          placeholder="Nom"
          required
          class="form-control"
        />
        <input
          type="text"
          v-model="citoyen.prenom"
          placeholder="Prénom"
          required
          class="form-control"
        />
        <input
          type="date"
          v-model="citoyen.date_naissance"
          placeholder="Date de naissance"
          required
          class="form-control"
        />
        <input
          type="text"
          v-model="citoyen.lieu_naissance"
          placeholder="Lieu de naissance"
          required
          class="form-control"
        />
        <input
          type="text"
          v-model="citoyen.numero_electeur"
          placeholder="Numéro d'électeur"
          required
          class="form-control"
        />
        <p>Choissiez votre méthode d'indentification : </p>
        <button @click="handlePasseportClick()"> Numéro de passeport </button>
        <button @click="handleIdClick()"> Numéro de carte d'identité </button>
        <br>
        
        <input
          type="text"
          v-if="connectionWithPasseport"
          v-model="citoyen.numero_passeport"
          placeholder="Numéro de passeport"
          required
          class="form-control"
        />
        <input
          type="text"
          v-if="connectionWithId"
          v-model="citoyen.numero_carte_id"
          placeholder="Numéro d'identité"
          required
          class="form-control"
        />
        
      </div>

      <div id="btn-grp">
        <button @click="loginUser()" class="btn-default">Connexion</button>
      </div>
    </form>
  </div>
</template>

<script>
module.exports = {
  props: {
    villeselected: { type: Object, default: null },
  },
  data() {
    return {
      citoyen: {
         nom: "",
        prenom: "",
        date_naissance: "",
        lieu_naissance: "",
        numero_electeur: "",
        numero_carte_id: "",
        numero_passeport: "",
        id_lieu_domicile: "",
        connection_type : ""  // 0 : numéro passeport, 1 : numéro Id
      },
      connectionWithPasseport : false,
      connectionWithId : false,
    };
  },
  methods: {
    loginUser() {
        this.citoyen.id_lieu_domicile = this.villeselected.IdVille
        this.$emit("loginuser", this.citoyen);
      
    },
    handlePasseportClick(){
        this.connectionWithPasseport = !this.connectionWithPasseport;
        this.citoyen.connection_type = 0;
        if(this.connectionWithId){
            this.connectionWithId = false
        }
    },
    handleIdClick(){
        this.connectionWithId = !this.connectionWithId;
        this.citoyen.connection_type = 1;
         if(this.connectionWithPasseport){
            this.connectionWithPasseport = false
        }
    }
  },
  created() {
    if(!this.villeselected){
        router.push("/")
    }
  }
};
</script>

<style scoped
.body h1 {
  font-family: "Open sans", Arial;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  text-decoration: underline;
}

form {
  text-align: center;
}

#btn-grp {
  margin-top: 60px;
}

#input-grp {
  margin-top: 50px;
}

.btn-default {
  text-align: center;
  background: rgb(151, 149, 149);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  font-size: 15px;
  padding: 12px 36px;
}

.body .form-control {
  background: rgb(190, 189, 189);
  border: 0;
  font-size: 18px;
}
.body .form-control::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.342);
}
</style>
