import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

export const useProductBrokenStore = defineStore('productBroken', {
    state: () => ({
        productBrokenAll: [],
        productBroken: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllProductBrokenWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/product/brokens`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.productBrokenAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllProductBroken() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/product/brokens?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.productBrokenAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getProductBrokenById(productBrokenId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/product/brokens/${ productBrokenId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.productBroken = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createProductBroken(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/product/brokens`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                });
                this.status_code = response?.meta.code;
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async updateProductBroken(updateData: any, productBrokenId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/product/brokens/${productBrokenId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.meta.code;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteProductBroken(productBrokenId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/product/brokens/${productBrokenId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllProductBroken();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
