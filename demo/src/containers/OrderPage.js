import { render } from '@testing-library/react';
import React from 'react'
import { useState } from 'react'
import { Container } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import ItemCard from '../components/ItemCard';
import RowList from '../components/RowList';
import {Button} from 'react-bootstrap'


const productWithCate = {
    data: [
        {
            "id":"1",
            "title": "1",
            "src": "https://onlinejpgtools.com/images/examples-onlinejpgtools/coffee-resized.jpg",
            "check":false
        },
        {
            "id":"2",
            "title": "1",
            "src": "https://onlinejpgtools.com/images/examples-onlinejpgtools/coffee-resized.jpg",
            "check":false
        },
        {
            "id":"3",
            "title": "1",
            "src": "https://onlinejpgtools.com/images/examples-onlinejpgtools/coffee-resized.jpg",
            "check":false
        },
        {
            "id":"4",
            "title": "1",
            "src": "https://onlinejpgtools.com/images/examples-onlinejpgtools/coffee-resized.jpg",
            "check":false
        },
        {
            "id":"5",
            "title": "1",
            "src": "https://onlinejpgtools.com/images/examples-onlinejpgtools/coffee-resized.jpg",
            "check":false
        },
        {
            "id":"6",
            "title": "1",
            "src": "https://onlinejpgtools.com/images/examples-onlinejpgtools/coffee-resized.jpg",
            "check":true
        },
        {
            "id":"7",
            "title": "1",
            "src": "https://onlinejpgtools.com/images/examples-onlinejpgtools/coffee-resized.jpg",
            "check":false
        },

    ]
}

const numberPerPage = 6;

const OrderPage = () => {
    const [products, setProducts] = useState(productWithCate.data)

    const [chosenProducts, setChosenProducts] = useState([])

    const [page, setPage] = useState(1)
    let index = (page - 1) * numberPerPage;
    const num = productWithCate.data.length;
    const [shownItem, setShownItem] = useState(products.slice(index, Math.min(num, index + numberPerPage)))

    const totalPageNum = parseInt((num) / numberPerPage) + 1;


    const getFromShownItem = (start, end) => {
        return products.slice(start, end);
    }

    const nextPage = (e) => {
        let start = page
        let end = page + 1;
        setPage(end)
        setShownItem(products.slice(start*numberPerPage, Math.min(end*numberPerPage,num)))
    
    }

    const prevPage = (e) => {
        let end = page - 1;
        let start = page - 2;
        setPage(end)
        setShownItem(products.slice(start*numberPerPage, Math.min(end*numberPerPage,num)))
        
    }

    const chooseProduct = (id, check) =>{
        let tmp = [...products]
        let item = tmp.filter(ele =>(ele["id"] == id))[0]
        if (check){
            
            if (!chosenProducts.includes(item)){
                setChosenProducts([...chosenProducts,item])
            }
            item["check"] = true
            setProducts(tmp)
        }
        else{
            setChosenProducts(chosenProducts.filter((ele) => (ele["id"] != id)))
            item["check"] = false
        }
    }

    let itemEachRow = 3

    return (
        <Container style={{ height: "100%",width:"80%"}}>
            <Container>
                <RowList onCheckChange={chooseProduct} items={shownItem} from={0} to={Math.min(shownItem.length, itemEachRow)}/>
                <RowList onCheckChange={chooseProduct} items={shownItem} from={itemEachRow} to={Math.min(shownItem.length, itemEachRow*2)}/>
                <RowList onCheckChange={chooseProduct} items={shownItem} from={itemEachRow*2} to={Math.min(shownItem.length, itemEachRow*3)}/>
            </Container>

            <Container>
                <Button style={{alignSelf:'center'}}/>
                <Pagination style={{ justifyContent: "flex-end", marginRight:"20%"}}>
                    {(page !== 1) ? <Pagination.Prev onClick={prevPage} /> : <></>}
                    <Pagination.Item>
                        Page {page} of {totalPageNum}
                    </Pagination.Item>
                    {(page !== totalPageNum) ? <Pagination.Next onClick={nextPage} /> : <></>}
                </Pagination>
            </Container>
        </Container>
    )
}

export default OrderPage
