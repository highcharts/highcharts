
describe('JSON serialization test', () => {
    beforeEach(() => {
        cy.visit('cypress/dashboard/dashboard-layout');
    });

    // it('should be the same state after export-delete-import of layout', () => {
    //     cy.get('.hd-edit-context-menu-btn').click();
    //     cy.get('div.hd-edit-context-menu-item').contains('Export 1 layout').click();

    //     cy.get('.highcharts-xaxis-labels').children().first().should('contain', 'buba');
    //     cy.get('.hd-edit-context-menu-btn').click();
    //     cy.get('div.hd-edit-context-menu-item').contains('Delete 1 layout').click();

    //     cy.get('.hd-edit-context-menu-btn').click();
    //     cy.get('div.hd-edit-context-menu-item').contains('Import saved layout').click();
    //     cy.get('.highcharts-xaxis-labels').children().first()
    // });

    it('should be the same state after export-delete-import of dashboard', () => {
        cy.get('.hd-edit-context-menu-btn').click();
        cy.get('div.hd-edit-context-menu-item').contains('Export dashboard').click();

        cy.get('.hd-edit-context-menu-btn').click();
        cy.get('div.hd-edit-context-menu-item').contains('Delete current dashboard').click();

        cy.get('.hd-edit-context-menu-btn').click();
        cy.get('div.hd-edit-context-menu-item').contains('Import saved dashboard').click();
   });
});
