<template>
    <main class="px-8 py-12 space-y-6  mt-10">
        <h1 class="text-4xl font-bold text-center mb-8">討論區</h1>
        <div class="border text-card-foreground shadow-lg rounded-lg " data-v0-t="card">
            <div class="flex flex-col space-y-1.5 p-6  text-white rounded-t-lg">
                <h3 class="font-semibold tracking-tight text-2xl">發布文章</h3>
            </div>
            <div class="p-6 space-y-4 ">
                <div class="space-y-2">
                    <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="title">
                        標題
                    </label>
                    <input
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="title" placeholder="輸入您的文章標題" required="" type="text" />
                </div>
                <div class="space-y-2">
                    <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="image">
                        圖片
                    </label>
                    <input
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="image" required="" type="file" />
                </div>
                <div class="space-y-2">
                    <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="content">
                        內容
                    </label>
                    <textarea
                        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="content" placeholder="在此輸入您的文章內容" required=""></textarea>
                </div>
            </div>
            <div class="flex items-center p-6  rounded-b-lg">
                <button
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 px-4 py-2 w-full text-white">
                    發布
                </button>
            </div>
        </div>
        <section>
            <h2 class="text-2xl font-bold text-center mb-8">查看文章</h2>
            <div class="grid grid-cols-2 gap-12 mt-4">
                <div class="border text-card-foreground shadow-lg rounded-lg " data-v0-t="card">
                    <div class="flex flex-col space-y-1.5 p-6  text-white rounded-t-lg">
                        <h3 class="font-semibold tracking-tight text-xl">文章標題 1</h3>
                        <p class="text-sm text-gray-200">發布於 2023年1月1日</p>
                    </div>
                    <div class="p-6 ">
                        <div class="w-full h-[300px] bg-gray-200">
                            <img src="/placeholder.svg" alt="文章圖片 1" class="w-full h-full object-cover" width="600"
                                height="300" style="aspect-ratio: 600 / 300; object-fit: cover;" />
                        </div>
                        <div class="prose mt-4">這是文章內容的範例，這裡可以寫下文章的詳細內容。</div>
                    </div>
                    <div class="flex items-center p-2  rounded-b-lg" style="background-color: ">
                        <button
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline h-10 px-4 py-2 ">
                            閱讀更多
                        </button>
                    </div>
                    <section class="mt-4 p-5">
                        <h3 class="text-xl font-bold ">留下評論</h3>
                        <div class="grid gap-4 mt-4">
                            <div class="text-sm flex items-start gap-4">
                                <span class="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10 border">
                                    <span
                                        class="flex h-full w-full items-center justify-center rounded-full bg-muted">U</span>
                                </span>
                                <div class="w-full grid gap-1.5">
                                    <textarea
                                        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="留下評論..." required=""></textarea>
                                    <button
                                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 px-4 py-2  border-black">
                                        發布評論
                                    </button>
                                </div>
                            </div>
                            <div class="text-sm flex items-start gap-4">
                                <span class="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10 border">
                                    <span
                                        class="flex h-full w-full items-center justify-center rounded-full bg-muted">U</span>
                                </span>
                                <div class="w-full grid gap-1.5">
                                    <p class="">這是一個範例評論，用來展示評論的格式和外觀。</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            
            </div>
        </section>
    </main>
</template>