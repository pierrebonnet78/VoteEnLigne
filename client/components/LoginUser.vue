<template>
    <div class="body">
        <h1>Portail</h1>
        <h1>Électeur</h1>
        <form>
            <div id="input-grp">
                <input type="text" v-model="user.nom" placeholder="Nom" required class="form-control">
                <input type="text" v-model="user.prenom" placeholder="Prénom" required class="form-control">
                <input type="date" v-model="user.dateNaissance" placeholder="Date de naissance" required class="form-control">
                <input type="text" v-model="user.numElecteur" placeholder="Numéro d'électeur" required class="form-control">
                <input type="text" v-model="user.numPasseport" placeholder="Numéro de passeport" required class="form-control">
                <input type="text" v-model="user.numID" placeholder="Numéro d'identité" required class="form-control">
                <input type="text" v-model="user.lieuNaissance" placeholder="Lieu de naissance" required class="form-control">
            </div>
            
            <div id="btn-grp">
                <button @click="loginUser()" class="btn-default">Connexion</button>
            </div>
        </form>
    </div>
</template>

<script>
module.exports = {
  data () {
    return {
        user: {
            nom: "",
            prenom: "",
            dateNaissance: "",
            numElecteur: "",
            numPasseport: "",
            numID: "",
            lieuNaissance: ""
        }
    }
  },
  methods: {
    loginUser() {
        this.$emit('loginUser', this.user)
    }
  }
}
</script>


<style scoped>

.body {
  
}
.body h1 {
	font-family: "Open sans", Arial;
	font-size: 40px;
	font-weight: bold;
	text-align: center;
    text-decoration: underline;
}


form{
    text-align: center;
}

#btn-grp{
    margin-top: 60px;
}

#input-grp{
    margin-top: 50px;
}

.btn-default{
    text-align: center;
    background: rgb(151, 149, 149);
	border: 1px solid rgba(255,255,255,.8);
    border-radius: 3px;
	font-size:15px;
	padding: 12px 36px;
}

.body .form-control { 
    background: rgb(190, 189, 189); 
    border: 0; 
    font-size:18px;
}
.body .form-control::-webkit-input-placeholder { color: rgba(0, 0, 0, 0.342); }


</style>