// composables/useTecnologies.ts

import { h, resolveComponent } from 'vue'

import type { Tecnology } from '~/types/tecnology'
import { defaultTecnology } from '~/types/tecnology'
import { useSupabaseClient } from '~/composables/useSupabaseClient'
import {type Category } from "~/types/category"
import { categoriesStore } from  "~/composables/useCategories"

const { fetchCategories } = categoriesStore

// const toast = useToast()

export const useTecnologies = () => {
    const client = useSupabaseClient()
    const tecnologies = ref<Tecnology[]>([])
    const loading = ref(false)
    const open = ref(false)
    const form = ref<Category>(defaultTecnology())
    const categoryName = ref<string>('')

    const fetchTecnologies = async (categoryId?: number) => {
        loading.value = true
        console.log('fazer fetchTecnologies')

        let query = client
            .from('tecnologies')
            .select('*, category:categories(*)')

        if (categoryId) {
            query = query.eq('category_id', categoryId)
        }

        const { data, error: fetchError } = await query

        if (fetchError) {
            // toast.add({ title: 'Erro', description: fetchError.message || 'Não foi possível cadastrar a categoria', color: 'error' })
        } else {
            tecnologies.value = data as Tecnology[]
        }

        loading.value = false
    }

    const createTecnology = async (tecnology: Partial<Tecnology>) => {

        loading.value = true

        const { error: insertError } = await client
            .from('tecnologies')
            .insert(tecnology)

        loading.value = false

        if (insertError) {
            // toast.add({ title: 'Erro', description: insertError.message || 'Não foi possível cadastrar a tecnologia', color: 'error' })
            throw insertError
        }

        // toast.add({ title: 'Tecnologia cadastrada', description: 'Tecnologia cadastrada com sucesso', color: 'primary' })

        open.value = false

        await fetchTecnologies()
        await fetchCategories()
    }

    const updateTecnology = async (id: number, tecnology: Partial<Tecnology>) => {

        loading.value = true

        delete tecnology.category

        const { error: updateError } = await client
            .from('tecnologies')
            .update(tecnology)
            .eq('id', id)


        loading.value = false

        if (updateError) {
            // toast.add({ title: 'Erro', description: updateError.message || 'Não foi possível atualizar a tecnologia', color: 'error' })
            throw updateError
        }

        // toast.add({ title: 'Tecnologia atualizada', description: 'Tecnologia atualizada com sucesso', color: 'primary' })

        open.value = false

        await fetchTecnologies()
        await fetchCategories()
    }

    const deleteTecnology = async (id: number) => {
        const { error: deleteError } = await client
            .from('tecnologies')
            .delete()
            .eq('id', id)

        if (deleteError) {
            // toast.add({ title: 'Erro', description: deleteError.message || 'Não foi possível deletar a tecnologia', color: 'error' })
            throw deleteError
        }

        // toast.add({ title: 'Tecnologia deletada', description: `Tecnologia deletada com sucesso`, color: 'primary'})

        await fetchTecnologies()
        await fetchCategories()
    }

    const openForm = (tecnology?: Tecnology) => {
        form.value = tecnology ? { ...tecnology } : defaultTecnology()
        open.value = true
    }

    onMounted(() => {
        fetchTecnologies()
    })

    return {
        tecnologies,
        loading,
        form,
        open,
        categoryName,
        openForm,
        fetchTecnologies,
        createTecnology,
        updateTecnology,
        deleteTecnology,
    }
}


export const tecnologiesStore = useTecnologies()