import React from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { ListGroup, Button } from 'react-bootstrap'
import '../components/Effect.css'
import CustomButtom from './CustomButtom'
const UserList = ({ users,onSetShow}) => {
    

    return (
        <div style={{ width: "100%", margin:"5%"}}>
            <ListGroup >
                {users.map((user) => (<ListGroup.Item className="cursor" o  style={{width:"100%"}}>
                    <div style={{ width:"100%",display:"flex",flexDirection:"row"}}>
                        <div style={{flexGrow:"1"}}>
                            <AiOutlineUser />
                            {user["id"]}
                        </div>
                        <div style={{}}>
                            <CustomButtom id={user["id"]}  func={onSetShow}/>
                        </div>
                    </div>
                </ListGroup.Item>))}
            </ListGroup>
        </div>
    )
}

export default UserList
