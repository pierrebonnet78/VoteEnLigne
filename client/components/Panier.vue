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
            <h1>Panier</h1>
            <article v-for="livre in panier.livres" :key="livre.id_livre">
                <div class="livre">

                    <div id = "livre_img" v-bind:style="{ backgroundImage: 'url('+ livre.image +')'}"></div>

                    <div class="livre-content"><h2>{{ livre.titre }} - {{ livre.auteur }}</h2></div>
                    <div class="livre-btn"> <button @click="deleteLPanier(livre.id_livre,currentuser[0].id_user)" class="livre_btn">Supprimer</button></div>
                </div>

            </article>
            <div style="text-align:center"><button v-if="panier.livres.length != 0" @click="validatePanier(currentuser[0].id_user)" class="livre_btn">Valider</button></div>
        </div>
    </div>   
</template>
<script>
module.exports = {
  props: {
      panier: {type : Object},
      currentuser: { type: Array, default: []}
  },
  data () {
      return {
          
      }
    },
    methods: {
        deleteLPanier(livreId,userId){
            this.$emit('deletelpanier',{livreid: livreId, userid: userId})
        },
        validatePanier(userId){
            this.$emit('validatepanier',{userid: userId})
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
    background-color: #333;
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
    background: rgba(5,5,5,0.4); 
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