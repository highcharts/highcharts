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
    data: {
        columns: {
            number: [1, 2, 3, 4, 5, 6, 7],
            text: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'],
            description: [
                // Intentionally long text to test the textarea content type
                'Alpha is the first letter of the Greek alphabet. In science, it often represents important constants or particles, like in alpha radiation, which consists of helium nuclei emitted by some radioactive elements.',
                'Beta is the second letter of the Greek alphabet. It is known from beta radiation, where electrons or positrons are emitted from atomic nuclei during certain types of decay.',
                'Gamma is the third letter of the Greek alphabet. Gamma rays are powerful forms of electromagnetic radiation, often produced by nuclear reactions or cosmic events like supernovae.',
                'Delta is the fourth letter of the Greek alphabet. In math and science, it often means a change in value - for example, Δt means a change in time between two events.',
                'Epsilon is the fifth letter of the Greek alphabet. In mathematics, it’s used to describe very small quantities, especially in precise definitions involving limits and accuracy.',
                'Zeta is the sixth letter of the Greek alphabet. It appears in number theory through the Riemann zeta function, which explores deep patterns in prime numbers.',
                'Eta is the seventh letter of the Greek alphabet. In physics, it’s sometimes used to describe viscosity, which is how much a fluid resists flowing - like honey versus water.'
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
