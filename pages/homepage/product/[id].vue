<script setup lang="ts">
import {useProductStore} from "~/stores/product";
import {useRoute} from "#app";
import {formatRupiah} from "~/helpers/FormatRupiah";
import imageNotFound from '~/assets/image/other/image-not-found.svg';

definePageMeta({
  layout: 'homepage',
})

const productStore = useProductStore();
const route = useRoute()

await productStore.getProductById(route.params.id)
console.log(productStore.product)
</script>

<template>
  <div>
    <section class="detail-product header container section-gap-margin">
      <div class="row">
        <div class="col-12">
          <h2 class="title">Detail Product</h2>
        </div>
        <div class="col-lg-9 content-gap">
          <div class="row">
            <div class="col-lg-5">
              <div class="product-image d-flex flex-column gap-2">
                <img :src="productStore.product.image_url != '' ? `http://localhost:8000/${productStore.product.image_url}` : imageNotFound" alt="Product Image">
                <div class="wrapper-image-scroll">
                  <div class="wrapper-image d-flex gap-2">
                    <img v-for="(image, index) in productStore.product.images" :key="index" :src="image.image_path != '' ? `http://localhost:8000/${image.image_path}` : imageNotFound" alt="Product Image" :class="{active: image.is_primary}">
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-7">
              <h3 class="product-title">{{productStore.product.name}}</h3>
              <p class="product-sold">Sold Out 400+</p>
              <h2 class="product-price">{{formatRupiah(productStore.product.discount != 0 ? productStore.product.price - productStore.product.discount / 100 * productStore.product.price : productStore.product.price)}}</h2>
              <div class="product-discount d-flex align-items-center gap-2" v-if="productStore.product.discount != 0">
                <p>{{productStore.product.discount}}%</p>
                <h6>{{formatRupiah(productStore.product.price)}}</h6>
              </div>
              <p class="description">{{productStore.product.description}}</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 content-gap">
          <div class="card-checkout">
            <h6 class="checkout-title">Set Quantity and Notes</h6>
            <div class="checkout-product d-flex gap-3 align-items-center">
              <img :src="productStore.product.image_url != '' ? `http://localhost:8000/${productStore.product.image_url}` : imageNotFound" alt="Product Image">
              <h6>{{productStore.product.name}}</h6>
            </div>
            <div class="checkout-quantity">
              <div class="input-group d-flex align-items-center gap-2">
                <button type="button">-</button>
                <input type="text" class="input" :value="quantity">
                <button type="button">+</button>
              </div>
              <p>Stock: <span>100</span></p>
            </div>
            <div class="checkout-button d-flex gap-2 align-items-center">
              <form class="form w-100">
                <input type="hidden" v-model="product_id">
                <input type="hidden" v-model="qty">
                <button type="submit" class="button-primary-small w-100">Checkout</button>
              </form>
              <form class="form w-100">
                <input type="hidden" v-model="product_id">
                <input type="hidden" v-model="qty">
                <button type="submit" class="button-reverse w-100">Cart</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
</style>