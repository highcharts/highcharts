// An order-fulfillment process: two retry loops (a backorder waiting on
// restock, a payment retry) closing cycles back onto earlier steps, two
// decisions, and two ways to reach the end - a shipped order or a
// cancellation.
//
// Nothing here positions anything: the `flowchart` series lays the nodes out
// in layers on its own, routes the long links around the nodes in between,
// and reverses the two loop-closing links so the graph can still be drawn
// top-to-bottom. Their arrowheads keep pointing at the step the data says
// they lead back to.
Highcharts.chart('container', {

    chart: {
        type: 'flowchart',
        height: 700
    },

    title: {
        text: 'Order fulfillment'
    },

    subtitle: {
        text: 'Dashed links close a retry loop. Drag a node to nudge it.'
    },

    series: [{
        name: 'Steps',

        // Each link is [from, to, text]; `text` labels what that branch out
        // of a decision - or out of a loop - represents.
        data: [
            ['Start', 'ReceiveOrder'],
            ['ReceiveOrder', 'CheckInventory'],
            ['CheckInventory', 'InStock'],
            ['InStock', 'ProcessPayment', 'Yes'],
            ['InStock', 'Backorder', 'No'],
            // Back edge: wait for restock, then check again.
            ['Backorder', 'CheckInventory', 'Restocked'],
            ['Backorder', 'CancelOrder', 'Unable'],
            ['ProcessPayment', 'PaymentValid'],
            ['PaymentValid', 'ShipItem', 'Yes'],
            ['PaymentValid', 'RequestRetry', 'No'],
            // Back edge: retry payment.
            ['RequestRetry', 'ProcessPayment', 'Retry'],
            ['RequestRetry', 'CancelOrder', 'Give up'],
            ['CancelOrder', 'End'],
            ['ShipItem', 'NotifyCustomer'],
            ['NotifyCustomer', 'End']
        ],

        // Shapes in classic flowchart notation: ovals for the terminators,
        // diamonds for the decisions, a parallelogram for input, a hexagon
        // for preparation, the subroutine box for a process defined
        // elsewhere, a cylinder for a data store, a document for generated
        // output, and plain rectangles (the default) for the rest.
        nodes: [{
            id: 'Start',
            shape: 'oval'
        }, {
            id: 'ReceiveOrder',
            shape: 'parallelogram',
            name: 'Receive order'
        }, {
            id: 'CheckInventory',
            shape: 'cylinder',
            name: 'Check inventory'
        }, {
            id: 'InStock',
            shape: 'diamond',
            name: 'In stock?'
        }, {
            id: 'Backorder',
            shape: 'hexagon',
            name: 'Backorder item'
        }, {
            id: 'ProcessPayment',
            shape: 'subroutine',
            name: 'Process payment'
        }, {
            id: 'PaymentValid',
            shape: 'diamond',
            name: 'Payment valid?'
        }, {
            id: 'RequestRetry',
            name: 'Request retry'
        }, {
            id: 'CancelOrder',
            name: 'Cancel order'
        }, {
            id: 'ShipItem',
            name: 'Ship item'
        }, {
            id: 'NotifyCustomer',
            shape: 'document',
            name: 'Notify customer'
        }, {
            id: 'End',
            shape: 'oval',
            name: 'Order closed'
        }]
    }]

});
