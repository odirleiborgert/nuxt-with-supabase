<script setup lang="ts">
import { useRouter } from 'vue-router'
import { categoriesStore } from '~/composables/useCategories'
import { tecnologiesStore } from '~/composables/useTecnologies'

const { loading, categories, openForm, fetchCategories, deleteCategory } = categoriesStore
const { categoryName } = tecnologiesStore
const filter = useTecnologyFilter()
const router = useRouter()

function _filterTecnologies(categoryId: number, categoryNameString: string) {
    categoryName.value = categoryNameString
    filter.value = categoryId
}
function filterTecnologies(categoryId: number, categoryNameString: string) {
    router.push({ path: `/category/${categoryId}`, query: { name: categoryNameString } })
}

onMounted(async () => {
    await fetchCategories()
})

</script>

<template>
    <div>
        <span v-if="loading" class="text-[12px] text-green-700">Load caregories...</span>
        
        <ul class="list-disc mb-2">
            <li v-for="category in categories" :key="category.id" class="gap-2 flex items-center justify-between mb-1 hover:bg-green-50 py-1">
                <div>
                    <a href="javascript:;" @click="filterTecnologies(category.id, category.name)" class="underline font-bold">{{ category.name }}</a> ({{ category.tecnologies[0]?.count || 0 }})
                </div>
                <div class="flex items-center gap-1">
                    <UButton @click="deleteCategory(category.id)" icon="i-lucide-trash-2" color="error" variant="outline"></UButton>
                    <UButton @click="openForm(category)" icon="i-lucide-edit" color="info" variant="outline"></UButton>
                </div>
            </li>
        </ul>

    </div>
</template>
