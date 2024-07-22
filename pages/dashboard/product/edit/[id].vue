<script setup lang="ts">
import { useProductStore } from "~/stores/product";
import { useSubCategoryStore } from "~/stores/subCategory";
import { useRoute } from '#app';
import { ref, onMounted, computed, watch } from 'vue';
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import Cookies from "js-cookie";
import {navigateTo} from "nuxt/app";

definePageMeta({
  title: 'Edit Product Page',
  layout: 'dashboard'
})

const productStore = useProductStore();
const subCategoryStore = useSubCategoryStore();
const route = useRoute();

const schema = yup.object({
  name: yup.string().required('Name is required'),
  price: yup.number().required('Price is required'),
  weight: yup.number().positive('Weight must be positive').required('Weight is required'),
  discount: yup.string(),
  promo_expired: yup.date(),
  is_pre_order: yup.string().required('Pre order is required'),
  pre_order_duration: yup.number(),
  categories: yup.array().min(1, 'At least one category is required'),
  description: yup.string().required('Description is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
});

const { value: name, errorMessage: nameError } = useField('name');
const { value: price, errorMessage: priceError } = useField('price');
const { value: discount, errorMessage: discountError } = useField('discount');
const { value: weight, errorMessage: weightError } = useField('weight');
const { value: promo_expired, errorMessage: promoExpiredError } = useField('promo_expired');
const { value: is_pre_order, errorMessage: isPreOrderError } = useField('is_pre_order');
const { value: pre_order_duration, errorMessage: preOrderDurationError } = useField('pre_order_duration');
const { value: description, errorMessage: descriptionError } = useField('description');
const categories = ref([]);
const categoriesError = ref('');

const isPromoExpiredDisabled = ref(true);
const isPreOrderDurationDisabled = ref(true);

watch(discount, (newVal) => {
  isPromoExpiredDisabled.value = !(newVal > 0);
});

watch(is_pre_order, (newVal) => {
  isPreOrderDurationDisabled.value = newVal !== 'true';
});

watch(promo_expired, (newVal) => {
  if (newVal) {
    const date = new Date(newVal);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    promo_expired.value = `${year}-${month}-${day}T${hours}:${minutes}`;
  }
});

const loadProduct = async() => {
  await productStore.getProductById(route.params.id);
  setValues({
    name: productStore.product.name,
    price: productStore.product.price,
    discount: productStore.product.discount,
    weight: productStore.product.weight,
    promo_expired: productStore.product.promo_expired,
    is_pre_order: productStore.product.is_pre_order ? 'true' : 'false',
    pre_order_duration: productStore.product.pre_order_duration,
    description: productStore.product.description,
  })
  categories.value = productStore.product?.categories.map(category => category.sub_category.id);
}

const updateProduct = handleSubmit(async (values) => {
  values.categories = categories.value.map(sub_category_id => ({ sub_category_id }));
  values.promo_expired = values.promo_expired != undefined ? new Date(values.promo_expired).toISOString() : '';
  values.discount = values.discount == '' ? 0 : values.discount;
  values.is_pre_order = values.is_pre_order == 'true';
  values.pre_order_duration = values.pre_order_duration == undefined ? '' : values.pre_order_duration;
  if (values.promo_expired === '') {
    delete values.promo_expired;
  }
  if (values.pre_order_duration === '') {
    delete values.pre_order_duration;
  }
  try {
    await productStore.updateProduct(values, route.params.id);
    if (productStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully update product');
      Cookies.set('alert-page', 'Product');
      navigateTo('/dashboard/product');
    }
  } catch (error) {
    console.error('Error updating product:', error);
  }
});


onMounted(async () => {
  await subCategoryStore.getAllSubCategoryWithoutPaginate();
  await loadProduct()
});
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form @submit.prevent="updateProduct" class="form w-100">
            <div class="row g-3">
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="name">Name</label>
                  <input type="text" class="input w-100" name="name" id="name"
                         placeholder="Enter your name.." autocomplete="off" v-model="name">
                  <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="price">Price</label>
                  <input type="number" class="input w-100" name="price" id="price"
                         placeholder="Enter your price.." autocomplete="off" v-model="price">
                  <p v-if="priceError" class="invalid-label">{{ priceError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="weight">Weight</label>
                  <input type="number" step="0.01" class="input w-100" name="weight" id="weight"
                         placeholder="Enter your weight.." autocomplete="off" v-model="weight">
                  <p v-if="weightError" class="invalid-label">{{ weightError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="discount">Discount (Percent)</label>
                  <input type="number" class="input w-100" name="discount" id="discount"
                         placeholder="Enter your discount.." autocomplete="off" v-model="discount" min="0">
                  <p v-if="discountError" class="invalid-label">{{ discountError }}</p>
                </div>
              </div>
              <div class="col-md-6" :class="{'d-none': isPromoExpiredDisabled}">
                <div class="input-group d-flex flex-column">
                  <label for="promo_expired">Promo Expired</label>
                  <input type="datetime-local" class="input w-100" name="promo_expired" id="promo_expired"
                         placeholder="Enter your promo expired.." autocomplete="off" v-model="promo_expired">
                  <p v-if="promoExpiredError" class="invalid-label">{{ promoExpiredError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="is_pre_order">Is Pre Order</label>
                  <select class="input w-100" name="is_pre_order" id="is_pre_order" autocomplete="off" v-model="is_pre_order">
                    <option value="true">Active</option>
                    <option value="false">Unactive</option>
                  </select>
                  <p v-if="isPreOrderError" class="invalid-label">{{ isPreOrderError }}</p>
                </div>
              </div>
              <div class="col-md-6" :class="{'d-none': isPreOrderDurationDisabled}">
                <div class="input-group d-flex flex-column">
                  <label for="pre_order_duration">Pre Order Duration (Days)</label>
                  <input type="number" class="input w-100" name="pre_order_duration" id="pre_order_duration"
                         placeholder="Enter your pre order duration.." autocomplete="off" v-model="pre_order_duration">
                  <p v-if="preOrderDurationError" class="invalid-label">{{ preOrderDurationError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label>Sub Category</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(subCategory, index) in subCategoryStore.subCategoryAll" :key="index">
                      <input type="checkbox" :id="subCategory.id" :value="subCategory.id" v-model="categories">
                      <label class="mb-0" :for="subCategory.id">{{subCategory.name}}</label>
                    </div>
                  </div>
                  <p v-if="categoriesError" class="invalid-label">{{ categoriesError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="description">Description</label>
                  <textarea class="input w-100" name="description" id="description" autocomplete="off" v-model="description" rows="4"></textarea>
                  <p v-if="descriptionError" class="invalid-label">{{ descriptionError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <button type="submit" class="button-primary-small">Save Changes</button>
                  <NuxtLink :to="{path: '/dashboard/product'}" class="button-reverse">Cancel Edit</NuxtLink>
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