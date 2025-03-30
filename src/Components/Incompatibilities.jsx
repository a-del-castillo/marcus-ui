import React from "react";
import { Delete } from "@mui/icons-material";

const Incompatibilities = (props) => {
    const {_fullPart, userRole, handleRemoveIncompatibility } = props
    const retValue = []
    _fullPart?.incompatibilities.forEach((incompatible) => {
        const title = incompatible.part_1.id === _fullPart.part.id ? `${incompatible.part_2.name} (${incompatible.part_2.category})` : `${incompatible.part_1.name} (${incompatible.part_1.category})`
        const id = incompatible.part_1.id === _fullPart.part.id ? incompatible.part_2.id : incompatible.part_1.id
        if (userRole === 'admin') {
            retValue.push(<span key={`span_inc_${id}`} className="incompatibility-label-wrapper"><label className="title-with-icon button delete-color" onClick={handleRemoveIncompatibility} id={`lbl_${id}`} ><Delete fontSize="medium"></Delete></label>{title}<br/></span>)
        } else {
            retValue.push(<span key={`span_inc_${id}`}>{title}<br/></span>)
        }
    })
 
    return (<>{retValue}</>)   
}

export default Incompatibilities;
