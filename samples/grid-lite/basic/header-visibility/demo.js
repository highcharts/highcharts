const dg = Grid.grid('container', {
    data: {
        columns: {
            product: [
                'Apples', 'Pears', 'Plums', 'Bananas',
                'Oranges', 'Peaches', 'Pineapples', 'Grapes'
            ],
            weight: [100, 40, 0.5, 200, 150, 300, 1000, 500],
            price: [1.5, 2.53, 5, 4.5, 3.5, 2.5, 1, 2],
            metaData: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            icon: [
                'Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL',
                'Oranges URL', 'Peaches URL', 'Pineapples URL', 'Grapes URL'
            ]
        }
    }
});

document.getElementById('toggle-header').addEventListener('click', () => {
    dg.update({
        rendering: {
            header: {
                enabled: !dg.options.rendering.header.enabled
            }
        }
    });
});
