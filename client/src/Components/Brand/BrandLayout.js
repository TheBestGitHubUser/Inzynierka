import {Outlet, Link, useNavigate} from "react-router-dom";
import LanguageSelect from "../LanguageSelect";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";

const EmpLayout = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    useEffect(() => {
       const token = localStorage.getItem("token");
       if (!token) {
       navigate("/brandLogin");
       return;
       }

    
    fetch("http://localhost:3001/profileBrand", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => {
          props.setUser({
            id: data.id,
            userID: data.userID,
            email: data.User.email,
            password: data.User.password,
            name: data.User.name,
            nip: data.nipNumber
          });
      })
      .catch(() =>{localStorage.removeItem("token");
       navigate("/brand")});
    }, []);

    return (
        <>
            <header>
                <img src="/logo.png" alt="logo" id="logo" onClick={() => {
                    navigate("/brand");
                }}/>
                <h1 className="inline">{translate("brand_platform")}</h1>
            </header>
            <nav>
                <div className="global-actions inline">
                    <Link to="products" id='products' className="tab">{translate("products")}</Link>
                    <Link to="orders" id='orders' className="tab">{translate("orders")}</Link>
                    <Link to="events" id='events' className="tab">{translate("events")}</Link>
                    
                
                </div>
                <div className="global-actions inline align-right">

                    <button onClick={() =>{
                        navigate('profile')
                    }}>{translate("your_profile")}</button>

                    <button onClick={() =>{
                        localStorage.removeItem("token")
                        props.setUser([]);
                        navigate("/")
                    } }>{translate("log_out")}</button>
                    <LanguageSelect setLanguage={props.setLanguage}/>
                </div>
            </nav>
            <Outlet/>
        </>
    );
}

export default EmpLayout;