<template>
  <Nav/>
  <div class="hero min-h-screen  " >
      <div class="hero-content flex-col sm:flex-row-reverse">
        <img src="../assets/tree.png" class="max-w-xs rounded-lg" />
        
        <div>
          <h1 class="text-5xl font-bold ">線上養殖</h1>
          <p class="py-6">「線上養殖，無限可能，輕鬆開展！」</p>
          <router-link class="btn btn-lg btn-active btn-accent max-sm:w-5/6 max-sm:ml-5" to="/plants">立即養殖</router-link>
        </div>
      </div>
    </div>
</template>
<style>
.hero{
  margin-top: -30px;
}
@media screen and (max-width: 768px) {
  .hero {
    margin-top: -2rem
  }
  h1 {
   text-align: center;
  }
  p{
    text-align: center;
  }


}
</style>

<script>
import Nav from '../components/nav.vue';

export default {
  components: {
    Nav
  },

}
</script>