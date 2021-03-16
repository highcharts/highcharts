class Interactions {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: Interactions.Options = {
        dragDrop: {
            enabled: true,
            draggableX: true,
            draggableY: true,
            dragSensitivity: 2
        },
        resize: {
            enabled: true,
            resizeX: true,
            resizeY: true
        }
    };

    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        options: Interactions.Options
    ) {
        this.dragDrop = options.dragDrop;
        this.resize = options.resize;
    }

    /* *
    *
    *  Properties
    *
    * */
    public dragDrop: Interactions.DragDropOptions;
    public resize: Interactions.ResizeOptions;
    /* *
     *
     *  Functions
     *
     * */
}

namespace Interactions {
    export interface Options {
        dragDrop: DragDropOptions;
        resize: ResizeOptions;
    }

    export interface DragDropOptions {
        enabled: boolean;
        draggableX: boolean;
        draggableY: boolean;
        dragSensitivity: number;
    }

    export interface ResizeOptions {
        enabled: boolean;
        resizeX: boolean;
        resizeY: boolean;
    }
}

export default Interactions;

