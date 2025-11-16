/* *
 *
 * Custom Sparkline Editor Renderer
 *
 * */

const { merge, Popup } = Grid;

class SparklineEditorPopup extends Popup {
    renderContent() {
        const { cell } = this.options;
        this.data = JSON.parse(`[${cell.value}]`);

        this.itemsContainer = document.createElement('div');
        this.content.appendChild(this.itemsContainer);

        this.data.forEach(value => {
            this.renderInputWithBtn(value);
        });
        this.renderInputWithBtn(null);

        this.renderFooter();
    }

    renderInputWithBtn(value) {
        const wrap = document.createElement('div');
        const input = document.createElement('input');
        const btn = document.createElement('button');

        wrap.classList.add('sparkline-editor-popup-item');
        input.type = 'number';
        input.value = value;
        btn.innerText = 'x';

        if (!value && value !== 0) {
            btn.style.display = 'none';
        }

        wrap.append(input, btn);
        this.itemsContainer.appendChild(wrap);

        if (!this.items) {
            this.items = [];
        }

        this.items.push({
            wrap, input, btn
        });

        const getI = () => (
            this.items.findIndex(item => item.input === input)
        );

        btn.addEventListener('click', () => {
            const i = getI();
            this.items.splice(i, 1);
            this.data.splice(i, 1);
            wrap.remove();
        });

        input.addEventListener('change', () => {
            const i = getI();
            if (i === this.data.length) {
                this.data.push(+input.value);
                this.items[i].btn.style.display = 'inline';
                this.renderInputWithBtn(null, this.data.length);
            } else {
                this.data[i] = +input.value;
            }
        });

        return input;
    }

    renderFooter() {
        const { cellEditing } = this.grid.viewport;

        this.footer = document.createElement('div');
        this.footer.classList.add('popup-footer');
        this.content.appendChild(this.footer);

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancel';
        const editBtn = document.createElement('button');
        editBtn.innerText = 'Save';

        cancelBtn.addEventListener('click', () => {
            cellEditing.stopEditing(false);
        });

        editBtn.addEventListener('click', () => {
            console.log(this.data);
            cellEditing.stopEditing(true);
        });

        this.footer.append(cancelBtn, editBtn);
    }

    hide(hiddenByEditor) {
        if (!hiddenByEditor) {
            this.grid.viewport.cellEditing.stopEditing(false);
        }
        super.hide();
    }
}

class SparklineEditorContent extends Grid.CellContentPro {
    constructor(cell, renderer, parentElement) {
        super(cell, renderer);
        this.popup = this.add(parentElement);
    }

    get value() {
        return this.popup.data.join(',');
    }

    add(parentElement) {
        const { column } = this.renderer;

        const popup = new SparklineEditorPopup(column.viewport.grid, null, {
            nextToAnchor: true,
            header: {
                label: 'Sparkline Editor'
            },
            cell: this.cell
        });

        popup.show(parentElement);

        column.viewport.cellEditing.containerElement.classList.add(
            'sparkline-editor-editing-container'
        );

        return popup;
    }

    getMainElement() {
        return this.popup.items[0].input;
    }

    destroy() {
        this.popup?.hide(true);
    }
}

class SparklineEditorRenderer extends Grid.CellRenderer {
    constructor(column, options) {
        super(column);
        this.options = merge(SparklineEditorRenderer.defaultOptions, options);
    }

    render(cell, parentElement) {
        return new SparklineEditorContent(cell, this, parentElement);
    }
}

SparklineEditorRenderer.defaultEditingRenderer = 'checkbox';
SparklineEditorRenderer.defaultOptions = {
    type: 'sparklineEditor'
};

Grid.CellRendererRegistry.registerRenderer(
    'sparklineEditor',
    SparklineEditorRenderer
);


/* *
 *
 * Usage in Grid
 *
 * */

Grid.grid('container', {
    dataTable: {
        columns: {
            ID: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10
            ],
            Name: [
                'Alice', 'Bob', 'Charlie', 'David', 'Eve',
                'Frank', 'George', 'Harry', 'Ivy', 'Jack'
            ],
            Trend: [
                '1,2,3', '3,2,1', '2,2,2', '4,5,6', '6,5,2',
                '7,2,5', '9,2,7', '10,1,9', '12,10,8', '1,6,4'
            ]
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: [{
        id: 'Trend',
        cells: {
            renderer: {
                type: 'sparkline'
            },
            editMode: {
                renderer: {
                    type: 'sparklineEditor'
                }
            }
        }
    }]
});
