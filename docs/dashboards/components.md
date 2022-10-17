
# Components


## Common properties
```ts
public parentElement: HTMLElement;
public parentCell?: Cell;
protected dimensions: { width: number | null; height: number | null };

public store?: Component.StoreTypes; // the attached store

public element: HTMLElement; // The component element
public titleElement?: HTMLElement; // The title section
public captionElement?: HTMLElement; // Caption element
public contentElement: HTMLElement; // The element to draw the content to

public options: Component.ComponentOptions;

public type: string;
public id: string; // ID for use in conveniance methods and cross-component talk


public editableOptions: EditableOptions; // array of options marked as editable by the UI
public callbackRegistry = new CallbackRegistry(); // registry of callbacks registered on the component. Used in the Highcharts component to keep track of chart events

private tableEvents: Function[] = []; // event listeners tied to the current DataTable. Used for redrawing the component on data changes
private tableEventTimeout?: number; // the interval for redrawing the component on data changes
private cellListeners: Function[] = []; // event listeners tied to the parent cell. Used for redrawing/resizing the component on interactions

protected hasLoaded: boolean;

public presentationModifier?: DataModifier; // DataModifier that is applied on top of the modifiers set on the DataStore
public presentationTable?: DataTable; // The table being presented, either a result of the above or a way to modify the table via events

public activeGroup: ComponentGroup | undefined = void 0; // The active group of the component. Used for sync

```

## Common methods

```ts
public setStore(store: Component.StoreTypes | undefined): this {
  this.store = store;
  if (this.store) {
      // Set up event listeners
      this.clearTableListeners();
      this.setupTableListeners(this.store.table);

      // re-setup if modifier changes
      this.store.table.on(
          'setModifier',
          (): void => this.clearTableListeners()
      );
      this.store.table.on('afterSetModifier', (e): void => {
          if (e.type === 'afterSetModifier' && e.modified) {
              this.setupTableListeners(e.modified);
          }
      });
  }

  // Clean up old event listeners
  if (!store && this.tableEvents.length) {
      while (this.tableEvents.length) {
          const eventCallback = this.tableEvents.pop();
          if (typeof eventCallback === 'function') {
              eventCallback();
          }
      }
  }

  // Add the component to a group based on the store table id by default
  // TODO: make this configurable
  if (this.store) {
      const tableID = this.store.table.id;

      if (!ComponentGroup.getComponentGroup(tableID)) {
          ComponentGroup.addComponentGroup(new ComponentGroup(tableID));
      }
      const group = ComponentGroup.getComponentGroup(tableID);
      if (group) {
          group.addComponents([this.id]);
          this.activeGroup = group;
      }
  }

  fireEvent(this, 'storeAttached', { store });
  return this;
}
```


```ts
public load(): this {
  // Set up the store on inital load if it has not been done
  if (!this.hasLoaded && this.store) {
      this.setStore(this.store);
  }

  this.setTitle(this.options.title);
  this.setCaption(this.options.caption);
  [
      this.titleElement,
      this.contentElement,
      this.captionElement
  ].forEach((element): void => {
      if (element) {
          this.element.appendChild(element);
      }
  });

  // Setup event listeners
  // Grabbed from Chart.ts
  const events = this.options.events;
  if (events) {
      Object.keys(events).forEach((key): void => {
          const eventCallback = (events as any)[key];
          if (eventCallback) {
              this.callbackRegistry.addCallback(key, {
                  type: 'component',
                  func: eventCallback
              });
          }
      });
      objectEach(events, (eventCallback, eventType): void => {
          if (isFunction(eventCallback)) {
              this.on(eventType as any, eventCallback as any);
          }
      });
  }

  this.on('message', (e): void => {
      if ('message' in e) {
          this.onMessage(e.message);
      }
  });

  window.addEventListener(
      'resize',
      (): void => this.resizeTo(this.parentElement)
  );

  this.hasLoaded = true;

  return this;
}
```

```ts
/**
* @todo make this call load on initial render
*
* @return {this}
* The component for chaining
*/
public render(): this {
  if (!this.hasLoaded) {
      this.load();
      // Call resize to fit to the cell
      this.resizeTo(this.parentElement);
  }
  return this;
}

/**
* @todo redraw should (usually) call render
* @return {this}
* The component for chaining
*/
public redraw(): this {
  // Do a redraw
  const e = {
      component: this
  };
  fireEvent(this, 'redraw', e);
  return e.component;
}

/**
* @todo Should perhaps also remove the component from the registry
* or set an `isactive` flag to false
*/
public destroy(): void {
  while (this.element.firstChild) {
      this.element.firstChild.remove();
  }
  // Unregister events
  this.tableEvents.forEach((eventCallback): void => eventCallback());
  this.element.remove();

  Component.removeInstance(this);
}
```

## Built-in components

### HTMLComponent

Basic component allowing for custom content using the AST interface from Highcharts

A simple static  component:
```js
{
  type: 'html',
  elements: [{
      tagName: 'img',
      attributes: {
          src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
          title: 'I heard you like components'
      }
  }]
}
```

Using the mount event to set the content:

```js
{
  cell: "table",
  type: "html",
  store,
  scaleElements: false,
  title: 'Activities',
  style: {
      boxShadow: 'none',
      width: '100%',
      left: 0,
      right: 0
  },
  elements: [
      {
          tagName: "div"
      }
  ],
  events: {
      mount: function () {
          this.contentElement.innerHTML = dumpHTMLTable(this.store.table);
          this.on('tableChanged', () => {
              setTimeout(() => {
                  this.contentElement.innerHTML =
                      dumpHTMLTable(this.store.table.modified);
              }, 0);
          });

      }
  }
}

```

The very much WIP attempts at handling content and text size:

```ts
// WIP handle scaling inner elements
// Could probably also implement responsive config
public autoScale(): void {
  this.element.style.display = 'flex';
  this.element.style.flexDirection = 'column';
  this.contentElement.childNodes.forEach((element): void => {
      if (element && element instanceof HTMLElement) {
          element.style.width = 'auto';
          element.style.maxWidth = '100%';
          element.style.maxHeight = '100%';
          element.style.flexBasis = 'auto'; // (100 / this.innerElements.length) + '%';
          element.style.overflow = 'auto';
      }
  });

  if (this.options.scaleElements) {
      this.scaleText();
  }
}

// WIP basic font size scaling
// Should also take height into account
public scaleText(): void {
  this.contentElement.childNodes.forEach((element): void => {
      if (element instanceof HTMLElement) {
          element.style.fontSize = Math.max(Math.min(element.clientWidth / (1 * 10), 200), 20) + 'px';
      }
  });
}

```

* KPIComponent

* Highcharts TM component
