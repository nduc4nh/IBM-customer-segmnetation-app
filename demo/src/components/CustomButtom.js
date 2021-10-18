import React from 'react'
import {Button} from 'react-bootstrap'
const CustomButtom = ({ id,func }) => {
    const onHandle =()=>{
        func(id)
    }
    return (
        <Button key={id} style={{ flexGrow: "1" }} onClick={onHandle}>
            Suggest
        </Button>
    )
}

export default CustomButtom
