# Hierarchy Select jQuery Plugin for Twitter Bootstrap

[a link to the original project for guidance](https://travis-ci.org/NeoFusion/hierarchy-select)

## Requirements
* **a bundeling system like webpack**
* jQuery
* bootstrap 
## Installation
```java
npm install bootstrap@3 jquery@3 @cartok/hierarchy-select
```

## Usage
### Restriction
You should only use this module inside of a build environment (ES6 module).

### Import and apply the plugin to jQuery
```javascript
import "jquery"
import "bootstrap"
import hierarchySelect from "@cartok/hierarchy-select"
import "bootstrap/dist/css/bootstrap.css"
import "@cartok/hierarchy-select/build/hierarchy-select.css"
hierarchySelect($)
```

### Example usage
```javascript
/**
 * create the base html code and append it somewhere.
 * @unwritten-feature: the html could be provided later from inside the plugin
 */
const html = new NodeTemplate(`
    <div class="btn-group hierarchy-select" data-resize="auto">
        <button class="btn btn-default dropdown-toggle" data-toggle="dropdown" data-ref="button">
            <span class="selected-label pull-left" data-ref="text">&nbsp;</span>
            <span class="caret"></span>
        </button>
        <div class="dropdown-menu open">
            <div class="hs-searchbox">
                <input type="text" class="form-control" autocomplete="off">
            </div>
            <ul data-ref="list" class="dropdown-menu inner" role="menu"></ul>
        </div>
        <input class="hidden hidden-field" readonly="readonly" type="text"/>
    </div>
`)
document.body.appendChild(html.fragment)

/**
 * Use HierarchySelect on the html and pass in options and a function
 * that creates the entries of the select view.
 * If you want the select to have a default selection on DOM-load you need
 * a function that creates entries with one of them having the 'data-default-selected' attribute.
 * But you can just take out the whole function code and execute it afterwards.
 */
$(html.root).hierarchySelect({
    hierarchy: false,
    togglePosition: false,
    keepFocused: false,
}, () => {
    // id attributes are optional and will be autofilled in the updateSelect() function.
    const data = [{
        id: 0,
        text: "Label A"
    },{
        id: 1,
        text: "Label B"
    },{
        id: 3,
        text: "Long John Silver!"
    },{
        id: 4,
        text: "This is the longest label in the world!"
    },{
        id: 5,
        text: "Another long sentence containing the word 'world'!"
    },]

    ;(function updateSelect(entries){
        // remove all entries from select.
        html.refs.list.innerHTML = ""

        // check if every entrie-object has an id, else create it.
        entries = entries.every(l => l.id instanceof Number)
        ? entries
        : entries.map((l, idx) => Object.assign(l, { id: idx }))

        // create html node from entries-array.
        const entriesFragment = document.createDocumentFragment()
        entries.forEach((e, idx) => {
            let entry = undefined
            if(idx === 0){
                // the first node gets selected by the plugin via data attribute.
                entry = new NodeTemplate(`
                    <li data-value="${e.id}" data-default-selected>
                        <a href="#">${e.text}</a>
                    </li>
                `)
            } else {
                entry = new NodeTemplate(`
                    <li data-value="${e.id}">
                        <a href="#">${e.text}</a>
                    </li>
                `)
            }
            entriesFragment.appendChild(entry.fragment)
        })
        html.refs.list.appendChild(entriesFragment)
    })(data)
)
```
### Usage additions
#### How-to react on selection change?
```javascript
$(html.root).on("change", (e, text) => {
    // The change event is triggered manually by the plugin through jQuery.
    // But it will also be triggered natively.
    // Only if the event was triggered by the plugin, you will get the text of the selection.
    if(text !== undefined){
        console.log("You can use the selected dropdown value on selection like this.")
        console.log(text)
    }
})
```

#### How-to open the dropdown on shortcut?
```javascript
$(window).on("keydown", (e) => {
    if(event.getModifierState("Control")){
        event.preventDefault()
        if(e.key.toLowerCase() === "l"){
            e.preventDefault()
            e.stopPropagation()
            html.refs.button.click()
        }
    }
})
```

## How to develop
Start the http-server for testing the example page for [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).
```
node bin/http.server
```

And use a browser that supports async ES6 module loading via script tag.
[*compability list*](https://caniuse.com/#feat=es6-module)
