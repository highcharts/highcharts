describe('Pagination.', () => {
    before(() => {
        cy.visit('/grid-pro/cypress/pagination-events');
    });

    it('beforePageChange / afterPageChange.', () => {
        // Click next page button
        cy.get('.highcharts-datagrid-pagination-btn[title="Next page"]').click();

        // Check event logging
        cy.get('#beforePageChange').should('have.value', '1');
        cy.get('#afterPageChange').should('have.value', '2');

        // Click previous button
        cy.get('.highcharts-datagrid-pagination-btn[title="Previous page"]').click();

        // Check event logging
        cy.get('#beforePageChange').should('have.value', '2');
        cy.get('#afterPageChange').should('have.value', '1');

        // Click on page number
        cy.get('.highcharts-datagrid-pagination-page').contains('3').click();

        // Check event logging
        cy.get('#beforePageChange').should('have.value', '1');
        cy.get('#afterPageChange').should('have.value', '3');
    });

    it('beforePageSizeChange / afterPageSizeChange.', () => {
        // Change page size to 10
        cy.get('.highcharts-datagrid-pagination-page-size-select').eq(0).select('20');

        // // Check event logging
        cy.get('#beforePageSizeChange').should('have.value', '22');
        cy.get('#afterPageSizeChange').should('have.value', '20');
    });
});
