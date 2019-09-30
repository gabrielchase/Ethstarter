const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const provider = ganache.provider()
const web3 = new Web3(provider)

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts
let factory 
let campaignAddress
let campaign 

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                            .deploy({ data: compiledFactory.bytecode })
                            .send({ from: accounts[0], gas: '1000000' })

    await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1000000' })

    let addresses = await factory.methods.getDeployedCampaigns().call()
    campaignAddress = addresses[0]

    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress)
})

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('campaign manager is create campaign caller', async () => {
        const manager = await campaign.methods.manager().call()
        assert.equal(accounts[0], manager)
    })

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({ value: '101', from: accounts[1]})

        const isContributor = await campaign.methods.approvers(accounts[1]).call()

        assert(isContributor)
    })

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({ value: '99', from: accounts[1]})
            assert(false)
        } catch (err) {
            assert(err)
        }
    })

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest('buy batteries', '100', accounts[2])
                                .send({ from: accounts[0], gas: '1000000'})

        const request = await campaign.methods.requests(0).call()
        
        assert.equal('buy batteries', request.description)
        assert.equal('100', request.value)
        assert.equal(accounts[2], request.recipient)
        assert.equal(false, request.complete)
        assert.equal(0, request.approvalCount)
    })

    // E2E test
    it('processes a payment request', async () => {
        // accounts[0] is the manager / requester 
        // accounts[1] is the contributor / approver
        // accounts[2] is the payment receiver

        // accounts[2] intial balance
        const initialBalance = await web3.eth.getBalance(accounts[2])
        console.log('1', initialBalance)

        // accounts[1] contributes
        await campaign.methods.contribute().send({ from: accounts[1], value: web3.utils.toWei('10', 'ether') })

        // manager creates a request to send money to accounts[2]
        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[2])
                                .send({ from: accounts[0], gas: '1000000' })

        // accounts[1] approves the request
        await campaign.methods.approveRequest(0).send({ from: accounts[1], gas: '1000000' })

        // accounts[0] finalizes the request
        await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '1000000'})

        // accounts[2] receives payment
        const finalBalance = await web3.eth.getBalance(accounts[2])
        const difference = finalBalance - initialBalance 
        assert(difference > web3.utils.toWei('4.8', 'ether'))
    })
})

