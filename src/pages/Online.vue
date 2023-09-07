<template>
    <Nav/>
    <div class=" container " style="margin-top:80px;">
        <div class="alert flex justify-center">
            <span class=" text-3xl">養殖植物</span>
        </div>
  <div>
    <div class="bg-black m-auto w-112 mt-10 max-sm:w-96 max-sm:h-a2 h-a1" ></div>
  </div>
        <div class="flex justify-center my-8">
            <button class="btn btn-lg btn-active btn-accent">澆水</button>
        </div>
       
    </div>
</template>
<script>
import Nav from '../components/nav.vue';

export default {
  components: {
    Nav
  },

}
</script>
<style scoped>
img {
    width: 100px;
    height: 120px;
}
</style>
