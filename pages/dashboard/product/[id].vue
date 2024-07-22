<script setup lang="ts">
import { useProductStore } from "~/stores/product";
import { useSubCategoryStore } from "~/stores/subCategory";
import { useRoute } from '#app';
import { ref, onMounted, watch, computed } from 'vue';
import { formatRupiah } from "~/helpers/FormatRupiah";
import Cookies from "js-cookie";

definePageMeta({
  title: 'Detail Product Page',
  layout: 'dashboard'
})

const productStore = useProductStore();
const subCategoryStore = useSubCategoryStore();
const route = useRoute();

await productStore.getProductById(route.params.id);
const categories = ref([]);
const isPromoExpiredDisabled = ref(true);
const isPreOrderDurationDisabled = ref(true);
let productImageLength = ref(0)
let alertMessage = useCookie('alert-message')
let alertPage = useCookie('alert-page')

const loadProduct = async() => {
  await productStore.getProductById(route.params.id);
  categories.value = productStore.product?.categories.map(category => category.sub_category.id);
  productStore.product.price = formatRupiah(productStore.product.price)
}

onMounted(async () => {
  await loadProduct();
  await subCategoryStore.getAllSubCategoryWithoutPaginate();
  categories.value = productStore.product?.categories.map(category => category.sub_category.id);
  productImageLength.value = productStore.product.images.length
});

watch(productStore.product.discount, (newVal) => {
  isPromoExpiredDisabled.value = !(newVal > 0);
});

watch(productStore.product.is_pre_order, (newVal) => {
  isPreOrderDurationDisabled.value = newVal !== 'true';
});

const formattedPromoExpired = computed(() => {
  const promoExpired = productStore.product.promo_expired;
  if (promoExpired) {
    const date = new Date(promoExpired);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  return '';
});

const isPreOrder = computed({
  get() {
    return productStore.product.is_pre_order ? 'true' : 'false';
  },
  set(value: string) {
    productStore.product.is_pre_order = value === 'true';
  }
});

onBeforeRouteLeave((to, from, next) => {
  Cookies.remove('alert-message');
  Cookies.remove('alert-page');
  next();
});

onBeforeRouteUpdate((to, from, next) => {
  Cookies.remove('alert-message');
  Cookies.remove('alert-page');
  next();
});
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div v-if="alertPage == 'Product'" class="alert alert-success w-100" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <form class="form w-100">
            <div class="row g-3">
              <div class="col-12 d-flex gap-3 align-items-end">
                <div class="wrapper d-flex flex-column input-group">
                  <label for="image">Product Image</label>
                  <div class="wrapper d-flex flex-wrap gap-2">
                    <img v-if="productImageLength > 0" v-for="(image, index) in productStore.product.images" :key="index" :src="`http://localhost:8000/${image.image_path}`" class="input-image" :class="{active: image.is_primary}" alt="Product Image" style="border-radius: 4px;"/>
                    <img v-else :src="'https://placehold.co/600x400?text=Image+Not+Found'" class="input-image" alt="Product Image" style="border-radius: 4px;">
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="name">Name</label>
                  <input type="text" class="input w-100" name="name" id="name"
                         placeholder="Enter your name.." autocomplete="off" v-model="productStore.product.name" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="price">Price</label>
                  <input type="text" class="input w-100" name="price" id="price"
                         placeholder="Enter your price.." autocomplete="off" v-model="productStore.product.price" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="weight">Weight</label>
                  <input type="number" step="0.01" class="input w-100" name="weight" id="weight"
                         placeholder="Enter your weight.." autocomplete="off" v-model="productStore.product.weight" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="discount">Discount (Percent)</label>
                  <input type="number" class="input w-100" name="discount" id="discount"
                         placeholder="Enter your discount.." autocomplete="off" v-model="productStore.product.discount" min="0" readonly>
                </div>
              </div>
              <div class="col-md-6" :class="{'d-none': isPromoExpiredDisabled}">
                <div class="input-group d-flex flex-column">
                  <label for="promo_expired">Promo Expired</label>
                  <input type="datetime-local" class="input w-100" name="promo_expired" id="promo_expired"
                         placeholder="Enter your promo expired.." autocomplete="off" v-model="formattedPromoExpired" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="is_pre_order">Is Pre Order</label>
                  <select class="input w-100" name="is_pre_order" id="is_pre_order" autocomplete="off" v-model="isPreOrder" disabled>
                    <option value="true">Active</option>
                    <option value="false">Unactive</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6" :class="{'d-none': isPreOrderDurationDisabled}">
                <div class="input-group d-flex flex-column">
                  <label for="pre_order_duration">Pre Order Duration (Days)</label>
                  <input type="number" class="input w-100" name="pre_order_duration" id="pre_order_duration"
                         placeholder="Enter your pre order duration.." autocomplete="off" v-model="productStore.product.pre_order_duration" readonly>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label>Sub Category</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(subCategory, index) in subCategoryStore.subCategoryAll" :key="index">
                      <input type="checkbox" :id="subCategory.id" :value="subCategory.id" v-model="categories" disabled>
                      <label class="mb-0" :for="subCategory.id">{{subCategory.name}}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="description">Description</label>
                  <textarea class="input w-100" name="description" id="description" autocomplete="off" v-model="productStore.product.description" rows="4" readonly></textarea>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex justify-content-between gap-2">
                  <NuxtLink :to="{path: '/dashboard/product'}" class="button-reverse">Back to Page</NuxtLink>
                  <NuxtLink :to="{path: `/dashboard/product/image/${route.params.id}`}" class="button-primary-small">Product Image</NuxtLink>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>