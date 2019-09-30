import Web3 from 'web3'

let web3

const getProvider = async () => {
    await window.web3.currentProvider.enable() // request authentication
}

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    getProvider()
    web3 = new Web3(window.web3.currentProvider)
} else {
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/b5b9ed2842784d22b906df8d5c785d7a')
    web3 = new Web3(provider)
}

export default web3
