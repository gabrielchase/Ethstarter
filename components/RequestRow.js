import React, { Component } from 'react'
import { Table, Button } from 'semantic-ui-react'

import web3 from '../ethereum/web3'
import Campaign from '../ethereum/campaign'
import { request } from 'http'

class RequestRow extends Component {
    onApprove = async () => {
        const accounts = await web3.eth.getAccounts()
        const campaign = Campaign(this.props.address)
        console.log('0', accounts[0])
        console.log('1', accounts[1])
        await campaign.methods.approveRequest(this.props.id).send({ 
            from: accounts[0],
            gas: '1000000'
        })
    }

    onFinalize = async () => {
        const accounts = await web3.eth.getAccounts()
        const campaign = Campaign(this.props.address)

        await campaign.methods.finalizeRequest(this.props.id).send({ 
            from: accounts[0],
            gas: '1000000'
        })
    }

    render() {
        const { Row, Cell } = Table
        const { req, id, approversCount } = this.props
        let approvalCount = parseInt(req.approvalCount)
        console.log('req: ',req)
        console.log('complete: ', req.complete)
        
        const readyToFinalize = approvalCount >= approversCount / 2
        console.log(readyToFinalize, req.complete)

        return (
            <Row disabled={req.complete} positive={readyToFinalize && !req.complete}> 
                <Cell>{id}</Cell>
                <Cell>{req.description}</Cell>
                <Cell>{web3.utils.fromWei(req.value, 'ether')}</Cell>
                <Cell>{req.recipient}</Cell>
                <Cell>{req.approvalCount} / {approversCount}</Cell>
                <Cell>
                    {
                        req.complete ? 
                            null 
                            :
                            <Button color="green" basic onClick={this.onApprove}>Approve</Button>
                    }
                </Cell>
                <Cell>
                    {
                        req.complete ? 
                            null 
                            :
                            <Button color="teal" basic onClick={this.onFinalize}>Finalize</Button>
                    }
                </Cell>
            </Row>
        )
    }
}

export default RequestRow
