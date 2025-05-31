import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailHandbook.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";

import { getDetailHandbookByIdNew } from "../../../services/userService";

import _ from "lodash";

class DetailHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailHandbook: {},
    };
  }

  async componentDidMount() {
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
        });
      } else {
        console.error("Failed to fetch handbook detail", res);
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
      </div>
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
