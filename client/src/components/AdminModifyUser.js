import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Container, Form, Button, Row, Modal } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Navigation from "./Navigation.js";

class AdminModifyUser extends Component {
  constructor(props) {
	  super(props);    
    this.state = {
      users: [],
      first: "",
      last: "",
      placeholderBody: "Please select a user",
      username: "Please select a user",
      password: "Please select a user",
      type: "Select user type",
      type_bool: null, // true === admin, false === swimmer
      currentSelect: -1,
      userid: null,
      submittable: false,
      isubmittable: true,
      // createsubmit: false,
      edittable: true,
      userTypes: ['Swimmer', 'Admin'],
      showModal: false,
      showForm: false
    }

    this.changeUser = this.changeUser.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changeFirst = this.changeFirst.bind(this);
    this.changeLast = this.changeLast.bind(this);
    this.changeType = this.changeType.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.checkSubmittable = this.checkSubmittable.bind(this);
    this.closeModal = this.closeModal.bind(this);

    //BELOW IS THE CODE TO BLOCK OFF WHEN NOT LOGGED IN
    if(this.props.location.state === undefined){
      this.props.history.push("/admin", { logged: false });
    }
    else if (!('logged' in this.props.location.state)){
      this.props.history.push("/admin", { logged: false });
    }
    else if(this.props.location.state.logged === false){
      this.props.history.push("/admin", { logged: false });
    }
    else if(this.props.location.state.admin === false){
      this.props.history.push("/", { logged: true });
    }
  }

  checkSubmittable = function(){
    // console.log(this.state.users[this.state.users.length-1].userID + 1);
    // console.log(this.state.userid === null &&
    //   this.state.currentSelect === "Create a new user" &&
    //   this.state.username !== "" &&
    //     this.state.password !== "" &&
    //     this.state.type_bool !== null);
    // creating a new user:
    // if (this.state.userid === null &&
    //   this.state.currentSelect === "Create a new user" &&
    //   this.state.username !== "" &&
    //     this.state.password !== "" &&
    //     this.state.type_bool !== null) {
    //       this.setState({createsubmit: true});
    // }
    // editing / deleting an existing user:
    if (this.state.username === "Please select a user" ||
        this.state.password === "Please select a user" ||
        this.state.type === "Select user type" ||
        this.state.userid === null ||
        this.state.currentSelect === -1) {
      this.setState({submittable: false});
    // editing / deleting
    } else {
      this.setState({submittable: true});
    }

    var usernames = this.state.users.map(function(value,index) { return value.username; });
    if (usernames.includes(this.state.username)) {
      this.setState({ submittable: false });
    } else {
      this.setState({ submittable: true });
    }
  }
  
  changeUser = (event) => {
    // if (event.target.value === "–") {
    //   alert("Please select a user");
    // } else {
    var selected = event.target.value;
    var temp = this.state.users.findIndex(record => record.username == selected);
    if (temp !== -1) {
      var new_type;
      if (this.state.users[temp].admin == true) {
        new_type = "Admin"
      } else {
        new_type = "Swimmer"
      }
      this.setState ({
        first: this.state.users[temp].firstName,
        last: this.state.users[temp].lastName,
        currentSelect: event.target.value,
        username: this.state.users[temp].username,
        password: this.state.users[temp].password,
        type: new_type,
        type_bool: this.state.users[temp].admin,
        userid: this.state.users[temp].userID,
        isubmittable: true,
        submittable: true,
        // createsubmit: false,
        edittable: false,
        showForm: true
      });
    } else {
      this.setState ({
        showForm: false,
        username: "-",
        currentSelect: -1
      });
    }
	}
  
  changeUsername = (event) => {
    this.setState({username: event.target.value}, () => this.checkSubmittable());
  }

  changeFirst = (event) => {
    this.setState({first: event.target.value}, () => this.checkSubmittable());
  }

  changeLast = (event) => {
    this.setState({last: event.target.value}, () => this.checkSubmittable());
  }
  
  changeType = (event) => {
    if(event.target.value == "Admin") {
      this.setState({type: "Admin", type_bool: true}, () => this.checkSubmittable());
    }
    else {
      this.setState({type: "Swimmer", type_bool: false}, () => this.checkSubmittable());
    }
    // this.checkSubmittable();
  }

  deleteUser = function () {
    fetch("http://localhost:3001/delete_user", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first: this.state.first,
        last: this.state.last,
        username: this.state.username,
        password: this.state.password,
        type_bool: this.state.type_bool, 
        userid: this.state.userid
        })
    })
      .then(
        (result) => {
          this.setState({
            showModal: true
          });
          // if (result.status == 200) {
          //   this.props.history.push("/admin/", { logged: true });
          // }
          // else {
          //   alert("error");
          // }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  
  updateUser = (event) => {
    event.preventDefault();
    event.stopPropagation();
    fetch("http://localhost:3001/edit_user_info", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first: this.state.first,
        last: this.state.last,
        username: this.state.username,
        password: this.state.password,
        type_bool: this.state.type_bool,
        userid: this.state.userid
      })
    })
      .then(
        (result) => {
          this.setState({
            showModal: true
          });
          // if (result.status == 200) {
          //   this.props.history.push("/admin/", { logged: true });
          // }
          // else {
          //   alert("error");
          // }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  closeModal() {
    this.setState({ showModal: false });
    this.props.history.push("/admin/", { logged: true });
  }

  sendProps() {
    var logged = this.props.location.state.logged;
    var admin = this.props.location.state.admin;
    var user = this.props.location.state.user;
    this.props.history.push("/admin", { logged: logged, admin: admin, user: user} );
  }

  populatePage() {
    fetch("http://localhost:3001/user_info")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            users: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  componentDidMount() {
    this.populatePage();
  }

  render() {
    return(
      <Container fluid className="page-container">
        <Container fluid className="siteHeader d-flex align-items-end">
          <h1 className="siteHeaderTitle px-3 mb-3">Admin</h1>
        </Container>        
        <Container className="px-3">
          <a onClick={() => this.sendProps()} className="standalone">
            <p><FontAwesomeIcon icon={faChevronLeft} className="px-0"/> Back to Admin Dashboard</p>
          </a>
          <h2 className="sectionTitle">Modify or Delete a User</h2>
        </Container>
        <Container className="px-4 dynamic-height">
          <Form className="py-3" onSubmit={this.updateUser}>
            <Form.Group className="mb-3">
              <Form.Label><h4 className="sectionTitle">Select a User</h4></Form.Label>
              <Form.Select
                aria-label="Select which user to modify"
                value={this.state.currentSelect}
                onChange={this.changeUser}
                className="me-2"
                // isInvalid={!this.state.isubmittable}
              >
                <option value="Select a user">–</option>
                {
                  this.state.users.map( (item) => {
                    return(<option value={item.username}>{item.username}</option>)
                  })
                }
              </Form.Select>
            </Form.Group>
            {this.state.showForm &&
            <Container>
              <Form.Group as={Row} className="mb-3"mx-2>
                <Form.Label>First Name</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={this.state.first}
                    onChange={this.changeFirst}
                    className="me-2"
                    // isInvalid={!this.state.isubmittable}
                    disabled={!this.state.edittable}
                  />
                </div>
              </Form.Group>

              <Form.Group as={Row} className="mb-3"mx-2>
                <Form.Label>Last Name</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={this.state.last}
                    onChange={this.changeLast}
                    className="me-2"
                    // isInvalid={!this.state.isubmittable}
                    disabled={!this.state.edittable}
                  />
                </div>
              </Form.Group>

              <Form.Group as={Row} className="mb-3"mx-2>
                <Form.Label>Username</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={this.state.username}
                    onChange={this.changeUsername}
                    className="me-2"
                    // isInvalid={!this.state.isubmittable}
                  />

                  <Form.Control.Feedback id="username_form" type="invalid">
                    This username already exists.
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            
              <Form.Group as={Row} className="mb-3"mx-2>
                <Form.Label>User Type</Form.Label>
                  <div className="px-3">
                    {
                      this.state.userTypes.map( (item) => {
                        return(
                          <Form.Check
                            type="radio"
                            label={item}
                            name="userType"
                            value={item}
                            onChange={this.changeType}
                            className="me-2"
                            checked={this.state.type === item ? true : false}
                            // isInvalid={!this.state.isubmittable}
                            // disabled={!this.state.edittable}
                          />
                        )
                      })
                    }
                  </div>
              </Form.Group>
            
              <Container className="d-flex justify-content-center">
                <Button
                  className="mx-3"
                  as={Link}
                  to={{pathname: "/admin", state: {logged: true}}}
                  variant="secondary">
                    Cancel
                </Button>
                {/* <Button onClick={this.createUser} disabled={!this.state.createsubmit}>Create</Button> */}
                <Button onClick={this.deleteUser} disabled={!this.state.submittable}className="mx-3">Delete</Button>
                <Button type="submit" disabled={this.state.edittable} className="mx-3">Save</Button>
              </Container>
            </Container>
            }
          </Form>
          {this.state.showModal &&
            <Modal show={this.state.showModal} onHide={this.closeModal} id="contained-modal-title-vcenter">
              <Modal.Header closeButton>
                <Modal.Title>Your changes have been saved!</Modal.Title>
              </Modal.Header>
              <Modal.Body>You have modified or deleted a user.</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={this.closeModal}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal>
          }
        </Container>
        <Navigation logged = {this.props.location.state.logged} admin = {this.props.location.state.admin} user = {this.props.location.state.user}/>
      </Container>
    );
  }
}

export default withRouter(AdminModifyUser);