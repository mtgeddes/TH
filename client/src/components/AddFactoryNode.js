import React, { Component } from 'react';
import axios from 'axios';

class AddFactoryNode extends Component {
    
  state = {
    name: '',
  }

  handleChange = event => {
    this.setState({ name: event.target.value });
  }
    
  handleSubmit = event => {
  event.preventDefault();

  const name = this.state.name

  axios.post('/api/addNode', { name })
    .then(res => {
      console.log(res);
      console.log(res.data);
    })
  }
    
  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <label>
            Add a FactoryNode:
            <input type="text" name="name" onChange={this.handleChange} />
          </label>
          <button type="submit">Add</button>
        </form>
      </React.Fragment>
    )
  }   
} 

export default AddFactoryNode;