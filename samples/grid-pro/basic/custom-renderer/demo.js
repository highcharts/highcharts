/* eslint-disable max-len */

const {
    CellRenderer,
    CellContentPro,
    CellRendererRegistry
} = Grid;

class TextareaContent extends CellContentPro {

    constructor(cell, renderer) {
        super(cell, renderer);
        this.add();
    }

    // Required by the interface
    add(parentElement = this.cell.htmlElement) {
        const textarea = this.textarea = document.createElement('textarea');

        this.update();

        parentElement.appendChild(textarea);

        return textarea;
    }

    // Required by the interface
    update() {
        this.textarea.value = this.cell.value;
    }

    // Required by the interface
    destroy() {
        const textarea = this.textarea;
        textarea.remove();
    }
}

class TextareaRenderer extends CellRenderer {

    constructor(column, options) {
        super(column);
        this.options = options;
    }

    render(cell) {
        return new TextareaContent(cell, this);
    }
}

CellRendererRegistry.registerRenderer('textarea', TextareaRenderer);

Grid.grid('container', {
    dataTable: {
        columns: {
            number: [1, 2, 3, 4, 5, 6, 7],
            text: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'],
            description: [
                // Intentionally long text to test the textarea content type
                'Alpha is the first letter of the Greek alphabet. It is a vowel.It is also the first letter of the English alphabet. It is also the first letter of the Greek alphabet.',
                'Beta is the second letter of the Greek alphabet. It is a consonant. It is also the second letter of the English alphabet. It is also the second letter of the Greek alphabet.',
                'Gamma is the third letter of the Greek alphabet. It is a consonant. It is also the third letter of the English a lphabet. It is also the third letter of the Greek alphabet.',
                'Delta is the fourth letter of the Greek alphabet. It is a consonant. It is also the fourth letter of the English alphabet. It is also the fourth letter of the Greek alphabet.',
                'Epsilon is the fifth letter of the Greek alphabet. It is a vowel. It is also the fifth letter of the English alphabet. It is also the fifth letter of the Greek alphabet.',
                'Zeta is the sixth letter of the Greek alphabet. It is a consonant. It is also the sixth letter of the English alphabet. It is also the sixth letter of the Greek alphabet.',
                'Eta is the seventh letter of the Greek alphabet. It is a vowel. It is also the seventh letter of the English alphabet. It is also the seventh letter of the Greek alphabet.'
            ]
        }
    },
    columns: [{
        id: 'description',
        cells: {
            renderer: {
                type: 'textarea'
            }
        }
    }]
});
