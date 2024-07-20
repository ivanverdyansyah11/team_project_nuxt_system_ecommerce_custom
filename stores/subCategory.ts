import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

export const useSubCategoryStore = defineStore('subCategory', {
    state: () => ({
        subCategoryAll: [],
        subCategory: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllSubCategoryWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/category/items`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.subCategoryAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllSubCategory() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/category/items?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.subCategoryAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getSubCategoryById(subCategoryId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/category/items/${ subCategoryId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.subCategory = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createSubCategory(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/category/items`, {
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
        async updateSubCategory(updateData: any, subCategoryId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/category/items/${subCategoryId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteSubCategory(subCategoryId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/category/items/${subCategoryId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllSubCategory();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
