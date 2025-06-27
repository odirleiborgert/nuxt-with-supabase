// composables/useSupabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL as string
// const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY as string

let client: ReturnType<typeof createClient> | null = null

export const useSupabaseClient = () => {
    if (!client) {
        client = createClient('https://ttfjbjhkdmmvfebdpsur.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZmpiamhrZG1tdmZlYmRwc3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTE4MjgsImV4cCI6MjA2MzMyNzgyOH0.n5JMnRlV8THjY67ZLZQ3CuDsclXSzzQAnOrMjpcyN7I')
    }
    return client
}