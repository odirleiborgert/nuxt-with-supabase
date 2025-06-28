<script setup>
</script>

<template>
    <UApp>
        
        <div>
            
            <div class="grid grid-cols-12 max-w-[1100px] mx-auto gap-3">
                
                <div class="col-span-12">
                    
                    <div>
                        <div class="mx-auto max-w-screen-2xl">
                            <header class="flex items-center justify-between py-4 md:py-8">
                                
                                <h1 class="text-[30px] font-bold">Directory</h1>
                                
                                <div class="ml-8 hidden flex-col gap-2.5 sm:flex-row sm:justify-center lg:flex lg:justify-start">
                                    <CategoryForm />
                                    <TecnologyForm />
                                </div>
                                
                            </header>
                        
                        </div>
                    </div>
                    
                </div>
                
                <div class="col-span-3">
                    <CategoryList />
                </div>
                
                <div class="col-span-9">
                    <NuxtPage />
                </div>
                
                <div class="col-span-12 my-3 text-[12px]">
                    <div class="flex justify-center items-center">
                        <p class="text-gray-500">Made with ❤️ by <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 underline">Nuxt</a>, <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 underline">Supabase</a>  and <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" class="text-gray-500 underline">Tailwind</a></p>
                    </div>
                </div>
                
            </div>
            
        </div>
    </UApp>
</template>