<script setup lang="ts">
import { useProductStore } from "~/stores/product";
import { ref, onMounted } from 'vue'
import { formatRupiah } from "~/helpers/FormatRupiah";
import Cookies from 'js-cookie'

definePageMeta({
  title: 'Product Page',
  layout: 'dashboard'
})

const keyword = ref('')
const productStore = useProductStore()
let productLength = ref(0)
const productDelete = ref(null);
const totalPages = ref(0)
let alertMessage = useCookie('alert-message')
let alertPage = useCookie('alert-page')

const search = async (event: any) => {
  event.preventDefault()
  productStore.$state.keyword = keyword.value
  await productStore.getAllProduct()
  productLength.value = productStore.productAll.length
  totalPages.value = Math.ceil(productStore.totalPages / productStore.pageSize)
}

const changePage = async (page: number) => {
  productStore.$state.page = page
  await productStore.getAllProduct()
  productLength.value = productStore.productAll.length
}

const confirmDeleteProduct = async () => {
  if (productDelete.value) {
    await productStore.deleteProduct(productDelete.value.id);
    if (productStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted product');
      Cookies.set('alert-page', 'Product');
      alertMessage = useCookie('alert-message')
      alertPage = useCookie('alert-page')
    }
    productDelete.value = null;
    totalPages.value = Math.ceil(productStore.totalPages / productStore.pageSize)
    productLength.value = productStore.productAll.length
  }
};

onMounted(async () => {
  await productStore.getAllProduct()
  productLength.value = productStore.productAll.length
  totalPages.value = Math.ceil(productStore.totalPages / productStore.pageSize)
})

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
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search product.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <NuxtLink :to="{path: `/dashboard/product/create`}" class="button-primary-small d-none d-md-inline-block">Add
              New
              Product</NuxtLink>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Weight</th>
                <th>Pre Order</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="productLength > 0" v-for="(product, index) in productStore.productAll" :key="index">
                <td>{{product.name}}</td>
                <td>{{formatRupiah(product.price)}}</td>
                <td>{{product.discount}}</td>
                <td>{{product.weight}}</td>
                <td>{{product.is_pre_order ? 'Pre Order' : 'Not Pre Order'}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <NuxtLink :to="{path: `/dashboard/product/${product.id}`}"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <NuxtLink :to="{path: `/dashboard/product/edit/${product.id}`}"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="productDelete = product">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="6">Data product not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: productStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(productStore.page - 1)" :disabled="productStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === productStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: productStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(productStore.page + 1)" :disabled="productStore.page === totalPages">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Product</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this product?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteProduct" data-bs-dismiss="modal">Delete Product</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
