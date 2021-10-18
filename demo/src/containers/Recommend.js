import React from 'react'
import BNavbar from '../components/BNavbar.js'
import ItemCard from '../components/ItemCard.js';
import Sidebar from '../components/Sidebar.js';
import OrderPage from '../containers/OrderPage';
import { BrowserRouter as Router, Link, Route, Switch} from  'react-router-dom';
import { AnalyticRecommend } from './AnalyticRecommend.js';
import { useState, useEffect } from 'react';
const Recommend = () => {
    const [users, setUsers] = useState()
    useEffect(() =>{fetchData();
    }, [])

    const fetchData = async () =>{
        let response = await fetch('http://androdamous:8090/user/get')
        let data = await response.json()
        setUsers(data)
        console.log(data);
    }
    return (
        <Router>
            <div>
                <div>
                    <BNavbar />
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <Sidebar />
                    {users && <AnalyticRecommend users = {users}/>}
                </div>
            </div>
        </Router>
    )
}

export default Recommend
