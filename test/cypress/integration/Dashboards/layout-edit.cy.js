function isWithinParent(element) {
    assert.isAtMost(element.width(), element.parent().innerWidth());
    assert.isAtMost(element.height(), element.parent().innerHeight());
}

function checkCells() {
    cy.get('.hd-cell').each((cell) => {
        isWithinParent(cell);
    });
}

function checkRowsAndCells() {
    cy.wait(100); // wait a bit for the DOM to settle

    cy.get('.hd-row').each(($el) => {
        cy.wrap($el).within((row) => {
            // Row is within parent
            isWithinParent(row);
            checkCells();
        });
    });
}

describe('layout resize on window changes', () => {
    before(() => {
        cy.visit('/cypress/dashboards/chart-interaction/');
    });
    it('should resize rows and cells correctly on horizontal window changes', () => {
        cy.viewport(1200, 1000);
        checkRowsAndCells();

        cy.viewport(600, 1000);
        checkRowsAndCells();

        cy.viewport(1200, 1000);
        checkRowsAndCells();
    });

    it('should resize rows and cells on vertical window changes', () => {
        cy.viewport(1200, 500);
        checkRowsAndCells();

        cy.viewport(1200, 1000);
        checkRowsAndCells();
    });

    // TODO: update when resizer is cemented
    it.skip('should resize cells and components when dragging the handles', () => {
        cy.get('.hd-row').first().next().as('secondRow').within(() => {
            cy.get('.hd-edit-resize-snap-x').first().as('dragger')
                .trigger('mousedown')
            cy.get('@secondRow')
                .trigger('mousemove', { clientX: 600 })
                .trigger('mouseup')

            checkCells()
            cy.get('.hd-component').each((component) => {
                isWithinParent(component)
            });

            cy.get('.hd-edit-resize-snap-y').first().as('dragger')
                .trigger('mousedown')
            cy.get('@secondRow')
                .trigger('mousemove', { clientY: 600 })
                .trigger('mouseup')

            checkCells()
            cy.get('.hd-component').each((component) => {
                isWithinParent(component)
            });
        });
    });
});
