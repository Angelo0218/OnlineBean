<template>
  <Nav />
  <Transition name="fade" mode="out-in">
    <router-view></router-view>
  </Transition>

</template>
<script>
import Nav from './components/nav.vue';
export default {
  components: {
    Nav
  },
}
</script>
<style>
.fade-enter-active,
.fade-leave-active{
  opacity: 0;
}
.fade-enter,
.fade-leave-to{
  transition: opacity 0.5s ease;;
}
</style>
