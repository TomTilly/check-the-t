import React, { Component } from 'react';
import './ArrivalCalcForm.css';

class ArrivalCalcForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputs: [
        {
          name: 'stop',
          label: 'Stop name',
          type: 'text',
          value: '',
          hasFocus: false,
        },
        {
          name: 'line',
          label: 'Route',
          type: 'select',
          value: '',
          hasFocus: false,
        },
        {
          name: 'direction',
          label: 'Direction',
          type: 'select',
          value: '',
          hasFocus: false,
        },
      ],
    };
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleFocus(e) {
    this.setState((st) => {
      const newInputs = st.inputs.map((input) => {
        if (input.name === e.target.name) {
          return {
            ...input,
            hasFocus: true,
          };
        }
        return input;
      });
      return { inputs: newInputs };
    });
  }

  handleBlur(e) {
    this.setState((st) => {
      const newInputs = st.inputs.map((input) => {
        if (input.name === e.target.name) {
          return {
            ...input,
            hasFocus: false,
          };
        }
        return input;
      });
      return { inputs: newInputs };
    });
  }

  handleChange(e) {
    this.setState((st) => {
      const newInputs = st.inputs.map((input) => {
        if (input.name === e.target.name) {
          return {
            ...input,
            value: e.target.value,
          };
        }
        return input;
      });
      return { inputs: newInputs };
    });
  }

  render() {
    const { inputs } = this.state;
    const inputHtml = inputs.map((input) => {
      const isActive = input.value || input.hasFocus;
      let classes = 'ArrivalCalcForm__form-group form-group';
      classes += isActive ? ' form-group--active' : '';
      if (input.type === 'text') {
        return (
          <div className={classes} key={input.name}>
            <label className="form-group__label" htmlFor={input.name}>
              {input.label}
            </label>
            <input
              name={input.name}
              type="text"
              value={input.value}
              className="ArrivalCalcForm__form-control form-group__control"
              id={input.name}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </div>
        );
      }
      return (
        <div className={classes} key={input.name}>
          <label className="form-group__label" htmlFor={input.name}>
            {input.label}
          </label>
          <select
            name={input.name}
            value={input.value}
            className="ArrivalCalcForm__form-control form-group__control"
            id={input.name}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          >
            <option value="default"> </option>
            <option value="red-line">Red Line</option>
          </select>
          <div className="form-group__arrow" />
        </div>
      );
    });
    return <form className="ArrivalCalcForm hero__form">{inputHtml}</form>;
  }
}

export default ArrivalCalcForm;
