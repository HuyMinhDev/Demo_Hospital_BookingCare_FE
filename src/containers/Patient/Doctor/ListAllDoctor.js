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
import LoadingOverlay from "react-loading-overlay";

class ListAllDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDoctors: [],
      selectedDoctorId: null,
      isShowLoading: false,
      currentPage: 1,
      doctorsPerPage: 5,
    };
  }

  async componentDidMount() {
    this.setState({ isShowLoading: true });

    let res = await getAllDoctors();
    if (res && res.errCode === 0) {
      this.setState({
        allDoctors: res.data || [],
        isShowLoading: false,
      });
    } else {
      this.setState({ isShowLoading: false });
    }
  }

  handleOnChangeDoctor = (selected) => {
    this.setState({
      selectedDoctorId: selected ? selected.value : null,
      currentPage: 1, // reset về trang đầu khi chọn filter
    });
  };

  handlePageChange = (newPage) => {
    this.setState({ currentPage: newPage });
  };

  render() {
    const {
      allDoctors,
      selectedDoctorId,
      currentPage,
      doctorsPerPage,
      isShowLoading,
    } = this.state;
    const { language } = this.props;

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

    const filteredDoctors = selectedDoctorId
      ? allDoctors.filter((doc) => doc.id === selectedDoctorId)
      : allDoctors;

    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = filteredDoctors.slice(
      indexOfFirstDoctor,
      indexOfLastDoctor
    );

    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

    return (
      <>
        <LoadingOverlay active={isShowLoading} spinner text="Loading...">
          <HomeHeader />
          <div
            className={`list-all-doctor-container ${
              isShowLoading ? "loading-overlay-active" : ""
            }`}
          >
            <div className="bg-body-detail">
              <div className="container">
                <div className="search-sp-doctor">
                  <Select
                    options={doctorOptions}
                    onChange={this.handleOnChangeDoctor}
                    placeholder={
                      language === LANGUAGES.VI
                        ? "Chọn bác sĩ"
                        : "Select doctor"
                    }
                    isClearable
                  />
                </div>

                {currentDoctors.map((doctor) => (
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

                {totalPages > 1 && (
                  <div className="pagination mt-4">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          className={`btn btn-sm mx-1 ${
                            page === currentPage
                              ? "btn-phantrang"
                              : "btn-outline-phantrang"
                          }`}
                          onClick={() => this.handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <HomeFooter />
        </LoadingOverlay>
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
