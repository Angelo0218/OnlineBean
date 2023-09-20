<template>
  <div class="pt-20">
    <h1>新增植物</h1>

    <form @submit.prevent="submitForm">
      <div>
        <label for="plantID">植物 ID:</label>
        <input type="text" id="plantID" v-model="plantID">
      </div>

      <div>
        <label for="plantName">植物名稱:</label>
        <input type="text" id="plantName" v-model="plantName">
      </div>

      <div>
        <label for="plantDescription">植物描述:</label>
        <textarea id="plantDescription" v-model="plantDescription"></textarea>
      </div>

      <div>
        <label for="image">圖片路徑:</label>
        <input type="text" id="image" v-model="image">
      </div>

      <button type="submit">新增</button>
    </form>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      plantID: '',
      plantName: '',
      plantDescription: '',
      image: ''
    }
  },
  methods: {
    async submitForm() {
      try {
        const token = localStorage.getItem('token');
        // 發送帶有 JWT 令牌的請求
        await axios.post('http://angelo0218-server.ddns.net/api/addPlant', {
          plantID: this.plantID,
          plantName: this.plantName,
          plantDescription: this.plantDescription,
          image: this.image
        }, {
          headers: {
            'Authorization': 'Bearer ' + token  // 將令牌添加到請求標頭中
          }
        });
        alert('植物已成功新增！');
        this.resetForm();
      } catch (error) {
        alert('新增失敗：' + error.response.data);
      }
    },
    resetForm() {
      this.plantID = '';
      this.plantName = '';
      this.plantDescription = '';
      this.image = '';
    }
  }
}
</script>
  