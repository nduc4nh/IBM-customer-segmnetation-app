import React from 'react'
import { Container, Row, Toast } from 'react-bootstrap'
import { useState, useEffect} from 'react'
import { Pagination, Table } from 'react-bootstrap';
import UserList from '../components/UserList';
import ItemCard from '../components/ItemCard';
import RowList from '../components/RowList';
import CardSugestion from '../components/CardSugestion';


const numberPerPage = 15;
const fetchAPI = async (id) =>{
    return  fetch('http://androdamous:8090/recommend/'+id)
}
export const AnalyticRecommend = ({users}) => {
    const [show, setshow] = useState(false)
    
    const [suggestion, setSuggestion] = useState()

    const [page, setPage] = useState(1)
    let index = (page - 1) * numberPerPage;
    const num = users.length;
    const [shownUser, setShownUser] = useState(users.slice(index, Math.min(num, index + numberPerPage)))

    const totalPageNum = parseInt((num) / numberPerPage) + 1;


    const nextPage = (e) => {
        let start = page
        let end = page + 1;
        setPage(end)
        setShownUser(users.slice(start * numberPerPage, Math.min(end * numberPerPage, num)))

    }

    const prevPage = (e) => {
        let end = page - 1;
        let start = page - 2;
        setPage(end)
        setShownUser(users.slice(start * numberPerPage, Math.min(end * numberPerPage, num)))

    }
    
    

    const onSetShow = async (id)=>{
        if (!show) {
            setshow(!show)
            let res = await fetchAPI(id)
            let data = await res.json()
            setSuggestion(data)
        }
    }

    

    

    const toggleShow = () => {
        setshow(!show)
    }
    return (
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <div style={{ width: "20%", height: "100%" }}>

                <Container style={{ display: "flex", height: "98%" }}>
                    <UserList users={shownUser} onSetShow={onSetShow}/>
                </Container>

                <Pagination style={{ justifyContent: "flex-end", marginRight: "10%" }}>
                    {(page !== 1) ? <Pagination.Prev onClick={prevPage} /> : <></>}
                    <Pagination.Item>
                        Page {page} of {totalPageNum}
                    </Pagination.Item>
                    {(page !== totalPageNum) ? <Pagination.Next onClick={nextPage} /> : <></>}
                </Pagination>
            </div>
            <div>
                <Toast show={show} onClose={toggleShow} style={{ width: "80%" }}>
                    <Toast.Header>
                        Suggestion
                    </Toast.Header>
                    <Toast.Body>
                        
                        { suggestion && <Row>{suggestion.map((item) => (<CardSugestion item={item}/>))} </Row>}  
                        
                    </Toast.Body>
                </Toast>
            </div>
            {show?<></>:
            <div style={{margin:"15px"}}>
                
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td colSpan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </Table>
            </div>}
        </div>
    )
}
export default AnalyticRecommend