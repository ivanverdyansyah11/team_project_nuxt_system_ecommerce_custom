<script setup lang="ts">
const userLogin = useCookie('auth-user')
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
    <div class="container d-lg-flex justify-content-lg-between align-items-lg-center">
      <NuxtLink :to="{path: '/'}" class="navbar-brand">
        <img src="~/assets/image/brand/brand-logo.svg" alt="Brand Logo" width="176">
      </NuxtLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse d-lg-flex justify-content-lg-center w-100" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <NuxtLink :to="{path: '/homepage'}" class="nav-link mx-1" :class="{active: $route.path == '/homepage'}">Home</NuxtLink>
          <NuxtLink :to="{path: '/homepage/category'}" class="nav-link mx-1" :class="{active: $route.path.startsWith('/homepage/category')}">Category</NuxtLink>
          <NuxtLink to="/homepage#about" class="nav-link mx-1">About</NuxtLink>
          <NuxtLink :to="{path: '/homepage/product'}" class="nav-link mx-1" :class="{active: $route.path.startsWith('/homepage/product')}">Product</NuxtLink>
          <NuxtLink v-if="userLogin" :to="{path: '/homepage/cart'}" class="nav-link d-lg-none mx-1" :class="{active: $route.path.startsWith('/homepage/cart')}">Cart</NuxtLink>
          <NuxtLink v-if="userLogin" :to="{path: '/homepage/profile'}" class="nav-link d-lg-none mx-1" :class="{active: $route.path.startsWith('/homepage/profile')}">Profile</NuxtLink>
          <NuxtLink v-else :to="{path: '/auth/login'}" class="nav-link d-lg-none mx-1">Login Account</NuxtLink>
        </div>
      </div>
      <div v-if="userLogin" class="profile-login d-none d-lg-flex align-items-center" style="gap: 12px;">
        <NuxtLink :to="{path: '/homepage/cart'}" class="profile-icon d-flex align-items-center justify-content-center">
          <i class="fa-solid fa-cart-shopping"></i>
        </NuxtLink>
        <NuxtLink :to="{path: '/homepage/profile'}" class="profile-image">
          <img :src="`http://localhost:8000/${userLogin.user.profile_path}`" alt="Profile Image">
        </NuxtLink>
      </div>
      <NuxtLink v-else :to="{path: '/auth/login'}" class="button-primary-small d-none d-lg-inline-block">Login Account</NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
</style>