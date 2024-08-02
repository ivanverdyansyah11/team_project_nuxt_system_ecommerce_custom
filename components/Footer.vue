<script setup lang="ts">
import {useCategoryStore} from "~/stores/category";

const categoryStore = useCategoryStore();

onMounted(async () => {
  categoryStore.pageSize = 4
  await categoryStore.getAllCategory()
  categoryStore.pageSize = 6
})
</script>

<template>
  <footer class="footer section-gap-margin" id="footer">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <NuxtLink :to="{path: '/homepage'}">
            <img src="~/assets/image/brand/brand-logo.svg" alt="Brand Logo" width="176" class="brand-image">
          </NuxtLink>
          <p>Your one-stop online shop for everything you need, from fashion to electronics, with top-notch service and fast shipping.</p>
          <div class="footer-sosmed d-flex align-items-center" style="gap: 6px;">
            <NuxtLink target="_blank" to="https://instagram.com" class="sosmed">
              <i class="fa-brands fa-instagram" style="font-size: 1.125rem;"></i>
            </NuxtLink>
            <NuxtLink target="_blank" to="https://whatsapp.com" class="sosmed">
              <i class="fa-brands fa-whatsapp" style="font-size: 1.125rem;"></i>
            </NuxtLink>
            <NuxtLink target="_blank" to="https://facebook.com" class="sosmed">
              <i class="fa-brands fa-facebook"></i>
            </NuxtLink>
            <NuxtLink target="_blank" to="https://twitter.com" class="sosmed">
              <i class="fa-brands fa-twitter"></i>
            </NuxtLink>
          </div>
        </div>
        <div class="col-6 col-md-2 my-5 my-md-0">
          <h6>Frequently Link</h6>
          <div class="footer-link d-flex flex-column gap-2">
            <NuxtLink :to="{path: '/homepage#home'}">Home</NuxtLink>
            <NuxtLink :to="{path: '/homepage/promo'}">Promo</NuxtLink>
            <NuxtLink :to="{path: '/homepage/product'}">Product</NuxtLink>
            <NuxtLink :to="{path: '/homepage#about'}">About</NuxtLink>
          </div>
        </div>
        <div class="col-6 col-md-2 my-5 my-md-0">
          <h6>All Category</h6>
          <div class="footer-link d-flex flex-column gap-2">
            <NuxtLink v-for="(category, index) in categoryStore.categoryAll" :key="index" :to="{path: `/homepage/category/${category.id}`}">{{category.name}}</NuxtLink>
          </div>
        </div>
        <div class="col-md-4">
          <h6>Contact Us</h6>
          <div class="footer-link d-flex flex-column gap-2">
            <NuxtLink target="_blank" to="https://whatsapp.com" class="d-flex gap-2 align-items-center">
              <i class="fa-solid fa-phone"></i>
              0361 2408 0608
            </NuxtLink>
            <NuxtLink target="_blank" to="https://mail.com" class="d-flex gap-2 align-items-center">
              <i class="fa-regular fa-envelope"></i>
              atride0908@gmail.com
            </NuxtLink>
          </div>
          <h6 class="mt-3 mb-2">Newsletter</h6>
          <div class="footer-search">
            <input type="text" placeholder="Enter your email..">
            <button type="button">Submit</button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <p class="copyright">2024 AllInOneStore. All right reserved</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>

</style>