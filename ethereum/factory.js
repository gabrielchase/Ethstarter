import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface), 
    '0x067Cf037C256E5965D741c18c3F4D59Da08d2742'
)

export default instance

