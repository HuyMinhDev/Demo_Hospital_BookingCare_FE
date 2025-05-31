import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDocter,
  postSendKemedy,
} from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
// Loading
import LoadingOverlay from "react-loading-overlay";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    this.getDataPatient();
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = currentDate;
    let res = await getAllPatientForDocter({
      doctorId: user.id,
      date: formatedDate,
    });
    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  handleOnchangeDatePicker = (date) => {
    const selectedDate = date[0];
    const formatedDate = moment(selectedDate).startOf("day").valueOf(); // chuẩn format API
    this.setState(
      {
        // currentDate: date[0],
        currentDate: formatedDate, // Lưu timestamp luôn cho gọn
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };
  handleBtnConform = (item) => {
    console.log("Nút gửi: ", item);
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };
  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };
  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    // console.log(">>> Check parent modal: ", dataChild);
    this.setState({
      isShowLoading: true,
    });
    let res = await postSendKemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
    });
    // console.log(">>> Check parent res: ", res);
    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success("Send Remedy Succeeds!");
      this.closeRemedyModal();
      await this.getDataPatient();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Something wrongs...");
      console.log("error send remedy: ", res);
    }
  };
  render() {
    let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
    let { language } = this.props;
    return (
      <>
        <div className="manage-patient-container container">
          <div className="m-p-title">Quản lý bệnh nhân khám bệnh</div>
          <div className="manage-patient-body row mt-3">
            <div className="form-group col-4">
              <label>Chọn ngày khám</label>
              <DatePicker
                onChange={this.handleOnchangeDatePicker}
                className="form-control"
                // value={this.state.currentDate}
                value={new Date(this.state.currentDate)}
              />
            </div>
            <div className="col-12 mt-4">
              <table className="table-manage-patient table table-striped table-responsive table-hover table-bordered">
                <thead className="table-dark ">
                  <tr>
                    <th>Id</th>
                    <th>Time</th>
                    <th>Email</th>
                    <th>Full name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPatient && dataPatient.length > 0 ? (
                    dataPatient.map((item, index) => {
                      let time =
                        language === LANGUAGES.VI
                          ? item.timeTypeDataPatient.valueVi
                          : item.timeTypeDataPatient.valueEn;
                      let gender =
                        language === LANGUAGES.VI
                          ? item.patientData.genderData.valueVi
                          : item.patientData.genderData.valueEn;
                      return (
                        <tr key={index}>
                          <th>{index + 1}</th>
                          <td>{time}</td>
                          <td>{item.patientData.email}</td>
                          <td>{item.patientData.firstName}</td>
                          <td>{item.patientData.address}</td>
                          <td>{item.patientData.phonenumber}</td>
                          <td>{gender}</td>
                          <td className="btn-double">
                            <button
                              className="btn btn-warning mp-btn-conform"
                              onClick={() => this.handleBtnConform(item)}
                            >
                              Xác nhận
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        Không có lịch hẹn
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <RemedyModal
          isOpenModal={isOpenRemedyModal}
          dataModal={dataModal}
          closeRemedyModal={this.closeRemedyModal}
          sendRemedy={this.sendRemedy}
        />
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading..."
        ></LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
