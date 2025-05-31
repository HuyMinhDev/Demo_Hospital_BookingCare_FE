import React, { Component } from "react";

import { connect } from "react-redux";
import "./MedicalFacility.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import { getAllClinic } from "../../../services/userService";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinics: [],
    };
  }
  async componentDidMount() {
    let res = await getAllClinic();
    // console.log(">>>>Check thong tin clinic: ", res);
    if (res && res.errCode === 0) {
      this.setState({
        dataClinics: res.data ? res.data : [],
      });
    }
  }
  handleViewDetailClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`);
      console.log(">>>Check id Clinc: ", clinic.id);
    }
  };
  handleAllClinic = () => {
    this.props.history.push(`/list-clinic`);
  };
  render() {
    let { dataClinics } = this.state;
    return (
      <section className="section-share section-medical-facility">
        <div className="container">
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">
                <FormattedMessage id="homepage.clinic-doctor" />
              </span>
              <button
                className="btn-section"
                onClick={() => this.handleAllClinic()}
              >
                <FormattedMessage id="homepage.more-infor" />
              </button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings}>
                {dataClinics &&
                  dataClinics.length > 0 &&
                  dataClinics.map((item, index) => {
                    return (
                      <div
                        className="section-customize"
                        key={index}
                        onClick={() => this.handleViewDetailClinic(item)}
                      >
                        <div className="customize-boder">
                          <div
                            className="bg-image section-medical-facility"
                            style={{
                              backgroundImage: `url(${item.image})`,
                            }}
                          />

                          <div className="title-clinic">
                            <div className="title-clinic-content">
                              {item.name}
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
