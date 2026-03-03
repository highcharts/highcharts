Grid.grid('container', {
    dataTable: {
        columns: {
            product: [
                'Apples',
                'Pears',
                'Plums',
                'Bananas',
                'Oranges',
                'Grapes'
            ],
            stock: [120, 55, 25, 10, 0, 80],
            margin: [38, 22, 14, 8, 4, 31]
        }
    },
    columnDefaults: {
        header: {
            style: {
                fontWeight: '700'
            }
        }
    },
    columns: [
        {
            id: 'product',
            style: {
                fontWeight: '100'
            },
            header: {
                style: {
                    backgroundColor: 'rgba(51, 65, 85, 0.85)',
                    color: '#f8fafc'
                }
            }
        },
        {
            id: 'stock',
            style: function () {
                return {
                    textAlign: 'right'
                };
            },
            header: {
                style: function () {
                    return {
                        backgroundColor: 'rgba(15, 118, 110, 0.85)',
                        color: '#f8fafc'
                    };
                }
            },
            cells: {
                style: function () {
                    if (this.value >= 50) {
                        return { color: '#22c55e', fontWeight: '700' };
                    }
                    if (this.value >= 20) {
                        return { color: '#f59e0b', fontWeight: '700' };
                    }
                    return {
                        color: '#ef4444',
                        fontWeight: '700'
                    };
                }
            }
        },
        {
            id: 'margin',
            cells: {
                style: function () {
                    const value = this.value;

                    if (value >= 25) {
                        return { color: '#22c55e', fontWeight: '700' };
                    }
                    if (value >= 10) {
                        return { color: '#f59e0b', fontWeight: '700' };
                    }

                    return {
                        color: '#ef4444',
                        fontWeight: '700'
                    };
                }
            },
            header: {
                style: {
                    backgroundColor: 'rgba(124, 45, 18, 0.85)',
                    color: '#f8fafc'
                }
            }
        }
    ],
    caption: {
        text: 'Column style options with simple high/medium/low thresholds'
    }
});
