import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import "../css/Management.css";

const CustomerView= () => {
    const [points, setPoints] = useState([]);
    let userID;
    const token = sessionStorage.getItem("token")
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            userID = decodedToken.user_id;
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    }

    const fetchPoints = async () => {
        try{
            console.log("fetching points")
            console.log(userID)
            let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${userID}`)
            let totalPoints = res.data.user.points;
            console.log(res.data)
            setPoints(totalPoints);
        } catch (err) {
            console.log(`Error fetching points: ${err}`)
        }
    }

    useEffect(() => {
        fetchPoints();
    }, []);

    return (
        <div className= "loyalty-header" style={{"display": "flex", gap: "5px"}} >
            You currently have:
            <span>{points} Loyalty Points</span>
        </div>
    );
}

export default CustomerView;
