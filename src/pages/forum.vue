<template>
    <main class="px-8 py-12 space-y-6 mt-10">
        <h1 class="text-4xl font-bold text-center mb-8">討論區</h1>
        <div class="border text-card-foreground shadow-lg rounded-lg" data-v0-t="card">
            <div class="flex flex-col space-y-1.5 p-6 text-white rounded-t-lg">
                <h3 class="font-semibold tracking-tight text-2xl">發布文章</h3>
            </div>
            <form @submit.prevent="submitPost" class="p-6 space-y-4">
                <div class="space-y-2">
                    <label class="text-sm font-medium" for="title">標題</label>
                    <input v-model="newPost.title" class="flex h-10 w-full rounded-md border px-3 py-2 text-sm" id="title"
                        placeholder="輸入您的文章標題" required type="text" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium" for="image">圖片</label>
                    <input @change="handleImageChange" class="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                        id="image" type="file" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium" for="content">內容</label>
                    <textarea v-model="newPost.content" class="flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
                        id="content" placeholder="在此輸入您的文章內容" required></textarea>
                </div>
                <div class="flex items-center p-6 rounded-b-lg">
                    <button type="submit"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary hover:bg-primary/90 h-10 px-4 py-2 w-full text-white">
                        發布
                    </button>
                </div>
            </form>
        </div>
        <section>
            <h2 class="text-2xl font-bold text-center mb-8">查看文章</h2>
            <div class="grid grid-cols-2 gap-12 mt-4">
                <!-- 文章列表 -->
                <div v-for="post in posts" :key="post.id" class="border text-card-foreground shadow-lg rounded-lg"
                    data-v0-t="card">
                    <div class="flex flex-col space-y-1.5 p-6 text-white rounded-t-lg">
                        <h3 class="font-semibold tracking-tight text-xl">{{ post.title }}</h3>
                        <p class="text-sm text-gray-200">發布於 {{ new Date(post.created_at).toLocaleDateString() }}</p>
                    </div>
                    <div class="p-6">
                        <div class="w-full h-[300px]">
                            <img :src="getImageUrl(post.imageUrl)" alt="文章圖片" class="w-full h-full object-cover"
                                style="aspect-ratio: 600 / 300; object-fit: cover;" />
                        </div>
                        <div class="prose mt-4">{{ post.content }}</div>
                    </div>
                    <!-- <button @click="toggleComments(post.id)"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary hover:bg-primary/90 h-10 px-4 py-2 text-white">
                        {{ selectedPostId === post.id ? '關閉評論' : '開啟評論' }}
                    </button> -->
                    <!-- 評論部分 -->
                    <section v-if="selectedPostId === post.id" class="mt-4 p-5">
                        <h3 class="text-xl font-bold ">留下評論</h3>
                        <div class="grid gap-4 mt-4">
                            <div class="text-sm flex items-start gap-4">
                                <textarea v-model="newComment"
                                    class="flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
                                    placeholder="留下評論..." required></textarea>
                                <button @click="submitComment(post.id)"
                                    class="  inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary hover:bg-primary/90 h-10 px-4 py-2 text-white">
                                    發布評論
                                </button>
                            </div>
                            <div v-for="comment in comments[post.id]" :key="comment.id"
                                class="text-sm flex items-start gap-4">
                                <p>{{ comment.content }}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            posts: [],
            comments: {},
            newPost: {
                title: '',
                content: '',
                image: null
            },
            newComment: '',
            selectedPostId: null,
            apiUrl: import.meta.env.VITE_API_URL
        };
    },
    mounted() {
        this.fetchPosts();
    },
    methods: {
        async fetchPosts() {
            try {
                const response = await axios.get(`${this.apiUrl}/forum/posts`);
                this.posts = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        handleImageChange(event) {
            this.newPost.image = event.target.files[0];
        },
        async submitPost() {
            try {
                const formData = new FormData();
                formData.append('title', this.newPost.title);
                formData.append('content', this.newPost.content);
                if (this.newPost.image) {
                    formData.append('image', this.newPost.image);
                }
                await axios.post(`${this.apiUrl}/forum/posts`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                this.newPost.title = '';
                this.newPost.content = '';
                this.newPost.image = null;
                this.fetchPosts();
            } catch (error) {
                console.error(error);
            }
        },
        async showComments(postId) {
            if (!this.comments[postId]) {
                try {
                    const response = await axios.get(`${this.apiUrl}/forum/posts/${postId}/comments`);
                    this.$set(this.comments, postId, response.data);
                } catch (error) {
                    console.error(error);
                }
            }
            this.selectedPostId = postId;
        },
        async submitComment(postId) {
            try {
                await axios.post(`${this.apiUrl}/forum/posts/${postId}/comments`, {
                    content: this.newComment
                });
                this.newComment = '';
                this.showComments(postId);
            } catch (error) {
                console.error(error);
            }
        },
        getImageUrl(imagePath) {
            return `${this.apiUrl}/${imagePath}`;
        },
        toggleComments(postId) {
            if (this.selectedPostId === postId) {
                this.selectedPostId = null;
            } else {
                this.showComments(postId);
            }
        },
    }
};
</script>
