// import * as $ from "../node_modules/jquery/dist/jquery.js"


// a function append hierarchySelect to jquery.
export default (jquery) => {
    const HierarchySelect = function(element, options, listInit) {
        this.$element = jquery(element)
        // this.$element.on("key", ...)
        this.options = jquery.extend({}, jquery.fn.hierarchySelect.defaults, options)
        this.$button = this.$element.children('button')
        this.$selectedLabel = this.$button.children('.selected-label')
        this.$menu = this.$element.children('.dropdown-menu')
        this.$menuInner = this.$menu.children('.inner')
        this.$searchbox = this.$menu.find('input')
        // this.$searchbox.on("change", () => event.preventDefault())
        this.$hiddenField = this.$element.children('input')
        this.previouslySelected = null
        if(listInit instanceof Function){
            listInit()
        }
        this.init()
    }

    HierarchySelect.prototype = {
        constructor: HierarchySelect,
        init() {
            this.setWidth()
            this.setHeight()
            this.initSelect()
            this.clickListener()
            this.buttonListener()
            this.searchListener()
        },
        initSelect() {
            var item = this.$menuInner.find('li[data-default-selected]:first')
            if (item.length) {
                this.setValue(item.data('value'))
            } else {
                var firstItem = this.$menuInner.find('li:first')
                this.setValue(firstItem.data('value'))
            }
        },
        isItemSelected(){
            var items = this.$menuInner.find('li')
            var isAnyItemSelected = false
            items.each(function(idx, item){
                item = jquery(item)
                if(item.hasClass('active') && !item.hasClass('hidden')){
                    isAnyItemSelected = true
                }
            })
            return isAnyItemSelected
        },
        setWidth() {
            if (this.options.width === 'auto') {
                var width = this.$menu.width()
                // this.$element.css('min-width', width + 2 + 'px')
            } else if (this.options.width) {
                this.$element.css('width', this.options.width)
            } else {
                this.$element.css('min-width', '42px')
            }
        },
        setHeight() {
            if (this.options.height) {
                this.$menu.css('overflow', 'hidden')
                this.$menuInner.css({
                    'max-height': this.options.height,
                    'overflow-y': 'auto'
                })
            }
        },
        getText() {
            return this.$selectedLabel.text()
        },
        getValue() {
            return this.$hiddenField.val()
        },
        getFirstVisibleItem(){
            return this.$menuInner.find('li').not('.hidden').first()
        },
        setValue(value) {
            var li = this.$menuInner.children('li[data-value="' + value + '"]:first')
            this.setSelected(li)
        },
        enable() {
            this.$button.removeAttr('disabled')
        },
        disable() {
            this.$button.attr('disabled', 'disabled')
        },        
        moveUp() {
            var items = this.$menuInner.find('li:not(.hidden,.disabled)')
            var liActive = this.$menuInner.find('.active')
            var index = items.index(liActive)
            if (typeof items[index - 1] !== 'undefined') {
                this.$menuInner.find('.active').removeClass('active')
                items[index - 1].classList.add('active')
                processElementOffset(this.$menuInner[0], items[index - 1])
            }
        },
        moveDown() {
            var items = this.$menuInner.find('li:not(.hidden,.disabled)')
            var liActive = this.$menuInner.find('.active')
            var index = items.index(liActive)
            if (typeof items[index + 1] !== 'undefined') {
                this.$menuInner.find('.active').removeClass('active')
                if (items[index + 1]) {
                    items[index + 1].classList.add('active')
                    processElementOffset(this.$menuInner[0], items[index + 1])
                }
            }
        },
        selectItem(li) {
            var that = this
            var selected = undefined
            if(li){
                selected = li
            } else {
                selected = this.$menuInner.find('.active')
                if (selected.hasClass('hidden') || selected.hasClass('disabled')) {
                    return
                }
            }
            if(that.options.returnAfterSelect === true){
                // dont refocus the button after a selection
            } else {
                setTimeout(function() {
                    that.$button.focus()
                }, 0)
            }
            if(selected){
                this.setSelected(selected)
            } 
        },
        setSelected(li) {
            if (li.length) {
                var text = li.children('a').text()
                var value = li.data('value')
                this.$selectedLabel.html(text)
                this.$hiddenField.val(value)
                this.$menuInner.find('.active').removeClass('active')
                li.addClass('active')
            }
        },
        triggerSelect(li){
            if(li === undefined){
                li = this.$menuInner.find('.active')
                if (li.hasClass('hidden') || li.hasClass('disabled')) {
                    return
                }
            }
            if (li.length) {
                var id = parseInt(li.attr('data-value'))
                var text = li.children('a').text()
                this.$button.dropdown('toggle')
                this.$element.trigger('change', { id, text })
            }
        },
        clickListener(e) {
            var that = this
            this.$element.on('show.bs.dropdown', function() {
                var $this = jquery(this)
                // dont toggle the dropdown drop position
                if(that.options.togglePosition === true){
                    var scrollTop = jquery(window).scrollTop()
                    var windowHeight = jquery(window).height()
                    var upperHeight = $this.offset().top - scrollTop
                    var elementHeight = $this.outerHeight()
                    var lowerHeight = windowHeight - upperHeight - elementHeight
                    var dropdownHeight = that.$menu.outerHeight(true)
                    if (lowerHeight < dropdownHeight && upperHeight > dropdownHeight) {
                        $this.toggleClass('dropup', true)
                    }
                }
                var selected = that.$menuInner.find('.active')
                if(selected.length){
                    setTimeout(function() {
                        var el = selected[0]
                        var p = selected[0].parentNode
                        if (!(p.scrollTop <= el.offsetTop && (p.scrollTop + p.clientHeight) > el.offsetTop + el.clientHeight)) {
                            el.parentNode.scrollTop = el.offsetTop
                        }
                    }, 0)
                }
            })
            this.$element.on('shown.bs.dropdown', function() {
                that.previouslySelected = that.$menuInner.find('.active')
                that.$searchbox.focus()
            })
            this.$element.on('hidden.bs.dropdown', function() {
                that.$element.toggleClass('dropup', false)
            })
            this.$menuInner.on('click', 'li a', function (e) {
                e.preventDefault()
                var $this = jquery(this)
                var li = $this.parent()
                if (li.hasClass('disabled')) {
                    e.stopPropagation()
                } else {
                    that.setSelected(li)
                    that.triggerSelect(li)
                }
            })
        },
        searchListener() {
            var that = this
            if (!this.options.search) {
                this.$searchbox.parent().toggleClass('hidden', true)
                return
            }
            function disableParents(element) {
                var item = element
                var level = item.data('level')
                while (typeof item == 'object' && item.length > 0 && level > 1) {
                    level--
                    item = item.prevAll('li[data-level="' + level + '"]:first')
                    if (item.hasClass('hidden')) {
                        item.toggleClass('disabled', true)
                        item.removeClass('hidden')
                    }
                }
            }
            this.$searchbox.on('keydown', function (e) {
                switch (e.keyCode) {
                    // @feature: add the positiblity to add shortcuts and/or keys to stop propagation for.
                    case 9: // Tab
                        e.preventDefault()
                        e.stopPropagation()
                        that.$menuInner.click()
                        that.$button.focus()
                        break
                    case 13: // Enter
                        if(that.isItemSelected()){
                            that.selectItem()
                        }
                        else {
                            var firstVisibleItem = that.getFirstVisibleItem()
                            that.selectItem(firstVisibleItem)
                        }
                        break
                    case 27: // Esc
                        e.preventDefault()
                        e.stopPropagation()
                        if(that.options.keepFocused){
                            that.$button.focus()
                        }
                        that.$button.dropdown('toggle')
                        break
                    case 38: // Up
                        // dont propagate to 'window' or anywhere else.
                        e.stopPropagation()
                        e.preventDefault()
                        that.moveUp()
                        break
                    case 40: // Down
                        // dont propagate to 'window' or anywhere else.
                        e.stopPropagation()
                        e.preventDefault()
                        that.moveDown()
                        break
                    default:
                        break
                }
            })
            this.$searchbox.on('input propertychange', function (e) {
                e.preventDefault()
                var searchString = that.$searchbox.val().toLowerCase()
                var items = that.$menuInner.find('li')

                if (searchString.length === 0) {
                    items.each(function() {
                        var item = jquery(this)
                        item.toggleClass('disabled', false)
                        item.toggleClass('hidden', false)
                    })
                } else {
                    items.each(function() {
                        var item = jquery(this)
                        var text = item.children('a').text().toLowerCase()

                        // 1. show all labels that contain the search-'word' [x]
                        // 2. auto preselect the first label that starts with the search-'word' []
                        // -> switch 'active' class!
                        if (text.indexOf(searchString) != -1) {
                            item.toggleClass('disabled', false)
                            item.toggleClass('hidden', false)
                            if (that.options.hierarchy) {
                                disableParents(item)
                            }
                        } else {
                            item.toggleClass('disabled', false)
                            item.toggleClass('hidden', true)
                        }


                    })
                }
            })
        },
        buttonListener() {
            var that = this
            this.$element.on('keydown', function (e) {
                if(e.keyCode === 13){
                    e.preventDefault()
                    that.selectItem()
                    that.triggerSelect()
                }
            })
        },
    }

    const Plugin = function(option, listInit) {
        let args = Array.prototype.slice.call(arguments, 1)
        let method = undefined
        let chain = this.each(function() {
            let $this   = jquery(this)
            let data    = $this.data('HierarchySelect')
            let options = typeof option == 'object'  && option
            if (!data) {
                $this.data('HierarchySelect', (data = new HierarchySelect(this, options, listInit)))
            }
            if (typeof option == 'string') {
                method = data[option].apply(data, args)
            }
        })

        return (method === undefined) ? chain : method
    }

    // if hierarchySelect is not defined this will be an error.
    // could check it but i guess we don't need the noConflict handling anyways.
    // const old = jquery.fn.hierarchySelect
    
    jquery.fn.hierarchySelect = Plugin
    jquery.fn.hierarchySelect.defaults = {
        width: 'auto',
        height: '208px',
        hierarchy: true,
        search: true,
        // new options.
        togglePosition: true,
        returnAfterSelect: true,
        selectFirstOnEnter: true,
        keepFocused: true,
    }
    jquery.fn.hierarchySelect.Constructor = HierarchySelect
    
    // jquery.fn.hierarchySelect.noConflict = function () {
    //     jquery.fn.hierarchySelect = old
    //     return this
    // }
}

function processElementOffset(parent, element) {
    if (parent.offsetHeight + parent.scrollTop < element.offsetTop + element.offsetHeight) {
        parent.scrollTop = element.offsetTop + element.offsetHeight - parent.offsetHeight
    } else if (parent.scrollTop > element.offsetTop) {
        parent.scrollTop = element.offsetTop
    }
}
