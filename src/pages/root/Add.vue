<template>
  <div class="pt-20 text-center">
    <span class=" bg-slate-300 rounded-md font-black text-black ">新增植物</span>

    <form @submit.prevent="submitForm">


      <div class="pb-10">
        <label for="plantName">植物名稱:</label>
        <input type="text" id="plantName" v-model="plantName">
      </div>

      <div class="pb-10">
        <label for="plantDescription">植物描述:</label>
        <textarea id="plantDescription" v-model="plantDescription"></textarea>
      </div>

      <div class="pb-10 ">
        <label for="image">圖片路徑:</label>
        <input type="text" id="image" v-model="image">
      </div>

      <button type="submit"
        class="focus:outline-none text-white bg-green-900 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">增加</button>
    </form>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      plantName: '',
      plantDescription: '',
      image: ''
    }
  },
  methods: {
    async submitForm() {
      if (!this.plantName || !this.plantDescription || !this.image) {
          alert('請完整的填');
          return;
        }
      try {
        const token = localStorage.getItem('token');
        // 發送帶有 JWT 的請求
        const apiUrl = import.meta.env.VITE_API_URL;
        await axios.post(`${apiUrl}/addPlant`, {
          plantID: this.plantID,
          plantName: this.plantName,
          plantDescription: this.plantDescription,
          image: this.image
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });


        alert('植物已成功新增！');
        this.resetForm();
      } catch (error) {
        alert('新增失敗：' + error.response.data);
      }
    },
    resetForm() {
      this.plantName = '';
      this.plantDescription = '';
      this.image = '';
    }
  }
}
</script>
<style scoped>
input, textarea {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin: 4px;
  display: block;
  width: 100%;
  box-sizing: border-box;
}
button {
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
}
</style>
