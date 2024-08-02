<script setup lang="ts">
import {useCategoryStore} from "~/stores/category";
import {onMounted, ref} from "vue";
import imageNotFound from '~/assets/image/other/image-not-found.svg';

definePageMeta({
  layout: 'homepage',
})

const keyword = ref('')
const categoryStore = useCategoryStore()

const search = async (event: any) => {
  event.preventDefault()
  categoryStore.$state.keyword = keyword.value
  await categoryStore.getAllCategoryWithoutPaginate()
}

onMounted(async() => {
  await categoryStore.getAllCategoryWithoutPaginate()
})
</script>

<template>
  <div>
    <!-- SECTION HEADER -->
    <section class="header container section-gap">
      <div class="row align-items-md-center">
        <div class="col-12 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 gap-md-0">
          <h2 class="title">All Category Available</h2>
          <form class="form" @submit="search">
            <div class="input-group input-group-search position-relative">
              <input type="text" placeholder="Search category..." class="input" v-model="keyword">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </section>
    <!-- END SECTION HEADER -->


    <!-- SECTION CATEGORY -->
    <section class="category content-gap container" id="category">
      <div class="row content-gap g-3 g-md-4">
        <div class="col-6 col-md-4 col-lg-3" v-for="(category, index) in categoryStore.categoryAll" :key="index">
          <NuxtLink :to="{path: `/homepage/category/${category.id}`}" class="card-category">
            <img :src="category.image_path != '' ? `http://localhost:8000/${category.image_path}` : imageNotFound" alt="Category Image">
            <h6 class="category-name">{{category.name}}</h6>
            <div class="category-icon d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
    <!-- END SECTION CATEGORY -->
  </div>
</template>

<style scoped>
</style>
