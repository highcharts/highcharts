describe('Grid Component and data csvURL.', () => {
    it('Loads data from CSV URL and renders grid', () => {
        cy.visit('/dashboards/cypress/component-grid-csv-url');
        cy.get('tr.hcg-row').should('have.length.at.least', 1);
    });
});
