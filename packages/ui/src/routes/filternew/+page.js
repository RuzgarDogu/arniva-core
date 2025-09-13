
const filterConfig = {
    name: 'warehouseFilter',
    translation: {
        general: {
            filter: 'Filtrele',
            clear: 'Temizle',
            delete: 'Sil',
            selected: 'Seçildi',
            loading: 'Yükleniyor...',
            loadingOptions: 'Seçenekler Yükleniyor...',
            noOptions: 'Seçenek Bulunamadı'
        }
    },
    search: {
        placeholder: 'Depo Arayın',
        columns: [
            {
                value: 'adi',
                label: 'Depo Adı içinde ara'
            },
            {
                value: 'kodu',
                label: 'Depo Kodu içinde ara'
            },
            {
                value: 'id',
                label: 'ID içinde ara'
            }
        ]
    },
    fields: [
        {
            name: 'created_at',
            label: 'Oluşturulma Tarihi',
            text: 'Tarih Seçin',
            type: 'date',
            isAmerican: false,
            dateRange: true
        },
        {
            name: 'sube_id',
            label: 'Şube',
            text: 'Şube Seçin',
            type: 'select',
            serverSide: true,
            nameKey: 'adi', // The property to use as the label
            endpoint: 'https://test-api.arniva.cloud/v1/sube',
            placeholder: 'Şube ara...'
        },
        {
            name: 'sube_id',
            label: 'Şubeler (Çoklu)',
            text: 'Şube Seçin',
            type: 'multiselect',
            serverSide: true,
            nameKey: 'adi', // The property to use as the label
            // endpoint: 'https://test-api.arniva.cloud/v1/sube',
            endpoint: {
                url: 'https://test-api.arniva.cloud/v1/sube',
                filter: { id: ['568e22f5-e681-439e-a81c-7608a55849d4', '43abd4d6-d09a-4718-bf53-fc63b63f5aca', '7afc6222-c71c-4399-b239-62f8e5a5182f']}
            },
            // placeholder: 'Şube ara...'
        },
        // {
        //     name: 'islemtip_id',
        //     label: 'Kasa İşlem Tipi (Sil)',
        //     text: 'İşlem Tipi Seçin',
        //     type: 'multiselect',
        //     serverSide: true,
        //     nameKey: 'adi', // The property to use as the label
        //     // endpoint: 'https://test-api.arniva.cloud/v1/sube',
        //     endpoint: {
        //         url: 'https://test-api.arniva.cloud/v1/islemtip',
        //         filter: { modul: [6]}
        //     },
        //     // placeholder: 'Şube ara...'
        // },
        {
            name: 'islemtip_id',
            label: 'Kasa İşlem Tipi (Yeni)',
            text: 'İşlem Tipi Seçin',
            type: 'multiselect',
            serverSide: true,
            nameKey: 'adi', // The property to use as the label
            endpoint: 'https://test-api.arniva.cloud/v1/islemtip?filter=modul eq 7 or modul eq 8&limit=9999',
            // placeholder: 'Şube ara...'
        }
    ]
}
/** @type {import('./$types').PageLoad} */
export async function load() {
    return {
        filterConfig
    };
};