/**
 * Config for the demo-site builder. Each key represents a page, i.e.
 * 'Highcharts demos'. Select which categories or tags to include with `tags` or
 * `categories`. `Filter` will further limit the selection to the specified tags
 * (or categories) `Path` specifies the relative path the page. In other words,
 * what comes after `highcharts.com/demo`. The key is also used for the page
 * title
 */
module.exports = {
    Highcharts: {
        categories: ['Line charts', 'Area charts', 'Column and bar charts', 'Pie charts', 'Scatter and bubble charts', 'Combinations', 'Styled mode (CSS styling)', 'Accessibility', 'Audio charts', 'Dynamic charts', '3D charts', 'Gauges', 'Heat and tree maps', 'Trees and networks', 'More chart types'],
        filter: { tags: ['Highcharts demo'] },
        path: '/'
    },
    'Highcharts Maps': {
        categories: ['General', 'Dynamic', 'Input formats', 'Series types'],
        filter: { tags: ['Highcharts Maps demo'] },
        path: '/maps/'
    },
    'Highcharts Stock': {
        categories: ['General', 'Chart types', 'Various features', 'Flags and Technical indicators'],
        filter: { tags: ['Highcharts Stock demo'] },
        path: '/stock/'
    },
    'Highcharts Gantt': {
        categories: ['Highcharts Gantt'],
        filter: { tags: ['Highcharts Gantt demo'] },
        path: '/gantt/'
    }
};
