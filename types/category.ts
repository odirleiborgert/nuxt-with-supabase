// types/category.ts

export interface Category {
    id: number
    name: string
    created_at: string
}

export function defaultCategory(): Category {
    return {
        name: ''
    }
}
