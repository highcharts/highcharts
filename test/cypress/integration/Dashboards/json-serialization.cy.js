
function clickElementInContextMenu(elemName) {
    cy.get('.highcharts-dashboards-edit-context-menu-btn').click();
    cy.get('div.highcharts-dashboards-edit-context-menu-item').contains(elemName).click();
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


   it('should save state after dragging.', () => {
        cy.toggleEditMode();
        cy.get('#cell-1').click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell').children()
            .first()
            .trigger('mousedown');
        cy.get('#cell-2').first().trigger('mousemove', 'bottom');
        cy.get('#cell-2').first().trigger('mouseup', 'bottom');
        cy.board().then((board) => {
            const json = board.toJSON();

            assert.equal(
                json.options.layouts[0].options.rows.length,
                2,
                'Two rows should be present.'
            );
        });
   });
});
