import React, { useState, useEffect } from "react";
import { ShoppingCart } from "@mui/icons-material";
import { formatPrice, usePost } from "../actions/index.js"
import axios from "axios"; 


const Configurator = (props) => {
    const { backEndRoot, addToCart } = props;
    const [error, setError] = useState(null);
    const [config, setConfig] = useState({})
    const [configIds, setConfigIds] = useState({ids:[]})
    const { data, loading } = usePost(`${backEndRoot}/api/v1/parts/available_parts`, configIds);
    const [parts, setParts] = useState([]);
    const [partPrices, setPartPrices] = useState({});
    const [categories, setCategories] = useState([]);
    
    const getPartPrice = async (part_id, partsIds) => {
        if (part_id === "0" ) return 0;   
        const response = await axios.get(`${backEndRoot}/api/v1/parts/${part_id}`);
        const tmpPart = response.data;
        let price = tmpPart.part.price
        tmpPart.pricemodifiers.map((pricemod) => {
            if (partsIds.includes(pricemod.variator_part.id + "")) {
                price = pricemod.price
            }
        })
        return price
    }

    const updatePrices = async () => {
        const partsIds = Object.values(config) 
        const tmpPartsPrices = []
        for (const part_id of partsIds) {
            const tmpPrice = await getPartPrice(part_id, partsIds)
            tmpPartsPrices.push({id: part_id, price: tmpPrice})
        }
        setPartPrices(tmpPartsPrices)
   }

    const formatCategories = (data) => {
		const tmpCategories = []
		data.forEach((part) => {
			if (!tmpCategories.includes(part.category)) {
				tmpCategories.push(part.category)
			}
		})
		setCategories(tmpCategories)
	}
    useEffect(() => {
        if (data) {
            setParts(data);
            formatCategories(data);
        }
        updatePrices()
    }, [data, configIds]);

    const handleChangeList = (e) => {
        setConfig({
            ...config,
            [e.target.name]: e.target.value,
        });
        
        setConfigIds({ids:Object.values({
            ...config,
            [e.target.name]: e.target.value,
        })})
    }
    const handleAddToCart = (e) => {
        if( partPrices.length === 0 ) return
        const tmpConfig = {
            price: partPrices?.map(a => parseFloat(a.price)).reduce((partialSum, a) => partialSum + a, 0).toFixed(2), 
            parts: []
        }
        
        Object.values(config).forEach( (part_id, index) =>  {
            tmpConfig.parts.push({id: part_id, "name": part_id, quantity: 1, price: partPrices[index].price})
        })
        
        addToCart(tmpConfig, 'config')
    };


    const Category = (props) => {
        const { category } = props;
        const optionList = [<option key="0" value="0">Select {category}</option>]
        const price = partPrices.find((element) => element.id === config[category])?.price
        parts.forEach(part => {
            if (category === part.category) {
                optionList.push(
                    <option key={part.id} value={part.id}>
                        {part.name}
                    </option>
                )
            }
        });
    
    
        return (
            <div>
                <span className="format-title">{category}</span><br/>
                <select onChange={handleChangeList} className="part-selector" value={config[category] ? config[category] : undefined } name={category}>
                    {optionList}
                </select>
                {price > 0 && (formatPrice(price))}
            </div>
        )
    }

  return (
    <div>
        <hr/>
        <div className="configurator-container">
            <h4>Bike configurator</h4>
            
            {loading ? (<p className="error">{error}</p>) :
                (<>
                    {categories.map((category, i) => {
                    return (<Category key={i} category={category} />) 
                    })}
                    {partPrices.length > 0 && 
                        (<div><br/><b>Total:</b> {formatPrice(partPrices?.map(a => parseFloat(a.price)).reduce((partialSum, a) => partialSum + a, 0).toFixed(2))}</div>)
                }</>)
            }
            
            <div>
                <label className="title-with-icon button edit-color " onClick={handleAddToCart}>
                    <ShoppingCart fontSize="medium" />
                    Add bike configuration to cart
                </label>
            </div>
        </div>
    </div>
  );

}

export default Configurator;
