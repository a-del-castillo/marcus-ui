import React from "react";
import ClearIcon from '@mui/icons-material/Clear';
import { formatPrice } from "../actions/index.js"

const CartEntry = (props) => {
    const {data, index, type, handleRemoveFromCart} = props
    const name = type === "configs" ? `Build ${index + 1}` : data.name;
    const price = formatPrice(data.price);
    const quantity = (type !== "config" && data.quantity > 1) ? ` (x${data.quantity})` : '' 
    
    return (
        <label className="title-with-icon button">
            <ClearIcon fontSize="small" className="delete-color" data-type={type} data-index={index} onClick={handleRemoveFromCart} />
            <span>{name}{quantity} - {price}</span>
        </label>
    )
}

export default CartEntry;
