import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageAbout.scss";
import { FormattedMessage } from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { toast } from "react-toastify";
import { saveVideoAbout, getAboutContent } from "../../../services/userService";

const mdParser = new MarkdownIt();

class ManageAbout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: "",
      videoLink: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      isEdit: false, // true nếu đã có dữ liệu
    };
  }

  async componentDidMount() {
    try {
      const res = await getAboutContent();
      if (res && res.errCode === 0 && res.data) {
        const { id, name, videoLink, descriptionHTML, descriptionMarkdown } =
          res.data;
        this.setState({
          id,
          name,
          videoLink,
          descriptionHTML,
          descriptionMarkdown,
          isEdit: true,
        });
      }
    } catch (e) {
      toast.error("Lỗi khi tải dữ liệu giới thiệu!");
    }
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnchangeInput = (event, id) => {
    this.setState({ [id]: event.target.value });
  };

  handleSaveAbout = async () => {
    const {
      id,
      name,
      videoLink,
      descriptionHTML,
      descriptionMarkdown,
      isEdit,
    } = this.state;

    const res = await saveVideoAbout({
      id,
      name,
      videoLink,
      descriptionHTML,
      descriptionMarkdown,
    });

    if (res && res.errCode === 0) {
      toast.success(
        isEdit ? "Cập nhật bài viết thành công!" : "Tạo bài viết thành công!"
      );
      this.setState({ isEdit: true });
    } else {
      toast.error("Lưu bài viết thất bại!");
    }
  };

  render() {
    const { name, videoLink, descriptionMarkdown, isEdit } = this.state;

    return (
      <div className="container manage-about-container">
        <h4 className="ms-title mb-1">
          <FormattedMessage
            id="admin.manage-about.title-about"
            defaultMessage="Quản lý giới thiệu"
          />
        </h4>

        <div className="add-new-about row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">
              <FormattedMessage
                id="admin.manage-about.name-about"
                defaultMessage="Tiêu đề"
              />
            </label>
            <input
              className="form-control"
              type="text"
              value={name}
              onChange={(e) => this.handleOnchangeInput(e, "name")}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <FormattedMessage
                id="admin.manage-about.video-link"
                defaultMessage="Đường dẫn video (YouTube)"
              />
            </label>
            <input
              className="form-control"
              type="text"
              value={videoLink}
              onChange={(e) => this.handleOnchangeInput(e, "videoLink")}
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">
            <FormattedMessage
              id="admin.manage-about.description"
              defaultMessage="Mô tả"
            />
          </label>
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={descriptionMarkdown}
          />
        </div>

        <div className="col-12">
          {isEdit ? (
            <button onClick={this.handleSaveAbout} className="btn  btn-warning">
              Lưu bài viết
            </button>
          ) : (
            <button onClick={this.handleSaveAbout} className="btn btn-primary">
              Tạo bài viết
            </button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
});

export default connect(mapStateToProps)(ManageAbout);
