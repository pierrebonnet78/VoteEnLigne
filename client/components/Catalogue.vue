<template>
    <div>
        <div class="nav">
            <div>
                <div>
                    <ul>
                        <li><router-link to='/panier' class="nav-btn">Panier</router-link></li>
                        <li><router-link to='/catalogue' class="nav-btn">Catalogue</router-link></li>
                    </ul>
                </div>
            </div>
	    </div> 
        <div class="body">
            <h1>Catalogue</h1>
            <div class="input-text">
                <input type="text" class="inputText" v-model="searchText" @keyup="searchInput()" placeholder="Rechercher un livre ...">
                <div id="suggestions"></div>
            </div>
            <article v-for="livre in livres" :key="livre.id_livre">
                <div class="livre">

                        <div id = "livre_img" v-bind:style="{ backgroundImage: 'url('+ livre.image +')'}"></div>

                            <div class="livre-content"><h2>{{ livre.titre }} - {{ livre.auteur }} - {{ livre.quantity }}</h2></div>
                            <div class="livre-btn">
                                <button v-if="currentuser[0].admin == 1" @click="deleteLivre(livre.id_livre)" class="livre_btn">Supprimer</button>
                                <button v-if="currentuser[0].admin == 0" @click="prendreLivre(livre.id_livre,currentuser[0].id_user,livre.quantity)" class="livre_btn">Emprunter</button>
                            </div>
                </div>
            </article>
            <add-livre v-if="currentuser[0].admin == 1" @add-livre="addLivre">
            </add-livre>
            <div style="margin-bottom: 0px"><br></div>
        </div>
    </div>
</template>
<script>
const AddLivre = window.httpVueLoader('./components/AddLivre.vue')
module.exports = {
  props: {
        livres: { type: Array, default: []},
        currentuser: { type: Array, default: []}
  },
  components: {
      AddLivre
  },
  data () {
      return {
          searchText: ""
      }
    },
    mounted(){
        this.$emit('refreshuser')
    },
    methods: {
        searchInput(){
            const filter = this.livres.filter(livre => livre.titre.includes(this.searchText))
            let suggestion = "";
            
            
            filter.forEach(filterItem => {                
                suggestion +=
                    '<div class="suggestion">'+filterItem.titre+'</div>'
            }) 
            document.getElementById('suggestions').innerHTML = suggestion;
        },
        prendreLivre(livreId,userId,livreQuantity){
            //verifie la quantité
            if (livreQuantity <= 0 ){ alert ("Plus d'exemplaire")}
            else{
                //console.log(livreId,userId)
                this.$emit('addpanier',{livreid: livreId, userid: userId})
            }
        },
        deleteLivre(livreId){
            this.$emit('deletelivre',{livreid: livreId})
        },
        addLivre (newLivre){
            this.$emit('add-livre',newLivre)
        }
    }
}
</script>

<style scoped>
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: rgb(75, 3, 106);
}

li{
    display: inline;
}

.nav-btn{
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    float: right;
}

#btn-nav{
    background-color: rgb(51, 51, 51);
}

.body {
	background: #e3b9f1  bottom center; 
	color: white;
    min-height: 100%;
    padding-top: 10px;
}
.body h1 {
	font-family: "Open sans", Arial;
	font-size: 30px;
	font-weight: bold;
	text-align: center;
	text-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
	color:white; ;
}

.body h2 {
	font-family: "Open sans", Arial;
	font-size: 20px;
	font-weight: bold;
	text-align: center;
	text-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
	color:white; ;
}

.input-text{
    text-align: center;
}

.inputText{
    background: #6b038dbe; 
    border: 0; 
    color: white; 
    font-size:18px;
    margin-bottom: 5px;
}
.livre{
    display: flex;
    justify-content: space-between;
    margin-left: 40px;
    margin-right: 40px;
    margin-bottom: 35px;
}

#livre_img{
    width: 150px;
    height: 200px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

.livre-content{
    margin: auto;
}

.livre-btn{
    margin:auto;
}

.livre_btn{
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.8);
    color: rgba(255,255,255,.8);
    font-size: 15px;
    padding: 12px 36px;
}

</style>