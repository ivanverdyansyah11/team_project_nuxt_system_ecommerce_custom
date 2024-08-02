<script setup lang="ts">
import { useProductOutStore } from "~/stores/productOut";
import { useProductStore } from "~/stores/product";
import { useSupplierStore } from "~/stores/supplier";
import { ref, onMounted } from 'vue'
import { useField, useForm } from 'vee-validate'
import { formatDate } from '~/helpers/FormatDate';
import { formatDateTimeLocal } from '~/helpers/FormatDateTimeLocal';
import Cookies from 'js-cookie'
import * as yup from 'yup'

definePageMeta({
  title: 'Inventaris Out Page',
  layout: 'dashboard'
})

const keyword = ref('')
const productOutStore = useProductOutStore()
const productStore = useProductStore()
const supplierStore = useSupplierStore()
let productOutLength = ref(0)
const productOutData = ref(null);
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
  productOutStore.$state.keyword = keyword.value
  productOutStore.$state.page = 1
  await productOutStore.getAllProductOut()
  productOutLength.value = productOutStore.productOutAll.length
  totalPages.value = Math.ceil(productOutStore.totalPages / productOutStore.pageSize)
}

const changePage = async (page: number) => {
  productOutStore.$state.page = page
  await productOutStore.getAllProductOut()
  productOutLength.value = productOutStore.productOutAll.length
}

const createProductOut = handleSubmit( async (values) => {
  values.date = new Date(values.date).toISOString();
  await productOutStore.createProductOut(values);
  if (productOutStore.status_code === 201) {
    Cookies.set('alert-message', 'Successfully create new product out');
    Cookies.set('alert-page', 'Product Out');
    alertMessage = useCookie('alert-message')
    alertPage = useCookie('alert-page')
    setValues({
      product_id: '',
      supplier_id: '',
      qty: '',
      date: '',
      note: '',
    });
    await productOutStore.getAllProductOut()
    totalPages.value = Math.ceil(productOutStore.totalPages / productOutStore.pageSize)
    productOutLength.value = productOutStore.productOutAll.length
  }
});

const removeProductOutDetail = async () => {
  productOutData.value = null
  setValues({
    product_id: '',
    supplier_id: '',
    qty: '',
    date: '',
    note: '',
  });
}

const productOutDetail = async (productOutSelect: any) => {
  await productOutStore.getProductOutById(productOutSelect.id);
  productOutData.value = productOutSelect
  const productOut = productOutStore.productOut;
  setValues({
    product_id: productOut.product.id,
    supplier_id: productOut.supplier.id,
    qty: productOut.qty,
    date: formatDateTimeLocal(productOut.date),
    note: productOut.note,
  });
}

onMounted(async () => {
  await productOutStore.getAllProductOut()
  await productStore.getAllProductWithoutPaginate()
  await supplierStore.getAllSupplierWithoutPaginate()
  productOutLength.value = productOutStore.productOutAll.length
  totalPages.value = Math.ceil(productOutStore.totalPages / productOutStore.pageSize)
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
        <div v-if="alertPage == 'Product Out'" class="alert alert-success w-100" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search product out.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <button type="button" class="button-primary-small d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createModal">Add
              New
              Product Out</button>
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
              <tr v-if="productOutLength > 0" v-for="(productOut, index) in productOutStore.productOutAll" :key="index">
                <td>{{productOut.product.name}}</td>
                <td>{{productOut.supplier.name}}</td>
                <td>{{productOut.qty}}</td>
                <td>{{formatDate(productOut.date)}}</td>
                <td>{{productOut.note || '-'}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <button type="button" data-bs-toggle="modal" data-bs-target="#detailModal" @click="productOutDetail(productOut)"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="6">Data product out not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: productOutStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(productOutStore.page - 1)" :disabled="productOutStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === productOutStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: productOutStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(productOutStore.page + 1)" :disabled="productOutStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="detailModalLabel">Detail Product Out</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeProductOutDetail()">
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
                           placeholder="Enter your qty.." autocomplete="off" v-model="qty" readonly>
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
            <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeProductOutDetail()">Close Modal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="createProductOut" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="createModalLabel">Create New Product Out</h1>
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
                           placeholder="Enter your qty.." autocomplete="off" v-model="qty">
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
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Add New Product Out</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
