import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailClinic.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getDetailClinicById } from "../../../services/userService";

import _ from "lodash";
import Select from "react-select";

class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailClinic: {},
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;

      let res = await getDetailClinicById({
        id: id,
      });

      if (res && res.errCode === 0) {
        let data = res.data;
        let arrDoctorId = [];
        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorClinic;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }

        this.setState({
          dataDetailClinic: res.data,
          arrDoctorId: arrDoctorId,
        });
      } else {
        console.error("Failed to fetch doctor detail", res);
      }
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  // handleOnChangeSelect = async (event) => {
  //   console.log(">>>> Check channel onchange: ", event.value);
  //   if (
  //     this.props.match &&
  //     this.props.match.params &&
  //     this.props.match.params.id
  //   ) {
  //     let id = this.props.match.params.id;
  //     let location = event.value;
  //     let res = await getDetailSpecialtyByIdNew({
  //       id: id,
  //       location: location,
  //     });

  //     if (res && res.errCode === 0) {
  //       let data = res.data;
  //       let arrDoctorId = [];
  //       if (data && !_.isEmpty(res.data)) {
  //         let arr = data.doctorSpecialty;
  //         if (arr && arr.length > 0) {
  //           arr.map((item) => {
  //             arrDoctorId.push(item.doctorId);
  //           });
  //         }
  //       }

  //       this.setState({
  //         dataDetailSpecialty: res.data,
  //         arrDoctorId: arrDoctorId,
  //       });
  //     }
  //   }
  // };

  render() {
    let { arrDoctorId, dataDetailClinic } = this.state;
    console.log(">>>>>>Check state this.state: ", this.state);
    let { language } = this.props;
    return (
      <div className="detail-clinic-container ">
        <HomeHeader />
        <div className="bg-description">
          <div className="description-clinic container">
            {/* Thông tin phòng khám */}
            {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
              <div className="clinic-header">
                <div className="clinic-img">
                  <img
                    src={dataDetailClinic.image}
                    alt={dataDetailClinic.name}
                  />
                </div>

                <div className="clinic-titlename">
                  <h2>{dataDetailClinic.name}</h2>
                  <p>
                    <i class="fa fa-map-marker"></i>
                    {dataDetailClinic.address}
                  </p>
                </div>
              </div>
            )}

            {/* Mô tả HTML */}
            {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
              <div
                className="desClinic"
                dangerouslySetInnerHTML={{
                  __html: dataDetailClinic.descriptionHTML,
                }}
              ></div>
            )}
          </div>
        </div>

        <div className="bg-body-detail">
          <div className="container ps-0 pe-0">
            {arrDoctorId &&
              arrDoctorId.length > 0 &&
              arrDoctorId.map((item, index) => {
                return (
                  <div className="each-doctor" key={index}>
                    <div className="dt-content-left">
                      <div className="profile-doctor">
                        <ProfileDoctor
                          key={item}
                          doctorId={item}
                          isShowDescriptionDoctor={true}
                          isShowLinkDetail={true}
                          isShowPrice={false}
                        />
                      </div>
                    </div>
                    <div className="dt-content-right">
                      <div className="doctor-schedule">
                        <DoctorSchedule doctorIdFromParent={item} />
                      </div>
                      <div className="doctor-extra-infor">
                        <DoctorExtraInfor doctorIdFromParent={item} />
                      </div>
                    </div>
                  </div>
                );
              })}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
