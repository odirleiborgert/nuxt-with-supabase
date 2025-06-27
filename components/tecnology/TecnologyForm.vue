<script setup lang="ts">
import { tecnologiesStore } from '~/composables/useTecnologies'
import { categoriesStore } from '~/composables/useCategories'

const { loading, open, form, openForm, createTecnology, updateTecnology } = tecnologiesStore
const { categories } = categoriesStore

</script>

<template>
    <div>
        <UButton  @click="openForm()" color="primary" icon="i-lucide-plus">Tecnology</UButton>
        <UModal v-model:open="open" title="Create or update a technology" >
            <template #body>
                <div>
                    <div>
                        <p class="text-sm">Category</p>
                        <USelect v-model="form.category_id" :items="categories" value-key="id" label-key="name"  class="w-full" />
                    </div>
                    <div class="mt-3">
                        <p class="text-sm">Name</p>
                        <UInput v-model="form.name" class="w-full" />
                    </div>
                    <div class="mt-3">
                        <p class="text-sm">Url</p>
                        <UInput v-model="form.url" class="w-full" />
                    </div>
                    <div class="mt-3">
                        <p class="text-sm">Description</p>
                        <UTextarea  v-model="form.description" class="w-full" />
                    </div>
                    <div class="mt-3">
                        <UButton @click="form.id ? updateTecnology(form.id, form) :  createTecnology(form)" :loading="loading">Save</UButton>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>
