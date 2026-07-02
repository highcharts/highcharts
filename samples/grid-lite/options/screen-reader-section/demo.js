const grid = Grid.grid('container', {
    data: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            stock: [120, 85, 40, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    caption: {
        text: 'Fruit inventory'
    },
    description: {
        text: 'Stock levels and prices for a small warehouse selection.'
    },
    accessibility: {
        screenReaderSection: {
            beforeGridFormat:
                '<div>{gridTitle}</div>' +
                '<div>{gridDescription}</div>' +
                '<div>Rows: {rowCount}, columns: {columnCount}.</div>',
            afterGridFormat:
                '<div>End of the Fruit inventory grid.</div>'
        }
    }
});

function getRegionMarkup(placement) {
    const region = document.querySelector(
        '#container [id^="grid-screen-reader-region-' + placement + '-"] div'
    );

    return region?.innerHTML.trim() || '(empty)';
}

function updatePreview() {
    document.getElementById('before-preview').textContent =
        getRegionMarkup('before');
    document.getElementById('after-preview').textContent =
        getRegionMarkup('after');
}

requestAnimationFrame(() => {
    updatePreview();
    grid.container?.addEventListener('focusin', updatePreview);
});
