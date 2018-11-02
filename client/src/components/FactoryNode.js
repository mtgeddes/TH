import React, { Component } from 'react';
import axios from 'axios';

class FactoryNode extends Component {
  constructor (props) {
    super(props);
    this.state = {
      min: this.props.min,
      max: this.props.max,
      name: this.props.name,
      amount: null
    }
    this.handleChange = this.handleChange.bind(this);
  }


  // Handles each input change
  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  // Submits random numbers
  handleRandomNumbersSubmit = event => {
    event.preventDefault();

    const id = this.props.id
    let numbers = []
    let generateRandomNumbers = function (amount, min, max, childArray) {
      console.log(min-max)
      for (let i = 0; i < amount; i++) {
        childArray.push(Math.floor((Math.random() * (max-min+1)) + min))
      }
      console.log(childArray)
    }
    console.log(numbers)
    
    // Can change this.props.min to this.state.min if/when state is in sync with db, 
    // otherwise use this.props to ensure saved range is what the random numbers
    // are bassed off of as saved range may not align with numbers generated.
    generateRandomNumbers(this.state.amount, this.props.min, this.props.max, numbers)
    
    axios.post(`/api/updateNumbers`, { id, numbers })
    .then(res => {
      console.log(res);
      console.log(res.data);
    })
  }

  // Submits range (min and max values) for random numbers to be in between
  handleRangeSubmit = event => {
    event.preventDefault();
    
    const range = [this.state.min, this.state.max]
    const id = this.props.id
  
    axios.post(`/api/updateRange`, { id, range })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }

  // Updates name of FactoryNode
  handleNameUpdate = event => {
    event.preventDefault();
    
    const name = this.state.name
    const id = this.props.id
   
    axios.post(`/api/updateName`, { id, name })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }

  // Deletes FactoryNode
  handleDelete = event => {
    event.preventDefault();
    
    const id = this.props.id
    
    axios.delete(`/api/deleteData/${id}`)
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleRandomNumbersSubmit}>
          <input type='text' name='amount' onChange={this.handleChange} ></input>
          <button type="submit">Update Numbers</button>
        </form>
        <form onSubmit={this.handleNameUpdate}>
          <input type='text' name='name' onChange={this.handleChange} value={this.state.name}></input>
          <button type="submit">Update Name</button>
        </form>
        <form onSubmit={this.handleRangeSubmit}>
          <input type='number' name='min' onChange={this.handleChange} value={this.state.min}></input>
          <input type='number' name='max' onChange={this.handleChange} value={this.state.max}></input>
          <button type="submit">Update Range</button>
        </form>
        <form onSubmit={this.handleDelete}>
          <button type="submit">Delete FactoryNode</button>
        </form>
        {this.props.children}
      </div>
    )
  }   
} 

export default FactoryNode;