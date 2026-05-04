const ui = {
    top: document.getElementById('topPinned'),
    bottom: document.getElementById('bottomPinned'),
    before: document.getElementById('beforeEvent'),
    after: document.getElementById('afterEvent')
};

const rowCount = 50;
const categories = ['Fruit', 'Vegetable', 'Snacks', 'Drinks'];
const ids = Array.from(
    { length: rowCount },
    (_, i) => 'SKU-' + String(i + 1).padStart(3, '0')
);

function toList(idsToFormat) {
    return idsToFormat.length ? idsToFormat.join(', ') : 'None';
}

function renderPinned(topIds, bottomIds) {
    ui.top.textContent = toList(topIds);
    ui.bottom.textContent = toList(bottomIds);
}

function renderEvent(target, event) {
    const rowId = event.rowId === void 0 ? 'n/a' : String(event.rowId);
    target.textContent = `${event.action} | row: ${rowId}`;
}

const columns = {
    id: ids,
    product: ids.map((_, i) => 'Product ' + (i + 1)),
    category: ids.map((_, i) => categories[i % categories.length]),
    stock: ids.map((_, i) => 15 + ((i * 7) % 90)),
    price: ids.map((_, i) => Number((1 + (i % 12) * 0.35).toFixed(2)))
};

const grid = Grid.grid('container', {
    data: { columns },
    rendering: {
        rows: {
            pinning: {
                idColumn: 'id',
                topIds: [ids[0]],
                bottomIds: [ids[ids.length - 1]],
                events: {
                    beforeRowPin: function (event) {
                        renderEvent(ui.before, event);
                    },
                    afterRowPin: function (event) {
                        renderEvent(ui.after, event);
                        renderPinned(event.topIds, event.bottomIds);
                    }
                }
            }
        }
    }
});

const pinned = grid.rowPinning.getPinnedRows();
renderPinned(pinned.topIds, pinned.bottomIds);
