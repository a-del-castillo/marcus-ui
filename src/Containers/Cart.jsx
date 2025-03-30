import React, { useState } from "react";
import { formatPrice } from "../actions/index.js"
import CartEntry from "../Components/CartEntry.jsx"
import { Payment } from "@mui/icons-material";
import axios from "axios";


const Cart = (props) => {
    const { backEndRoot, loginData, isLogged, setCartData, cartData } = props;
    const [totalPrice, setTotalPrice] = useState(0);

    const configsTotal = cartData?.configs.map(a => parseFloat(a.price)).reduce((partialSum, a) => partialSum + a, 0)
    const partsTotal = cartData?.parts.map(a => parseFloat(a.price)).reduce((partialSum, a) => partialSum +a, 0)

    const hoverText = `Configs cost: ${formatPrice(configsTotal)}\nParts cost: ${formatPrice(partsTotal)}`

    const handleRemoveFromCart = (e) => {
        const type = e.currentTarget.attributes['data-type'].value
        const index = e.currentTarget.attributes['data-index'].value
        const tmpList = type === 'parts' ? cartData.parts : cartData.configs

        tmpList.splice(index, 1)
        
        setCartData({
            ...cartData,
            [type]:tmpList
        })
    }

    if (localStorage.token && localStorage.token !== "null" && !isLogged) {
        // fetchLoggedInUser()
    }

    const handleOnClickPay = async (e) => {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
        }

        const formattedConfigs = []
        cartData.configs.forEach( (tmpConfig) =>{
            const tmpPartsList = tmpConfig.parts.map(part => parseInt(part.id, 10))
            tmpConfig.parts = tmpPartsList
            formattedConfigs.push(tmpConfig)
        })
        const order = {
            "status": "paid",
            "parts_ids": cartData.parts.map(part => part.id),
            "configs": formattedConfigs
        }
        
        console.log(order)

        const result = await axios.post(`${backEndRoot}/api/v1/orders`, { order }, { headers });
        console.log('result', result)
        if (result.status === 200) {
            alert("Order completed!");
            setCartData({
                configs:[],
                parts: []
            })
        } else {
            alert("Error... try again in a few minutes")
        }
    }  

    return (
        <div className="Cart-wrapper">
            <h3>Cart</h3>
            <div className="cart-detail-wrapper">
                <div className="cart-detail cart-detail-configs">
                    {cartData.configs && cartData.configs.map((data, index) => (
                            <CartEntry
                                key={index}
                                index={index}
                                type="configs"
                                data={data}
                                setTotalPrice={setTotalPrice}
                                totalPrice={totalPrice}
                                handleRemoveFromCart={handleRemoveFromCart}
                            />          
						))
					}
                </div>
                <div className="cart-detail cart-detail-parts">
                {cartData.parts && cartData.parts.map((data, index) => (
                            <CartEntry
                                key={index}
                                index={index}
                                type="parts"
                                data={data}
                                setTotalPrice={setTotalPrice}
                                totalPrice={totalPrice}
                                handleRemoveFromCart={handleRemoveFromCart}
                            />                         
						))
					}
                </div>
            </div>
            {/*
            <hr />
            <div className="cart-detail-wrapper">
                <div className="cart-detail cart-detail-configs">
                    {configsTotal > 0 && (<>Total Configs: {formatPrice(configsTotal)}</>)}
                </div>
                <div className="cart-detail cart-detail-parts">
                    {partsTotal > 0 && (<>Total Parts: {formatPrice(partsTotal)}</>)}
                </div>
            </div>
            */}
            <hr />
            <div className="cart-detail-wrapper" title={hoverText}>
                <span>TOTAL {formatPrice(configsTotal + partsTotal)}</span>
                <label className="title-with-icon button edit-color process-payment" onClick={handleOnClickPay}>
                    <Payment fontSize="medium" />
                        Process order
                </label>
            </div>
        </div>
    );

}

export default Cart;
