import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

export const useProductStore = defineStore('product', {
    state: () => ({
        productAll: [],
        product: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllProductWithoutPaginate() {
            try {
                const response = await $fetch(`${ apiUrl }/products?search=${this.keyword}`, {
                    method: 'GET',
                })
                this.productAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllProduct() {
            try {
                const response = await $fetch(`${ apiUrl }/products?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                })
                this.productAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getProductById(productId: string) {
            try {
                const response = await $fetch(`${ apiUrl }/products/${ productId }`, {
                    method: 'GET',
                })
                this.product = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createProduct(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/products`, {
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
        async updateProduct(updateData: any, productId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/products/${productId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.meta.code;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async saveImageProduct(formData: FormData) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/products/image`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: formData
                });
                this.status_code = response.meta.code;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async updateImageProduct(formData: FormData) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/products/image`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: formData
                });
                this.status_code = response.meta.code;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteImageProduct(productId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/products/image/delete`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: productId
                });
                this.status_code = response.meta.code;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteProduct(productId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/products/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllProduct();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
