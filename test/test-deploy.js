const { assert } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleStorage", function () {
    let SimpleStorageFactory, simpleStorage
    beforeEach(async function () {
        SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await SimpleStorageFactory.deploy()
    })

    it("Should start with a favorite number 0", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should Update the value", async function () {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)
        const updatedValue = await simpleStorage.retrieve()
    })

    it("Should add a person and favorite Number", async function () {
        const personName = "Akhil"
        const personNumber = "5"
        const transactionResponse = await simpleStorage.addPerson(
            personName,
            personNumber
        )
        await transactionResponse.wait(1)
        const person = await simpleStorage.people(0)
        assert.equal(person.name, personName)
        assert.equal(person.favoriteNumber.toString(), personNumber)
    })
})
