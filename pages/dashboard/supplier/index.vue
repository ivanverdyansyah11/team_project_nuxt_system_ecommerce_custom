<script setup lang="ts">
import { useSupplierStore } from "~/stores/supplier";
import { ref, onMounted } from 'vue'
import { useField, useForm } from 'vee-validate'
import Cookies from 'js-cookie'
import * as yup from 'yup'

definePageMeta({
  title: 'Supplier Page',
  layout: 'dashboard'
})

const keyword = ref('')
const supplierStore = useSupplierStore()
let supplierLength = ref(0)
const supplierData = ref(null);
const totalPages = ref(0)
let alertMessage = useCookie('alert-message')
let alertPage = useCookie('alert-page')

const schema = yup.object({
  name: yup.string().required('Name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string(),
  address: yup.string().required('Address is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
});

const { value: name, errorMessage: nameError } = useField('name');
const { value: username, errorMessage: usernameError } = useField('username');
const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');
const { value: address, errorMessage: addressError } = useField('address');

const search = async (event: any) => {
  event.preventDefault()
  supplierStore.$state.keyword = keyword.value
  supplierStore.$state.page = 1
  await supplierStore.getAllSupplier()
  supplierLength.value = supplierStore.supplierAll.length
  totalPages.value = Math.ceil(supplierStore.totalPages / supplierStore.pageSize)
}

const changePage = async (page: number) => {
  supplierStore.$state.page = page
  await supplierStore.getAllSupplier()
  supplierLength.value = supplierStore.supplierAll.length
}

const createSupplier = handleSubmit( async (values) => {
  await supplierStore.createSupplier(values);
  if (supplierStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully create new supplier');
    Cookies.set('alert-page', 'Supplier');
    alertMessage = useCookie('alert-message')
    alertPage = useCookie('alert-page')
    setValues({
      name: '',
      address: '',
      username: '',
      email: '',
      password: '',
    });
    await supplierStore.getAllSupplier()
    totalPages.value = Math.ceil(supplierStore.totalPages / supplierStore.pageSize)
    supplierLength.value = supplierStore.supplierAll.length
  }
});

const removeSupplierDetail = async () => {
  supplierData.value = null
  setValues({
    name: '',
    address: '',
    username: '',
    email: '',
    password: '',
  });
}

const supplierDetail = async (supplierSelect: any) => {
  await supplierStore.getSupplierById(supplierSelect.id);
  supplierData.value = supplierSelect
  const supplier = supplierStore.supplier;
  setValues({
    name: supplier.name,
    address: supplier.address,
    username: supplier.user.username,
    email: supplier.user.email,
  });
}

const updateSupplier = handleSubmit( async (values) => {
  await supplierStore.updateSupplier(values, supplierData.value.id);
  if (supplierStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully update supplier');
    Cookies.set('alert-page', 'Supplier');
    alertMessage = useCookie('alert-message')
    alertPage = useCookie('alert-page')
    setValues({
      name: '',
      address: '',
      username: '',
      email: '',
    });
    supplierData.value = null;
    await supplierStore.getAllSupplier()
  }
});

const confirmDeleteSupplier = async () => {
  if (supplierData.value) {
    await supplierStore.deleteSupplier(supplierData.value.id);
    if (supplierStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted supplier');
      Cookies.set('alert-page', 'Supplier');
      alertMessage = useCookie('alert-message')
      alertPage = useCookie('alert-page')
    }
    supplierData.value = null;
    totalPages.value = Math.ceil(supplierStore.totalPages / supplierStore.pageSize)
    supplierLength.value = supplierStore.supplierAll.length
  }
};

onMounted(async () => {
  await supplierStore.getAllSupplier()
  supplierLength.value = supplierStore.supplierAll.length
  totalPages.value = Math.ceil(supplierStore.totalPages / supplierStore.pageSize)
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
        <div v-if="alertPage == 'Supplier'" class="alert alert-success w-100" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search supplier.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <button type="button" class="button-primary-small d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createModal">Add
              New
              Supplier</button>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Address</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="supplierLength > 0" v-for="(supplier, index) in supplierStore.supplierAll" :key="index">
                <td>{{supplier.name}}</td>
                <td>{{supplier.user.username}}</td>
                <td>{{supplier.user.email}}</td>
                <td>{{supplier.address}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <button type="button" data-bs-toggle="modal" data-bs-target="#detailModal" @click="supplierDetail(supplier)"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button" data-bs-toggle="modal" data-bs-target="#updateModal" @click="supplierDetail(supplier)"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="supplierData = supplier">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="5">Data supplier not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: supplierStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(supplierStore.page - 1)" :disabled="supplierStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === supplierStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: supplierStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(supplierStore.page + 1)" :disabled="supplierStore.page === totalPages">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h1 class="modal-title fs-5" id="detailModalLabel">Detail Supplier</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeSupplierDetail()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <form class="form">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name"
                           placeholder="Enter your name.." autocomplete="off" v-model="name" readonly>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="username">Username</label>
                    <input type="text" class="input w-100" name="username" id="username"
                           placeholder="Enter your username.." autocomplete="off" v-model="username" readonly>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="email">Email</label>
                    <input type="email" class="input w-100" name="email" id="email"
                           placeholder="Enter your email.." autocomplete="off" v-model="email" readonly>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="address">Address</label>
                    <textarea class="input w-100" name="address" id="address" placeholder="Enter your address.." autocomplete="off" v-model="address" readonly rows="4"></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeSupplierDetail()">Close Modal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="createSupplier" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="createModalLabel">Create New Supplier</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name"
                           placeholder="Enter your name.." autocomplete="off" v-model="name">
                    <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="username">Username</label>
                    <input type="text" class="input w-100" name="username" id="username"
                           placeholder="Enter your username.." autocomplete="off" v-model="username">
                    <p v-if="usernameError" class="invalid-label">{{ usernameError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="email">Email</label>
                    <input type="email" class="input w-100" name="email" id="email"
                           placeholder="Enter your email.." autocomplete="off" v-model="email">
                    <p v-if="emailError" class="invalid-label">{{ emailError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="password">Password</label>
                    <input type="password" class="input w-100" name="password" id="password"
                           placeholder="Enter your password.." autocomplete="off" v-model="password">
                    <p v-if="passwordError" class="invalid-label">{{ passwordError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="address">Address</label>
                    <textarea class="input w-100" name="address" id="address" placeholder="Enter your address.." autocomplete="off" v-model="address" rows="4"></textarea>
                    <p v-if="addressError" class="invalid-label">{{ addressError }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Add</button>
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Add New Supplier</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="updateSupplier" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="updateModalLabel">Edit Supplier</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeSupplierDetail()">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name"
                           placeholder="Enter your name.." autocomplete="off" v-model="name">
                    <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="username">Username</label>
                    <input type="text" class="input w-100" name="username" id="username"
                           placeholder="Enter your username.." autocomplete="off" v-model="username">
                    <p v-if="usernameError" class="invalid-label">{{ usernameError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="email">Email</label>
                    <input type="email" class="input w-100" name="email" id="email"
                           placeholder="Enter your email.." autocomplete="off" v-model="email">
                    <p v-if="emailError" class="invalid-label">{{ emailError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="address">Address</label>
                    <textarea class="input w-100" name="address" id="address" placeholder="Enter your address.." autocomplete="off" v-model="address" rows="4"></textarea>
                    <p v-if="addressError" class="invalid-label">{{ addressError }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeSupplierDetail()">Cancel Edit</button>
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Supplier</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this supplier?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteSupplier" data-bs-dismiss="modal">Delete Supplier</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
