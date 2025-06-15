<script setup>

import {createClient} from '@supabase/supabase-js'
import {h, resolveComponent} from 'vue'

const UButton = resolveComponent('UButton')

const config = useRuntimeConfig()
const toast = useToast()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)

const categories = ref({
    loading: false,
    open: false,
    form: {
        name: ''
    },
    data: []
})

const tecnologies = ref({
    loading: false,
    open: false,
    form: {
        category_id: null,
        name: null,
        description: null,
        url: null
    },
    data: [],
    columns: [
        {
            header: 'Criado em',
            accessorKey: 'created_at',
            cell: ({row}) => {
                const date = new Date(row.original.created_at)
                return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
            }
        },
        {
            header: 'Categoria',
            accessorKey: 'category_id',
            cell: ({row}) => {
                const category = categories.value.data.find(c => c.id === row.original.category_id)
                return category ? category.name : 'N/A'
            }
        },
        {header: 'Tecnologia', accessorKey: 'name'},
        {
            header: 'Ações', cell: ({row}) => {
                return h(UButton, {
                    icon: 'i-lucide-trash-2',
                    color: 'error',
                    onClick: () => destroyTecnologia(row.original.id)
                })
            }
        }
    ]
})


async function getCategories() {
    const { data } = await supabase.from('categories').select()
    categories.value.data = (data || []).sort((a, b) => a.name.localeCompare(b.name))
}

async function getTecnologies() {
    const {data} = await supabase.from('tecnologies').select()
    tecnologies.value.data = data
    countCategories()
}

async function countCategories() {
    categories.value.data = categories.value.data.map(category => ({
        ...category,
        total: tecnologies.value.data ? tecnologies.value.data.filter(tech => tech.category_id === category.id).length : 0
    }))
}

async function createCategories() {
    
    if (!categories.value.form.name) {
        toast.add({ title: 'Erro', description: 'Nome da categories é obrigatório', color: 'error' })
        return
    }
    
    categories.value.loading = true
    
    const response = await supabase.from('categories').insert({
        name: categories.value.form.name
    })
    
    if (response.error) {
        toast.add({ title: 'Erro', description: response.error.message, color: 'error' })
        categories.value.loading = false
        return
    }
    
    toast.add({ title: 'Categoria cadastrada', description: 'Categoria cadastrada com sucesso', color: 'primary' })

    categories.value.form.name = ''
    categories.value.loading = false
    categories.value.open = false
    
    getCategories()
    
}

async function createTecnologia() {
    
    if (!tecnologies.value.form.name) {
        toast.add({ title: 'Erro', description: 'Nome da tecnologia é obrigatório', color: 'error' })
        return
    }
    
    tecnologies.value.loading = true
    
    const response = await supabase.from('tecnologies').insert(tecnologies.value.form)
    
    if (response.error) {
        toast.add({ title: 'Erro', description: response.error.message, color: 'error' })
        tecnologies.value.loading = false
        return
    }
    
    toast.add({ title: 'Tecnologia cadastrada', description: 'Tecnologia cadastrada com sucesso', color: 'primary' })

    tecnologies.value.form.category_id = null
    tecnologies.value.form.name = null
    tecnologies.value.form.description = null
    tecnologies.value.form.url = null
    tecnologies.value.loading = false
    tecnologies.value.open = false
    
    getTecnologies()
    
}

async function filterTecnologies(categoryId) {
    tecnologies.value.loading = true
    const {data} = await supabase.from('tecnologies').select().eq('category_id', categoryId)
    tecnologies.value.data = data || []
    tecnologies.value.loading = false
}

async function countTecnologies(categoryId) {
    const { count } = await supabase
        .from('tecnologies')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)
    return count || 0
}

async function destroyCategory(id) {
    const result = await supabase.from('categories').delete().eq('id', id)
    if (result.error) {
        toast.add({ title: 'Erro', description: result.error.message, color: 'error' })
        return
    }
    getCategories()
    toast.add({ title: 'Categoria deletada', description: `Categoria deletada com sucesso`, color: 'primary'})
}

async function destroyTecnologia(id) {
    const result = await supabase.from('tecnologies').delete().eq('id', id)
    if (result.error) {
        toast.add({ title: 'Erro', description: result.error.message, color: 'error' })
        return
    }
    getTecnologies()
    toast.add({ title: 'Tecnologia deletada', description: `Tecnologia deletada com sucesso`, color: 'primary'})
}

onMounted(() => {
    getCategories()
    getTecnologies()
})
</script>

<template>
    <UApp>
        
        <div>
            
            <div class="grid grid-cols-12 max-w-[1100px] mx-auto gap-3">
                
                <div class="col-span-12">
                    
                    <div>
                        <div class="mx-auto max-w-screen-2xl">
                            <header class="flex items-center justify-between py-4 md:py-8">
                                
                                <!-- logo - start -->
                                <h2 class="text-lg font-bold">Diretório de Tecnologias</h2>
                                <!-- logo - end -->
                                
                                <!-- buttons - start -->
                                <div class="-ml-8 hidden flex-col gap-2.5 sm:flex-row sm:justify-center lg:flex lg:justify-start">
                                    <UModal v-model:open="categories.open" title="Criar uma categoria" >
                                        <UButton label="Categoria" icon="i-lucide-plus"  />
                                        <template #body>
                                            <div>
                                                <p class="text-sm">Categoria</p>
                                                <div class="flex items-start gap-3">
                                                    <UInput v-model="categories.form.name" />
                                                    <UButton @click="createCategories()" :loading="categories.loading">Salvar</UButton>
                                                </div>
                                            </div>
                                        </template>
                                    </UModal>
                                    
                                    <UModal v-model:open="tecnologies.open" title="Criar uma tecnologia" >
                                        <UButton label="Tecnologia" icon="i-lucide-plus" />
                                        <template #body>
                                            <div>
                                                <p class="text-sm">Categoria</p>
                                                <USelect v-model="tecnologies.form.category_id" :items="categories.data" value-key="id" label-key="name"  class="w-48" />
                                            </div>
                                            <div>
                                                <p class="text-sm">Tecnologia</p>
                                                <UInput v-model="tecnologies.form.name" />
                                            </div>
                                            <div>
                                                <p class="text-sm">Url</p>
                                                <UInput v-model="tecnologies.form.url" />
                                            </div>
                                            <div>
                                                <p class="text-sm">Descrição</p>
                                                <UInput v-model="tecnologies.form.description" />
                                            </div>
                                            <UButton @click="createTecnologia()" :loading="tecnologies.loading">Salvar</UButton>
                                        </template>
                                    </UModal>
                                </div>
                                
                                <!-- buttons - end -->
                            </header>
                        
                        </div>
                    </div>
                    
                </div>
                
                <div class="col-span-3">
                    
                    <ul class="list-disc mb-2">
                        <li v-for="category in categories.data" :key="category.id" class="gap-2 flex items-center mb-1">
                            <UButton @click="destroyCategory(category.id)" icon="i-lucide-trash-2" color="error" variant="outline"></UButton>
                            <a href="javascript:;" @click="filterTecnologies(category.id)" class="underline">{{ category.name }} ({{ category.total || 0}})</a>
                        </li>
                    </ul>
                    
                    <a
                        href="javascript:;"
                        @click="getTecnologies()"
                        class="flex items-center justify-center h-[70px] bg-green-50 px-6 border border-green-200 rounded-xl text-[12px] font-bold text-green-700 transition hover:bg-green-100"
                    >
                        Todas as tecnologias
                    </a>
                
                </div>
                
                <div class="col-span-9 bg-white p-2 rounded-[10px]">
                    <UTable :data="tecnologies.data" :columns="tecnologies.columns"  class="flex-1" :loading="tecnologies.loading" loading-color="primary" loading-animation="carousel">
                        <template #action-cell="{ row }">
                            {{ row }}
                        </template>
                    </UTable>
                </div>
                
            </div>
            
        </div>
    </UApp>
</template>