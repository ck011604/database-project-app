import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import '../css/Management.css';
import Modal from "./Reusable/Modal";
import AddPromotionForm from "./EditForms/AddPromotionForm";

const PromotionManagement = () => {
    const [productFilter, setProductFilter] = useState("PROMOTIONS");
    const [promotions, setPromotions] = useState([]);
    const [modal, setModal] = useState(false);
    const [promotion, setPromotion] = useState(null);

    const fetchAllPromotions = async () => {
        try{
            let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/promotions`)
            let promotions = res.data.promotions;
            let new_promotions = []
            for(let promotion of promotions){
                new_promotions.push({
                    promoCode_id: promotion.promoCode_id,
                    code: promotion.code,
                    discount_percent: promotion.discount_percent,
                    uses_left: promotion.uses_left,
                    isActive: promotion.is_active,
                })
            }
            console.log(new_promotions)
            setPromotions(new_promotions);
        } catch (err) {
            console.log(`Error fetching Promotions: ${err}`)
        }
    }

    useEffect(() => {
        if (productFilter === "PROMOTIONS") {
            fetchAllPromotions();
        }
    }, [productFilter]);

    const toggleModal = async (promotion = null) => {
        console.log(promotion)
        if(promotion){
            let data = {
                promoCode_id: promotion.promoCode_id,
                code: promotion.code,
                discount_percent: promotion.discount_percent,
                uses_left: promotion.uses_left,
                isActive: promotion.isActive,
            }
            promotion = data
        }
        console.log(promotion)
        setPromotion(promotion)
        setModal(!modal)
    };

    const handleDelete = async(id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/promotions/${id}`);
            fetchAllPromotions();
        } catch (err) {
            console.error(`Error deleting item: ${err}`);
        }
    };

    const handleReactivate = async(id) => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/promotions/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_active: true })
            });
            fetchAllPromotions();
        } catch (err) {
            console.error(`Error reactivating promotion: ${err}`);
        }
    }

    const filterTable = (e) => {
        const searchValue = e.target.value.toUpperCase()
        // Declare variables
        let table, tr, td, i, txtValue;
        table = document.getElementById("promotion-table");
        tr = table.getElementsByTagName("tr");
      
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[1];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(searchValue) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }
        }
      }

    return(
        <div className="add-menu-item">
            <Modal modal={modal} setModal={setModal}>
                <AddPromotionForm setModal={setModal} promotion={promotion} callback={fetchAllPromotions}/>
            </Modal>
            <div className="inventory-form-container">
                <div className="add-employee" style={{"paddingBottom": "5px"}}>
                    <h2 style={{display: "inline"}} >Promotion Management</h2>
                </div>
                <div>
                <input className="filter-table" type="text" onKeyUp={filterTable} placeholder="Search for items.."></input>
                    <button onClick={() => toggleModal()} className="btn-modal"> + </button>
                </div>
                <table id="promotion-table" className="management-table">
                    <thead> 
                        <tr className="item-info">
                            <th>ID</th>
                            <th>Promotion Code</th>
                            <th>Discount Percent</th>
                            <th>Uses Left</th>
                            <th>Is Active</th>
                        </tr>
                    </thead>
                        <tbody id="items-table">
                            {promotions.map((promotion) => (
                                <tr key={promotion.promoCode_id}>
                                    <td>{promotion.promoCode_id}</td>
                                    <td>{promotion.code}</td>
                                    <td>{promotion.discount_percent}</td>
                                    <td>
                                        <div>
                                        {promotion.uses_left === null ? "Unlimited" : promotion.uses_left}
                                        </div>
                                    </td>
                                    <td>
                                        <div className='actions-container'>
                                            <span className={`status-label ${promotion.isActive ? 'status-label-active' : 'status-label-inactive'}`}>
                                                {promotion.isActive ? "Active" : "Inactive"}
                                            </span>
                                            {promotion.isActive ? 
                                                <span className='item-actions'>
                                                    <BsFillPencilFill onClick={() => toggleModal(promotion)}/>                       
                                                    <BsFillTrashFill className='delete-btn' onClick={() => handleDelete(promotion.promoCode_id)}/>
                                                </span> :
                                                <button className="reactivate-btn" onClick={() => handleReactivate(promotion.promoCode_id)}> Reactivate </button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                </table>
            </div>
        </div>
    );

};

export default PromotionManagement;

