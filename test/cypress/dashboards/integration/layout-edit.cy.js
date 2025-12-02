function isWithinParent(element) {
    assert.isAtMost(element.width(), element.parent().innerWidth());
    assert.isAtMost(element.height(), element.parent().innerHeight());
}

function checkCells() {
    cy.get('.highcharts-dashboards-cell').each((cell) => {
        isWithinParent(cell);
    });
}

function checkRowsAndCells() {
    cy.wait(100); // wait a bit for the DOM to settle

    cy.get('.highcharts-dashboards-row').each(($el) => {
        cy.wrap($el).within((row) => {
            // Row is within parent
            isWithinParent(row);
            checkCells();
        });
    });
}

describe('layout resize on window changes', () => {
    before(() => {
        cy.visit('/dashboards/cypress/chart-interaction/');
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

    it('should resize cells and components when dragging the handles', () => {
        // Act
        cy.toggleEditMode();
        cy.get('#dashboard-col-0').click();
        cy.get('#dashboard-col-0').as('secondCell');
        cy.get('.highcharts-dashboards-edit-resize-snap-x').first().as('dragger').trigger('mousedown');
        cy.get('@secondCell').trigger('mousemove', { clientX: 600 }).trigger('mouseup');

        // Assert
        checkCells();

        // Act
        cy.get('.highcharts-dashboards-edit-resize-snap-y').first().as('dragger').trigger('mousedown');
        cy.get('@secondCell').trigger('mousemove', { clientY: 600 }).trigger('mouseup');

        // Assert
        checkCells();
    });
});
