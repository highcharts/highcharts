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
                'Alpha is the first letter of the Greek alphabet and is a vowel. Although it shares the name with the first letter of the English alphabet. In Greek, Alpha holds both phonetic and symbolic significance.',
                'Beta is the second letter of the Greek alphabet and is a vowel. Although it shares the name with the second letter of the English alphabet. In Greek, Beta holds both phonetic and symbolic significance.',
                'Gamma is the third letter of the Greek alphabet and is a vowel. Although it shares the name with the third letter of the English alphabet. In Greek, Gamma holds both phonetic and symbolic significance.',
                'Delta is the fourth letter of the Greek alphabet and is a vowel. Although it shares the name with the fourth letter of the English alphabet. In Greek, Delta holds both phonetic and symbolic significance.',
                'Epsilon is the fifth letter of the Greek alphabet and is a vowel. Although it shares the name with the fifth letter of the English alphabet. In Greek, Epsilon holds both phonetic and symbolic significance.',
                'Zeta is the sixth letter of the Greek alphabet and is a vowel. Although it shares the name with the sixth letter of the English alphabet. In Greek, Zeta holds both phonetic and symbolic significance.',
                'Eta is the seventh letter of the Greek alphabet and is a vowel. Although it shares the name with the seventh letter of the English alphabet. In Greek, Eta holds both phonetic and symbolic significance.'
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
