window.dataGrid = DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            dessert: [
                'Fruit Salad',
                'Rice Pudding',
                'Custard',
                'Bread Pudding',
                'Ice Cream',
                'Cheesecake',
                'Brownie',
                'Chocolate Mousse'
            ],
            calories: [50, 118, 122, 153, 207, 321, 260, 250],
            fat: [0.3, 2.0, 3.5, 4.0, 11.0, 23.0, 14.0, 16.0],
            carbs: [13, 22, 20, 28, 24, 29, 34, 30],
            protein: [1.0, 3.0, 4.0, 5.0, 3.5, 6.0, 3.0, 4.5],
            fiber: [2.0, 1.0, 0.5, 1.0, 0.5, 1.0, 2.0, 1.0],
            sugar: [10, 10, 15, 18, 14, 22, 19, 16],
            sodium: [5, 55, 47, 105, 90, 270, 140, 60],
            healthScore: [
                'healthy',
                'moderate',
                'unhealthy',
                'unhealthy',
                'moderate',
                'healthy',
                'moderate',
                'healthy'
            ]

        }
    },
    header: [
        'dessert',
        {
            format: 'Nutritional Info',
            columns: [{
                format: 'Macronutrients',
                columns: [{
                    columnId: 'calories',
                    format: 'Calories'
                }, {
                    columnId: 'fat',
                    format: 'Fat (g)'
                }, {
                    columnId: 'carbs',
                    format: 'Carbs (g)'
                }, {
                    columnId: 'protein',
                    format: 'Protein (g)'
                }]
            }, {
                format: 'Other Nutrients',
                columns: [{
                    columnId: 'fiber',
                    format: 'Fiber (g)'
                }, {
                    columnId: 'sugar',
                    format: 'Sugar (g)'
                }, {
                    columnId: 'sodium',
                    format: 'Sodium (mg)'
                }]
            }]
        },
        {
            format: 'Health Score',
            columns: [{
                columnId: 'healthScore',
                format: 'Score'
            }]
        }
    ],
    columns: [{
        id: 'dessert',
        header: {
            format: 'Dessert (100g serving)'
        }
    }]
});
