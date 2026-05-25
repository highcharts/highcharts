Grid.grid('container', {
    data: {
        columns: {
            minLimited: [
                'Try making me narrower',
                'I stop at 160px'
            ],
            flexible: [
                'This column fills the remaining space',
                'Drag either divider to resize'
            ],
            maxLimited: [
                'Try making me wider',
                'I stop at 180px'
            ]
        }
    },
    columns: [{
        id: 'minLimited',
        width: '35%',
        minWidth: 160,
        header: {
            format: 'minWidth: 160px'
        }
    }, {
        id: 'flexible',
        header: {
            format: 'Resizable column'
        }
    }, {
        id: 'maxLimited',
        width: '20%',
        maxWidth: 180,
        header: {
            format: 'maxWidth: 180px'
        }
    }],
    rendering: {
        rows: {
            strictHeights: true
        }
    }
});
