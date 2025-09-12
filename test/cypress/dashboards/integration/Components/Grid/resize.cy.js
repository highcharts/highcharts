describe('Grid component resize reflected in options', () => {
    beforeEach(() => {
        cy.visit('dashboards/cypress/component-grid-resize');
    });

    it('Changes in the grid should be reflected in the options', () => {
        cy.board().then(board => {
            const componentOptions = board.mountedComponents[0].component.options;
            const gridOptions = componentOptions.gridOptions;
            console.log(gridOptions);
            assert.notOk(gridOptions.columnDefaults, 'Column defaults should not be defined');
            assert.ok(gridOptions.columns, 'Columns should be defined');
            assert.notOk(gridOptions.credits, 'Credits should not be defined');
            assert.notOk(gridOptions.lang, 'Language should not be defined');
            assert.notOk(gridOptions.rendering, 'Rendering should not be defined');
        });
    });
});

