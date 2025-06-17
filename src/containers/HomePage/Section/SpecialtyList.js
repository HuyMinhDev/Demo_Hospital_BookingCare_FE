import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class SpecialtyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleItems: [],
    };
    this.timer = null;
  }

  componentDidMount() {
    this.animateItems(this.props.data);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      clearInterval(this.timer);
      this.setState({ visibleItems: [] }, () => {
        this.animateItems(this.props.data);
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  animateItems = (data) => {
    let index = 0;
    this.timer = setInterval(() => {
      if (index < data.length) {
        this.setState((prevState) => ({
          visibleItems: [...prevState.visibleItems, data[index]],
        }));
        index++;
      } else {
        clearInterval(this.timer);
      }
    }, 150);
  };

  handleClick = (id, type) => {
    let path = "/";
    if (type === "specialty") path = `/detail-specialty/${id}`;
    else if (type === "doctor") path = `/detail-doctor/${id}`;
    else if (type === "clinic") path = `/detail-clinic/${id}`;

    this.props.history.push(path);
  };

  render() {
    const { visibleItems } = this.state;
    const { data } = this.props;
    const isDataEmpty = !data || data.length === 0;
    return (
      <div
        className="search-list-group mt-2"
        style={
          visibleItems.length > 3
            ? { maxHeight: "250px", overflowY: "auto" }
            : {}
        }
      >
        {isDataEmpty ? (
          <div className="title-item text-muted">Không có kết quả...</div>
        ) : (
          visibleItems.map((item, i) => {
            let typeLabel = "";
            if (item.type === "doctor") typeLabel = "[Bác sĩ]";
            else if (item.type === "clinic") typeLabel = "[Phòng khám]";
            else if (item.type === "specialty") typeLabel = "[Chuyên khoa]";

            return (
              <div
                key={i}
                className="search-list-item d-flex align-items-center gap-3"
                onClick={() => this.handleClick(item.id, item.type)}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                )}
                <span>
                  {typeLabel} {item.name}
                </span>
              </div>
            );
          })
        )}
      </div>
    );
  }
}

export default withRouter(SpecialtyList);
