const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
    'chair summer display orchard muscle rare trade gallery cement record burden leisure',
    'https://rinkeby.infura.io/v3/b5b9ed2842784d22b906df8d5c785d7a'
)

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()
    console.log('Attempting to deploy from account ', accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ gas: '1000000', from: accounts[0] })

    console.log('Contract deployed to: ', result.options.address)
    // 0x4635E7BB167dE0F8C3f8f3d41F1D1E03Db858729
}

deploy()
