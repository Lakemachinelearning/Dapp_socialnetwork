import React, { Component } from 'react';
import logo from '../read-thum.png';
import './App.css';
import Web3 from 'web3';
import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    // takes connection from metamask
    // wires it up to WEB3. reads it inside web3 connection inside our app
    // looks ethereum provider inside your window
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    // if it does not have one. = creates new one with web3
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying Metamask! :) ')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId];

    if(networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork: socialNetwork })

      const postCount = await socialNetwork.methods.postCount().call();
      this.setState({ postCount: postCount })

      // Load Posts
      for (var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({ posts: [...this.state.posts, post] })
      }
      console.log({ posts: this.state.posts });
    }
    else {
      window.alert('SocialNetwork contract not deployed to detected network')
    }
    // Aadress
    // ABI
  }

  // props = properties for the component
  // and we want to call super on this constructor
  // this.state = {}     <---- this is what state object looks like
  // it is just an object. + has a value in it (account: '')
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: []
    }
  }


  render() {
    return (
      <div>

        <Navbar account = { this.state.account } />

        <div container-fluid mt-5>
          <div className = "row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <br></br>
                <br></br>
                <h1> Welcome to the social network </h1>
                <a href="http://www.rate.ee">
                  <img src = {logo} className="App-logo" alt="logo" />
                </a>
             </div>
          </main>
          </div>
        </div>


      </div>
    );
  }
}

export default App;
