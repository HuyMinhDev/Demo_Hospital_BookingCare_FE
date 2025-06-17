import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import { LANGUAGES } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientHistory,
  postSendKemedy,
} from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { removeVietnameseTones } from "../../../utils/util1";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
      searchTerm: "",
    };
  }

  async componentDidMount() {
    this.getDataPatient();
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let res = await getAllPatientHistory({
      doctorId: user.id,
    });
    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
  };

  async componentDidUpdate(prevProps) {
    if (this.props.language !== prevProps.language) {
      // Ngôn ngữ thay đổi, có thể re-render nếu cần
    }
  }

  handleOnchangeDatePicker = (date) => {
    const selectedDate = date[0];
    const formatedDate = moment(selectedDate).startOf("day").valueOf();
    this.setState(
      {
        currentDate: formatedDate,
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleBtnConform = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      address: item.patientData.address,
      phonenumber: item.patientData.phonenumber,
      timeType: item.timeType,
      appointmentDate: item.appointmentDate,
      timeTypeDataPatient: item.timeTypeDataPatient,
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
      address: dataModal.address,
      phonenumber: dataModal.phonenumber,
      appointmentDate: dataModal.appointmentDate,
      timeTypeDataPatient: dataModal.timeTypeDataPatient,
    });

    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success("Gửi đơn thuốc thành công!");
      this.closeRemedyModal();
      await this.getDataPatient();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Có lỗi xảy ra...");
      console.log("error send remedy: ", res);
    }
  };

  render() {
    let { dataPatient, isOpenRemedyModal, dataModal, searchTerm } = this.state;
    let { language } = this.props;

    // Tìm kiếm không dấu
    let filteredPatients = dataPatient
      .filter((item) => {
        const name = removeVietnameseTones(
          item.patientData.firstName.toLowerCase()
        );
        const phone = item.patientData.phonenumber.toLowerCase();
        const search = removeVietnameseTones(searchTerm.toLowerCase());
        return name.includes(search) || phone.includes(search);
      })
      .sort((a, b) => {
        const dateA = moment(a.appointmentDate).valueOf();
        const dateB = moment(b.appointmentDate).valueOf();
        return dateB - dateA;
      });

    return (
      <>
        <div className="manage-patient-container container">
          <div className="m-p-title">Quản lý bệnh nhân khám bệnh</div>
          <div className="manage-patient-body row mt-3">
            <div className="form-group col-12">
              <label>Tìm kiếm (Tên hoặc SĐT)</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Nhập tên hoặc số điện thoại"
                onChange={this.handleSearchChange}
                value={this.state.searchTerm}
              />
            </div>
            <div className="col-12 mt-4">
              <table className="table-manage-patient table table-striped table-responsive table-hover table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Id</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Email</th>
                    <th>Full name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients && filteredPatients.length > 0 ? (
                    filteredPatients.map((item, index) => {
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
                          <td>
                            {moment(item.appointmentDate).format("DD/MM/YYYY")}
                          </td>
                          <td>{time}</td>
                          <td>{item.patientData.email}</td>
                          <td>{item.patientData.firstName}</td>
                          <td>{item.patientData.address}</td>
                          <td>{item.patientData.phonenumber}</td>
                          <td>{gender}</td>
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
        />
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
