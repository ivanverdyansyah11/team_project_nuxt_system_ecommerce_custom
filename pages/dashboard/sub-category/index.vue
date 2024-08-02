<script setup lang="ts">
import { useSubCategoryStore } from "~/stores/subCategory";
import { useCategoryStore } from "~/stores/category";
import { ref, onMounted } from 'vue'
import { useField, useForm } from 'vee-validate'
import Cookies from 'js-cookie'
import * as yup from 'yup'

definePageMeta({
  title: 'Sub Category Page',
  layout: 'dashboard'
})

const keyword = ref('')
const subCategoryStore = useSubCategoryStore()
const categoryStore = useCategoryStore()
let subCategoryLength = ref(0)
const subCategoryData = ref(null);
const totalPages = ref(0)
let alertMessage = useCookie('alert-message')
let alertPage = useCookie('alert-page')

const schema = yup.object({
  category_id: yup.string().required('Category is required'),
  name: yup.string().required('Name is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
});

const { value: category_id, errorMessage: categoryIdError } = useField('category_id');
const { value: name, errorMessage: nameError } = useField('name');

const search = async (event: any) => {
  event.preventDefault()
  subCategoryStore.$state.keyword = keyword.value
  subCategoryStore.$state.page = 1
  await subCategoryStore.getAllSubCategory()
  subCategoryLength.value = subCategoryStore.subCategoryAll.length
  totalPages.value = Math.ceil(subCategoryStore.totalPages / subCategoryStore.pageSize)
}

const changePage = async (page: number) => {
  subCategoryStore.$state.page = page
  await subCategoryStore.getAllSubCategory()
  subCategoryLength.value = subCategoryStore.subCategoryAll.length
}

const createSubCategory = handleSubmit( async (values) => {
  await subCategoryStore.createSubCategory(values);
  if (subCategoryStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully create new sub category');
    Cookies.set('alert-page', 'Sub Category');
    alertMessage = useCookie('alert-message')
    alertPage = useCookie('alert-page')
    setValues({
      category_id: '',
      name: '',
    });
    await subCategoryStore.getAllSubCategory()
    totalPages.value = Math.ceil(subCategoryStore.totalPages / subCategoryStore.pageSize)
    subCategoryLength.value = subCategoryStore.subCategoryAll.length
  }
});

const removeSubCategoryDetail = async () => {
  subCategoryData.value = null
  setValues({
    category_id: '',
    name: '',
  });
}

const subCategoryDetail = async (subCategorySelect: any) => {
  await subCategoryStore.getSubCategoryById(subCategorySelect.id);
  subCategoryData.value = subCategorySelect
  const subCategory = subCategoryStore.subCategory;
  setValues({
    category_id: subCategory.category.id,
    name: subCategory.name,
  });
}

const updateSubCategory = handleSubmit( async (values) => {
  await subCategoryStore.updateSubCategory(values, subCategoryData.value.id);
  if (subCategoryStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully update sub category');
    Cookies.set('alert-page', 'Sub Category');
    alertMessage = useCookie('alert-message')
    alertPage = useCookie('alert-page')
    setValues({
      category_id: '',
      name: '',
    });
    subCategoryData.value = null;
    await subCategoryStore.getAllSubCategory()
  }
});

const confirmDeleteSubCategory = async () => {
  if (subCategoryData.value) {
    await subCategoryStore.deleteSubCategory(subCategoryData.value.id);
    if (subCategoryStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted sub category');
      Cookies.set('alert-page', 'Sub Category');
      alertMessage = useCookie('alert-message')
      alertPage = useCookie('alert-page')
    }
    subCategoryData.value = null;
    totalPages.value = Math.ceil(subCategoryStore.totalPages / subCategoryStore.pageSize)
    subCategoryLength.value = subCategoryStore.subCategoryAll.length
  }
};

onMounted(async () => {
  await subCategoryStore.getAllSubCategory()
  await categoryStore.getAllCategoryWithoutPaginate()
  subCategoryLength.value = subCategoryStore.subCategoryAll.length
  totalPages.value = Math.ceil(subCategoryStore.totalPages / subCategoryStore.pageSize)
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
        <div v-if="alertPage == 'Sub Category'" class="alert alert-success w-100" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search sub category.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <button type="button" class="button-primary-small d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createModal">Add
              New
              Sub Category</button>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Category</th>
                <th>Name</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="subCategoryLength > 0" v-for="(subCategory, index) in subCategoryStore.subCategoryAll" :key="index">
                <td>{{subCategory.category.name}}</td>
                <td>{{subCategory.name}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <button type="button" data-bs-toggle="modal" data-bs-target="#detailModal" @click="subCategoryDetail(subCategory)"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button" data-bs-toggle="modal" data-bs-target="#updateModal" @click="subCategoryDetail(subCategory)"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="subCategoryData = subCategory">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="3">Data sub category not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: subCategoryStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(subCategoryStore.page - 1)" :disabled="subCategoryStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === subCategoryStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: subCategoryStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(subCategoryStore.page + 1)" :disabled="subCategoryStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="detailModalLabel">Detail Sub Category</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeSubCategoryDetail()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <form class="form">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="category_id">Category</label>
                    <select class="input w-100" name="category_id" id="category_id" autocomplete="off" v-model="category_id" disabled>
                      <option v-for="(category, index) in categoryStore.categoryAll" :key="index" :value="category.id">{{category.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name" placeholder="Enter your name.." autocomplete="off" v-model="name" readonly>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeSubCategoryDetail()">Close Modal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="createSubCategory" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="createModalLabel">Create New Sub Category</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="category_id">Category</label>
                    <select class="input w-100" name="category_id" id="category_id" autocomplete="off" v-model="category_id">
                      <option v-for="(category, index) in categoryStore.categoryAll" :key="index" :value="category.id">{{category.name}}</option>
                    </select>
                    <p v-if="categoryIdError" class="invalid-label">{{ categoryIdError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name"
                           placeholder="Enter your name.." autocomplete="off" v-model="name">
                    <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Add</button>
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Add New Sub Category</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="updateSubCategory" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="updateModalLabel">Edit Sub Category</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeSubCategoryDetail()">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="category_id">Category</label>
                    <select class="input w-100" name="category_id" id="category_id" autocomplete="off" v-model="category_id">
                      <option v-for="(category, index) in categoryStore.categoryAll" :key="index" :value="category.id">{{category.name}}</option>
                    </select>
                    <p v-if="categoryIdError" class="invalid-label">{{ categoryIdError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name"
                           placeholder="Enter your name.." autocomplete="off" v-model="name">
                    <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeSubCategoryDetail()">Cancel Edit</button>
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
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Sub Category</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this sub category?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteSubCategory" data-bs-dismiss="modal">Delete Sub Category</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
