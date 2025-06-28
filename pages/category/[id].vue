<script setup lang="ts">
import { useRoute } from 'vue-router'
import { tecnologiesStore } from '~/composables/useTecnologies'

const route = useRoute()
const { tecnologies, fetchTecnologies, deleteTecnology, loading } = tecnologiesStore

const categoryId = Number(route.params.id)
const categoryName = route.query.name as string || ''

onMounted(async () => {
    await fetchTecnologies(categoryId)
})

</script>

<template>
    <div>
        
        <h1 class="mb-4 text-[22px] font-bold" v-if="categoryName">{{ categoryName }}</h1>
        
        <div v-for="tecnology in tecnologies" class="bg-white mt-6 p-4 rounded-[4px] flex items-center justify-between gap-3">
            <div>
                <span class="bg-green-500 text-white text-[11px] px-2 py-1 rounded absolute mt-[-28px]">{{ tecnology.category.name }}</span>
                <a v-if="tecnology.url" :href="tecnology.url" class="font-bold block underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                    <span>{{ tecnology.name }}</span>
                    <UIcon name="i-lucide-external-link" class="size-4" />
                </a>
                <p v-else class="font-bold block">{{  tecnology.name }}</p>
                <span class="text-blue-gray-500 text-[13px]">{{  tecnology.description }}</span>
            </div>
            <div class="flex items-center gap-1">
                <UButton @click="openForm(tecnology)" icon="i-lucide-edit" color="info" variant="outline"></UButton>
                <UButton @click="deleteTecnology(tecnology.id, categoryId)" icon="i-lucide-trash-2" color="error" variant="outline"></UButton>
            </div>
        </div>
        
        <div v-if="loading" class="flex justify-center items-center">
            Await... Load tecnologies...
        </div>
        
        <div v-if="tecnologies.length === 0 && !loading" class="flex justify-center items-center">
            <p class="text-gray-500">Tecnology not found.</p>
        </div>
        
    </div>
</template>