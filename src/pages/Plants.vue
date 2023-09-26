<template>
    <main class="flex flex-wrap gap-x-8 gap-y-4 justify-center pt-20">
        <div class="alert flex justify-center">
            <span class="text-3xl">💎植物商城</span>
        </div>
        <div v-if="loading" class="flex justify-center w-full">
            <span class="loading loading-spinner text-success"></span>
        </div>
        <div v-else v-for="plant in plants" :key="plant.plantID" class="card card-compact w-96 bg-base-100 shadow-xl">
            <figure>
                <img :src="plant.image" :alt="plant.plantName" class="object-cover h-48 w-full" />
            </figure>
            <div class="card-body">
                <span class="card-title justify-center text-2xl">{{ plant.plantName }}</span>
                <span class="card-title justify-center text-base">{{ plant.plantDescription }}</span>
                <div class="card-actions justify-center">
                    <button @click="choosePlant(plant.plantID)" class="btn btn-primary">選這個</button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../store/auth';

export default {
    data() {
        return {
            plants: [],
            loading: true
        };
    },
    async mounted() {
        const authStore = useAuthStore();
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${apiUrl}/api/plants`, {
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            });

            this.plants = response.data;
        } catch (error) {
            console.error('Error fetching plants:', error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        async choosePlant(plantId) {
            const authStore = useAuthStore();
            try {
                await axios.post('http://angelo0218-server.ddns.net:3000/choosePlant', {
                    plantId
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                });
                alert('植物選擇成功！');
            } catch (error) {
                console.error('Error in /choosePlant:', error); // 這裡應該使用 error 而不是 err
                alert('選擇植物失敗，請稍後再試！');
            }

        }
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
