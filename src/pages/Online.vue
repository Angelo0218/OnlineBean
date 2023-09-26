<template>
    <div class=" container " style="margin-top:80px;">
        <router-link to="/Backpack" class="btn btn-primary justify-center mb-3">
            <i class="fa-solid fa-chevron-left"></i>
            <span>上一頁</span>
        </router-link>

        <div class="alert flex justify-center">
            <span class=" text-3xl">養殖植物</span>
        </div>
        <div>
            <div class="bg-black m-auto  mt-10 max-sm:w-96 max-sm:h-a2 h-a1"></div>
        </div>
        <div class="flex justify-center my-8">
            <button class="btn btn-lg btn-active btn-accent">澆水</button>
        </div>

    </div>
</template>
<script>

import { useRoute } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
        const plantId = route.query.plantId;

    }
}

</script>
<style scoped>
img {
    width: 100px;
    height: 120px;
}
</style>
