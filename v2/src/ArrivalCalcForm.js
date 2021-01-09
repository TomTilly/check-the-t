import React, { Component } from 'react';
import './ArrivalCalcForm.css';

class ArrivalCalcForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stop: '',
      line: '',
      dir: '',
    };
  }

  render() {
    const { stop, line, dir } = this.state;
    return (
      <form className="ArrivalCalcForm hero__form">
        <div className="ArrivalCalcForm__stop form-group">
          <input
            name="stop"
            type="text"
            value={stop}
            className="ArrivalCalcForm__stop-input form-group__control"
          />
        </div>
        <div className="ArrivalCalcForm__line form-group">
          <select
            name="line"
            value={line}
            className="ArrivalCalcForm__line-input form-group__control"
          >
            <option value="1...">Val 1</option>
            <option value="2...">Val 2</option>
          </select>
          <div className="form-group__arrow" />
        </div>
        <div className="ArrivalCalcForm__dir form-group">
          <select
            name="direction"
            value={dir}
            className="ArrivalCalcForm__dir-input form-group__control"
          >
            <option value="1...">Val 1</option>
            <option value="2...">Val 2</option>
          </select>
          <div className="form-group__arrow" />
        </div>
      </form>
    );
  }
}

export default ArrivalCalcForm;
