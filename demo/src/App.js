import ItemCard from './components/ItemCard.js';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import Recommend from './containers/Recommend.js';
import Home from './containers/Home.js';
import ClusteringPage from './containers/ClusteringPage.js';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact component={Home} path="/"></Route>
        <Route exact component={Recommend} path="/recommend"></Route>
        <Route exact component={Recommend} path="/recommend"></Route>
        <Route exact component={ClusteringPage} path="/clustering"></Route>
        <Route exact component={Home} path="/content-based"></Route>
      </Switch>
    </Router>

  );
}

export default App;
