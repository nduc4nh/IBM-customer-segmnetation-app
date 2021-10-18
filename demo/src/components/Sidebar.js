import React from 'react'
import { Navigation } from 'react-minimal-side-navigation';

import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { BrowserRouter as Router, Route, Switch, Redirect} from  'react-router-dom';
import Recommend from '../containers/Recommend';
import { useHistory } from "react-router-dom";

const sideBarWidth = 240

const Sidebar = () => {
    const history = useHistory()
    return (
        <div style = {{background:"#f8f9fa",display:"flex",width:sideBarWidth}}>
        <Navigation 
            // you can use your own router's api to get pathname
            
            activeItemId="/management/members"
            
            onSelect={({ itemId }) => {
                // maybe push to the route
                //history.push(itemId)
                window.location.href = itemId
            }}

            items={[
                {
                    title: 'Recommend',
                    itemId: '/recommend',
                    // you can use your own custom Icon component as well
                    // icon is optional
                    //elemBefore: () => <Icon name="inbox" />,
                },
                {
                    title: 'Clustering',
                    itemId: '/clustering',
                },
                /*{
                    title: 'Content based',
                    itemId: '/content-based',
                }*/
            ]}
        />
        </div>
    )
}

export default Sidebar
