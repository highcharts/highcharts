const countryByCode = {
    PL: {
        flag: '🇵🇱',
        name: 'Poland'
    },
    NL: {
        flag: '🇳🇱',
        name: 'Netherlands'
    },
    RO: {
        flag: '🇷🇴',
        name: 'Romania'
    },
    EC: {
        flag: '🇪🇨',
        name: 'Ecuador'
    },
    ES: {
        flag: '🇪🇸',
        name: 'Spain'
    },
    IT: {
        flag: '🇮🇹',
        name: 'Italy'
    },
    DE: {
        flag: '🇩🇪',
        name: 'Germany'
    },
    TR: {
        flag: '🇹🇷',
        name: 'Turkey'
    },
    BR: {
        flag: '🇧🇷',
        name: 'Brazil'
    }
};

const productCatalog = [
    { name: 'Apples', baseWeight: 110, basePrice: 1.5, country: 'PL' },
    { name: 'Pears', baseWeight: 95, basePrice: 2.2, country: 'NL' },
    { name: 'Plums', baseWeight: 60, basePrice: 3.9, country: 'RO' },
    { name: 'Bananas', baseWeight: 120, basePrice: 2.8, country: 'EC' },
    { name: 'Grapes', baseWeight: 70, basePrice: 3.5, country: 'ES' },
    { name: 'Peaches', baseWeight: 140, basePrice: 4.1, country: 'IT' },
    { name: 'Cherries', baseWeight: 30, basePrice: 5.2, country: 'TR' },
    { name: 'Strawberries', baseWeight: 25, basePrice: 4.8, country: 'DE' },
    { name: 'Blueberries', baseWeight: 22, basePrice: 5.5, country: 'BR' },
    { name: 'Mangos', baseWeight: 150, basePrice: 3.9, country: 'EC' }
];

const rows = Array.from({ length: 200 }, (_, index) => {
    const catalogEntry = productCatalog[index % productCatalog.length];
    const seasonalShift = (index % 5) * 5;
    const priceVariation = ((index % 4) * 0.15);

    return {
        available: (index % 4) !== 0,
        product: catalogEntry.name,
        weight: catalogEntry.baseWeight + seasonalShift,
        price: Number((catalogEntry.basePrice + priceVariation).toFixed(2)),
        country: catalogEntry.country,
        trend: Array.from({ length: 6 }, (_, pointIndex) => {
            const base = 2 + (index % 6);
            const seasonal = Math.sin((index + pointIndex) / 2) * 2;
            const growth = pointIndex * 0.5;
            return Math.floor(base + seasonal + growth);
        })
    };
});

const gridData = {
    available: rows.map(row => row.available),
    product: rows.map(row => row.product),
    weight: rows.map(row => row.weight),
    price: rows.map(row => row.price),
    country: rows.map(row => row.country),
    trend: rows.map(row => row.trend)
};

const columnsConfig = [{
    id: 'available',
    width: 100,
    className: 'hcg-center',
    header: {
        format: 'In Stock'
    },
    cells: {
        format: `
            {#if value}
                <span class="green">✓</span>
            {else}
                <span class="red">✗</span>
            {/if}
        `
    }
}, {
    id: 'product',
    header: {
        format: 'Product'
    },
    cells: {
        editMode: {
            enabled: false
        }
    }
}, {
    id: 'country',
    header: {
        format: 'Country'
    },
    cells: {
        formatter: function () {
            const countryObj = countryByCode[this.value];
            return countryObj ? `${countryObj.flag} ${countryObj.name}` :
                this.value;
        },
        editMode: {
            renderer: {
                type: 'select',
                options: Object.keys(countryByCode).map(code => ({
                    value: code,
                    label: countryByCode[code].name
                }))
            }
        }
    }
}, {
    id: 'weight',
    header: {
        format: 'Weight (kg)'
    }
}, {
    id: 'price',
    header: {
        format: 'Price'
    },
    cells: {
        format: '${value}',
        editMode: {
            renderer: {
                type: 'numberInput',
                attributes: {
                    step: 0.5,
                    min: 1
                }
            }
        }
    }
}, {
    id: 'trend',
    header: {
        format: 'Sales trend'
    },
    cells: {
        renderer: {
            type: 'sparkline'
        },
        editMode: {
            validationRules: ['notEmpty', {
                validate: function ({ value }) {
                    return /^\d+(?:,\d+)*$/.test(value);
                },
                notification: 'Please enter a comma-separated list of numbers.'
            }]
        }
    }
}];

Grid.grid('container', {
    dataTable: {
        columns: gridData
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    pagination: {
        enabled: true,
        pageSize: 20,
        controls: {
            pageInfo: {
                enabled: false
            },
            pageSizeSelector: {
                enabled: false
            }
        }
    },
    columns: columnsConfig
});
