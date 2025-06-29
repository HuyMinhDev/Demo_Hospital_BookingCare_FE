import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";
import "react-toastify/dist/ReactToastify.css";

import { path } from "../utils";
import Home from "../routes/Home";
import Login from "./Auth/Login";
import System from "../routes/System";
import { CustomToastCloseButton } from "../components/CustomToast";
import HomePage from "./HomePage/HomePage.js";
import CustomScrollbars from "../../src/components/CustomScrollbars.js";
import DetailDoctor from "./Patient/Doctor/DetailDoctor.js";
import Doctor from "../routes/Doctor.js";
import VerifyEmail from "./Patient/VerifyEmail.js";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty.js";
import DetailClinic from "./Patient/Clinic/DetailClinic.js";
import ListAllDoctor from "./Patient/Doctor/ListAllDoctor.js";
import ListAllSpecialty from "./Patient/Specialty/ListAllSpecialty.js";
import ListAllClinic from "./Patient/Clinic/ListAllClinic.js";
import DetailHandbook from "./Patient/Handbook/DetailHandbook.js";
import ListAllHandbook from "./Patient/Handbook/ListAllHandbook.js";
import BackToTop from "../components/BackToTop.js";

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     scrollRef: null,
  //   };
  // }
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };
  // handleScrollRef = (ref) => {
  //   this.setState({ scrollRef: ref });
  // };
  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            <div className="content-container">
              <CustomScrollbars
                className="scroll-container"
                style={{ height: "100vh", width: "100%" }}
              >
                <Switch>
                  <Route path={path.HOME} exact component={Home} />
                  <Route
                    path={path.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route
                    path={path.SYSTEM}
                    component={userIsAuthenticated(System)}
                  />
                  <Route
                    path={"/doctor/"}
                    component={userIsAuthenticated(Doctor)}
                  />
                  <Route path={path.HOMEPAGE} component={HomePage} />
                  <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                  <Route
                    path={path.DETAIL_SPECIALTY}
                    component={DetailSpecialty}
                  />
                  <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                  <Route
                    path={path.DETAIL_HANDBOOK}
                    component={DetailHandbook}
                  />

                  <Route
                    path={path.VERIFY_EMAIL_BOOKING}
                    component={VerifyEmail}
                  />
                  <Route path={path.LIST_DOCTOR} component={ListAllDoctor} />
                  <Route
                    path={path.LIST_SPECIALTY}
                    component={ListAllSpecialty}
                  />
                  <Route path={path.LIST_CLINIC} component={ListAllClinic} />
                  <Route
                    path={path.LIST_HANDBOOK}
                    component={ListAllHandbook}
                  />
                </Switch>
              </CustomScrollbars>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

            <BackToTop />

            {/* <ToastContainer
              className="toast-container"
              toastClassName="toast-item"
              bodyClassName="toast-item-body"
              autoClose={false}
              hideProgressBar={true}
              pauseOnHover={false}
              pauseOnFocusLoss={true}
              closeOnClick={false}
              draggable={false}
              closeButton={<CustomToastCloseButton />}
            /> */}
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
