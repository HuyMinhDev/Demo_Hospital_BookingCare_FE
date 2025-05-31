import React, { Component } from "react";

import { connect } from "react-redux";
// import "./HandBook.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import "./HandBook.scss";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
// Import css files
import { getAllHandbook } from "../../../services/userService";
class HandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataHandbook: [],
    };
  }
  async componentDidMount() {
    let res = await getAllHandbook();
    // console.log(">>>>Check res handbook: ", res);
    if (res && res.errCode === 0) {
      this.setState({
        dataHandbook: res.data ? res.data : [],
      });
    }
  }
  handleAllHandbook = () => {
    this.props.history.push(`/list-handbook`);
  };
  handleViewDetailHandbook = (handbook) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${handbook.id}`);
    }
  };
  render() {
    let { dataHandbook } = this.state;
    return (
      <section className="section-share section-handbook">
        <div className="container">
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">
                <FormattedMessage id="homepage.handbook" />
              </span>
              <button
                className="btn-section"
                onClick={() => this.handleAllHandbook()}
              >
                <FormattedMessage id="homepage.more-infor" />
              </button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings}>
                {dataHandbook &&
                  dataHandbook.length > 0 &&
                  dataHandbook.map((item, index) => {
                    return (
                      <div
                        className="section-customize"
                        key={index}
                        onClick={() => this.handleViewDetailHandbook(item)}
                      >
                        <div className="customize-boder">
                          <div
                            className="bg-image section-handbook"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                          <div className="title-handbook">
                            <div className="title-handbook-content">
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
  connect(mapStateToProps, mapDispatchToProps)(HandBook)
);
