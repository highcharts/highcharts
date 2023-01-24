
function clickElementInContextMenu(elemName) {
    cy.get('.hd-edit-context-menu-btn').click();
    cy.get('div.hd-edit-context-menu-item').contains(elemName).click();
}
describe('JSON serialization test', () => {
    beforeEach(() => {
        cy.visit('cypress/dashboards/dashboard-layout');
    });

    it.skip('should be the same state after export-delete-import of layout', () => {
        clickElementInContextMenu('Export 1 layout');
        clickElementInContextMenu('Delete 1 layout');
        clickElementInContextMenu('Import saved layout');
    });

    it.skip('should be the same state after export-delete-import of dashboard', () => {
        clickElementInContextMenu('Export dashboard');
        clickElementInContextMenu('Delete current dashboard');
        clickElementInContextMenu('Import saved dashboard');
   });
});
