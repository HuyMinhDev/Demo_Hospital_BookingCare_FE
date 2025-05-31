import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { FormattedMessage, injectIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  getAllHandbook,
  getDetailHandbookByIdNew,
  updateHandbookService,
  deleteHandbookService,
} from "../../../services/userService";

import "./ManageInforHandbook.scss";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

class ManageInforHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listHandbook: [],
      selectedHandbook: null,
      name: "",
      descriptionMarkdown: "",
      descriptionHTML: "",
      imageBase64: "",
      previewImgURL: "",
    };
    this.fileInputRef = React.createRef();
  }

  async componentDidMount() {
    await this.fetchHandbookList();
  }

  fetchHandbookList = async () => {
    const res = await getAllHandbook();
    if (res && res.errCode === 0) {
      const dataSelect = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      this.setState({ listHandbook: dataSelect });
    }
  };

  handleChangeSelect = async (selectedHandbook) => {
    this.setState({ selectedHandbook });

    const res = await getDetailHandbookByIdNew(selectedHandbook.value);
    if (res && res.errCode === 0) {
      const { name, descriptionMarkdown, descriptionHTML, image } = res.data;
      let previewImgURL = "";
      if (image) {
        previewImgURL = image.startsWith("data:image")
          ? image
          : `data:image/jpeg;base64,${image}`;
      }

      this.setState({
        name: name || "",
        descriptionMarkdown: descriptionMarkdown || "",
        descriptionHTML: descriptionHTML || "",
        imageBase64: image || "",
        previewImgURL: previewImgURL,
      });
    }
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionMarkdown: text,
      descriptionHTML: html,
    });
  };

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  handleOnChangeImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await this.toBase64(file);
      const objectUrl = URL.createObjectURL(file);

      this.setState({
        imageBase64: base64,
        previewImgURL: objectUrl,
      });
    }
  };

  handleReset = () => {
    this.setState({
      selectedHandbook: null,
      name: "",
      descriptionMarkdown: "",
      descriptionHTML: "",
      imageBase64: "",
      previewImgURL: "",
    });

    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = null;
    }
  };

  handleSave = async () => {
    const {
      selectedHandbook,
      name,
      descriptionHTML,
      descriptionMarkdown,
      imageBase64,
    } = this.state;
    const { intl } = this.props;

    if (!selectedHandbook) {
      toast.error(
        intl.formatMessage({ id: "admin.manage-handbook.toast-chooseHandbook" })
      );
      return;
    }

    const res = await updateHandbookService({
      id: selectedHandbook.value,
      name,
      descriptionHTML,
      descriptionMarkdown,
      image: imageBase64,
    });

    if (res && res.errCode === 0) {
      toast.success(
        intl.formatMessage({ id: "admin.manage-doctor.toast-saveSuccess" })
      );
      this.handleReset();
      await this.fetchHandbookList();
    } else {
      toast.error(
        intl.formatMessage({ id: "admin.manage-doctor.toast-saveError" })
      );
    }
  };

  handleDelete = async () => {
    const { selectedHandbook } = this.state;
    const { intl } = this.props;

    if (!selectedHandbook) return;

    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xoá cẩm nang "${selectedHandbook.label}" không?`
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteHandbookService(selectedHandbook.value);
      if (res && res.errCode === 0) {
        toast.success(
          intl.formatMessage({
            id: "admin.manage-doctor.toast-deleteSuccess",
          })
        );
        this.handleReset();
        await this.fetchHandbookList();
      } else {
        toast.error(
          intl.formatMessage({ id: "admin.manage-doctor.toast-deleteError" })
        );
      }
    } catch (e) {
      console.error(e);
      toast.error(
        intl.formatMessage({ id: "admin.manage-doctor.toast-deleteError" })
      );
    }
  };

  render() {
    const {
      listHandbook,
      selectedHandbook,
      name,
      descriptionMarkdown,
      previewImgURL,
    } = this.state;

    return (
      <div className="manage-handbook container mt-4">
        <h4 className="ms-title mb-1">
          <FormattedMessage id="admin.manage-handbook.manage-infor-handbook" />
        </h4>

        <div className="row">
          <div className="col-6 form-group mt-3">
            <label className="form-label">
              <FormattedMessage id="admin.manage-handbook.chooseHandbook" />
            </label>
            <Select
              value={selectedHandbook}
              onChange={this.handleChangeSelect}
              options={listHandbook}
            />
          </div>

          <div className="col-3 form-group mt-3">
            <label className="form-label">
              <FormattedMessage id="admin.manage-handbook.image-handbook" />
            </label>
            <input
              type="file"
              className="form-control"
              onChange={this.handleOnChangeImage}
              ref={this.fileInputRef}
            />
            {previewImgURL && (
              <img
                src={previewImgURL}
                alt="Ảnh cẩm nang"
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
            <FormattedMessage id="admin.manage-handbook.description-handbook" />
          </label>
          <MdEditor
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={descriptionMarkdown}
          />
        </div>

        <button onClick={this.handleSave} className="btn btn-warning mt-4 me-4">
          <FormattedMessage id="admin.manage-handbook.save" />
        </button>
        <button
          onClick={this.handleDelete}
          className="btn btn-danger mt-4"
          disabled={!selectedHandbook}
        >
          <FormattedMessage id="admin.manage-handbook.delete" />
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
});

export default injectIntl(connect(mapStateToProps)(ManageInforHandbook));
