import React from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import { useState } from 'react'

const ItemCard = ({item, onCheckChange}) => {
    const [checked, setChecked] = useState(item["check"])
    const setCheck = () =>{
        setChecked(!checked)
        onCheckChange(item["id"],!checked)
    }

    return (
        <div style={{margin:"20px"}}>
            <Card style={{ width: '18rem'}}>
                <Card.Img variant="top" src={item["src"]} />
                <Card.Body>
                    <Card.Title>{item["title"]}</Card.Title>
                    <Card.Text>
                    </Card.Text>
                    
                    <Form.Check key={item["id"]} type="checkbox" label="Choose" onChange={setCheck} defaultChecked={checked}/> 
                </Card.Body>
            </Card>
        </div>
    )
}

export default ItemCard
