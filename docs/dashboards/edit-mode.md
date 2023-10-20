Edit mode
===

Edit mode is a mode in which the user can change the appearance of the dashboard through the User Interface (UI).

In addition, this option has to be enabled in the dashboard config:
```js
editMode: {
    enabled: true,
    contextMenu: {
        enabled: true,
        items: ['editMode']
    }
},
```

Edit mode can now be enabled by the burger menu in the upper right corner.

![edit-mode-context-menu.png](edit-mode-context-menu.png)

When edit mode is enabled, the appearance of the dashboard changes. When hovering over a cell a blue border appears around it. The border of the row containing the cell turns green. Additionally, both the row and the cell get a tooltip, which allows the user to change its position, change its options, or just delete it.

![edit-mode-tooltip.png](edit-mode-tooltip.png)

Next to the burger menu, some additional buttons are added.

The “Large”, “Medium”, and “Small” buttons change the width of the dashboard, to let the designer check how the dashboard will appear on smaller screens such as tablets and smartphones.

The `Add Component` button allows the user to add a new component. When clicked, a sidebar appears, which lets you choose the type of component you want to add and then by drag&drop component type can be selected and dragged to the correct place, which is also indicated by the drop marker.

![edit-mode-sidebar.png](edit-mode-sidebar.png)

The `contextMenu` option also allows you to edit, what should be inside the menu, which shows after clicking on the burger menu.  The items can either be a string like `editMode` if it is a default button, or an object, which defines the button name, `onclick` event and some more options. Here is the example snippet of context menu button configuration:
```js
items: [{
    id: 'custom-id',
    type: 'toggle',
    text: 'Custom Name',
    events: {
        click: function () {
            // onClick Event
        }
    }
}]
```
