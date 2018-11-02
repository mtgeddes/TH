import React, { Component } from 'react';
import axios from 'axios';
import InputBase from "@material-ui/core/InputBase";


export default class FactoryNode extends Component {
  constructor (props) {
    super(props);
    this.state = {
      min: this.props.min,
      max: this.props.max,
      name: this.props.name,
      amount: null
    }
  }


  // Handles each input change
  handleChange = event => {
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
        console.log(res.error);
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
        console.log(res.data)
        console.log(res.error);
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
      <React.Fragment>

        Item Count:
        <InputBase type='text' name='amount' onChange={this.handleChange} />
        <button onClick={this.handleRandomNumbersSubmit}>Generate</button>
        <button onClick={this.handleDelete}>Delete</button>

        <InputBase name='name' type='text' onBlur={this.handleNameUpdate} onChange={this.handleChange} defaultValue={this.state.name}/>
        <InputBase name='min' type='text' onBlur={this.handleRangeSubmit} onChange={this.handleChange} defaultValue={this.state.min}/> 
        <InputBase name='max' type='text' onBlur={this.handleRangeSubmit} onChange={this.handleChange} defaultValue={this.state.max}/> 

        {this.props.children}
      </React.Fragment>
    )
  }   
} 

