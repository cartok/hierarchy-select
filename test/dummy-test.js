// add chai to env
import { should } from "chai"
import { expect } from "chai"
should()

// add jquery to env
import $ from "jquery"

// actual imports
import foo from "../build/dummy-code.js"

describe("testing es6 import", ()=>{
    it("imported value should be 'foo'.", ()=>{
        foo.should.equal("foo")
    })
})