describe('Grid resize.', () => {
    beforeEach(() => {
        cy.visit('dashboards/cypress/component-grid-resize');
    });

    it('Changes in the grid should be reflected in the options', () => {
        cy.get('.highcharts-datagrid-header-cell').eq(0).as('cell');
        cy.get('@cell').find('.highcharts-datagrid-column-resizer').as('resizer');
        cy.get('@resizer').trigger('mousedown');
        cy.get('@resizer').trigger('mousemove', { pageX: 100 });
        cy.get('@resizer').trigger('mouseup');

        cy.get('@cell').invoke('width').should('be.lessThan', 400);

        cy.board().then((board) => {
            const options = board.getOptions().components[0];
            const gridOptions = options.gridOptions;

            assert.equal(options.type, 'Grid', 'Component type should be Grid');
            assert.ok(gridOptions.columnDefaults, 'Column defaults should be defined');
            assert.ok(gridOptions.columns, 'Columns should be defined');
            assert.ok(gridOptions.credits, 'Credits should be defined');
            assert.ok(gridOptions.lang, 'Language should be defined');
            assert.ok(gridOptions.rendering, 'Rendering should be defined');
        });
    });
});
