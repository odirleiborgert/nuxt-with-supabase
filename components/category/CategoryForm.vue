<script setup lang="ts">
import { categoriesStore } from '~/composables/useCategories'
const { loading, open, form, openForm, createCategory, updateCategory } = categoriesStore

</script>

<template>
    <div>
        <UButton  @click="openForm()" color="primary" icon="i-lucide-plus">Category</UButton>
        <UModal v-model:open="open" title="Create or update a category" >
            <template #body>
                <div>
                    <div class="mt-3">
                        <p class="text-sm">Name</p>
                        <UInput v-model="form.name" class="w-full" />
                    </div>
                    <div class="mt-3">
                        <UButton @click="form.id ? updateCategory(form.id, form) :  createCategory(form)" :loading="loading">Save</UButton>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>
