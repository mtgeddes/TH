import React, { Component } from 'react';
import axios from 'axios';
import "./FactoryNode.css";
import io from 'socket.io-client'

const socket = io('https://arcane-woodland-73099.herokuapp.com/')

export default class FactoryNode extends Component {
  constructor (props) {
    super(props);
    this.state = {
      min: this.props.min,
      max: this.props.max,
      name: this.props.name, 
      amount: '',
      nameReadOnly: true,
      minReadOnly: true,
      maxReadOnly: true,
      showOrHide: 'hide',
      toggleState: true,
      minContingency: '',
      maxContingency: ''
    }
  }

  // 
  componentDidMount = () => {
    socket.on('update-client', () => {
      
      setTimeout(() => {
        console.log("check this value here: " + this.props.min)
        this.setState({ min: this.props.min, max: this.props.max })
      }, 500)
     
    }); 
  }

  // Handles each input change
  handleChange = event => {
    const re1 = /^[0-9\b]+$/;
    const re2 = /^[0-9a-zA-Z\b]+$/;
    const name = event.target.name
    const value = event.target.value

    if (name === 'amount' && value <= 15 && (value === '' || re1.test(value))) {

      this.setState({ [name]: value });
    }
    
    if (name === 'min' && (value === '' || re1.test(value))) {

      this.setState({ [name]: value, minContingency: this.props.min });
    } 

    if (name === 'max' && (value === '' || re1.test(value))) {

      this.setState({ [name]: value, maxContingency: this.props.max });
    } 

    if (name === ('name') && (value === '' || re2.test(value))) {
      this.setState({ [name]: value });
    }

  
  }

  // Changes the readonly value to 'false'. Also changes value's value  
  // origination to be from state for input registry.  
  handleReadOnly = event => {
    if (event.target.name === 'name') {
      this.setState({ nameReadOnly: false, toggleState: false })
    };
    if (event.target.name === 'min') {
      this.setState({ minReadOnly: false, toggleState: false })
    };
    if (event.target.name === 'max') {
      this.setState({ maxReadOnly: false, toggleState: false })
    };
  };

  // Toggles classname that changes readonly state
  toggleActionsClassName = () => {
    if(this.state.showOrHide === 'hide') {
      this.setState({ showOrHide: 'show' })
    } else {
      this.setState({ showOrHide: 'hide' })
    }
  }

  // Submits random numbers
  handleRandomNumbersSubmit = event => {
    event.preventDefault();

    const id = this.props.id
    const numbers = []
    const generateRandomNumbers = function (amount, min, max, childArray) {
      for (let i = 0; i < amount; i++) {
        childArray.push(Math.floor((Math.random() * (max-min+1)) + min))
      }
    }
    
    // Can change this.props.min to this.state.min if/when state is in constant sync with db, 
    // otherwise use this.props to ensure numbers are based off of range saved on the db so that 
    // there is no confusion
    generateRandomNumbers(this.state.amount, this.props.min, this.props.max, numbers)
    
    axios.post(`/api/updateNumbers`, { id, numbers })
    .then(res => {
      console.log(res);
      console.log(res.data);
      socket.emit('update-server', 'random numbers added')
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
    const name = event.target.name
    const value = event.target.value

    // If range is not set properly it will reset values
    if (name === 'max' && value < this.props.min) {
      this.setState({ max: this.state.maxContingency })
      return 
    }
    if (name === 'min' && value > this.props.max) {
      this.setState({ min: this.state.minContingency })
      return 
    }

    // Only posts onBlur if readonly attribute on input is set 
    // to false preventing posts on unintentional onBlur events.
    if (!this.state.minReadOnly || !this.state.maxReadOnly) {
      axios.post(`/api/updateRange`, { id, range })
      .then(() => {
        socket.emit('update-server', 'min/max range updated')
        this.setState({ maxReadOnly: true, minReadOnly: true, toggleState: true})
      })
    }

  }

  // Updates name of FactoryNode
  handleNameUpdate = event => {
    event.preventDefault();
    
    const name = this.state.name
    const id = this.props.id

    this.setState({ toggleState: true })

    if (!this.state.nameReadOnly) {
      axios.post(`/api/updateName`, { id, name })
      .then(res => {
        socket.emit('update-server', 'name updated')
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
        socket.emit('update-server', 'node deleted')
      })

    if(this.state.showOrHide === 'show') {
      this.setState({ showOrHide: 'hide' })
    } 
  }

  render() {
    return (
      <React.Fragment>
        <li className='container'>        
          <p>
            <input 
              name='name' 
              className='input-name' 
              type='text' 
              readOnly={this.state.nameReadOnly} 
              onDoubleClick={this.handleReadOnly} 
              onBlur={this.handleNameUpdate} 
              onChange={this.handleChange} 
              onClick={this.toggleActionsClassName}
              value={this.state.name}   
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
                value={this.state.min}
              /> 
              {`:`}
              <input 
                name='max' 
                className='range-numbers' 
                type='text' 
                readOnly={this.state.maxReadOnly} 
                onDoubleClick={this.handleReadOnly} 
                onBlur={this.handleRangeSubmit} 
                onChange={this.handleChange} 
                value={this.state.max}
              /> 
            </p>
          </p>
          <ul>

          <div className={`parent-node-actions ${this.state.showOrHide}`}>
            Item Count:
            <input 
              className={this.state.showOrHide} 
              type='text' 
              name='amount' 
              onChange={this.handleChange}
              value={this.state.amount}
            />
            <div 
              className={`cursor generate ${this.state.showOrHide}`} 
              onClick={this.handleRandomNumbersSubmit}>
              Generate
            </div>
            <div 
              className={`delete cursor ${this.state.showOrHide}`} 
              onClick={this.handleDelete}>
              Delete
            </div>
          </div>

            {this.props.children}
          </ul>
        </li>
      </React.Fragment>
    )
  }   
} 

// To do:
// 1) <p> tag inside of a <p> tag to fix. CSS is based off of it 
// for visual tree branching. Will need to adjust.
// 2) Add a click field covering rest of page so that when clicked on will close FactoryNode actions box.
// 3) Make doubleClick not also bring up onClick FactoryNode actions box
// 4) check for duplicate names before posting update to name