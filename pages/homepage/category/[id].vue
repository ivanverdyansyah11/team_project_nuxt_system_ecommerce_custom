<script setup lang="ts">
import {useCategoryStore} from "~/stores/category";
import {useSubCategoryStore} from "~/stores/subCategory";
import {onMounted, ref} from "vue";
import {useRoute} from "#app";
import imageNotFound from '~/assets/image/other/image-not-found.svg';

definePageMeta({
  layout: 'homepage',
})

const route = useRoute()
const products = ref()
const categoryStore = useCategoryStore()
const subCategoryStore = useSubCategoryStore()

const changeProduct = (async(id: string) => {
  if (id == '') {
    console.log(id)
  } else {
    await subCategoryStore.getSubCategoryById(id)
    console.log(subCategoryStore.subCategory)
  }
})

await categoryStore.getCategoryById(route.params.id)
</script>

<template>
  <div>
    <!-- SECTION HEADER -->
    <section class="header container section-gap">
      <div class="row align-items-md-center">
        <div class="col-12 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 gap-md-0">
          <h2 class="title">{{categoryStore.category.name}}</h2>
        </div>
      </div>
    </section>
    <!-- END SECTION HEADER -->


    <!-- SECTION SUB CATEGORY -->
    <section class="sub-category container content-gap" id="subCategory">
      <div class="row">
        <div class="col-12">
          <div class="sub-category-scroll">
            <div class="wrapper-sub-category d-flex gap-2">
              <button type="button" class="sub-category" @click="changeProduct('')">All Product</button>
              <button type="button" class="sub-category" v-for="(subCategory, index) in categoryStore.category.sub_categories" :key="index" @click="changeProduct(subCategory.id)">{{subCategory.name}}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- END SECTION SUB CATEGORY -->
  </div>
</template>

<style scoped>
</style>
