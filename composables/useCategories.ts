// composables/useCategories.ts

// import { useToast } from '#imports'
import type { Category } from '~/types/category'
import { defaultCategory } from '~/types/category'
import { useSupabaseClient } from "~/composables/useSupabaseClient";

// const toast = useToast()

export const useCategories = () => {
    const client = useSupabaseClient()
    const categories = ref<Category[]>([])
    const loading = ref(false)
    const open = ref(false)
    const form = ref<Category>(defaultCategory())
    // const toast = useToast()

    const fetchCategories = async () => {

        loading.value = true

        const { data, error: fetchError } = await client
            .from('categories')
            .select('*, tecnologies(count)')
            .order('name', { ascending: true }) // opcional: ordena pelo nome

        if (fetchError) {
            // toast.add({ title: 'Erro', description: fetchError.message || 'Não foi possível cadastrar a categoria', color: 'error' })
        } else {
            categories.value = data as Category[]
        }

        loading.value = false
    }

    const createCategory = async (category: Partial<Category>) => {

        loading.value = true

        const { error: insertError } = await client
            .from('categories')
            .insert(category)

        loading.value = false

        if (insertError) {
            // toast.add({ title: 'Erro', description: insertError.message || 'Não foi possível cadastrar a categoria', color: 'error' })
            throw insertError
        }

        open.value = false

        // toast.add({ title: 'Categoria cadastrada', description: 'Categoria cadastrada com sucesso', color: 'primary' })

        await fetchCategories()
    }

    const updateCategory = async (id: number, category: Partial<Category>) => {

        loading.value = true

        const { error: updateError } = await client
            .from('categories')
            .update(category)
            .eq('id', id)

        loading.value = false

        if (updateError) {
            // toast.add({ title: 'Erro', description: updateError.message || 'Não foi possível atualizar a categoria', color: 'error' })
            throw updateError
        }

        open.value = false

        // toast.add({ title: 'Categoria atualizada', description: 'Categoria atualizada com sucesso', color: 'primary' })

        await fetchCategories()
    }

    const deleteCategory = async (id: number) => {
        const { error: deleteError } = await client
            .from('categories')
            .delete()
            .eq('id', id)

        if (deleteError) {
            // toast.add({ title: 'Erro', description: deleteError.message || 'Não foi possível deletar a categoria', color: 'error' })
            throw deleteError
        }

        // toast.add({ title: 'Categoria deletada', description: `Categoria deletada com sucesso`, color: 'primary'})

        await fetchCategories()
    }

    const openForm = (category?: Category) => {
        form.value = category ? { ...category } : defaultCategory()
        open.value = true
    }

    onMounted(() => {
        fetchCategories()
    })

    return {
        categories,
        loading,
        open,
        form,
        openForm,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    }
}

export const categoriesStore = useCategories()

