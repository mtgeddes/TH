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
        <div className='label'>       
          Add a FactoryNode:<input type="text" className="input-add-node" name="name" onChange={this.handleChange} />
          <button onClick={this.handleSubmit}>Add</button>
        </div>
      </React.Fragment>
    )
  }   
} 

export default AddFactoryNode;