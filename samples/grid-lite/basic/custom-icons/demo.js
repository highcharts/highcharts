const customChevronRight = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M2 1L2 11L10 6Z" fill="currentColor"/></svg>';

const circleSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.5"/></svg>';

const customStarIcon = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    children: [{
        d: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 ' +
            '21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
        stroke: 'currentColor',
        'stroke-width': 2,
        'stroke-linejoin': 'round',
        fill: 'none'
    }]
};

Grid.grid('container', {
    dataTable: {
        columns: {
            product: [
                'Apples', 'Pears', 'Plums', 'Bananas', 'Oranges',
                'Grapes', 'Lemons', 'Peaches', 'Melons', 'Berries'
            ],
            weight: [100, 40, 0.5, 200, 120, 80, 60, 90, 150, 25],
            price: [1.5, 2.53, 5, 4.5, 3.2, 4, 0.8, 2.1, 1.9, 6]
        }
    },
    columnDefaults: {
        cells: {
            contextMenu: {
                items: [{
                    label: 'Mark as favorite',
                    icon: 'star',
                    onClick: function () {
                        alert('Favorite clicked');
                    }
                }]
            }
        }
    },
    pagination: {
        enabled: true,
        pageSize: 5,
        controls: {
            pageSizeSelector: {
                options: [2, 5, 10]
            }
        }
    },
    rendering: {
        icons: {
            chevronRight: customChevronRight,
            arrowUpDown: circleSvg,
            star: customStarIcon
        }
    }
});
