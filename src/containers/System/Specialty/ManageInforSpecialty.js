import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageInforSpecialty.scss";
import Select from "react-select";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import {
  getAllSpecialty,
  getDetailSpecialtyById,
  updateSpecialtyService,
  deleteSpecialtyService,
} from "../../../services/userService";
import { injectIntl } from "react-intl";
// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageInforSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listSpecialty: [],
      selectedSpecialty: null,
      name: "",
      descriptionMarkdown: "",
      descriptionHTML: "",
      imageBase64: "",
      previewImgURL: "",
    };
    this.fileInputRef = React.createRef();
  }

  async componentDidMount() {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      let dataSelect = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      this.setState({ listSpecialty: dataSelect });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  handleDelete = async () => {
    const { selectedSpecialty } = this.state;
    if (!selectedSpecialty) return;

    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xoá chuyên khoa "${selectedSpecialty.label}" không?`
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteSpecialtyService(selectedSpecialty.value);
      if (res && res.errCode === 0) {
        toast.success(
          this.props.intl.formatMessage({
            id: "admin.manage-doctor.toast-deleteSuccess",
          })
        );
        if (this.fileInputRef.current) {
          this.fileInputRef.current.value = null;
        }
        // Reset dữ liệu form
        this.setState({
          selectedSpecialty: null,
          name: "",
          descriptionMarkdown: "",
          descriptionHTML: "",
          imageBase64: "",
          previewImgURL: "",
        });

        // Cập nhật lại list chuyên khoa
        const fetch = await getAllSpecialty();
        if (fetch && fetch.errCode === 0) {
          let dataSelect = fetch.data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          this.setState({ listSpecialty: dataSelect });
        }
      } else {
        toast.error(
          this.props.intl.formatMessage({
            id: "admin.manage-doctor.toast-deleteError",
          })
        );
      }
    } catch (e) {
      console.error(e);
      toast.error(
        this.props.intl.formatMessage({
          id: "admin.manage-doctor.toast-deleteError",
        })
      );
    }
  };

  handleChangeSelect = async (selectedSpecialty) => {
    this.setState({ selectedSpecialty });

    let res = await getDetailSpecialtyById(selectedSpecialty.value);
    if (res && res.errCode === 0) {
      const { name, descriptionMarkdown, descriptionHTML, image } = res.data;

      this.setState({
        name: name,
        descriptionMarkdown: descriptionMarkdown || "",
        descriptionHTML: descriptionHTML || "",
        imageBase64: image || "",
        previewImgURL: image?.startsWith("data:image")
          ? image
          : `data:image/jpeg;base64,${image}`,
      });
    }
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionMarkdown: text,
      descriptionHTML: html,
    });
  };

  handleOnChangeImage = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let base64 = await this.toBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        imageBase64: base64,
      });
    }
  };

  toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  handleSave = async () => {
    let {
      selectedSpecialty,
      name,
      descriptionHTML,
      descriptionMarkdown,
      imageBase64,
    } = this.state;
    if (!selectedSpecialty) {
      toast.error(
        this.props.intl.formatMessage({
          id: "admin.manage-doctor.toast-chooseSpecialty",
        })
      );
      return;
    }
    let res = await updateSpecialtyService({
      id: selectedSpecialty.value,
      name,
      descriptionHTML,
      descriptionMarkdown,
      image: imageBase64,
    });

    if (res && res.errCode === 0) {
      toast.success(
        this.props.intl.formatMessage({
          id: "admin.manage-doctor.toast-saveSuccess",
        })
      );
      if (this.fileInputRef.current) {
        this.fileInputRef.current.value = null;
      }
      this.setState({
        selectedSpecialty: null,
        name: "",
        descriptionMarkdown: "",
        descriptionHTML: "",
        imageBase64: "",
        previewImgURL: "",
      });
    } else {
      toast.error(
        this.props.intl.formatMessage({
          id: "admin.manage-doctor.toast-saveError",
        })
      );
    }
  };

  render() {
    return (
      <div className="manage-specialty container mt-4">
        <h4 className="ms-title mb-1">
          <FormattedMessage id="admin.manage-doctor.manage-infor-specialty" />
        </h4>
        <div className="row">
          <div className="col-6 form-group mt-3">
            <label className="form-label">
              <FormattedMessage id="admin.manage-doctor.chooseSpecialty" />
            </label>
            <Select
              value={this.state.selectedSpecialty}
              onChange={this.handleChangeSelect}
              options={this.state.listSpecialty}
            />
          </div>

          <div className="col-3 form-group mt-3">
            <label className="form-label">
              <FormattedMessage id="admin.manage-doctor.imageSpecialty" />
            </label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => this.handleOnChangeImage(e)}
              ref={this.fileInputRef}
            />
            {this.state.previewImgURL && (
              <img
                src={this.state.previewImgURL}
                alt="Ảnh chuyên khoa"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginTop: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            )}
          </div>
        </div>

        <div className="form-group mt-3">
          <label className="form-label">
            <FormattedMessage id="admin.manage-doctor.desSpecialty" />
          </label>
          <MdEditor
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.descriptionMarkdown}
          />
        </div>

        <button onClick={this.handleSave} className="btn btn-warning mt-4 me-4">
          <FormattedMessage id="admin.manage-doctor.save" />
        </button>
        <button
          onClick={this.handleDelete}
          className="btn btn-danger mt-4"
          disabled={!this.state.selectedSpecialty}
        >
          <FormattedMessage id="admin.manage-doctor.delete" />
        </button>
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

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(ManageInforSpecialty)
);
