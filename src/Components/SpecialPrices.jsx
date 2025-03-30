import React, { useState } from "react";
import { Delete } from "@mui/icons-material";
import { formatPrice } from "../actions/index.js"

const SpecialPrices = (props) => {
    const {_fullPart, userRole, handleRemoveSpecialPrice } = props
    const retValue = []
    
    _fullPart?.pricemodifiers.map((pricemod) => {
        const title = `${formatPrice(pricemod.price)} when paired with ${pricemod.variator_part.name} (${pricemod.variator_part.category})`
        const id = pricemod.variator_part.id
        if (userRole === 'admin') {
            retValue.push(<span key={`span_spp_${id}`} className="incompatibility-label-wrapper"><label className="title-with-icon button delete-color" onClick={handleRemoveSpecialPrice} id={`lblspp_${id}`} ><Delete fontSize="medium"></Delete></label>{title}<br/></span>)
        } else {
            retValue.push(<span key={`span_spp_${id}`}>{title}<br/></span>)
        }
    })

    return (retValue)
}

export default SpecialPrices;