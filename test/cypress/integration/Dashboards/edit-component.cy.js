describe('Editable component options', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/dashboard-layout');
        cy.viewport(1200, 1000);
        cy.toggleEditMode();
    });

    it('should be able update chart ID via edit mode GUI', function() {
        const newChartID = 'myNewChart';

        cy.get('.highcharts-dashboards-component').first().click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(2)').click();

        // type new value
        cy.get('.highcharts-dashboards-edit-accordion')
            .last().click()
            .find('input[name="chartID"]').clear().type(newChartID);

        // call update
        cy.contains('Confirm').click();
        cy.board().then((board) => {
            assert.equal(
                board.mountedComponents[0].component.options.chartID,
                newChartID,
                'New chartID is applied.'
            );
        });
    });

    it('Chart options should be updated via edit mode GUI', function() {
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
            assert.deepEqual(
                board.mountedComponents[0].component.chart.userOptions.chart.type,
                newChartOptions.chart.type,
                'New chart options are applied on chart.'
            );

            assert.deepEqual(
                board.mountedComponents[0].component.chart.userOptions.title,
                newChartOptions.title,
                'New title options are applied on chart.'
            );

            assert.deepEqual(
                board.mountedComponents[0].component.chart.userOptions.subtitle,
                newChartOptions.subtitle,
                'New subtitle options are applied on chart.'
            );

            assert.deepEqual(
                board.mountedComponents[0].component.chart.userOptions.legend,
                newChartOptions.legend,
                'New legend options are applied on chart.'
            );

            assert.deepEqual(
                board.mountedComponents[0].component.chart.userOptions.xAxis[0],
                newChartOptions.xAxis,
                'New xAxis options are applied on chart.'
            );

            assert.deepEqual(
                board.mountedComponents[0].component.chart.userOptions.yAxis[0],
                newChartOptions.yAxis,
                'New yAxis options are applied on chart.'
            );

            assert.deepEqual(
                board.mountedComponents[0].component.chart.userOptions.plotOptions,
                newChartOptions.plotOptions,
                'New data labels options are applied on chart.'
            );
            assert.deepEqual(
                board.mountedComponents[0].component.chart.userOptions.tooltip,
                newChartOptions.tooltip,
                'New tooltip options are applied on chart.'
            );
        });
    });

});
