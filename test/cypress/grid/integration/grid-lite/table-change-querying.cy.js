describe('Querying on table change.', () => {
    before(() => {
        cy.visit('/grid-lite/cypress/table-change-querying/');
    });

    it('Add a new row to the table.', () => {
        cy.get('#add-row').click();
        cy.get('table tbody tr').should('have.length', 5);
    });
});
