import React from 'react'
import { Card } from 'react-bootstrap'

const CardSugestion = ({item}) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={"s"} />
            <Card.Body>
                <Card.Title>{item["Product"]}</Card.Title>
                <Card.Subtitle>{item["Category"]}</Card.Subtitle>
                <Card.Text>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default CardSugestion
