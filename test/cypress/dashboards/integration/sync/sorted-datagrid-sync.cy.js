describe('Highlight sync after sorting datagrid column.', () => {
    before(()=>{
        cy.visit('/dashboards/cypress/component-datagrid');
    });

    it('Sorted datagrid should synchronize correct rows with chart\'s points.', () => {
        cy.get('th[data-column-id="Vitamin A"]').click();
        cy.get('tr[data-row-index="0"] td[data-column-id="Vitamin A"]').trigger('mouseover');

        cy.chart().then(chart =>{
            expect(
                chart.series[0].points.map(p => p.y),
                'Chart data should not be sorted.'
            ).to.deep.equal([6421, 2122, 1350, 388, 214, 180, 140, 60, 60, 120, 120, 157]);

            expect(
                chart.series[0].points[7].state,
                'The 8th point should be highlighted.'
            ).to.be.equal('hover');
        })
    });
});
