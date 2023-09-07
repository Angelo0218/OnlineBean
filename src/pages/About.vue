<template>
   
    <div class="about-us">
        <h2 class="title font-bold">關於我們</h2>
        <p class="rounded-xl w-auto h-1 mt-10 title2  "></p>
        <p class="description">
            你好！我們是一群充滿熱情和創意的高中生。這個線上養殖網站是我們的專題作業，由初構想到實際製作，每一步都充滿了我們的汗水和心。我們希望透過這個平台，將虛擬技術和真實世界結合，為使用者提供一個全新、互動的養殖體驗。
        </p>
        <p class="feedback">
            學生時期的我們雖然還在學習，但我們相信好的點子和堅持可以打破年齡的界限。你的每一份反饋都是對我們最寶貴的鼓勵和建議，請不吝告訴我們你的想法！
        </p>
        <p class="thanks">
            再次感謝你的光臨，期待你在這個平台上的每一次探索和收穫！
        </p>
        <iframe class="form" src="https://forms.gle/tixTpAEcFLs4y7CM9" frameborder="0" width="100%" height="500"></iframe>
    </div>
</template>

<script>

export default {

    name: 'AboutUs'
}
</script>

<style scoped>
.about-us {
    max-width: 800px;
    margin: 40px auto;
    padding: 30px;
    background-color: #282c34;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.title {
    font-size: 2.5rem;
    color: #4a90e2;
    margin-bottom: 25px;
  
}
.title2 {
    background-color:#4a90e2;
    margin-top: -10px;
    margin-bottom: 20px;

}
.description, .feedback, .thanks {
    font-size: 1.15rem;
    line-height: 1.8;
    margin-bottom: 20px;
    color: #d1d5d9;
    text-align: justify;
}

.form {
    border-radius: 10px;
    border: 1px solid #434a52;
}
</style>
