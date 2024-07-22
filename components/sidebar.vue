<script setup lang="ts">
import { navigateTo } from "nuxt/app";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const logout = async (event: any) => {
  event.preventDefault();
  await authStore.logout();
  navigateTo('/dashboard/auth/login');
};

const toggleActive = (event: Event) => {
  const button = event.currentTarget as HTMLElement;
  button.classList.toggle('active');
};
</script>

<template>
  <nav class="sidebar d-flex flex-column align-items-center">
    <NuxtLink to="/dashboard">
      <img src="~/assets/image/brand/brand-logo.svg" alt="Brand Logo" class="brand-logo">
    </NuxtLink>
    <div class="sidebar-menu d-flex flex-column w-100">
      <NuxtLink to="/dashboard"
         class="menu-link d-flex align-items-center gap-2" :class="{ active: $route.path === '/dashboard' }">
        <i class="fa-solid fa-gauge"></i>
        Dashboard
      </NuxtLink>
      <button type="button" class="menu-link d-flex flex-column parent-menu" :class="{ active: $route.path.startsWith('/dashboard/supplier') || $route.path.startsWith('/dashboard/staff') || $route.path.startsWith('/dashboard/customer') }" @click="toggleActive($event)">
        <div class="wrapper d-flex align-items-center gap-2">
          <i class="fa-solid fa-circle-user"></i>
          User
        </div>
        <div class="child-menu flex-column gap-1">
          <NuxtLink to="/dashboard/supplier" :class="{ active: $route.path.startsWith('/dashboard/supplier') }">Supplier</NuxtLink>
          <NuxtLink to="/dashboard/staff" :class="{ active: $route.path.startsWith('/dashboard/staff') }">Staff</NuxtLink>
          <NuxtLink to="/dashboard/customer" :class="{ active: $route.path.startsWith('/dashboard/customer') }">Customer</NuxtLink>
        </div>
      </button>
      <button type="button" class="menu-link d-flex flex-column parent-menu" :class="{ active: $route.path === '/dashboard/product' || $route.path.startsWith('/dashboard/product/') || $route.path.startsWith('/dashboard/category') || $route.path.startsWith('/dashboard/sub-category') }" @click="toggleActive($event)">
        <div class="wrapper d-flex align-items-center gap-2">
          <i class="fa-solid fa-database"></i>
          Master Data
        </div>
        <div class="child-menu flex-column gap-1">
          <NuxtLink to="/dashboard/product" :class="{ active: $route.path === '/dashboard/product' || $route.path.startsWith('/dashboard/product/') }">Product</NuxtLink>
          <NuxtLink to="/dashboard/category" :class="{ active: $route.path.startsWith('/dashboard/category') }">Category</NuxtLink>
          <NuxtLink to="/dashboard/sub-category" :class="{ active: $route.path.startsWith('/dashboard/sub-category') }">Sub Category</NuxtLink>
        </div>
      </button>
      <button type="button" class="menu-link d-flex flex-column parent-menu" :class="{ active: $route.path.startsWith('/dashboard/product-in') || $route.path.startsWith('/dashboard/product-out') || $route.path.startsWith('/dashboard/product-broken') || $route.path.startsWith('/dashboard/product-return') }" @click="toggleActive($event)">
        <div class="wrapper d-flex align-items-center gap-2">
          <i class="fa-solid fa-database"></i>
          Inventaris
        </div>
        <div class="child-menu flex-column gap-1">
          <NuxtLink to="/dashboard/product-in" :class="{ active: $route.path.startsWith('/dashboard/product-in') }">Product In</NuxtLink>
          <NuxtLink to="/dashboard/product-out" :class="{ active: $route.path.startsWith('/dashboard/product-out') }">Product Out</NuxtLink>
          <NuxtLink to="/dashboard/product-broken" :class="{ active: $route.path.startsWith('/dashboard/product-broken') }">Product Broken</NuxtLink>
          <NuxtLink to="/dashboard/product-return" :class="{ active: $route.path.startsWith('/dashboard/product-return') }">Product Return</NuxtLink>
        </div>
      </button>
      <form @submit.prevent="logout">
        <button type="submit" class="menu-link d-flex gap-2 align-items-center">
          <i class="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>
      </form>
    </div>
  </nav>
</template>

<style scoped>

</style>