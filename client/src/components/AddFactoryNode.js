import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client'

const socket = io('https://arcane-woodland-73099.herokuapp.com/')

class AddFactoryNode extends Component {
    
  state = {
    name: '',
  }

  handleChange = event => {
    const re = /^[0-9a-zA-Z\b]+$/;

    // if value is not blank, then test the regex
    if (event.target.value === '' || re.test(event.target.value)) {
      this.setState({ name: event.target.value });
    }
  }
    
  handleSubmit = event => {
  event.preventDefault();

  const name = this.state.name

  axios.post('/api/addNode', { name })
    .then(() => socket.emit('update-server', 'node added'))
  }
    
  render() {
    return (
      <React.Fragment>
        <div className='label'>       
          Add a FactoryNode:<input type="text" className="input-add-node" name="name" onChange={this.handleChange} value={this.state.name}/>
          <button onClick={this.handleSubmit}>Add</button>
        </div>
      </React.Fragment>
    )
  }   
} 

export default AddFactoryNode;