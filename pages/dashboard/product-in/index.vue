<script setup lang="ts">
import { useProductInStore } from "~/stores/productIn";
import { useProductStore } from "~/stores/product";
import { useSupplierStore } from "~/stores/supplier";
import { ref, onMounted } from 'vue'
import { useField, useForm } from 'vee-validate'
import { formatDate } from '~/helpers/FormatDate';
import { formatDateTimeLocal } from '~/helpers/FormatDateTimeLocal';
import Cookies from 'js-cookie'
import * as yup from 'yup'

definePageMeta({
  title: 'Inventaris In Page',
  layout: 'dashboard'
})

const keyword = ref('')
const productInStore = useProductInStore()
const productStore = useProductStore()
const supplierStore = useSupplierStore()
let productInLength = ref(0)
const productInData = ref(null);
const totalPages = ref(0)
let alertMessage = useCookie('alert-message')
let alertPage = useCookie('alert-page')

const schema = yup.object({
  product_id: yup.string().required('Product Id is required'),
  supplier_id: yup.string().required('Supplier Id is required'),
  qty: yup.number().required('Quantity is required'),
  date: yup.date().required('Date is required'),
  note: yup.string(),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
});

const { value: product_id, errorMessage: productIdError } = useField('product_id');
const { value: supplier_id, errorMessage: supplierIdError } = useField('supplier_id');
const { value: qty, errorMessage: qtyError } = useField('qty');
const { value: date, errorMessage: dateError } = useField('date');
const { value: note, errorMessage: noteError } = useField('note');

const search = async (event: any) => {
  event.preventDefault()
  productInStore.$state.keyword = keyword.value
  productInStore.$state.page = 1
  await productInStore.getAllProductIn()
  productInLength.value = productInStore.productInAll.length
  totalPages.value = Math.ceil(productInStore.totalPages / productInStore.pageSize)
}

const changePage = async (page: number) => {
  productInStore.$state.page = page
  await productInStore.getAllProductIn()
  productInLength.value = productInStore.productInAll.length
}

const createProductIn = handleSubmit( async (values) => {
  values.date = new Date(values.date).toISOString();
  await productInStore.createProductIn(values);
  if (productInStore.status_code === 201) {
    Cookies.set('alert-message', 'Successfully create new product in');
    Cookies.set('alert-page', 'Product In');
    alertMessage = useCookie('alert-message')
    alertPage = useCookie('alert-page')
    setValues({
      product_id: '',
      supplier_id: '',
      qty: '',
      date: '',
      note: '',
    });
    await productInStore.getAllProductIn()
    totalPages.value = Math.ceil(productInStore.totalPages / productInStore.pageSize)
    productInLength.value = productInStore.productInAll.length
  }
});

const removeProductInDetail = async () => {
  productInData.value = null
  setValues({
    product_id: '',
    supplier_id: '',
    qty: '',
    date: '',
    note: '',
  });
}

const productInDetail = async (productInSelect: any) => {
  await productInStore.getProductInById(productInSelect.id);
  productInData.value = productInSelect
  const productIn = productInStore.productIn;
  setValues({
    product_id: productIn.product.id,
    supplier_id: productIn.supplier.id,
    qty: productIn.qty,
    date: formatDateTimeLocal(productIn.date),
    note: productIn.note,
  });
}

onMounted(async () => {
  await productInStore.getAllProductIn()
  await productStore.getAllProductWithoutPaginate()
  await supplierStore.getAllSupplierWithoutPaginate()
  productInLength.value = productInStore.productInAll.length
  totalPages.value = Math.ceil(productInStore.totalPages / productInStore.pageSize)
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
        <div v-if="alertPage == 'Product In'" class="alert alert-success w-100" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search product in.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <button type="button" class="button-primary-small d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createModal">Add
              New
              Product In</button>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Product</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Note</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="productInLength > 0" v-for="(productIn, index) in productInStore.productInAll" :key="index">
                <td>{{productIn.product.name}}</td>
                <td>{{productIn.supplier.name}}</td>
                <td>{{productIn.qty}}</td>
                <td>{{formatDate(productIn.date)}}</td>
                <td>{{productIn.note || '-'}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <button type="button" data-bs-toggle="modal" data-bs-target="#detailModal" @click="productInDetail(productIn)"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="6">Data product in not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: productInStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(productInStore.page - 1)" :disabled="productInStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === productInStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: productInStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(productInStore.page + 1)" :disabled="productInStore.page === totalPages">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h1 class="modal-title fs-5" id="detailModalLabel">Detail Product In</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeProductInDetail()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <form class="form">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="input-group d-flex flex-column">
                    <label for="product_id">Product</label>
                    <select class="input w-100" name="product_id" id="product_id" autocomplete="off" v-model="product_id" disabled>
                      <option v-for="(product, index) in productStore.productAll" :key="index" :value="product.id">{{product.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group d-flex flex-column">
                    <label for="supplier_id">Supplier</label>
                    <select class="input w-100" name="supplier_id" id="supplier_id" autocomplete="off" v-model="supplier_id" disabled>
                      <option v-for="(supplier, index) in supplierStore.supplierAll" :key="index" :value="supplier.id">{{supplier.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group d-flex flex-column">
                    <label for="qty">Quantity</label>
                    <input type="number" class="input w-100" name="qty" id="qty"
                           placeholder="Enter your quantity.." autocomplete="off" v-model="qty" readonly>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group d-flex flex-column">
                    <label for="date">Date</label>
                    <input type="datetime-local" class="input w-100" name="date" id="date"
                           placeholder="Enter your date.." autocomplete="off" v-model="date" readonly>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="note">Note</label>
                    <textarea class="input w-100" name="note" id="note" placeholder="Enter your note.." autocomplete="off" v-model="note" readonly rows="4"></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeProductInDetail()">Close Modal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="createProductIn" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="createModalLabel">Create New Product In</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="input-group d-flex flex-column">
                    <label for="product_id">Product</label>
                    <select class="input w-100" name="product_id" id="product_id" autocomplete="off" v-model="product_id">
                      <option v-for="(product, index) in productStore.productAll" :key="index" :value="product.id">{{product.name}}</option>
                    </select>
                    <p v-if="productIdError" class="invalid-label">{{ productIdError }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group d-flex flex-column">
                    <label for="supplier_id">Supplier</label>
                    <select class="input w-100" name="supplier_id" id="supplier_id" autocomplete="off" v-model="supplier_id">
                      <option v-for="(supplier, index) in supplierStore.supplierAll" :key="index" :value="supplier.id">{{supplier.name}}</option>
                    </select>
                    <p v-if="supplierIdError" class="invalid-label">{{ supplierIdError }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group d-flex flex-column">
                    <label for="qty">Quantity</label>
                    <input type="number" class="input w-100" name="qty" id="qty"
                           placeholder="Enter your quantity.." autocomplete="off" v-model="qty">
                    <p v-if="qtyError" class="invalid-label">{{ qtyError }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group d-flex flex-column">
                    <label for="date">Date</label>
                    <input type="datetime-local" class="input w-100" name="date" id="date"
                           placeholder="Enter your date.." autocomplete="off" v-model="date">
                    <p v-if="dateError" class="invalid-label">{{ dateError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="note">Note</label>
                    <textarea class="input w-100" name="note" id="note" placeholder="Enter your note.." autocomplete="off" v-model="note" rows="4"></textarea>
                    <p v-if="noteError" class="invalid-label">{{ noteError }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Add</button>
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Add New Product In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
