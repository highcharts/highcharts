describe('Grid resize.', () => {
    beforeEach(() => {
        cy.visit('dashboards/cypress/component-grid-resize');
    });

    it('Changes in the grid should be reflected in the options', () => {
        cy.get('.hcg-header-cell').eq(0).as('cell');
        cy.get('@cell').find('.hcg-column-resizer').as('resizer');
        cy.get('@resizer').trigger('mousedown');
        cy.get('@resizer').trigger('mousemove', { pageX: 100 });
        cy.get('@resizer').trigger('mouseup');

        cy.get('@cell').invoke('width').should('be.lessThan', 400);

        cy.board().then((board) => {
            const componentOptions = board.getOptions().components[0];
            const gridOptions = componentOptions.gridOptions;

            assert.equal(componentOptions.type, 'Grid', 'Component type should be Grid');
            assert.notOk(gridOptions.columnDefaults, 'Column defaults should not be defined');
            assert.ok(gridOptions.columns, 'Columns should be defined');
            assert.notOk(gridOptions.credits, 'Credits should not be defined');
            assert.notOk(gridOptions.lang, 'Language should not be defined');
            assert.notOk(gridOptions.rendering, 'Rendering should not be defined');
        });
    });
});