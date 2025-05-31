import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageInforClinic.scss";
import Select from "react-select";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import {
  getAllClinic,
  getDetailClinicByIdNew,
  updateClinicService,
  deleteClinicService,
} from "../../../services/userService";
import { injectIntl } from "react-intl";
// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageInforClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listClinic: [],
      selectedClinic: null,
      name: "",
      address: "",
      descriptionMarkdown: "",
      descriptionHTML: "",
      imageBase64: "",
      previewImgURL: "",
    };
    this.fileInputRef = React.createRef();
  }

  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      let dataSelect = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      this.setState({ listClinic: dataSelect });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  handleDelete = async () => {
    const { selectedClinic } = this.state;
    if (!selectedClinic) return;

    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xoá phòng khám "${selectedClinic.label}" không?`
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteClinicService(selectedClinic.value);
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
          selectedClinic: null,
          name: "",
          address: "",
          descriptionMarkdown: "",
          descriptionHTML: "",
          imageBase64: "",
          previewImgURL: "",
        });

        // Cập nhật lại list chuyên khoa
        const fetch = await getAllClinic();
        if (fetch && fetch.errCode === 0) {
          let dataSelect = fetch.data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          this.setState({ listClinic: dataSelect });
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

  handleChangeSelect = async (selectedClinic) => {
    this.setState({ selectedClinic });

    let res = await getDetailClinicByIdNew(selectedClinic.value);
    if (res && res.errCode === 0) {
      const { name, address, descriptionMarkdown, descriptionHTML, image } =
        res.data;
      this.setState({
        name: name || "",
        address: address || "",
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
      selectedClinic,
      name,
      address,
      descriptionHTML,
      descriptionMarkdown,
      imageBase64,
    } = this.state;
    if (!selectedClinic) {
      toast.error(
        this.props.intl.formatMessage({
          id: "admin.manage-doctor.toast-chooseClinic",
        })
      );
      return;
    }
    let res = await updateClinicService({
      id: selectedClinic.value,
      name,
      address,
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
        selectedClinic: null,
        name: "",
        address: "",
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
          <FormattedMessage id="admin.manage-doctor.manage-infor-clinic" />
        </h4>
        <div className="row">
          <div className="col-6 form-group mt-3">
            <label className="form-label">
              <FormattedMessage id="admin.manage-doctor.chooseClinic" />
            </label>
            <Select
              value={this.state.selectedClinic}
              onChange={this.handleChangeSelect}
              options={this.state.listClinic}
            />
          </div>

          <div className="col-6 form-group mt-3">
            <label className="form-label">
              <FormattedMessage id="admin.manage-doctor.addressClinic" />
            </label>
            <input
              className="form-control"
              value={this.state.address}
              onChange={(e) => this.setState({ address: e.target.value })}
            />
          </div>

          <div className="col-3 form-group mt-3">
            <label className="form-label">
              <FormattedMessage id="admin.manage-doctor.imageClinic" />
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
                alt="Ảnh phòng khám"
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
            <FormattedMessage id="admin.manage-doctor.desClinic" />
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
          disabled={!this.state.selectedClinic}
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
  connect(mapStateToProps, mapDispatchToProps)(ManageInforClinic)
);
