import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

export const useProductOutStore = defineStore('productOut', {
    state: () => ({
        productOutAll: [],
        productOut: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllProductOutWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/product/outs`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.productOutAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllProductOut() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/product/outs?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.productOutAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getProductOutById(productOutId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/product/outs/${ productOutId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.productOut = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createProductOut(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/product/outs`, {
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
        async updateProductOut(updateData: any, productOutId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/product/outs/${productOutId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.meta.code;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteProductOut(productOutId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/product/outs/${productOutId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllProductOut();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
