import React from 'react'
import { Row, Col } from 'react-bootstrap';
import ItemCard from './ItemCard';
const RowList = ({ items, from, to, onCheckChange }) => {
    return (
        <Row xs="auto">
            {items.slice(from, to).map(item => (<Col><ItemCard key={item["id"]}  item = {item}  onCheckChange={onCheckChange}/></Col>))}
        </Row>
    )
}

export default RowList
