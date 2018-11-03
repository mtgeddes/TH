import React, { Component } from 'react';
import './App.css';
import FactoryNode from './components/FactoryNode';
import FactoryChild from './components/FactoryChild';
import axios from 'axios';
import AddFactoryNode from './components/AddFactoryNode';
import "./components/FactoryNode.css"

export default class App extends Component {

  state = {
    factoryNodes: [],
    name: null
  }

  componentDidMount() {
    axios.get('/api')
      .then(res => {
        const factoryNodes = res.data
        this.setState({ factoryNodes });
        console.log(this.state)
      })
  }

  render() {
    return (
      <div className="App">
        <br/>
        <br/>
        <h1>Root     <AddFactoryNode /></h1>
        <ul>
          {this.state.factoryNodes.map(node => 
            <FactoryNode 
              key={node._id} 
              id={node._id} 
              name={node.name} 
              min={node.range[0]} 
              max={node.range[1]}
            >
            {node.numbers.map((number, index) =>
              <FactoryChild key={index} numbers={number} />
            )}
            </FactoryNode>
          )}
        </ul>
      </div>
    )
  }

}


// To do:
// 1) Don't use index as keys for <FactoryChild />. 




