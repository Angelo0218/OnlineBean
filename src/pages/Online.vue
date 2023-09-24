
<template>
    <div>
        <div v-if="error" class="error">
            {{ error }}
        </div>
        <div v-else>
            <div class="container" style="margin-top:80px;">
                <router-link to="Plants" class="btn btn-primary justify-center mb-3">
                    <i class="fa-solid fa-chevron-left"></i>
                    <span>上一頁</span>
                </router-link>
                <div class="alert flex justify-center">
                    <span class="text-3xl">養殖植物 - {{ plantDetails ? plantDetails.plantName : '' }}</span>
                </div>
                <div v-if="plantDetails">
                    <div class="bg-black m-auto mt-10 max-sm:w-96 max-sm:h-a2 h-a1"></div>
                    <p>{{ plantDetails.plantDescription }}</p>
                </div>
                <div class="flex justify-center my-8">
                    <button class="btn btn-lg btn-active btn-accent">澆水</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    data() {
        return {
            error: null,
            plantDetails: null
        };
    },
    async mounted() {
        try {

            const token = localStorage.getItem('token');
console.log(token); // 输出Token以确认其存在
const plantId = this.$route.query.plantId;
console.log(plantId); // 输出植物ID以确认其正确

            const response = await axios.get(`http://angelo0218-server.ddns.net:3000/api/plantDetails?plantId=${this.$route.query.plantId}`, {
                headers: {
                    // 在请求头中加入Token
                    Authorization: `Bearer ${token}`
                }
            });
            this.plantDetails = response.data;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                this.error = '您沒有訪問該植物的權限';
                this.$router.push({ name: '首頁' });
            } else {
                this.error = '發生錯誤，請稍後再試';
            }
        }
    }
};
</script>

<style>
.error {
    color: red;
}
</style>
