<script setup lang="ts">
import {useCustomerStore} from "~/stores/customer";
import {useRoute} from '#app';
import {ref} from "vue";

definePageMeta({
  title: 'Detail Customer Page',
  layout: 'dashboard'
})

const customerStore = useCustomerStore();
let addressLength = ref(0)
const route = useRoute();
await customerStore.getCustomerById(route.params.id);

onMounted(async () => {
  addressLength.value = customerStore.customer.addresses.length
})
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form class="form w-100">
            <div class="row g-3">
              <div class="col-12 d-flex gap-3 align-items-end">
                <div class="wrapper d-flex flex-column">
                  <label for="image" class="form-label">Customer Image</label>
                  <img :src="customerStore?.customer?.user.profile_path != null ? `http://localhost:8000/${customerStore.customer.user.profile_path}` : 'https://placehold.co/600x400?text=Image+Not+Found'" class="input-image" alt="Customer Image" style="border-radius: 4px;"/>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="name">Name</label>
                  <input type="text" class="input w-100" name="name" id="name"
                         placeholder="Enter your name.." autocomplete="off" v-model="customerStore.customer.name" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="username">Username</label>
                  <input type="text" class="input w-100" name="username" id="username"
                         placeholder="Enter your username.." autocomplete="off" v-model="customerStore.customer.user.username" readonly>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="email">Email</label>
                  <input type="email" class="input w-100" name="email" id="email" placeholder="Enter your email.." autocomplete="off" v-model="customerStore.customer.user.email" readonly>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="address">Address Customer</label>
                </div>
                <div class="wrapper-table">
                  <table class="table" style="width:100%">
                    <thead>
                    <tr>
                      <th>Address</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Detail</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="addressLength > 0" v-for="(address, index) in customerStore.customer.addresses" :key="index">
                      <td>{{address.full_address}}</td>
                      <td>{{address.latitude}}</td>
                      <td>{{address.longitude}}</td>
                      <td>{{address.details}}</td>
                    </tr>
                    <tr v-else>
                      <td colspan="4">Data address not found!</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <NuxtLink :to="{path: '/dashboard/customer'}" class="button-reverse">Back to Page</NuxtLink>
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