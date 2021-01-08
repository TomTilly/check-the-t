import './App.css';
import { Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import ArrivalCalc from './ArrivalCalc';
import About from './About';
import NotFound from './NotFound';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/" component={ArrivalCalc} />
        <Route exact path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
