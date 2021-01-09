import React, { Component } from 'react';
import Hero from './Hero';
import ArrivalCalcForm from './ArrivalCalcForm';
import subwaySrc from './subway.svg';
import './ArrivalCalc.css';

class ArrivalCalc extends Component {
  render() {
    return (
      <div className="ArrivalCalc">
        <Hero background="#F2F9FB">
          <div className="hero">
            <h1 className="hero__title">
              Find the next arrival of your train or bus
            </h1>
            <ArrivalCalcForm />
            <img
              src={subwaySrc}
              alt="Cartoon illustration of subway station"
              className="hero__img"
            />
          </div>
        </Hero>
      </div>
    );
  }
}

export default ArrivalCalc;
