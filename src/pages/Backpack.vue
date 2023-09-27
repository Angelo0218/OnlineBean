<template>
    <main class="flex flex-wrap gap-x-8 gap-y-4 justify-center pt-20">
        <div class="alert flex justify-center">
            <span class="text-3xl">🎒植物背包</span>
        </div>
        <div v-if="loading" class="flex justify-center w-full">
            <span class="loading loading-spinner text-success"></span>
        </div>
        <div v-else-if="userPlants.length === 0" class="flex justify-center w-full">
            <div class="alert flex justify-center w-full py-4 my-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
                role="alert">
                <div class="flex">
                    <div class="py-1">
                        <svg class="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20">
                            <path
                                d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0 4v2h2v-2H9z" />
                        </svg>
                    </div>
                    <div>
                        <p class="font-bold">您的背包中沒有植物！</p>
                        <p class="text-sm">請前往<router-link to="/Plants"
                                class="text-yellow-700 underline">商店</router-link>購買。</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else v-for="plant in userPlants" :key="plant.plantID" class="card card-compact w-96 bg-base-100 shadow-xl">
            <figure>
                <img :src="plant.image" :alt="plant.plantName" class="object-cover h-48 w-full" />
            </figure>
            <div class="card-body">
                <span class="card-title justify-center text-2xl">{{ plant.plantName }}</span>
                <span class="card-title justify-center text-base">{{ plant.plantDescription }}</span>
                <div class="card-actions justify-center">
                    <button @click="selectPlant(plant)" class="btn btn-primary">選擇植物</button>

                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

export default {
    data() {
        return {
            userPlants: [],
            loading: true
        };
    },
    async mounted() {
        const authStore = useAuthStore();
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${apiUrl}/api/userPlants`, {
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            this.userPlants = response.data;
            // console.log(this.userPlants); 
        } catch (error) {
            console.error('Error fetching user plants:', error);
            this.loading = false;
        } finally {
            this.loading = false;
        }
    },


    setup() {
        const router = useRouter();

        function selectPlant(plant) {
    // 檢查植物是否是神秘的植物
    if (plant.plantName === '神秘的植物') {
        // 如果是神秘的植物，則導向 online666
        router.push({ path: `/online666` });
    } else {
        // 把userPlantId變成分解為四個部分
        const parts = plant.user_plant_id.split('-');

        // 重新排列
        const reorderedId = parts[4] + parts[3] + parts[2] + parts[1] + parts[0];

        // 使用重新排列的 ID
        router.push({ path: `/online/${reorderedId}` });
    }
}





        return {
            selectPlant
        };
    }
}
</script>


<style scoped>
.img {
    object-fit: cover;
    height: 120px;
    width: 100%;
}</style>
