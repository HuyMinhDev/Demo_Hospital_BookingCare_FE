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

  handleClick = (id) => {
    this.props.history.push(`/detail-specialty/${id}`);
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
          visibleItems.map((item, i) => (
            <div
              key={i}
              className="search-list-item d-flex align-items-center gap-3"
              onClick={() => this.handleClick(item.id)}
            >
              {item.image && <img src={item.image} alt={item.name} />}
              <span>{item.name}</span>
            </div>
          ))
        )}
      </div>
    );
  }
}

export default withRouter(SpecialtyList);
