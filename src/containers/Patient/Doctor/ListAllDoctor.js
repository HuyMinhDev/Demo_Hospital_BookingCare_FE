import React, { Component } from "react";
import { connect } from "react-redux";
import "./ListAllDoctor.scss";
import { LANGUAGES } from "../../../utils";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import { getAllDoctors } from "../../../services/userService";
import Select from "react-select";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";

class ListAllDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDoctors: [], // Danh sách tất cả bác sĩ
      selectedDoctorId: null, // ID bác sĩ được chọn
    };
  }

  async componentDidMount() {
    let res = await getAllDoctors();
    if (res && res.errCode === 0) {
      this.setState({
        allDoctors: res.data || [],
      });
    }
  }

  handleOnChangeDoctor = (selected) => {
    this.setState({
      selectedDoctorId: selected ? selected.value : null,
    });
  };

  render() {
    const { allDoctors, selectedDoctorId } = this.state;
    const { language } = this.props;

    // Danh sách options cho dropdown
    const doctorOptions = allDoctors.map((doctor) => {
      const label =
        language === LANGUAGES.VI
          ? `${doctor.lastName} ${doctor.firstName}`
          : `${doctor.firstName} ${doctor.lastName}`;
      return {
        value: doctor.id,
        label: label,
      };
    });

    // Danh sách bác sĩ để hiển thị
    const doctorsToRender = selectedDoctorId
      ? allDoctors.filter((doc) => doc.id === selectedDoctorId)
      : allDoctors;

    return (
      <>
        <HomeHeader />
        <div className="list-all-doctor-container">
          <div className="bg-body-detail">
            <div className="container">
              <div className="search-sp-doctor">
                <Select
                  options={doctorOptions}
                  onChange={this.handleOnChangeDoctor}
                  placeholder={
                    language === LANGUAGES.VI ? "Chọn bác sĩ" : "Select doctor"
                  }
                  isClearable
                />
              </div>

              {doctorsToRender.map((doctor) => (
                <div className="each-doctor" key={doctor.id}>
                  <div className="dt-content-left">
                    <ProfileDoctor
                      doctorId={doctor.id}
                      isShowDescriptionDoctor={true}
                      isShowLinkDetail={true}
                      isShowPrice={false}
                    />
                  </div>
                  <div className="dt-content-right">
                    <DoctorSchedule doctorIdFromParent={doctor.id} />
                    <DoctorExtraInfor doctorIdFromParent={doctor.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(ListAllDoctor);
