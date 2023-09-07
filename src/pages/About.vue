<template>
    <Nav/>
    <div class="about-us">
        <h2 class="text-2xl font-semibold mb-4">關於我們</h2>
        <p class="mb-6">
            歡迎來到 ONlineBean，我們是一個熱愛植物養殖的團隊，專注於提供線上植物養殖的服務。無論您是新手還是有經驗的植物愛好者，我們都致力於為您提供最好的養殖體驗。
        </p>
        <p class="mb-6">
            如果您對我們的服務有任何疑問、建議或反饋，請不要猶豫，填寫以下表單與我們聯繫。我們非常樂意聆聽您的想法，並持續改進我們的服務。
        </p>
        <iframe src="https://forms.gle/WgwqH3Di2R2RWrARA" frameborder="0" width="100%" height="500"></iframe>
    </div>
</template>

<script>
import Nav from '../components/nav.vue';
export default {
    components: {
        Nav
    },
    name: 'AboutUs'
}
</script>

<style scoped>
.about-us {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}
</style>
