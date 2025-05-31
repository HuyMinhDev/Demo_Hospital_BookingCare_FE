import React, { Component } from "react";

import { connect } from "react-redux";
import "./OutStandingDoctor.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import LoadingOverlay from "react-loading-overlay";
class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
      isShowLoading: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      this.setState({
        arrDoctors: this.props.topDoctorsRedux,
        isShowLoading: false,
      });
    }
  }

  componentDidMount() {
    this.setState({ isShowLoading: true }, () => {
      this.props.loadTopDoctors();
    });
  }

  handleViewDetailDoctor = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };
  handleAllDoctor = () => {
    this.props.history.push(`/list-doctor`);
  };
  render() {
    let arrDoctors = this.state.arrDoctors;
    let { language } = this.props;
    // arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors);
    console.log("check arrDoctors: ", arrDoctors);
    return (
      <LoadingOverlay
        active={this.state.isShowLoading}
        spinner
        text="Loading..."
      >
        <section
          className={`section-share section-outstanding-doctor ${
            this.state.isShowLoading ? "loading-overlay-active" : ""
          }`}
        >
          <div className="container">
            <div className="section-container">
              <div className="section-header">
                <span className="title-section">
                  <FormattedMessage id="homepage.outstanding-doctor" />
                </span>
                <button
                  className="btn-section"
                  onClick={() => this.handleAllDoctor()}
                >
                  <FormattedMessage id="homepage.more-infor" />
                </button>
              </div>
              <div className="section-body">
                <Slider {...this.props.settings}>
                  {arrDoctors &&
                    arrDoctors.length > 0 &&
                    arrDoctors.map((item, index) => {
                      let imageBase64 = "";
                      if (item.image) {
                        imageBase64 = new Buffer(item.image, "base64").toString(
                          "binary"
                        );
                      }

                      let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName} `;
                      let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                      return (
                        <div
                          className="section-customize"
                          key={index}
                          onClick={() => this.handleViewDetailDoctor(item)}
                        >
                          <div className="customize-boder">
                            <div className="outer-bg">
                              <div
                                className="bg-image section-outstanding-doctor"
                                style={{
                                  backgroundImage: `url(${imageBase64})`,
                                }}
                              />
                            </div>
                            <div className="position text-center">
                              <div className="title-chucvu">
                                <div className="title-chucvu-content">
                                  <div className="name-doctor">
                                    {language === LANGUAGES.VI
                                      ? nameVi
                                      : nameEn}
                                  </div>
                                  <div className="name-specialty">
                                    {item.doctorInfor?.specialtyData?.name || (
                                      <FormattedMessage id="homepage.specialty-doctor" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </Slider>
              </div>
            </div>
          </div>
        </section>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    topDoctorsRedux: state.admin.topDoctors,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
