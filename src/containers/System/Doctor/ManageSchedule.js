import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import _ from "lodash";
import {
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
} from "../../../services/userService";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: "",
      rangeTime: [],
    };
  }

  componentDidMount() {
    let { userInfo } = this.props;

    if (userInfo && userInfo.roleId === "R1") {
      // Admin thì load full danh sách doctor
      this.props.fetchAllDoctors();
    } else if (userInfo && userInfo.roleId === "R2") {
      // Bác sĩ thì set luôn selectedDoctor
      let doctor = {
        label: `${userInfo.lastName} ${userInfo.firstName}`,
        value: userInfo.id,
      };
      this.setState({ selectedDoctor: doctor });
    }

    this.props.fetchAllScheduleTime();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }

    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({
        rangeTime: data,
      });
    }
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName}`;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  handleChangeSelect = async (selectedDoctor) => {
    this.setState({ selectedDoctor }, async () => {
      if (this.state.currentDate) {
        let date = new Date(this.state.currentDate).getTime();
        await this.fetchScheduleByDate(selectedDoctor.value, date);
      }
    });
  };

  handleOnchangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        if (
          this.state.selectedDoctor &&
          !_.isEmpty(this.state.selectedDoctor)
        ) {
          let date = new Date(this.state.currentDate).getTime();
          await this.fetchScheduleByDate(this.state.selectedDoctor.value, date);
        }
      }
    );
  };

  hanleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      this.setState({
        rangeTime: rangeTime,
      });
    }
  };

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate } = this.state;
    let result = [];

    if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
      toast.error("Invalid selected doctor!");
      return;
    }
    if (!currentDate) {
      toast.error("Invalid date!");
      return;
    }

    let formateDate = new Date(currentDate).getTime();
    let selectedTime = rangeTime.filter((item) => item.isSelected === true);

    if (selectedTime && selectedTime.length > 0) {
      selectedTime.map((schedule) => {
        let object = {
          doctorId: selectedDoctor.value,
          date: formateDate,
          timeType: schedule.keyMap,
        };
        result.push(object);
      });
    } else {
      toast.error("Invalid selected time!");
      return;
    }

    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      formateDate: formateDate,
    });

    if (res && res.errCode === 0) {
      toast.success("Save Schedule successed!");
    } else {
      toast.error("Error Save Schedule!");
      console.log("Error saveBulkScheduleDoctor >>> res: ", res);
    }
  };

  /** Gọi API lấy lịch khám đã lưu theo bác sĩ + ngày */
  fetchScheduleByDate = async (doctorId, date) => {
    let res = await getScheduleDoctorByDate(doctorId, date);
    if (res && res.errCode === 0 && res.data) {
      let { rangeTime } = this.state;
      let updatedTime = rangeTime.map((time) => {
        let matched = res.data.some((item) => item.timeType === time.keyMap);
        return {
          ...time,
          isSelected: matched,
        };
      });
      this.setState({
        rangeTime: updatedTime,
      });
    }
  };

  render() {
    let { rangeTime } = this.state;
    let { language, userInfo } = this.props;
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              {userInfo && userInfo.roleId === "R1" ? (
                <>
                  <label>
                    <FormattedMessage id="manage-schedule.choose-doctor" />
                  </label>
                  <Select
                    value={this.state.selectedDoctor}
                    onChange={this.handleChangeSelect}
                    options={this.state.listDoctors}
                  />
                </>
              ) : (
                <>
                  <label>
                    <FormattedMessage id="manage-schedule.name-doctor" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={
                      language === LANGUAGES.VI
                        ? `${userInfo.lastName} ${userInfo.firstName}`
                        : `${userInfo.firstName} ${userInfo.lastName}`
                    }
                  />
                </>
              )}
            </div>

            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-date" />
              </label>
              <DatePicker
                onChange={this.handleOnchangeDatePicker}
                className="form-control"
                value={this.state.currentDate}
                minDate={yesterday}
              />
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTime &&
                rangeTime.length > 0 &&
                rangeTime.map((item, index) => {
                  return (
                    <button
                      className={
                        item.isSelected
                          ? "btn btn-schedule active"
                          : "btn btn-schedule"
                      }
                      key={index}
                      onClick={() => this.hanleClickBtnTime(item)}
                    >
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary btn-save-schedule"
                onClick={this.handleSaveSchedule}
              >
                <FormattedMessage id="manage-schedule.save" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
