import axios from "axios";
import { useState, useEffect } from "react";

const Ingredient = ({ ingredient_id }) => {
    const [ingredient, setIngredient] = useState({});
    useEffect(() => {
        const fetchIngredient = async ()=>{
            try{
                let res = await axios.get(`http://localhost:3001/api/inventory/${ingredient_id}`)
                setIngredient(res.data.ingredient);
            } catch (err) {
                console.log(`Error fetching Ingredient: ${err}`)
            }
        }
        fetchIngredient()
    }, [])
    return (
        <div>
            {ingredient.name}
        </div>
    );
};

export default Ingredient;
