<template>
    <main class="flex flex-wrap gap-x-8 gap-y-4 justify-center pt-20">
        <div class="alert flex justify-center">
            <span class="text-3xl">選擇植物</span>
        </div>
        <!-- Display loading spinner while loading -->
        <div v-if="loading" class="flex justify-center w-full">
            <span class="loading loading-spinner text-success"></span>
        </div>
        <!-- Display content when loading is finished -->
        <div v-else v-for="plant in plants" :key="plant.plantID" class="card card-compact w-96 bg-base-100 shadow-xl">
            <figure>
                <img :src="plant.image" :alt="plant.plantName" />
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

export default {
    data() {
        return {
            plants: [],
            loading: true
        };
    },
    async mounted() {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://angelo0218-server.ddns.net:3000/api/plants', {
                headers: {
                    'Authorization': `Bearer ${token}`
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
            const token = localStorage.getItem('token');
            try {
                await axios.post('http://angelo0218-server.ddns.net:3000/choosePlant', {
                    plantId
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert('植物選擇成功！');
            } catch (error) {
                console.error('Error choosing plant:', error);
                alert('選擇植物失敗，請稍後再試！');
            }
        }
    }
}
</script>

<style scoped>
img {
    width: 100px;
    height: 120px;
}
</style>
