// types/tecnology.ts

export interface Tecnology {
    id: number
    name: string
    description?: string
    url?: string
    category_id: number
    created_at: string
}

export function defaultTecnology(): Tecnology {
    return {
        name: '',
        description: '',
        url: '',
        category_id: null
    }
}