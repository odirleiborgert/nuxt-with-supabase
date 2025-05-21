<script setup>
import {createClient} from '@supabase/supabase-js'
import {h, resolveComponent} from 'vue'

const UButton = resolveComponent('UButton')

const config = useRuntimeConfig()
const toast = useToast()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
const instruments = ref([])
const globalFilter = ref('')
const new_instrument = ref('')
const loading = ref(false)
const columns = ref([
    {header: 'Id', accessorKey: 'id'},
    {
        header: 'Created At',
        accessorKey: 'created_at',
        cell: ({row}) => {
            const date = new Date(row.original.created_at)
            return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
        }
    },
    {header: 'Name', accessorKey: 'name'},
    {
        header: 'Actions', cell: ({row}) => {
            return h(UButton, {
                icon: 'i-lucide-trash-2',
                color: 'error',
                onClick: () => destroy(row.original.id)
            })
        }
    }
])

async function getInstruments() {
    loading.value = true
    const {data} = await supabase.from('instruments').select()
    instruments.value = data
    loading.value = false
}

async function create() {
    if (!new_instrument.value) {
        toast.add({
            title: 'Error',
            description: 'Instrument name is required',
            color: 'error'
        })
        return
    }
    loading.value = true
    const response = await supabase.from('instruments').insert({
        name: new_instrument.value
    })

    if (response.error) {
        toast.add({
            title: 'Error',
            description: response.error.message,
            color: 'error'
        })
        loading.value = false
        return
    }
    
    toast.add({
        title: 'Instruments created',
        description: 'Instruments created successfully',
        color: 'primary'
    })
    sendBroadcast(new_instrument.value)
    new_instrument.value = ''
    loading.value = false
    getInstruments()
    
    
}

async function destroy(id) {
    await supabase.from('instruments').delete().eq('id', id)
    getInstruments()
    toast.add({
        title: 'Instrument deleted',
        description: `Instrument ${id} deleted successfully`,
        color: 'primary'
    })
}

const myChannel = supabase.channel('test-channel', {
    config: {
        broadcast: { self: true },
    }
})

async function sendBroadcast(instrument){
    /**
     * Sending a message before subscribing will use HTTP
     */
    myChannel
        .send({
            type: 'broadcast',
            event: 'shout',
            payload: { message: `New instrument created: ${instrument}` },
        })
        .then((resp) => console.log('sendBroadcast', resp, instrument))
}

myChannel.on(
    'broadcast',
    { event: 'shout' },
    (payload) => console.log(payload)
)

/**
 * Sending a message after subscribing will use Websockets
 */
// myChannel.subscribe((status) => {
//     if (status !== 'SUBSCRIBED') {
//         return null
//     }
//     myChannel.send({
//         type: 'broadcast',
//         event: 'shout',
//         payload: { message: 'Hi' },
//     })
// })

onMounted(() => {
    getInstruments()
})
</script>

<template>
    <UApp>
        <h1 class="text-[30px] text-black font-bold mt-10 mb-10 text-center">Project with Supabase and Nuxt</h1>
        <div class="grid grid-cols-6 max-w-[1100px] mx-auto gap-3 mt-4">
            
            <div class="col-span-2 p-2">
                
                
                <p class="text-sm">Create a new instrument</p>
                <div class="flex items-start gap-3">
                    <UInput v-model="new_instrument" :loading="loading"/>
                    <UButton @click="create()" :loading="loading">Create</UButton>
                </div>
                
                <h1 class="text-[20px] font-bold mt-10">
                    <a href="https://supabase.com/" target="_blank" class="block">
                        <svg width="160" height="50" viewBox="0 0 581 113" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M151.397 66.7608C151.996 72.3621 157.091 81.9642 171.877 81.9642C184.764 81.9642 190.959 73.7624 190.959 65.7607C190.959 58.559 186.063 52.6577 176.373 50.6571L169.379 49.1569C166.682 48.6568 164.884 47.1565 164.884 44.7559C164.884 41.9552 167.681 39.8549 171.178 39.8549C176.772 39.8549 178.87 43.5556 179.27 46.4564L190.359 43.9558C189.76 38.6546 185.064 29.7527 171.078 29.7527C160.488 29.7527 152.696 37.0543 152.696 45.8561C152.696 52.7576 156.991 58.4591 166.482 60.5594L172.976 62.0598C176.772 62.8599 178.271 64.6605 178.271 66.8609C178.271 69.4615 176.173 71.762 171.777 71.762C165.983 71.762 163.085 68.1611 162.786 64.2602L151.397 66.7608Z" fill="#1F1F1F"/><path d="M233.421 80.4639H246.109C245.909 78.7635 245.609 75.3628 245.609 71.5618V31.2529H232.321V59.8592C232.321 65.5606 228.925 69.5614 223.031 69.5614C216.837 69.5614 214.039 65.1604 214.039 59.6592V31.2529H200.752V62.3599C200.752 73.0622 207.545 81.7642 219.434 81.7642C224.628 81.7642 230.325 79.7638 233.022 75.1627C233.022 77.1631 233.221 79.4636 233.421 80.4639Z" fill="#1F1F1F"/><path d="M273.076 99.4682V75.663C275.473 78.9636 280.469 81.6644 287.263 81.6644C301.149 81.6644 310.439 70.6617 310.439 55.7584C310.439 41.1553 302.148 30.1528 287.762 30.1528C280.37 30.1528 274.875 33.4534 272.677 37.2544V31.253H259.79V99.4682H273.076ZM297.352 55.8585C297.352 64.6606 291.958 69.7616 285.164 69.7616C278.372 69.7616 272.877 64.5605 272.877 55.8585C272.877 47.1566 278.372 42.0554 285.164 42.0554C291.958 42.0554 297.352 47.1566 297.352 55.8585Z" fill="#1F1F1F"/><path d="M317.964 67.0609C317.964 74.7627 324.357 81.8643 334.848 81.8643C342.139 81.8643 346.835 78.4634 349.332 74.5625C349.332 76.463 349.532 79.1635 349.832 80.4639H362.02C361.72 78.7635 361.422 75.2627 361.422 72.6622V48.4567C361.422 38.5545 355.627 29.7527 340.043 29.7527C326.855 29.7527 319.761 38.2544 318.963 45.9562L330.751 48.4567C331.151 44.1558 334.348 40.455 340.141 40.455C345.737 40.455 348.434 43.3556 348.434 46.8564C348.434 48.5568 347.536 49.9572 344.738 50.3572L332.65 52.1576C324.458 53.3579 317.964 58.2589 317.964 67.0609ZM337.644 71.962C333.349 71.962 331.25 69.1614 331.25 66.2608C331.25 62.4599 333.947 60.5594 337.345 60.0594L348.434 58.359V60.5594C348.434 69.2615 343.239 71.962 337.644 71.962Z" fill="#1F1F1F"/><path d="M387.703 80.4641V74.4627C390.299 78.6637 395.494 81.6644 402.288 81.6644C416.276 81.6644 425.467 70.5618 425.467 55.6585C425.467 41.0552 417.174 29.9528 402.788 29.9528C395.494 29.9528 390.1 33.1535 387.902 36.6541V8.04785H374.815V80.4641H387.703ZM412.178 55.7584C412.178 64.7605 406.784 69.7616 399.99 69.7616C393.297 69.7616 387.703 64.6606 387.703 55.7584C387.703 46.7564 393.297 41.8554 399.99 41.8554C406.784 41.8554 412.178 46.7564 412.178 55.7584Z" fill="#1F1F1F"/><path d="M432.99 67.0609C432.99 74.7627 439.383 81.8643 449.873 81.8643C457.165 81.8643 461.862 78.4634 464.358 74.5625C464.358 76.463 464.559 79.1635 464.858 80.4639H477.046C476.748 78.7635 476.448 75.2627 476.448 72.6622V48.4567C476.448 38.5545 470.653 29.7527 455.068 29.7527C441.881 29.7527 434.788 38.2544 433.989 45.9562L445.776 48.4567C446.177 44.1558 449.374 40.455 455.167 40.455C460.763 40.455 463.46 43.3556 463.46 46.8564C463.46 48.5568 462.561 49.9572 459.763 50.3572L447.676 52.1576C439.484 53.3579 432.99 58.2589 432.99 67.0609ZM452.671 71.962C448.375 71.962 446.276 69.1614 446.276 66.2608C446.276 62.4599 448.973 60.5594 452.371 60.0594L463.46 58.359V60.5594C463.46 69.2615 458.265 71.962 452.671 71.962Z" fill="#1F1F1F"/><path d="M485.645 66.7608C486.243 72.3621 491.339 81.9642 506.124 81.9642C519.012 81.9642 525.205 73.7624 525.205 65.7607C525.205 58.559 520.311 52.6577 510.62 50.6571L503.626 49.1569C500.929 48.6568 499.132 47.1565 499.132 44.7559C499.132 41.9552 501.928 39.8549 505.425 39.8549C511.021 39.8549 513.118 43.5556 513.519 46.4564L524.607 43.9558C524.007 38.6546 519.312 29.7527 505.326 29.7527C494.735 29.7527 486.944 37.0543 486.944 45.8561C486.944 52.7576 491.238 58.4591 500.73 60.5594L507.224 62.0598C511.021 62.8599 512.519 64.6605 512.519 66.8609C512.519 69.4615 510.421 71.762 506.025 71.762C500.23 71.762 497.334 68.1611 497.034 64.2602L485.645 66.7608Z" fill="#1F1F1F"/><path d="M545.385 50.2571C545.685 45.7562 549.482 40.5549 556.375 40.5549C563.967 40.5549 567.165 45.3561 567.365 50.2571H545.385ZM568.664 63.0601C567.065 67.4609 563.668 70.5617 557.474 70.5617C550.88 70.5617 545.385 65.8606 545.087 59.3593H580.252C580.252 59.159 580.451 57.1587 580.451 55.2582C580.451 39.4547 571.361 29.7527 556.175 29.7527C543.588 29.7527 531.998 39.9548 531.998 55.6584C531.998 72.262 543.886 81.9642 557.374 81.9642C569.462 81.9642 577.255 74.8626 579.753 66.3607L568.664 63.0601Z" fill="#1F1F1F"/><path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)"/><path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint1_linear)" fill-opacity="0.2"/><path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/><defs><linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse"><stop stop-color="#249361"/><stop offset="1" stop-color="#3ECF8E"/></linearGradient><linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse"><stop/><stop offset="1" stop-opacity="0"/></linearGradient></defs></svg>
                    </a>
                    <a href="https://nuxt.com/" target="_blank" class="block">
                        <svg class="text-highlighted block w-auto h-6" width="800" height="200" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M377 200C379.16 200 381 198.209 381 196V103C381 103 386 112 395 127L434 194C435.785 197.74 439.744 200 443 200H470V50H443C441.202 50 439 51.4941 439 54V148L421 116L385 55C383.248 51.8912 379.479 50 376 50H350V200H377Z" fill="currentColor"></path><path d="M726 92H739C742.314 92 745 89.3137 745 86V60H773V92H800V116H773V159C773 169.5 778.057 174 787 174H800V200H783C759.948 200 745 185.071 745 160V116H726V92Z" fill="currentColor"></path><path d="M591 92V154C591 168.004 585.742 179.809 578 188C570.258 196.191 559.566 200 545 200C530.434 200 518.742 196.191 511 188C503.389 179.809 498 168.004 498 154V92H514C517.412 92 520.769 92.622 523 95C525.231 97.2459 526 98.5652 526 102V154C526 162.059 526.457 167.037 530 171C533.543 174.831 537.914 176 545 176C552.217 176 555.457 174.831 559 171C562.543 167.037 563 162.059 563 154V102C563 98.5652 563.769 96.378 566 94C567.96 91.9107 570.028 91.9599 573 92C573.411 92.0055 574.586 92 575 92H591Z" fill="currentColor"></path><path d="M676 144L710 92H684C680.723 92 677.812 93.1758 676 96L660 120L645 97C643.188 94.1758 639.277 92 636 92H611L645 143L608 200H634C637.25 200 640.182 196.787 642 194L660 167L679 195C680.818 197.787 683.75 200 687 200H713L676 144Z" fill="currentColor"></path><path d="M168 200H279C282.542 200 285.932 198.756 289 197C292.068 195.244 295.23 193.041 297 190C298.77 186.959 300.002 183.51 300 179.999C299.998 176.488 298.773 173.04 297 170.001L222 41C220.23 37.96 218.067 35.7552 215 34C211.933 32.2448 207.542 31 204 31C200.458 31 197.067 32.2448 194 34C190.933 35.7552 188.77 37.96 187 41L168 74L130 9.99764C128.228 6.95784 126.068 3.75491 123 2C119.932 0.245087 116.542 0 113 0C109.458 0 106.068 0.245087 103 2C99.9323 3.75491 96.7717 6.95784 95 9.99764L2 170.001C0.226979 173.04 0.00154312 176.488 1.90993e-06 179.999C-0.0015393 183.51 0.229648 186.959 2 190C3.77035 193.04 6.93245 195.244 10 197C13.0675 198.756 16.4578 200 20 200H90C117.737 200 137.925 187.558 152 164L186 105L204 74L259 168H186L168 200ZM89 168H40L113 42L150 105L125.491 147.725C116.144 163.01 105.488 168 89 168Z" fill="#00DC82"></path></svg>
                    </a>
                </h1>
            </div>
            
            <div class="col-span-4 bg-white p-2 rounded-[10px]">
                <div class="flex px-4 py-3.5 border-b border-accented gap-3">
                    <UInput v-model="globalFilter" icon="i-lucide-search" class="max-w-sm" placeholder="Filter..." />
                    <UButton @click="globalFilter = ''" color="neutral">Clear</UButton>
                </div>
                
                <UTable :data="instruments" :columns="columns" v-model:global-filter="globalFilter" class="flex-1" :loading="loading" loading-color="primary" loading-animation="carousel">
                    <template #action-cell="{ row }">
                        {{ row }}
                    </template>
                </UTable>
            </div>
            
        </div>
    </UApp>
</template>