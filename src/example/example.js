import { NodeTemplate } from "dom-node-template"

// WARN: this is not the code we would use in our applications. 
// if this example works, try the code in an external application.
import $ from "jquery"
import hierarchySelect from "../build/hierarchy-select"
hierarchySelect($)

// ???   do i need a container   ???
// ???   do i need a name on the hidden input field   ???
const html = new NodeTemplate(`
    <div class="btn-group hierarchy-select" data-resize="auto">
        <button class="btn btn-default dropdown-toggle" data-toggle="dropdown" data-ref="button">
            <span class="selected-label pull-left" data-ref="text"></span>
            <span class="caret"></span>
            <span class="sr-only">Toggle Dropdown</span>
        </button>
        <div class="dropdown-menu open">
            <div class="hs-searchbox">
                <input type="text" class="form-control" autocomplete="off">
            </div>
            <ul data-ref="list" class="dropdown-menu inner" role="menu"></ul>
        </div>
        <input class="hidden hidden-field" name="DO I NEED A NAME" readonly="readonly" type="text"/>
    </div>
`)
document.body.appendChild(html.fragment)

// ???   should i change defaults   ???
$(html.root).hierarchySelect({
    hierarchy: false,
    togglePosition: false,
    returnAfterSelect: true,
    selectFirstOnEnter: true,
    keepFocused: false,
})

const data = [{
    id: 0,
    text: "Label A"
},{
    id: 1,
    text: "Label B"
},{
    id: 2,
    text: "Label C"
},]

(function updateSelect(entries){
    // remove all entries from select.
    html.ref.list.innerHTML = ""

    // check if every entrie-object has an id, else create it.
    entries = entries.every(l => l.id instanceof Number)
    ? entries
    : entries.map((l, idx) => Object.assign(l, { id: idx }))
    
    // create html node from entries-array.
    const entriesFragment = document.createDocumentFragment()
    entries.forEach((label, idx) => {
        let entry = undefined
        if(idx === 0){
            // ???   can i remove ="" OR set it to true  ???
            // the first node gets selected by the plugin via data attribute.
            entry = new NodeTemplate(`
                <li data-value="${label.id}" data-default-selected="">
                    <a href="#">${label.name}</a>
                </li>
            `)
        } else {
            entry = new NodeTemplate(`
                <li data-value="${label.id}">
                    <a href="#">${label.name}</a>
                </li>
            `)
        }
        entriesFragment.appendChild(entry.fragment)
    })
    html.ref.list.appendChild(entriesFragment)
})(data)

// how-to react on selection-change:
$(html.root).on("change", () => {
     console.warn("how to acces the value here in this handler?")
     console.log("do something.")
})

// how-to open the hierarchy select via function:
function openSelect(e){
    if(e.key.toLowerCase() === "s"){
        e.preventDefault()
        e.stopPropagation()
        html.ids["sia-propview-label-select-button"].click()
    }
}