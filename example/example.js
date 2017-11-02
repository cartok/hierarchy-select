// alert("loaded!")

// WARN: this is not the code we would use in our applications. 
// if this example works, try the code in an external application.
import NodeTemplate from "../node_modules/dom-node-template-es6/build/NodeTemplate.js"
// @thesis importing jquery in the browser
// jquery is now imported via script tag.
// the browser does not support importing jquery as we want. 
// babel can do or bundlers like webpack.
// import * as jQuery from "../node_modules/jquery/dist/jquery.js"
import hierarchySelect from "../build/hierarchy-select.js"
hierarchySelect($)

// ???   do i need a container   ???
// ???   do i need a name on the hidden input field   ???
// @&nbsp; is needed for style. the button span needs a default value to size as if.
const html = new NodeTemplate(`
    <div class="btn-group hierarchy-select" data-resize="auto">
        <button class="btn btn-default dropdown-toggle" data-toggle="dropdown" data-ref="button">
            <span class="selected-label pull-left" data-ref="text">&nbsp;</span>
            <span class="caret"></span>
            <span class="sr-only">Toggle Dropdown</span>
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
// console.log(html)
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
},{
    id: 3,
    text: "Label DDDDDDDDDD"
},]

;(function updateSelect(entries){
    // remove all entries from select.
    html.refs.list.innerHTML = ""

    // check if every entrie-object has an id, else create it.
    entries = entries.every(l => l.id instanceof Number)
    ? entries
    : entries.map((l, idx) => Object.assign(l, { id: idx }))
    console.log(entries)

    // create html node from entries-array.
    const entriesFragment = document.createDocumentFragment()
    entries.forEach((e, idx) => {
        console.log(e)
        let entry = undefined
        if(idx === 0){
            // ???   can i remove ="" OR set it to true  ???
            // the first node gets selected by the plugin via data attribute.
            entry = new NodeTemplate(`
                <li data-value="${e.id}" data-default-selected="">
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