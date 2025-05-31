import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllClinic } from "../../../services/userService";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { LANGUAGES } from "../../../utils";
import Select from "react-select";
import "./ListAllClinic.scss";

class ListAllClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allClinics: [],
      selectedClinicId: null,
    };
  }

  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        allClinics: res.data || [],
      });
    }
  }

  handleOnChangeClinic = (selected) => {
    this.setState({
      selectedClinicId: selected ? selected.value : null,
    });
  };

  handleDetailClinic = (id) => {
    this.props.history.push(`/detail-clinic/${id}`);
  };

  render() {
    const { allClinics, selectedClinicId } = this.state;
    const { language } = this.props;

    // Tạo options cho Select
    const clinicOptions = allClinics.map((item) => ({
      value: item.id,
      label: language === LANGUAGES.VI ? item.name : item.nameEn || item.name,
    }));

    // Lọc clinic để hiển thị
    const clinicsToRender = selectedClinicId
      ? allClinics.filter((item) => item.id === selectedClinicId)
      : allClinics;

    return (
      <>
        <HomeHeader />

        <div className="list-all-clinic-container py-4">
          <div className="container">
            <h3 className="text-center fw-bold mb-4">
              {language === LANGUAGES.VI ? "Tất cả phòng khám" : "All Clinics"}
            </h3>

            <div className="mb-4">
              <Select
                options={clinicOptions}
                onChange={this.handleOnChangeClinic}
                placeholder={
                  language === LANGUAGES.VI
                    ? "Chọn phòng khám"
                    : "Select clinic"
                }
                isClearable
              />
            </div>

            <div className="row">
              {clinicsToRender.map((item, index) => (
                <div className="col-6 col-md-4 col-lg-4 mb-4" key={index}>
                  <div
                    onClick={() => this.handleDetailClinic(item.id)}
                    className="clinic-card card h-100 shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="card-img-top img-fluid"
                      style={{
                        maxWidth: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div className="card-body text-center">
                      <h6 className="card-title mb-0">
                        {language === LANGUAGES.VI
                          ? item.name
                          : item.nameEn || item.name}
                      </h6>
                    </div>
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

export default connect(mapStateToProps)(ListAllClinic);
