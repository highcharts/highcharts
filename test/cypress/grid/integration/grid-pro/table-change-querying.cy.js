describe('Querying on table change.', () => {
    before(() => {
        cy.visit('/grid-pro/demo/todo-app/');
    });

    it('Mark a todo item as completed when done grid is sorted.', () => {
        cy.get('#container-done .highcharts-datagrid-header-cell[data-column-id="Category"]').click();
        cy.get('table tbody tr').first().find('input[type="checkbox"]').click();
        cy.get('#container-done tbody tr').should('have.length', 4);
    });
});
