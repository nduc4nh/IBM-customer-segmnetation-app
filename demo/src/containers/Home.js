import BNavbar from '../components/BNavbar.js'
import ItemCard from '../components/ItemCard.js';
import Sidebar from '../components/Sidebar.js';
import OrderPage from '../containers/OrderPage';
import { BrowserRouter as Router, Link, Route, Switch} from  'react-router-dom';
import Recommend from '../containers/Recommend.js';


function Home() {
  return (
    <Router>
    <div>
      <div>
        <BNavbar />
        </div>
        <div style ={{display:"flex", flexDirection:"row"}}>
        <Sidebar />
        <OrderPage/>
        </div>
    </div>
    </Router>

  );
}

export default Home;
