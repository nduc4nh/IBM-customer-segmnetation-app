import React from 'react'
import BNavbar from '../components/BNavbar.js'
import ItemCard from '../components/ItemCard.js';
import Sidebar from '../components/Sidebar.js';
import OrderPage from '../containers/OrderPage';
import { BrowserRouter as Router, Link, Route, Switch} from  'react-router-dom';
import ClusteringContent from './ClusteringContent'
import CardContent from '../components/CardContent.js';
const ClusteringPage = () => {
    return (
        <Router>
            <div>
                <div>
                    <BNavbar />
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <Sidebar />
                    <ClusteringContent/>
                    <div style={{display:"flex", flexDirection: "column"}}>
                    <CardContent title="Cluster 1" desscribe="something"/>
                    <CardContent title="Cluster 2" desscribe="something"/>
                    <CardContent title="Cluster 3" desscribe="something"/>
                    <CardContent title="Cluster 4" desscribe="something"/>    
                    </div>
                </div>
            </div>
        </Router>
    )
}

export default ClusteringPage
