
function clickElementInContextMenu(elemName) {
    cy.get('.highcharts-dashboards-edit-context-menu-btn').click();
    cy.get('div.highcharts-dashboards-edit-context-menu-item').contains(elemName).click();
}

function grabComponent(name) {
    cy.get('.highcharts-dashboards-edit-tools-btn').contains('Add').click();
    cy.get('.highcharts-dashboards-edit-grid-items')
        .children()
        .contains(name)
        .trigger('mousedown');
}

function dropComponent(elementName) {
    cy.get(elementName).first().trigger('mouseenter', {force: true});
    cy.get(elementName).first().trigger('mousemove', 'right', {force: true});
    cy.get(elementName).first().trigger('mouseup', 'right', {force: true});
}


describe('JSON serialization test', () => {
    beforeEach(() => {
        cy.visit('dashboards/cypress/dashboard-layout');
    });

    it('Should save state after resizing cell.', () => {
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
            const json = board.getOptions();
            const cellOptions = json.gui.layouts[0].rows[0].cells[0];

            expect(cellOptions.width).to.match(/%/);
            expect(cellOptions.height).to.match(/px/);
        });
    });

    it('Component\'s state should be updated, after actions in sidebar', () => {
        const newChartOptions = {
            chart: {
                type: 'column'
            },
            credits: {
                text: 'column',
                href: 'http://column.com'
            },
            legend: {
                enabled: true,
                align: 'left'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        align: 'left'
                    }
                }
            },
            subtitle: {
                text: 'column subtitle'
            },
            title: {
                text: 'column title'
            },
            tooltip: {
                enabled: true,
                split: true
            },
            xAxis: {
                title: { text: 'column xAxis title' },
                type: 'linear'
            },
            yAxis: {
                title: { text: 'column yAxis title' },
                type: 'linear'
            }
        };

        cy.toggleEditMode();

        cy.get('.highcharts-dashboards-component').first().click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(2)').click();

        // type new value
        cy.get('.highcharts-dashboards-edit-accordion')
            .contains('Chart options')
            .click();

        cy.get('.highcharts-dashboards-edit-accordion-content .highcharts-dashboards-edit-accordion-header')
            .each((item) => {
                cy.wrap(item).click().then(() => {
                    const currentOption = item.find('span').text();
                    const detailsContent = item.siblings('.highcharts-dashboards-edit-accordion-content').eq(0);
                    const toggleInput = item.find('input');
                    const dropdown = detailsContent.find('button.highcharts-dashboards-edit-dropdown-button');

                    if (currentOption.match(/chart/ig)) {
                        cy.wrap(detailsContent.find('input[name="title"]')).clear().type(newChartOptions.title.text);
                        cy.wrap(detailsContent.find('input[name="subtitle"]')).clear().type(newChartOptions.subtitle.text);
                    }

                    if (currentOption.match(/credits/ig)) {
                        cy.wrap(detailsContent.find('input[name="url"]'))
                            .clear().type(newChartOptions.credits.href);
                        cy.wrap(detailsContent.find('input[name="name"]'))
                            .clear().type(newChartOptions.credits.text);
                    }

                    if (currentOption.match(/xaxis/ig)) {
                        cy.wrap(detailsContent.find('input[name="title"]'))
                            .clear().type(newChartOptions.xAxis.title.text);
                    }

                    if (currentOption.match(/yaxis/ig)) {
                        cy.wrap(detailsContent.find('input[name="title"]'))
                            .clear().type(newChartOptions.yAxis.title.text);
                    }

                    if (toggleInput.length > 0) {
                        item.find('.highcharts-dashboards-edit-toggle-wrapper').click();
                    }

                    // tooltip
                    if (currentOption.match(/tooltip/ig)) {
                        detailsContent.find('.highcharts-dashboards-edit-toggle-wrapper').click()
                    }

                    // select
                    if (dropdown.length > 0) {
                        cy.wrap(dropdown).click().parent().find('li').eq(0).click();
                    }
                });
            });

        // call update
        cy.contains('Confirm').click();
        cy.board().then((board) => {
            const json = board.getOptions();
            const componentChartOptions = board.mountedComponents[0].component.options.chartOptions;
            const componentJSONChartOptions = json.components[0].chartOptions;

            assert.equal(
                componentJSONChartOptions.chart.type,
                componentChartOptions.chart.type,
                'New chart options are applied on chart.'
            );

            assert.deepEqual(
                componentJSONChartOptions.title,
                componentChartOptions.title,
                'New title options are applied on chart.'
            );

            assert.deepEqual(
                componentJSONChartOptions.subtitle,
                componentChartOptions.subtitle,
                'New subtitle options are applied on chart.'
            );

            assert.deepEqual(
                componentJSONChartOptions.legend,
                componentChartOptions.legend,
                'New legend options are applied on chart.'
            );

            assert.deepEqual(
                componentJSONChartOptions.xAxis[0],
                componentChartOptions.xAxis[0],
                'New xAxis options are applied on chart.'
            );

            assert.deepEqual(
                componentJSONChartOptions.yAxis[0],
                componentChartOptions.yAxis[0],
                'New yAxis options are applied on chart.'
            );

            assert.deepEqual(
                componentJSONChartOptions.plotOptions,
                componentChartOptions.plotOptions,
                'New data labels options are applied on chart.'
            );

            assert.deepEqual(
                componentJSONChartOptions.tooltip,
                componentChartOptions.tooltip,
                'New tooltip options are applied on chart.'
            );
        });
    });

    it('Should save state after dragging.', () => {
        cy.toggleEditMode();
        cy.get('#cell-1').click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell').children()
            .first()
            .trigger('mousedown');
        cy.get('#cell-2').first().trigger('mousemove', 'bottom');
        cy.get('#cell-2').first().trigger('mouseup', 'bottom');
        cy.board().then((board) => {
            const json = board.getOptions();

            assert.equal(
                json.gui.layouts[0].rows.length,
                2,
                'Two rows should be present.'
            );
        });
    });

    it('Should save state after removing cell.', () => {
        cy.toggleEditMode();
        cy.get('.highcharts-dashboards-component').first().click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell').children()
            .last()
            .click();
        
        cy.get('button').contains('Confirm').click();

        cy.board().then((board) => {
            const json = board.getOptions();
            assert.equal(
                json.gui.layouts[0].rows[0].cells.length,
                1,
                'One cell should be present.'
            );
        });
    });

    it('Should save state after add new component.', () => {
        cy.toggleEditMode();
        grabComponent('layout');
        dropComponent('#cell-2');

        cy.board().then((board) => {
            const json = board.getOptions();

            assert.equal(
                json.gui.layouts.length,
                2,
                'New layout should be added.'
            );
        });
    });

    it('Should save state after add new component.', () => {
        cy.toggleEditMode();
        grabComponent('chart');
        dropComponent('#cell-2');

        cy.board().then((board) => {
            const json = board.getOptions();

            assert.equal(
                json.gui.layouts[0].rows[0].cells.length,
                3,
                'New cell should be added.'
            );

            assert.equal(
                json.components.length,
                3,
                'New component should be added.'
            );
        });
    });
});
