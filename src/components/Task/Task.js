import React, { Component } from 'react';
import ApiService from '../../services/api-service';
import HouseholdContext from '../../contexts/HouseHoldContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

export default class Task extends Component {
  state = {
    editPts: false,
    editTitle: false,
    newPoints: this.props.task.points,
    newTitle: this.props.task.title,
  }

  static contextType = HouseholdContext;

  handleEditTitleClick = () => {
    this.setState({ editTitle: true });
  };

  handleEditPointsClick = () => {
    this.setState({ editPts: true });
  };

  handleTitleUpdate = (id, member_id) => {
    const { household_id } = this.props;
    let reqBody = {
      method: 'title',
      id: id,
      title: this.state.newTitle,
    };

    ApiService.updateTask(household_id, reqBody)
      .then(after => {
        this.setState({ editTitle: false })
        const memberTasks = this.context.tasks;
        memberTasks[member_id].tasks.forEach(task => {
          return parseInt(task.id) === parseInt(id) ? task.title=this.state.newTitle : task.title;
        })
        this.context.setTasks(memberTasks);
      })
  };

  handlePointsUpdate = (id, member_id) => {
    const { household_id } = this.props;
    let reqBody = {
      method: 'points',
      id: id,
      points: this.state.newPoints,
    };

    ApiService.updateTask(household_id, reqBody)
      .then(after => {
        this.setState({ editPts: false })
        const memberTasks = this.context.tasks;
        memberTasks[member_id].tasks.forEach(task => {
          return parseInt(task.id) === parseInt(id) ? task.points=this.state.newPoints : task.points;
        })
        
        console.log(memberTasks)
        this.context.setTasks(memberTasks);
      })
  };

  handleTitleChange = event => {
    this.setState({ newTitle: event.target.value });
  };

  handlePointsChange = event => {
    this.setState({ newPoints: event.target.value });
  };

  render() {
    const {
      task,
      member,
      handleTaskDelete} = this.props;

      console.log(member.member_id);


    return (
      <li key={task.id}>
        {this.state.editTitle ? (
          <div className='title'>
            <input
              className="update-title"
              value={this.state.newTitle}
              onChange={e => {
                this.handleTitleChange(e);
              }}
          />
          <button 
            className="save-title-edit"
            onClick={() => this.handleTitleUpdate(task.id, member.member_id)}>
            Save
          </button>
          </div>
        ) : (
            <div className='title'>
              <div className='content'> 
                <span>{task.title}&nbsp;</span>
                <button onClick={() => this.handleEditTitleClick()}>
                  <FontAwesomeIcon icon={faPencilAlt} size="lg" color="green"/>
                </button>
              </div>
            </div>
          )}
      
        {this.state.editPts ? (
          <div className='points'>
            <input
              className="update-points"
              value={this.state.newPoints}
              onChange={e => {
                this.handlePointsChange(e);
              }}
            />
            <button 
              className="save-points-edit"
              onClick={() => this.handlePointsUpdate(task.id, member.member_id)}>
              Save
            </button>
          </div>
        ) : (
            <div className='points'>
              <span>points: {task.points}</span>
              <button onClick={() => this.handleEditPointsClick()}>
                <FontAwesomeIcon icon={faPencilAlt} size="lg" color="green"/>
              </button>
            </div>
          )}
        
        <button
          onClick={() =>
            handleTaskDelete(task.id, member.member_id)
          }
        >
          Delete
        </button>
      </li>
    );
  }
}