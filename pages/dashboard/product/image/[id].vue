<script setup lang="ts">
import { useProductStore } from "~/stores/product";
import { useRoute, useRouter } from '#app';
import { ref, onMounted } from 'vue';
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import Cookies from "js-cookie";

definePageMeta({
  title: `Product Image Page`,
  layout: 'dashboard'
});

const productStore = useProductStore();
const route = useRoute();
const router = useRouter();

let productImageLength = ref(0)
const createDataImage = ref('https://placehold.co/600x400?text=Image+Not+Found');
const file = ref(null);
const productImageData = ref(null);

const schema = yup.object({
  image: yup.mixed().required('Image is required'),
});

const { handleSubmit } = useForm({
  validationSchema: schema,
});

const { value: image, errorMessage: imageError } = useField('image');

const previewImage = (e: any) => {
  file.value = e.target.files[0];
  image.value = e.target.files[0];
  if (!file.value) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      createDataImage.value = reader.result;
    }
    e.target.value = "";
  };
  reader.readAsDataURL(file.value);
}

const uploadImageProduct = handleSubmit(async (values) => {
  const formData = new FormData();
  formData.append('image', file.value);
  formData.append('is_primary', 0);
  formData.append('product_id', route.params.id);
  try {
    await productStore.saveImageProduct(formData, route.params.id);
    Cookies.set('alert-message', 'Successfully created new product image');
    Cookies.set('alert-page', 'Product');
    router.push(`/dashboard/product/${route.params.id}`);
  } catch (error) {
    console.error('Error creating service:', error);
  }
});

const updateProductImage = async () => {
  if (productImageData.value) {
    await productStore.updateImageProduct(productImageData.value);
    if (productStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully update status product image');
      Cookies.set('alert-page', 'Product');
      router.push(`/dashboard/product/${route.params.id}`);
    }
    productImageData.value = null;
    await productStore.getProductById(route.params.id);
    productImageLength.value = productStore.product.images.length;
  }
};

const confirmDeleteProductImage = async () => {
  if (productImageData.value) {
    await productStore.deleteImageProduct(productImageData.value);
    if (productStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted product image');
      Cookies.set('alert-page', 'Product');
      router.push(`/dashboard/product/${route.params.id}`);
    }
    productImageData.value = null;
    await productStore.getProductById(route.params.id);
    productImageLength.value = productStore.product.images.length;
  }
};

const loadProduct = async() => {
  await productStore.getProductById(route.params.id);
}

onMounted(async () => {
  await loadProduct();
  productImageLength.value = productStore.product.images.length
});
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form @submit.prevent="uploadImageProduct" class="form w-100">
            <div class="row g-3">
              <div class="col-12 d-flex gap-3 align-items-end">
                <div class="wrapper d-flex flex-column input-group" style="width: fit-content;">
                  <label for="image" class="form-label" style="width: fit-content;">Add Product Image</label>
                  <img :src="createDataImage" class="input-image" alt="Service Image" style="border-radius: 4px;"/>
                </div>
                <div class="wrapper">
                  <input type="file" id="image" class="input-hide" @change="previewImage" />
                  <label for="image" class="button-reverse w-100 text-center mt-3">Choose Image</label>
                  <p class="invalid-label">{{ imageError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="wrapper-table mt-2">
                  <table class="table" style="width:100%">
                    <thead>
                    <tr>
                      <th>Image List</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td v-if="productImageLength > 0" :class="{'d-flex gap-3': productImageLength > 0}">
                        <div class="wrapper-image-product position-relative" v-for="(image, index) in productStore.product.images" :key="index">
                          <img :src="`http://localhost:8000/${image.image_path}`" class="input-image position-relative" :class="{active: image.is_primary}" alt="Product Image" style="border-radius: 4px;"/>
                          <div class="popup-action d-flex gap-3 align-items-center justify-content-center">
                            <i class="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#updateModal" @click="productImageData = {product_id: route.params.id, product_image_id: image.id}"></i>
                            <i class="fa-solid fa-trash-can" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="productImageData = {ids: [image.id]}"></i>
                          </div>
                        </div>
                      </td>
                      <td v-else>Image product not found!</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <button type="submit" class="button-primary-small">Save Image</button>
                  <NuxtLink :to="{path: `/dashboard/product/${route.params.id}`}" class="button-reverse">Back to Detail Page</NuxtLink>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h1 class="modal-title fs-5" id="updateModalLabel">Update Status Image Product</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to update status this image product?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Update</button>
            <button type="button" class="button-primary-small" @click="updateProductImage" data-bs-dismiss="modal">Update Image Product</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Image Product</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this image product?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteProductImage" data-bs-dismiss="modal">Delete Image Product</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>