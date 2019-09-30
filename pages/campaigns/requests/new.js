import React, { Component } from 'react'
import { Button, Form, Message, Input } from 'semantic-ui-react'

import { Link, Router } from '../../../routes'
import Layout from '../../../components/Layout'
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'

class RequestNew extends Component {
    state = {
        loading: false,
        errorMessage: '',
        description: '',
        value: '',
        recipientAddress: ''
    }

    static async getInitialProps(props) {
        const { address } = props.query 

        return { address }
    }

    onSubmit = async (e) => {
        e.preventDefault()

        const campaign = Campaign(this.props.address)
        const { description, value, recipientAddress } = this.state 

        this.setState({ loading: true, errorMessage: '' })

        try {
            const accounts = await web3.eth.getAccounts() 

            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipientAddress)
                                    .send({ from: accounts[0], gas: '1000000' })
            
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`)
        } catch (error) {
            this.setState({ errorMessage: error.message })   
        }

        this.setState({ loading: false, value: '' })
    }


    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>

                <h3>Create a Request</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input  
                            value={this.state.description}
                            onChange={(e) => this.setState({ description: e.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input  
                            label="ether" 
                            labelPosition="right" 
                            value={this.state.value}
                            onChange={(e) => this.setState({ value: e.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient Address</label>
                        <Input  
                            value={this.state.recipientAddress}
                            onChange={(e) => this.setState({ recipientAddress: e.target.value })}
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />

                    <Button primary loading={this.state.loading}>
                        Create Request
                    </Button>
                </Form>
            </Layout>
        )
    }
}

export default RequestNew
