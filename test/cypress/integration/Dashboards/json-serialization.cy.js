
function clickElementInContextMenu(elemName) {
    cy.get('.highcharts-dashboards-edit-context-menu-btn').click();
    cy.get('div.highcharts-dashboards-edit-context-menu-item').contains(elemName).click();
}
describe('JSON serialization test', () => {
    beforeEach(() => {
        cy.visit('cypress/dashboards/dashboard-layout');
    });

    it('Resize component', () => {
        cy.viewport(1200, 1000);
        cy.toggleEditMode();
        cy.get('.highcharts-dashboards-component').first().click();

        cy.get('.highcharts-dashboards-edit-resize-snap-x').first()
            .trigger('mousedown')
            .trigger('mousemove', { clientX: 300 })
            .trigger('mouseup');

        cy.get('.highcharts-dashboards-edit-resize-snap-y').first()
            .trigger('mousedown')
            .trigger('mousemove', { clientY: 300 })
            .trigger('mouseup');

        cy.board().then((board) => {
            const json = board.toJSON();
            const cellOptions = json.options.layouts[0].options.rows[0].options.cells[0].options;

            expect(cellOptions.width).to.match(/%/);
            expect(cellOptions.height).to.match(/px/);
        });
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
