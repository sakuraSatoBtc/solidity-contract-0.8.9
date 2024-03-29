const ganache = require('ganache'); // Local Test Network
const { Web3 } = require('web3'); // Constructor so we capitalize it
const web3 = new Web3(ganache.provider()); 
const assert = require('assert');
const { abi, evm } = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = 'Hello World'
beforeEach(async () => {
// Get a list of all accounts
    accounts = await web3.eth.getAccounts();
// Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(abi)
     .deploy({ data: evm.bytecode.object, arguments: [INITIAL_STRING]})
     .send({ from: accounts[0], gas: '1000000'});
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
     });

     it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
     });

     it('can change the message', async () => {
        await inbox.methods.setMessage('Wow').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Wow');
     });
});
