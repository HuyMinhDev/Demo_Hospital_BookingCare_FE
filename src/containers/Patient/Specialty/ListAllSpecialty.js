import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllSpecialty } from "../../../services/userService";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { LANGUAGES } from "../../../utils";
import Select from "react-select";
import "./ListAllSpecialty.scss";
import LoadingOverlay from "react-loading-overlay";

class ListAllSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allSpecialties: [],
      selectedSpecialtyId: null,
      isShowLoading: false,
      currentPage: 1,
      specialtiesPerPage: 9,
    };
  }

  async componentDidMount() {
    this.setState({ isShowLoading: true });
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        allSpecialties: res.data || [],
        isShowLoading: false,
      });
    } else {
      this.setState({ isShowLoading: false });
    }
  }

  handleOnChangeDoctor = (selected) => {
    this.setState({
      selectedSpecialtyId: selected ? selected.value : null,
      currentPage: 1,
    });
  };

  handleDetailSpecialty = (id) => {
    this.props.history.push(`/detail-specialty/${id}`);
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    const {
      allSpecialties,
      selectedSpecialtyId,
      isShowLoading,
      currentPage,
      specialtiesPerPage,
    } = this.state;

    const { language } = this.props;

    // Select options
    const doctorOptions = allSpecialties.map((item) => ({
      value: item.id,
      label: language === LANGUAGES.VI ? item.name : item.nameEn || item.name,
    }));

    // Filtered specialties
    const filteredSpecialties = selectedSpecialtyId
      ? allSpecialties.filter((item) => item.id === selectedSpecialtyId)
      : allSpecialties;

    // Pagination logic
    const indexOfLast = currentPage * specialtiesPerPage;
    const indexOfFirst = indexOfLast - specialtiesPerPage;
    const currentSpecialties = filteredSpecialties.slice(
      indexOfFirst,
      indexOfLast
    );
    const totalPages = Math.ceil(
      filteredSpecialties.length / specialtiesPerPage
    );

    return (
      <>
        <LoadingOverlay active={isShowLoading} spinner text="Loading...">
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
                {currentSpecialties.map((item, index) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination d-flex justify-content-center mt-4">
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

export default connect(mapStateToProps)(ListAllSpecialty);
