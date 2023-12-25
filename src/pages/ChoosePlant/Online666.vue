<template>
    <div class=" container " style="margin-top:5rem;">
        <router-link to="/Backpack" class="btn btn-primary justify-center mb-3">
            <i class="fa-solid fa-chevron-left"></i>
            <span>上一頁</span>
        </router-link>

        <div class="alert flex justify-center">
            <span class=" text-3xl">養殖植物</span>
        </div>
        <div>
            <div class="bg-black m-auto mt-10 relative max-sm:w-96 max-sm:h-a2 h-a1">
                <img :src="currentPlantImage" class="m-auto mt-10 max-sm:w-96 max-sm:h-a2 h-a1">
                <img v-if="showWatering" src="/test/water.gif" class="absolute water">
            </div>
            <div class="flex justify-center my-8">
                <button @click="waterPlant" class="btn btn-lg btn-active btn-accent" :disabled="isWatering">澆水</button>
            </div>
            <div v-if="showAlert" class="alert alert-warning qq">
                <span>請稍後...</span>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, computed } from 'vue';

export default {
    setup() {
        const showWatering = ref(false);
        const wateringCount = ref(0);
        const isWatering = ref(false);
        const showAlert = ref(false);

        const waterPlant = () => {
            if (isWatering.value) {
                showAlert.value = true;
                return;
            }

            showAlert.value = false;
            isWatering.value = true;
            showWatering.value = true;

            setTimeout(() => {
                showWatering.value = false;
                setTimeout(() => {
                    wateringCount.value++;
                    isWatering.value = false;

                    // 檢查當前植物是否是 "神秘的植物"
                    if (currentPlant.plantName === '神秘的植物') {

                        const randomNum = Math.random();
                        if (randomNum < 0.05) {
                            currentPlantImage.value = "/test/plant666.png";
                        }
                    }
                }, 500);
            }, 510);
        };


        const currentPlantImage = computed(() => {
            const imageIndex = wateringCount.value % 12;


            if (imageIndex === 10) {
                const randomNum = Math.random();

                if (randomNum < 0.1) {

                    alert('恭喜中獎')
                    return "/test/plant666.png";

                }
            }

            // 當 water為 10，並當前圖片為 plant666.png 時，會變成 plant6662.png
            if (imageIndex === 11 && currentPlantImage.value === "/test/plant666.png") {
                return "/test/plant6662.png";
            }


            return `/test/plant${imageIndex}.png`;
        });



        return {
            showWatering,
            waterPlant,
            currentPlantImage,
            showAlert,
            isWatering, // 確保 isWatering 被返回，以便在模板中使用
        };
    },
    mounted() {
        // 預加載所有圖片
        for (let i = 0; i < 12; i++) {
            const img = new Image();
            img.src = `/test/plant${i}.png`;
        }
    },
}
</script>




<style scoped>
.water {
    width: 8rem;
    height: 8rem;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
}

.qq {
    position: absolute;
    bottom: -8%;
    width: 7rem;
    left: 45%;
}
</style>