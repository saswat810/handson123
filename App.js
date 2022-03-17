import React, { Component } from 'react';
import "./App.css"

class Home extends Component {

  state = {
    show: false,
    data: [],
    rating: 1,
  }
  componentDidMount = () => {
    // Write your code here
    this.handleGetData();
  }

  handleGetData = async () => {
    // Write your code here
    const response = await fetch("http://localhost:8001/courses/get");
    let gotResponse = await response.json();
    if (gotResponse.length) {
      await this.setState({ data: gotResponse })
    }
  }

  handleApply = async (id) => {
    // Write your code here
    await fetch(`http://localhost:8001/courses/enroll/${id}`, {
      method: "post",
      headers: { "Content-Type": "application/json" }
    });
    this.handleGetData();

  };

  handleRating = async (e) => {
    // Write your code here
    await this.setState({ rating: e.target.value })
  }

  handleAddRating = async (id) => {
    // Write your code here
    await fetch(`http://localhost:8001/courses/rating/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: this.state.rating })//"{\"rating\":1}",
    })
    this.handleGetData();

  }

  handleDrop = async (id) => {
    await fetch(`http://localhost:8001/courses/drop/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    this.handleGetData();

  }

  render() {
    return (
      <div className="home">
        <header>
          <h2>ABC Learning</h2>
        </header>
        {/* write your code here */}
        <div className="cardContainer">
          {this.state.data.map((data) => (
            <div className="card">
              <ul>
                <div className="header">
                  <li>{data.courseName}</li>
                  <li>{data.courseDept}</li>
                  <li>{data.description}</li>
                  {data.isApplied &&
                    <li>
                      {!data.isRated &&
                        <li>Rate:
                          <select className="rating" name="rating" onChange={this.handleRating}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                          <button className="rate" onClick={this.handleAddRating.bind(this, data._id)}>Add</button>
                        </li>}
                      <button className="drop" onClick={this.handleDrop.bind(this, data._id)}>Drop Course</button>
                    </li>}
                  {!data.isApplied && <li><button className="btn" onClick={this.handleApply.bind(this, data._id)}>Apply</button></li>}
                </div>
                <div className="footer">
                  <li>{`${data.duration} hrs . ${data.noOfRatings} Ratings . ${data.rating}/5`}</li>
                </div>
              </ul>
            </div>
          ))}

        </div>
      </div>
    );
  }
}

export default Home;