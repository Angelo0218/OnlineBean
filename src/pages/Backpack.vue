<template>
    <main class="flex flex-wrap gap-x-8 gap-y-4 justify-center pt-20">
        <div class="alert flex justify-center">
            <span class="text-3xl">植物背包</span>
        </div>
        <div v-if="loading" class="flex justify-center w-full">
            <span class="loading loading-spinner text-success"></span>
        </div>
        <div v-else v-for="plant in userPlants" :key="plant.plantID" class="card card-compact w-96 bg-base-100 shadow-xl">
            <figure>
                <img :src="plant.image" :alt="plant.plantName" class="object-cover h-48 w-full" />
            </figure>
            <div class="card-body">
                <span class="card-title justify-center text-2xl">{{ plant.plantName }}</span>
                <span class="card-title justify-center text-base">{{ plant.plantDescription }}</span>
                <div class="card-actions justify-center">
                    <button @click="selectPlant(plant.plantID)" class="btn btn-primary">選擇植物</button>
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
            const response = await axios.get('http://angelo0218-server.ddns.net:3000/api/userPlants', {
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            this.userPlants = response.data;
        } catch (error) {
            console.error('Error fetching user plants:', error);
            this.loading = true;
        } finally {
            this.loading = false;
        }
    },
    setup() {
        const router = useRouter();

        function selectPlant(plantId) {
            router.push({ path: '/Online', query: { plantId } });
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
}
</style>
