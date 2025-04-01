import React from "react";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import axios from "axios";

const UserOrders = (props) => {
    const { userOrders = [], handleUserModalClose, backEndRoot, retrieveUsersOrders } = props
    const paidOrders = [<span><h3>Paid Orders</h3></span>]
    const otherOrders = [<span><h3>Other Orders</h3></span>]
    const markOrderAsProcessed = async (e) =>{
        const id = parseInt(e.currentTarget.id.split('_')[1], 10)
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
        }
        const order = {
            "status": "processed"
        }
    
        await axios.patch(`${backEndRoot}/api/v1/orders/${id}`, { order }, { headers });
        retrieveUsersOrders()
    }

    userOrders.forEach((order, index) => {
        const title = `Order id ${order.id} Price: ${order.price}`
        const id = order.id
        if (order.status === 'paid')   {
            paidOrders.push(<span key={`span_order_${id}`} className="incompatibility-label-wrapper">{title}<label className="title-with-icon button add-color" onClick={markOrderAsProcessed} id={`lbl_${id}`} title="Set as processed" ><AssignmentTurnedInIcon fontSize="medium"></AssignmentTurnedInIcon></label><br/></span>)
        }else{
            otherOrders.push(<span key={`span_order_${id}`} className="incompatibility-label-wrapper">{title}<br/></span>)
        }
    })
 
    return (
        <div className="user-orders-modal modal-content-close" onClick={handleUserModalClose}>
            <div className="user-orders-modal-content-wrapper">
                <a className="part-modal-content-close-icon modal-content-close" href="#">X</a>
                <div className="user-orders-modal-content">
                    <div className="user-orders-content-details">
                        {paidOrders}
                        {otherOrders}
                    </div>
                </div>
            </div>
        </div>
    )   
}

export default UserOrders;
