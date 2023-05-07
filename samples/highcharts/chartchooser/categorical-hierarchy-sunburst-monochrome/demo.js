const data = [
    {
        id: 'Happy',
        parent: '',
        name: 'Happy',
        color: '#FFFFFF'
    },
    {
        id: 'Playful',
        parent: 'Happy',
        name: 'Playful'
    },
    {
        id: 'Content',
        parent: 'Happy',
        name: 'Content'
    },
    {
        id: 'Interested',
        parent: 'Happy',
        name: 'Interested'
    },
    {
        id: 'Proud',
        parent: 'Happy',
        name: 'Proud'
    },
    {
        id: 'Accepted',
        parent: 'Happy',
        name: 'Accepted'
    },
    {
        id: 'Powerful',
        parent: 'Happy',
        name: 'Powerful'
    },
    {
        id: 'Peaceful',
        parent: 'Happy',
        name: 'Peaceful'
    },
    {
        id: 'Trusting',
        parent: 'Happy',
        name: 'Trusting'
    },
    {
        id: 'Optimistic',
        parent: 'Happy',
        name: 'Optimistic'
    },

    /* Level 3 */
    {
        id: 'Aroused',
        parent: 'Playful',
        name: 'Aroused',
        value: 1
    },
    {
        id: 'Checky',
        parent: 'Playful',
        name: 'Checky',
        value: 1
    },

    {
        id: 'Free',
        parent: 'Content',
        name: 'Free',
        value: 1
    },
    {
        id: 'Joyful',
        parent: 'Content',
        name: 'Joyful',
        value: 1
    },

    {
        parent: 'Interested',
        name: 'Curious',
        value: 1
    },
    {
        parent: 'Interested',
        name: 'Inquisitive',
        value: 1
    },

    {
        parent: 'Proud',
        name: 'Successful',
        value: 1
    },
    {
        parent: 'Proud',
        name: 'Confident',
        value: 1
    },

    {
        parent: 'Accepted',
        name: 'Respected',
        value: 1
    },
    {
        parent: 'Accepted',
        name: 'Valued',
        value: 1
    },

    {
        parent: 'Powerful',
        name: 'Courageous',
        value: 1
    },
    {
        parent: 'Powerful',
        name: 'Creative',
        value: 1
    },

    {
        parent: 'Peaceful',
        name: 'Loving',
        value: 1
    },
    {
        parent: 'Peaceful',
        name: 'Thankful',
        value: 1
    },

    {
        parent: 'Trusting',
        name: 'Sensitive',
        value: 1
    },
    {
        parent: 'Trusting',
        name: 'Intimate',
        value: 1
    },

    {
        parent: 'Optimistic',
        name: 'Hopeful',
        value: 1
    },
    {
        parent: 'Optimistic',
        name: 'Inspired',
        value: 1
    }
];

Highcharts.setOptions({
    colors: ['#B0B0B0', '#FFFFFF']
});

Highcharts.chart('container', {
    chart: {
        height: '100%'
    },

    title: {
        text: 'The Feelings Wheel'
    },
    subtitle: {
        text:
      'Source <href="https://blog.calm.com/blog/the-feelings-wheel">Calm</a>'
    },
    accessibility: {
        typeDescription:
      'Sunburst chart with three levels to display the feelings wheel of happiness. The first level shows the word happy. The next level displays close feelings to the word happy such as content and optimistic, where the third level displays more general happiness feelings, such as free, joyful, successful.'
    },
    series: [
        {
            type: 'sunburst',
            data: data,
            allowDrillToNode: true,
            cursor: 'pointer',
            borderWidth: 3,
            borderColor: '#000000',
            dataLabels: {
                format: '{point.name}',
                filter: {
                    property: 'innerArcLength',
                    operator: '>',
                    value: 8
                },
                style: {
                    textOutline: false,
                    color: '#000000'
                },
                rotationMode: 'circular'
            },
            levels: [
                {
                    level: 1,
                    levelIsConstant: false,
                    dataLabels: {
                        filter: {
                            property: 'outerArcLength',
                            operator: '>',
                            value: 64
                        }
                    }
                },
                {
                    level: 2,
                    colorByPoint: true
                },
                {
                    level: 3,
                    colorVariation: {
                        key: 'brightness',
                        to: -0.5
                    }
                },
                {
                    level: 4,
                    colorVariation: {
                        key: 'brightness',
                        to: 0.5
                    }
                }
            ]
        }
    ],
    tooltip: {
        headerFormat: '',
        pointFormat: 'Feeling: <b>{point.options.name}</b>'
    }
});
