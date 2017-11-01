// add chai to env
import { should } from "chai"
import { expect } from "chai"
should()

// add jquery to env
import * as $ from "jquery"

// actual imports
import init from "../build/hierarchy-select"
console.log(init)

describe("testing hierarchy-select init", ()=>{
    it("should execute imported init function with jquery.", ()=>{
        init($)
        it("should be added to jquery", () => {
            $.fn.hierarchySelect.should.be.a("function")
            $.fn.hierarchySelect.defaults.should.be.a("object")
        })
    })
})