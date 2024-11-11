import { useNavigate } from 'react-router-dom';
import "../css/NotFoundPage.css"
const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        window.history.go(-3);
    };
    return ( 
        <div className="not-found-page">
            <div className="not-found-page-circle">
                <p className="page-not-found-text">OPPS! PAGE NOT FOUND</p>
                <h1 className="code-404">404</h1>
                <p className="page-not-found-text">WE ARE SORRY, BUT THE PAGE YOUR REQUESTED WAS NOT FOUND</p>
                <button className="page-not-found-back-button" onClick={handleGoBack}>Go Back</button>
            </div>
        </div> 
    );
}
 
export default NotFoundPage;