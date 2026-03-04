describe('Remove the dashboard.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/grid-hidden');
    });

    it('Rows should be visible when grid is switched from hidden.', () => {
        // Act
        cy.get('#show').trigger('click');

        // Assert
        cy.get('tr').should('have.length', 5);
    });

    it('Rows should have even and odd classes.', () => {
        cy.get('tbody tr').eq(0).should('have.class', 'hcg-row-odd');
        cy.get('tbody tr').eq(1).should('have.class', 'hcg-row-even');
    });
});

describe('Grid rows removal.', () => {
    before(() => {
        cy.visit('grid-lite/basic/destroy-grid');
    });

    it('Remove all grid rows.', () => {
        cy.get('#delete-rows-btn').click();
        // All grid rows should be removed.
        cy.get('tbody').should('be.empty');
    });
});

describe('Rendering size.', () => {
    before(() => {
        cy.visit('grid-lite/e2e/rendering-size');
    });

    it('Fixed height grid.', () => {
        cy.get('#container').should('have.css', 'height', '200px');
    });

    it('Percentage height grid inside fixed container.', () => {
        cy.get('#grid2').should('have.css', 'height', '200px');
    });

    it('Max height inside fixed container.', () => {
        cy.get('#grid3').should('have.css', 'height', '180px');
    });

    it('Flex grow inside fixed flexbox.', () => {
        cy.get('#grid4').should('have.css', 'height', '200px');
    });
});
