

Highcharts.chart('container', {
    chart: {
        inverted: true
    },
    title: {
        text: "World War Two Timeline - Inverted"
    },
    subtitle: {
        text: 'Info source: <a href="https://www.historyonthenet.com">www.historyonthenet.com</a>'
    },
    series: [{
        type: 'timeline',
        showInLegend: false,
        data: [{
            date: 'September 1939',
            label: 'Hitler invades Poland',
            description: 'Adolf Hitler invaded Poland.'
        }, {
            date: 'May 1940',
            label: 'Blitzkrieg',
            description: 'Hitler launched his blitzkrieg (lightning war) against Holland and Belgium. Rotterdam was bombed almost to extinction. Both countries were occupied.'
        }, {
            date: 'December 1941',
            label: 'Pearl Harbor',
            description: 'The Japanese, who were already waging war against the Chinese, attacked the US pacific fleet at Pearl Harbour, Hawaii, as a preliminary to taking British, French and Dutch colonies in South East Asia.'
        }, {
            date: 'June 1942',
            label: 'Battle of Midway',
            description: 'The USA defeated the Japanese navy at the Battle of Midway. Following this victory, the US navy was able to push the Japanese back.'
        }, {
            date: 'November 1943',
            label: 'Allies meet at Tehran',
            description: 'Stalin, Roosevelt and Churchill met to co-ordinate plans for a simultaneous squeeze on Germany. They also discussed post war settlements. Churchill mistrusted Stalin; Roosevelt anxious to show that the West would not stand against Russia, went along with Stalin’s wishes for a second front in France and no diversions further east. Churchill was over-ruled and the fate of post-war Eastern Europe was thus decided.'
        }, {
            date: 'June 1944',
            label: 'D-Day',
            description: 'The allies launched an attack on Germany’s forces in Normandy, Western France. Thousands of transports carried an invasion army under the supreme command of general Eisenhower to the Normandy beaches. The Germans who had been fed false information about a landing near Calais, rushed troops to the area but were unable to prevent the allies from forming a solid bridgehead. For the allies it was essential to first capture a port.'
        }, {
            date: 'Sept 1945',
            label: 'MacArthur accepts Japan’s surrender',
            description: 'US General, Douglas MacArthur, accepted Japan’s surrender thus formally ending the second world war.'
        }]
    }]
});
