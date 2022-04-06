import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Container, DropdownButton, Dropdown, Card, Accordion, Alert } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import '../css/alerts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Navigation from "./Navigation.js";
import moment from 'moment';

class AlertsAndCalendar extends Component {

  constructor(props) {
    super(props);
    if(this.props.location.state == undefined){
      this.props.history.push("/", { logged: false });
    }
    else if (!('logged' in this.props.location.state)){
      this.props.history.push("/", { logged: false });
    }
    else if(this.props.location.state.logged == false){
      this.props.history.push("/", { logged: false });
    }
    this.state = {
      alertList: [],
      // meetlist: [],
      // dropdownlist: [],
      logged: this.props.location.state.logged,
      admin: this.props.location.state.admin,
      user: this.props.location.state.user
    }

    this.getBackground = this.getBackground.bind(this);
    this.textString = this.textString.bind(this);
  }

  //AJAX Calls
  populateAlerts() {
    console.log("hello populate");
    fetch("http://localhost:3001/alert_info")
      .then(res => res.json())
      .then(
        (result) => {
          result.sort(function(x, y) {
            if(x.alert_end_date > y.alert_end_date) {
              return 1;
            }
            else if (y.alert_type == "High") {
              return 1;
            }
            else if(x.alert_type == "High") {
              return -1;
            }
            else if(y.alert_type == "Medium") {
              return 1;
            }
            else if(x.alert_type == "Medium") {
              return -1;
            }
            else if(y.alert_type == "Low") {
              return 1;
            }
            else if(x.alert_type == "Low") {
              return -1;
            }
            else if(y.alert_type == "Info") {
              return 1;
            }
            return -1;
          });

          console.log(result);
          this.setState({
            alertList: result
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

  componentDidMount(){
    console.log("component mount");
    this.populateAlerts();
  }

  // sendProps(lister) {
  //   var logged = this.props.location.state.logged;
  //   var admin = this.props.location.state.adin
  //   var user = this.props.location.state.user;
  //   this.props.history.push("/meet/"+ lister.meetName + "_" + lister.meetStartDate, { logged: logged, admin: admin, user: user} );
  // }

  textString = function(lister) {
    var atype = lister.alert_type;
    var date = lister.alert_end_date;
    var text = lister.alert_text;

    var return_str = "";
    if(atype != "Info") {
      return_str += date.substring(5,7) + "/" + date.substring(8,10) + " - ";
    }

    return_str += text;
    return return_str
  }

  getBackground = function(atype) {
    // may need to change colors
    if(atype == "High") {
      return "danger";
    }
    else if(atype == "Medium") {
      return "warning";
    }
    else if(atype == "Low") {
      return "secondary";
    }
    else if(atype == "Info") {
      return "primary";
    }
  }

  render() {
    return(
      <Container fluid className="page-container">
        <Container fluid className="siteHeader d-flex align-items-end">
          <h1 className="siteHeaderTitle px-3 mb-3">Alerts</h1>
        </Container>
        <Container className="px-4">
          <Accordion flush defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h2>Upcoming</h2>
              </Accordion.Header>
              <Accordion.Body>
                {this.state.alertList.map( (lister) => {
                    return(
                      <Alert
                        className="mb-3"
                        variant={this.getBackground(lister.alert_type)}
                        // variant={"success"}
                        text={this.getBackground(lister.alert_type) === 'light' ? 'dark' : 'white'}
                      >
                      {this.textString(lister)}
                      </Alert>)
                })}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <h2>Calendar</h2>
              </Accordion.Header>
            </Accordion.Item>
          </Accordion>
        </Container>
        <Navigation logged = {this.props.location.state.logged} admin = {this.props.location.state.admin} user = {this.props.location.state.user}/>
      </Container>

    );
  }
}

export default withRouter(AlertsAndCalendar);

// if the calendar is collapsed - show scroll bar with 5(?) alerts shown