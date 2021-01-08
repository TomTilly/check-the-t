import './App.css';
import { Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import ArrivalCalc from './ArrivalCalc';
import About from './About';
import NotFound from './NotFound';
import MainWrapper from './MainWrapper';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <MainWrapper fullWidth>
              <ArrivalCalc />
            </MainWrapper>
          )}
        />
        <Route
          exact
          path="/about"
          render={() => (
            <MainWrapper background="#F2F9FB">
              <About />
            </MainWrapper>
          )}
        />
        <Route
          render={() => (
            <MainWrapper>
              <NotFound />
            </MainWrapper>
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
