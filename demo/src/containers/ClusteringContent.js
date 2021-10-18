import React from 'react'
import Plot from 'react-plotly.js'
import { useState, useEffect } from 'react'



const ClusteringContent = () => {
    const [traces, setTraces] = useState()
    
    //use this to fetch data from api NOTE: this will call AFTER the first rendering ==> need a method to wait for calling fetch function before render
    useEffect(()=>{
        fetchData();
    },[])

    //async function help to prevent calling useEffect multiple time
    const fetchData = async () =>{
        let response = await fetch('http://androdamous:8090/cluster/get')
        let data = await response.json()
        setTraces(data.map((item) => ({x:item.x,y:item.y,z:item.z,type:"scatter3d",mode:"markers", name:"cluster " + (parseInt(item.label) + 1)})))
    }
    
    return (
        <Plot
            data={traces}
            layout={{
                width: 1000,
                height: 1000,
                title: `Customer Segementation Visuallization`
            }}
        />
    )
}

export default ClusteringContent
