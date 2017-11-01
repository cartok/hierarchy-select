# Hierarchy Select jQuery Plugin for Twitter Bootstrap

[a link to the original project for guidance](https://travis-ci.org/NeoFusion/hierarchy-select)

## Requirements
* jQuery
* bootstrap 

## Installation
```java
npm install bootstrap@3 jquery @cartok/hierarchy-select
```

## Usage
### Restriction
You can only use this fork inside of a build environment like webpack that loads sass. It's a plain ES6 module.

### Import
```
import $ from "jquery"  // have jquery installed in your main project
import hierarchySelect from "hierarchy-select"
import "~hierarchy-select/build/hierarchy-select.scss"
```

### Example
```javascript
<div class="btn-group hierarchy-select" data-resize="auto">
    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="sia-propview-label-select-button">
        <span class="selected-label pull-left" id="sia-propview-label-select-text">&nbsp;</span>
        <span class="caret"></span>
        <span class="sr-only">Toggle Dropdown</span>
    </button>
    <div class="dropdown-menu open">
        <div class="hs-searchbox">
            <input type="text" class="form-control" autocomplete="off" id="sia-propview-label-select-input">
        </div>
            <ul class="dropdown-menu inner" role="menu" id="sia-propview-label-select-list">
        </ul>
    </div>
    <input class="hidden hidden-field" name="example_two" readonly="readonly" aria-hidden="true" type="text"/>
</div>
```