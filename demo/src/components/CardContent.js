import React from 'react'
import {MdScatterPlot} from 'react-icons/md'
import {Card} from 'react-bootstrap'
const CardContent = ({title, desscribe}) => {
    return (
        <Card style={{ width: '18rem' ,margin:"10%"}}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted"><MdScatterPlot/></Card.Subtitle>
                <Card.Text>
                    {desscribe}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default CardContent
