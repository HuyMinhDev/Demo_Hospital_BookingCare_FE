import React, { Component } from "react";

import { connect } from "react-redux";
import "./Specialty.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
// Import css files
import { getAllSpecialty } from "../../../services/userService";
class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: [],
    };
  }
  async componentDidMount() {
    let res = await getAllSpecialty();
    // console.log(">>>>Check res chuyen khoa: ", res);
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      });
    }
  }
  handleViewDetailSpecialty = (specialty) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${specialty.id}`);
      console.log(">>>Check id specialty: ", specialty.id);
    }
  };
  handleAllSpecialty = () => {
    this.props.history.push(`/list-specialty`);
  };
  render() {
    let { dataSpecialty } = this.state;
    return (
      <section className="section-share section-specialty">
        <div className="container">
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">
                <FormattedMessage id="homepage.specialty-poplular" />
              </span>
              <button
                className="btn-section"
                onClick={() => this.handleAllSpecialty()}
              >
                <FormattedMessage id="homepage.more-infor" />
              </button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings}>
                {dataSpecialty &&
                  dataSpecialty.length > 0 &&
                  dataSpecialty.map((item, index) => {
                    return (
                      <div
                        className="section-customize"
                        key={index}
                        onClick={() => this.handleViewDetailSpecialty(item)}
                      >
                        <div className="customize-boder">
                          <div
                            className="bg-image section-specialty"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />

                          <div className="title-specialty">
                            <div className="title-specialty-content">
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
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Specialty)
);
