<template>
    <header>
        <div class="navbar bg-base-100 relative z-20">
            <div class="navbar-start">
                <div class="dropdown">
                    <label tabindex="0" class="btn btn-ghost lg:hidden">
                       
                    </label>
                    <ul tabindex="0"
                        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><router-link to="/">首頁</router-link></li>
                        <li><router-link to="/online">線上養殖</router-link></li>
                        <li><router-Link to="/about">關於我們</router-link></li>
                    </ul>
                </div>
                <a class="btn btn-ghost normal-case text-xl">ONlineBean<span><img src="../assets/Logo.ico"
                            style="width:20px; height:20px;"></span></a>
            </div>
            <div class="navbar-center hidden lg:flex">
                <ul class="menu menu-horizontal px-1">
                    <li><router-link to="/">首頁</router-link></li>
                    <li><router-link to="/plants">線上養殖</router-link></li>
                    <li><router-Link to="/about">關於我們</router-link></li>
                </ul>
            </div>
            <div class="navbar-end">
                <a class="btn"><router-link to="/login">登入</router-link></a>
            </div>
        </div>
    </header>
</template>