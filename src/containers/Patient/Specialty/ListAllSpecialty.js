import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllSpecialty } from "../../../services/userService";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { LANGUAGES } from "../../../utils";
import Select from "react-select";
import "./ListAllSpecialty.scss";

class ListAllSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allSpecialties: [],
      selectedSpecialtyId: null,
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        allSpecialties: res.data || [],
      });
    }
  }

  handleOnChangeDoctor = (selected) => {
    this.setState({
      selectedSpecialtyId: selected ? selected.value : null,
    });
  };

  handleDetailSpecialty = (id) => {
    this.props.history.push(`/detail-specialty/${id}`);
  };
  render() {
    const { allSpecialties, selectedSpecialtyId } = this.state;
    const { language } = this.props;

    // Tạo options cho Select
    const doctorOptions = allSpecialties.map((item) => {
      return {
        value: item.id,
        label: language === LANGUAGES.VI ? item.name : item.nameEn || item.name,
      };
    });

    // Lọc specialty để hiển thị
    const specialtiesToRender = selectedSpecialtyId
      ? allSpecialties.filter((item) => item.id === selectedSpecialtyId)
      : allSpecialties;

    return (
      <>
        <HomeHeader />

        <div className="list-all-specialty-container mt-3">
          <div className="container">
            <h3 className="text-center fw-bold mb-4">
              {language === LANGUAGES.VI
                ? "Tất cả chuyên khoa"
                : "All Specialties"}
            </h3>
            <div className="row">
              <div className="col-12 mb-4">
                <Select
                  options={doctorOptions}
                  onChange={this.handleOnChangeDoctor}
                  placeholder={
                    language === LANGUAGES.VI
                      ? "Chọn chuyên khoa"
                      : "Select specialty"
                  }
                  isClearable
                />
              </div>
            </div>
            <div className="row">
              {specialtiesToRender.map((item, index) => (
                <div className="col-6 col-md-4 col-lg-4 mb-4" key={index}>
                  <div
                    onClick={() => this.handleDetailSpecialty(item.id)}
                    className="specialty-card card h-100 shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="card-img-top img-fluid"
                      style={{
                        maxWidth: "100%",
                        height: "100%",
                        objectFit: "cover",
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

export default connect(mapStateToProps)(ListAllSpecialty);
