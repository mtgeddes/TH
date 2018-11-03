import React, { Component } from 'react';
import axios from 'axios';
import "./FactoryNode.css"


export default class FactoryNode extends Component {
  constructor (props) {
    super(props);
    this.state = {
      min: this.props.min,
      max: this.props.max,
      name: this.props.name,
      amount: null,
      nameReadOnly: true,
      minReadOnly: true,
      maxReadOnly: true,
      showOrHide: 'hide'
    }
  }

  // Handles each input change
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleReadOnly = event => {

    console.log(event.target.name)
    if (event.target.name === 'name') {
      this.setState({ nameReadOnly: false })
    };
    
    if (event.target.name === 'min') {
      this.setState({ minReadOnly: false })
    };

    if (event.target.name === 'max') {
      this.setState({ maxReadOnly: false })
    };

  };

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
    
    // Can change this.props.min to this.state.min if/when state is in constant sync with db, 
    // otherwise use this.props to ensure numbers are based off of range saved on the db so that 
    // there is no confusion
    generateRandomNumbers(this.state.amount, this.props.min, this.props.max, numbers)
    
    axios.post(`/api/updateNumbers`, { id, numbers })
    .then(res => {
      console.log(res);
      console.log(res.data);
    })

    if(this.state.showOrHide === 'show') {
      this.setState({ showOrHide: 'hide' })
    } 
  }

  // Submits range (min and max values) for random numbers to be in between
  handleRangeSubmit = event => {
    event.preventDefault();
    
    const range = [this.state.min, this.state.max]
    const id = this.props.id
    
    if (!this.state.minReadOnly || !this.state.maxReadOnly) {
      axios.post(`/api/updateRange`, { id, range })
      .then(res => {
        console.log(res);
        console.log(res.data);
        console.log(res.error);
        this.setState({ maxReadOnly: true, minReadOnly: true })
      })
    }

  }

  // Updates name of FactoryNode
  handleNameUpdate = event => {
    event.preventDefault();
    
    const name = this.state.name
    const id = this.props.id

    if (!this.state.nameReadOnly) {
      axios.post(`/api/updateName`, { id, name })
      .then(res => {
        console.log(res);
        console.log(res.data)
        console.log(res.error);
        this.setState({ nameReadOnly: true })
      })
    }
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

    if(this.state.showOrHide === 'show') {
      this.setState({ showOrHide: 'hide' })
    } 
  }

  toggleActionsClassName = () => {

    if(this.state.showOrHide === 'hide') {
      this.setState({ showOrHide: 'show' })
    } else {
      this.setState({ showOrHide: 'hide' })
    }

  }

  render() {
    return (
      <React.Fragment>
        <li className='container'>        
          <p><input 
                name='name' 
                className='input-name' 
                type='text' 
                readOnly={this.state.nameReadOnly} 
                onDoubleClick={this.handleReadOnly} 
                onBlur={this.handleNameUpdate} 
                onChange={this.handleChange} 
                onClick={this.toggleActionsClassName}
                defaultValue={this.state.name} 
              />         
            <p className='range-placement'>
              <input 
                name='min' 
                className='range-numbers' 
                type='text' 
                readOnly={this.state.minReadOnly} 
                onDoubleClick={this.handleReadOnly} 
                onBlur={this.handleRangeSubmit} 
                onChange={this.handleChange} 
                defaultValue={this.state.min}
              /> 
              {` : `}
              <input 
                name='max' 
                className='range-numbers' 
                type='text' 
                readOnly={this.state.maxReadOnly} 
                onDoubleClick={this.handleReadOnly} 
                onBlur={this.handleRangeSubmit} 
                onChange={this.handleChange} 
                defaultValue={this.state.max}
              /> 
            </p>
          </p>
          <ul>

          <div className={`parent-node-actions ${this.state.showOrHide}`}>
            Item Count:
            <input className={this.state.showOrHide} type='text' name='amount' onChange={this.handleChange} />
            <div className={`cursor generate ${this.state.showOrHide}`} onClick={this.handleRandomNumbersSubmit}>Generate</div>
            <div className={`delete cursor ${this.state.showOrHide}`} onClick={this.handleDelete}>Delete</div>
          </div>

            {this.props.children}
          </ul>
        </li>
      </React.Fragment>
    )
  }   
} 

// To do:
// 1) create this list