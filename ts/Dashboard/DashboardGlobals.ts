/**
 *
 * Prefix of a GUIElement HTML class name.
 *
 */
const PREFIX = 'highcharts-dashboard-';

const DashboardGlobals: DashboardGlobals = {
    prefix: PREFIX,
    layout: PREFIX + 'layout',
    column: PREFIX + 'column',
    row: PREFIX + 'row'
};

interface DashboardGlobals {
    prefix: string;
    layout: string;
    column: string;
    row: string;
}

export default DashboardGlobals;
