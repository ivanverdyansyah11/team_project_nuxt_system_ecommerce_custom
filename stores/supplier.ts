import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

export const useSupplierStore = defineStore('supplier', {
    state: () => ({
        supplierAll: [],
        supplier: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllSupplierWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/suppliers`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.supplierAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllSupplier() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/suppliers?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.supplierAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getSupplierById(supplierId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/suppliers/${ supplierId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.supplier = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createSupplier(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/suppliers`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                });
                this.status_code = response?.data ? 200 : null;
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async updateSupplier(updateData: any, supplierId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/suppliers/${supplierId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteSupplier(supplierId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/suppliers/${supplierId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllSupplier();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
