import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

export const useProductInStore = defineStore('productIn', {
    state: () => ({
        productInAll: [],
        productIn: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllProductInWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/product/ins`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.productInAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllProductIn() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/product/ins?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.productInAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getProductInById(productInId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/product/ins/${ productInId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.productIn = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createProductIn(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/product/ins`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                });
                this.status_code = response.meta.code;
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async updateProductIn(updateData: any, productInId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/product/ins/${productInId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.meta.code;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteProductIn(productInId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/product/ins/${productInId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllProductIn();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
