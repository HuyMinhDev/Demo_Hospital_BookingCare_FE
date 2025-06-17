import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailHandbook.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import LoadingOverlay from "react-loading-overlay";
import { getDetailHandbookByIdNew } from "../../../services/userService";

import _ from "lodash";
import HomeFooter from "../../HomePage/HomeFooter";

class DetailHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailHandbook: {},
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    this.setState({ isShowLoading: true });
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;

      let res = await getDetailHandbookByIdNew(id);

      if (res && res.errCode === 0) {
        let data = res.data;
        let arrDoctorId = [];
        if (data && !_.isEmpty(data)) {
          let arr = data.doctorHandbook;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }

        this.setState({
          dataDetailHandbook: data,
          arrDoctorId: arrDoctorId,
          isShowLoading: false,
        });
      } else {
        console.error("Failed to fetch handbook detail", res);
        this.setState({ isShowLoading: false });
      }
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  render() {
    let { arrDoctorId, dataDetailHandbook } = this.state;
    let { language } = this.props;
    return (
      <LoadingOverlay
        active={this.state.isShowLoading}
        spinner
        text="Loading..."
      >
        <div className="detail-handbook-container">
          <HomeHeader />
          <div className="bg-description">
            <div className="description-handbook container">
              {/* Thông tin cẩm nang */}
              {dataDetailHandbook && !_.isEmpty(dataDetailHandbook) && (
                <div className="handbook-header">
                  <div className="handbook-img">
                    <img
                      src={dataDetailHandbook.image}
                      alt={dataDetailHandbook.name}
                    />
                  </div>

                  <div className="handbook-titlename">
                    <h2>{dataDetailHandbook.name}</h2>
                  </div>
                </div>
              )}

              {/* Mô tả HTML */}
              {dataDetailHandbook && !_.isEmpty(dataDetailHandbook) && (
                <div
                  className="desHandbook"
                  dangerouslySetInnerHTML={{
                    __html: dataDetailHandbook.descriptionHTML,
                  }}
                ></div>
              )}
            </div>
          </div>
          <HomeFooter />
        </div>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);
