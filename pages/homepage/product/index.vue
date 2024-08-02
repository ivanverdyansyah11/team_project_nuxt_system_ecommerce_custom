<script setup lang="ts">
import {useProductStore} from "~/stores/product";
import {onMounted, ref} from "vue";
import {formatRupiah} from "~/helpers/FormatRupiah";
import imageNotFound from '~/assets/image/other/image-not-found.svg';

definePageMeta({
  layout: 'homepage',
})

const keyword = ref('')
const productStore = useProductStore()

const search = async (event: any) => {
  event.preventDefault()
  productStore.$state.keyword = keyword.value
  await productStore.getAllProductWithoutPaginate()
}

onMounted(async() => {
  await productStore.getAllProductWithoutPaginate()
})
</script>

<template>
  <div>
    <!-- SECTION HEADER -->
    <section class="header container section-gap">
      <div class="row align-items-md-center">
        <div class="col-12 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 gap-md-0">
          <h2 class="title">All Product Available</h2>
          <form class="form" @submit="search">
            <div class="input-group input-group-search position-relative">
              <input type="text" placeholder="Search product..." class="input" v-model="keyword">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </section>
    <!-- END SECTION HEADER -->


    <!-- SECTION PRODUCT -->
    <section class="product content-gap container" id="product">
      <div class="row content-gap g-3 g-md-4">
        <div class="col-6 col-md-4 col-lg-3" v-for="(product, index) in productStore.productAll" :key="index">
          <NuxtLink :to="{path: `/homepage/product/${product.id}`}" class="card-product">
            <img :src="product.image_url != '' ? `http://localhost:8000/${product.image_url}` : imageNotFound" alt="Product Image">
            <div class="wrapper d-flex align-items-center justify-content-between mt-3 mb-2">
              <h6 class="product-sold">345 Sold Out</h6>
              <h6 class="product-discount" v-if="product.discount != 0">{{formatRupiah(product.price)}}</h6>
            </div>
            <div class="wrapper d-flex flex-column flex-md-row align-items-start justify-content-between gap-1 gap-md-4">
              <h6 class="product-name">{{product.name}}</h6>
              <h6 class="product-price">{{formatRupiah(product.discount != 0 ? product.price - product.discount / 100 * product.price : product.price)}}</h6>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
    <!-- END SECTION PRODUCT -->
  </div>
</template>

<style scoped>
</style>
