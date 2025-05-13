
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
            endpoint: 'https://test-api.arniva.cloud/v1/sube',
            placeholder: 'Şube ara...'
        }
    ]
}
/** @type {import('./$types').PageLoad} */
export async function load() {
    return {
        filterConfig
    };
};