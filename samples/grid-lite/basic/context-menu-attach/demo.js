const grid = Grid.grid('container', {
    data: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    }
});

const sortByPrice = order => grid.update({
    columns: [{
        id: 'price',
        sorting: { order }
    }]
});

// Gives the button Grid context menu functionality.
grid.contextMenu.attach(document.getElementById('actions'), {
    items: [{
        label: 'Cheapest first',
        icon: 'arrowUp',
        onClick: () => sortByPrice('asc')
    }, {
        label: 'Most expensive first',
        icon: 'arrowDown',
        onClick: () => sortByPrice('desc')
    }, {
        separator: true
    }, {
        label: 'Rename this button',
        icon: 'pencil',
        onClick: button => {
            button.textContent = 'Renamed (right-click me)';
        }
    }]
});
