import React, { useState, useEffect } from "react";
import { ShoppingCart, DeleteForever, Add, Save } from "@mui/icons-material";
import { formatPrice } from "../actions/index.js"
import useFetch from "../actions/index.js"
import Incompatibilities from "./Incompatibilities"
import SpecialPrices from "./SpecialPrices.jsx"
import axios from "axios";

const PartModal = (props) => {
	const { backEndRoot, partData, setPartData, handleModalClose, userRole, parts, mode = 'edit', setShowModal, setParts, addToCart } = props
    const { data, loading } = useFetch(`${backEndRoot}/api/v1/parts/${partData.id}`);
    const [fullPart, setFullPart] = useState({});
    const [part, setPart] = useState(partData);
    const [selectedIncompatibility, setSelectedIncompatibility] = useState();
    const [selectedSpecialPricePart, setSelectedSpecialPricePart] = useState();
    const [selectedSpecialPrice, setSelectedSpecialPrice] = useState(0); 


    useEffect(() => {
        if (data) {
            setFullPart(data);
        }
    }, [data]);

    const reloadList = async () => {
        const response = await axios.get(`${backEndRoot}/api/v1/parts`);
        setParts(response.data)
    }

    const handleDeletePart = async (e) => {
		if (confirm(`Delete part ${part.name}?`)){
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.token}`,
            }
			await axios.delete(`${backEndRoot}/api/v1/parts/${partData.id}`, { headers });
			setShowModal(false);
            reloadList();
		}
	};

	const handleSave = async (e) => {
		const part = {
			...partData,
			incompatibilities:fullPart.incompatibilities || [],
			pricemodifiers:fullPart.pricemodifiers || []
		}
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
        }
        let response

        if (partData.id){
            // update
            response = await axios.patch(`${backEndRoot}/api/v1/parts/${partData.id}`, part, { headers });
        }else{
            //create
            response = await axios.post(`${backEndRoot}/api/v1/parts`, part, { headers });
            setPartData(response.data)
            setPart(response.data)
        }
        reloadList();
	};

    const handleChange = (e) => {
        const targetField = e.target.id.split('_')[1];
        const value = e.target.value
        setPartData({
            ...partData,
            [targetField]: value
        })
    };

    const handleOnChangeIncompatibility = (e) => {
		setSelectedIncompatibility(parseInt(e.target.value, 10))
	}

	const handleRemoveIncompatibility = (e) => {
		const id = parseInt(e.currentTarget.id.split('_')[1], 10)
		const incompatibilities = []
		fullPart.incompatibilities.forEach( (incompatibility) =>  {
			if (incompatibility.part_1.id !== id && incompatibility.part_2.id !== id) {
				incompatibilities.push(incompatibility)
			}
		})
		setFullPart({
			...fullPart,
			incompatibilities: incompatibilities
		})
	}

	const handleAddIncompatibility = (e) => {
        if ( !part.id ) {
            alert('Before adding incompatible parts save the part')
        } else {
            if (!selectedIncompatibility || selectedIncompatibility === 0) return null
            const incompatibilities = fullPart.incompatibilities || [];
            var alreadyThere = incompatibilities.filter(part => { return part.part_1.id === selectedIncompatibility || part.part_2.id === selectedIncompatibility }).length > 0 ? true : false
            if (alreadyThere) return null

            var incomPart = parts.filter(part => { return part.id === selectedIncompatibility })[0]
            incompatibilities.push({
                "part_1": {
                    "id": partData.id,
                    "name": partData.name,
                    "category": partData.category,
                },
                "part_2": {
                    "id":selectedIncompatibility,
                    "name": incomPart.name,
                    "category": incomPart.category,
                },
                "description": `${partData.name}/${incomPart.name}`,
            })

            setFullPart({
                ...fullPart,
                incompatibilities: incompatibilities
            })
        }
		
	}

	const handleSelectedSpecialPriceChange = (e) => {
		setSelectedSpecialPrice(parseInt(e.target.value, 10))
	};

	const handleOnChangeSpecialPrice = (e) => {
		setSelectedSpecialPricePart(parseInt(e.target.value, 10))
	}

	const handleRemoveSpecialPrice = (e) => {
		const id = parseInt(e.currentTarget.id.split('_')[1], 10)
		const pricemodifiers = []
		fullPart.pricemodifiers.forEach( (pricemod) =>  {
			if (pricemod.variator_part.id !== id) {
				pricemodifiers.push(pricemod)
			}
		})
		setFullPart({
			...fullPart,
			pricemodifiers: pricemodifiers
		})
	}
	 
	const handleAddSpecialPrice = (e) => {
		if ( !part.id ) {
            alert('Before adding special prices save the part')
        } else {
            if (!selectedSpecialPricePart || selectedSpecialPricePart === 0) return null
            const pricemodifiers = fullPart.pricemodifiers || [];

            var alreadyThere = pricemodifiers.filter(part => { return part.variator_part.id === selectedSpecialPricePart }).length > 0 ? true : false
            if (alreadyThere) return null

            var pricemodifierPart = parts.filter(part => { return part.id === selectedSpecialPricePart })[0]
            pricemodifiers.push({
                "main_part": {
                    "id": partData.id,
                    "name": partData.name,
                    "category": partData.category,
                },
                "variator_part": {
                    "id": selectedSpecialPricePart,
                    "name": pricemodifierPart.name,
                    "category": pricemodifierPart.category,

                },
                "price": selectedSpecialPrice
            })

            setFullPart({
                ...fullPart,
                pricemodifiers: pricemodifiers
            })
        }
	}

    const handleAddToCart = (e) => {
        addToCart(part, 'part')
        setShowModal(false)

    }

	return (
		<div className="part-modal modal-content-close" onClick={handleModalClose}>
            <div className="part-modal-content-wrapper">
                <a className="part-modal-content-close-icon modal-content-close" href="#">X</a>
                <div className="part-modal-content">
                    <div className="part-modal-content-details">
                        <span>Part name: { (userRole === 'admin') ? <input type="text" value={partData.name} onChange={handleChange} id="part_name" /> : <span>{partData.name}</span> }<br/></span>
                        <span>Price: { (userRole === 'admin') ?  <input type="text" value={partData.price} id="part_price" onChange={handleChange} /> : <span>{formatPrice(partData.price)}</span> }<br/></span>
                        <span>Availability: { (userRole === 'admin') ? (
                            <select id="part_available" className="part-selector" value={partData.available} onChange={handleChange}>
                                <option key="0" value="true">In stock</option>
                                <option key="1" value="false">Unavailable</option>
                            </select>
                        ) : ( partData.available ? "In stock" : "Temporarily out of stock" ) }<br/></span>
                        <span>Category: { (userRole === 'admin') ? <input type="text" value={partData.category} onChange={handleChange} id="part_category" /> : <span>{partData.category}</span> }<br/></span>
                        { partData.extra_props && Object.values(partData.extra_props).length > 0 && (<span>Details: {partData.extra_props}</span>)}<br/>
                        {(fullPart.incompatibilities && fullPart.incompatibilities?.length > 0) && (<div>
                            <span>Incompatible with:</span><br/>
                            { <Incompatibilities
                                handleRemoveIncompatibility={handleRemoveIncompatibility}
                                userRole={userRole}
                                _fullPart={fullPart}
                            />}
                        </div>)}
                        { (userRole === 'admin') && (
                            <div className="space-between-inline">
                                <span className="add-detail-text">Add Incompatibility with =&gt; </span>
                                <select className="part-selector detail-selector" value={selectedIncompatibility} onChange={handleOnChangeIncompatibility}>
                                <option key={'incompatible_0'} value={0}>Select incompatible part</option>
                                {
                                    
                                    parts.map((tmp_part) => (tmp_part.id !== part.id && (
                                        <option key={'incompatible_' + tmp_part.id} value={tmp_part.id}>{tmp_part.name}</option>
                                    )
                                ))}
                                </select>
                                <a href="#" className="title-with-icon button add-color add-detail-button" onClick={handleAddIncompatibility}>
                                    <Add fontSize="medium"></Add>
                                </a>
                            </div>
                        )}
                        {(fullPart?.pricemodifiers && fullPart?.pricemodifiers.length > 0) && (<div>
                            <span>Price detail:</span><br/>
                            { <SpecialPrices
                                handleRemoveSpecialPrice={handleRemoveSpecialPrice}
                                userRole={userRole}
                                _fullPart={fullPart}
                            />}
                        </div>)}
                        { (userRole === 'admin') && (
                            <div className="space-between-inline">
                                <span className="add-detail-text">Price changes when paired with =&gt; </span>
                                <select id="specialprice_parts" className="part-selector detail-selector" value={selectedSpecialPricePart} onChange={handleOnChangeSpecialPrice}>
                                    <option key={'specialprice_0'} value={0}>Select part</option>
                                {
                                    parts.map((tmp_part) => (tmp_part.id !== part.id && (
                                        <option key={'specialprice_' + tmp_part.id} value={tmp_part.id}>{tmp_part.name}</option>
                                    )
                                ))}
                                </select>
                                <span className="add-detail-text">&nbsp;to: </span> 
                                <input type="number" onChange={handleSelectedSpecialPriceChange} id="specialprice" value={selectedSpecialPrice} className="text-specialprice" />
                                <a href="#" className="title-with-icon button add-color add-detail-button" onClick={handleAddSpecialPrice}>
                                    <Add fontSize="medium"></Add>
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="add-part-to-cart space-between-flex">
                        {mode !== 'create' && (
                        <label className="title-with-icon button edit-color" onClick={handleAddToCart}>
                            <ShoppingCart fontSize="medium" />
                            Add to cart
                        </label>
                        )}
                        {(userRole === 'admin') && (
                            <label className="title-with-icon button delete-color" onClick={handleDeletePart}>
                                <DeleteForever fontSize="medium" />
                                Delete
                            </label>
                        )}
                        
                        {(userRole === 'admin') && (
                            <label className="title-with-icon button save-color" onClick={handleSave}>
                                <Save fontSize="medium" />
                                Save 
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
	);
};

export default PartModal;
