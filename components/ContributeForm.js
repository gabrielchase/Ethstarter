import React, { Component } from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'

import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'
import { Router } from '../routes'


class ContributeForm extends Component {
    state = {
        contributionAmount: '0',
        loading: false,
        errorMessage: ''
    }

    onSubmit = async (e) => {
        e.preventDefault()

        const campaign = Campaign(this.props.campaignAddress)

        this.setState({ loading: true, errorMessage: '' })

        try {
            const accounts = await web3.eth.getAccounts() 

            await campaign.methods.contribute().send({
                value: web3.utils.toWei(this.state.contributionAmount, 'ether'),
                from: accounts[0]
            })
            
            Router.replaceRoute(`/campaigns/${this.props.campaignAddress}`)
        } catch (error) {
            this.setState({ errorMessage: error.message })   
        }

        this.setState({ loading: false, value: '' })
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input  
                        label="ether" 
                        labelPosition="right" 
                        value={this.state.contributionAmount}
                        onChange={(e) => this.setState({ contributionAmount: e.target.value })}
                    />
                </Form.Field>

                <Message error header="Oops!" content={this.state.errorMessage} />

                <Button primary loading={this.state.loading}>
                    Contribute
                </Button>
            </Form>
        )
    }
}

export default ContributeForm
