import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllHandbook } from "../../../services/userService";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { LANGUAGES } from "../../../utils";
import Select from "react-select";
import "./ListAllHandbook.scss";
import LoadingOverlay from "react-loading-overlay";
class ListAllHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allHandbooks: [],
      selectedHandbookId: null,
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    this.setState({ isShowLoading: true });
    try {
      let res = await getAllHandbook();
      if (res && res.errCode === 0) {
        this.setState({ allHandbooks: res.data || [] });
      }
    } catch (error) {
      console.error("Error loading handbooks:", error);
    } finally {
      this.setState({ isShowLoading: false });
    }
  }

  handleOnChangeHandbook = (selected) => {
    this.setState({ isShowLoading: true });

    const selectedId = selected ? selected.value : null;
    this.setState({ selectedHandbookId: selectedId });

    this.setState({ isShowLoading: false });
  };

  handleDetailHandbook = (id) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${id}`);
    }
  };

  render() {
    const { allHandbooks, selectedHandbookId } = this.state;
    const { language } = this.props;

    const handbookOptions = allHandbooks.map((item) => ({
      value: item.id,
      label: language === LANGUAGES.VI ? item.name : item.nameEn || item.name,
    }));

    const handbooksToRender = selectedHandbookId
      ? allHandbooks.filter((item) => item.id === selectedHandbookId)
      : allHandbooks;

    return (
      <>
        <HomeHeader />
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading..."
        >
          <div className="list-all-handbook-container py-4">
            <div className="container">
              <h3 className="text-center fw-bold mb-4">
                {language === LANGUAGES.VI
                  ? "Tất cả cẩm nang"
                  : "All Handbooks"}
              </h3>

              <div className="mb-4">
                <Select
                  options={handbookOptions}
                  onChange={this.handleOnChangeHandbook}
                  placeholder={
                    language === LANGUAGES.VI
                      ? "Chọn cẩm nang"
                      : "Select handbook"
                  }
                  isClearable
                />
              </div>

              <div className="row">
                {handbooksToRender.map((item, index) => (
                  <div className="col-6 col-md-4 col-lg-4 mb-4" key={index}>
                    <div
                      onClick={() => this.handleDetailHandbook(item.id)}
                      className="handbook-card card h-100 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="card-img-top img-fluid"
                        style={{
                          maxWidth: "100%",
                          height: "200px",
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
        </LoadingOverlay>
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

export default connect(mapStateToProps)(ListAllHandbook);
