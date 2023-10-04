<template>
  <div class="container">
    <div class="content">
      <img src="/404.png" alt="404" class="image" />
      <h1 class="title font-black">哎呀！頁面未找到</h1>
      <p class="description ">抱歉，您訪問的頁面不存在。</p>
      <router-link to="/" class="home-link">返回首頁</router-link>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'NotFound'
}
</script>
  
<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin-top: 20vh;

}

.content {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px #00000033;
  background-color: white;
  width: 70%;
  height: auto;

}

.image {
  max-width: 60%;
  height: auto;

}

.title {
  font-size: 36px;
  color: #000;
  margin-top: 20px;
}

.description {
  font-size: 18px;
  color: #000;
  margin-top: 10px;
}

.home-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #28a745;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #218838;
}
</style>
  