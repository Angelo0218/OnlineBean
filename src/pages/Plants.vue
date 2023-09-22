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
                    <router-link class="btn btn-primary" to="/online">選這個</router-link>
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
            loading: true // 初始化 loading 状态为 true
        };
    },
    async mounted() {
        const token = localStorage.getItem('token'); // 從 localStorage 中獲取 token
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
            this.loading = false; // 设置 loading 状态为 false，无论请求成功还是失败
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
