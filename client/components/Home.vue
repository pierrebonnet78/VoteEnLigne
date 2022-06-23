<template>
    <div class="container">
        
        <div class="title">
            <p> Vote en ligne</p>
            </div>
        <div class="selector">
            <p>Sélectionner une commune</p>
        </div>
        <div class = "button">
            <!-- <button  @onclick={} class="btn-default">Connexion Admin</button> -->
            <router-link to='/AdminLogin' class="btn-default">Connexion Admin</router-link>
        </div>
    </div>
</template>

<style scoped>

.container{
    display : flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
}

.header{
    display : flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-grow: 1;
    width: 100%;
    height: 5vw;
}
.blue{
    background-color: blue;
    width : 33.33%;
}
.red{
    background-color: red;
    width : 33.33%;
}
.white{
    background-color: white;
    width : 33.33%;
}
.btn-default{
    text-align: center;
    background: rgb(151, 149, 149);
	border: 1px solid rgba(255,255,255,.8);
    border-radius: 3px;
	font-size:15px;
	padding: 12px 36px;
}
.button{
   margin-top: 200px;
  
}
</style>