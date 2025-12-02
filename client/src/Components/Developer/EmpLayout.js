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
       navigate("/empLogin");
       return;
       }

    
    fetch("http://localhost:3001/profileDeveloper", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => {
            props.setUser({
            id: data.id,
            userID: data.userID,
            email: data.User.email,
            name: data.User.name,
            role: data.role,
            salary: data.salary
          });
      })
      .catch(() =>{localStorage.removeItem("token");
       navigate("/emp")});
    }, []);

    return (
        <>
            <header>
                <img src="/logo.png" alt="logo" id="logo" onClick={() => {
                    navigate("/emp");
                }}/>
                <h1 className="inline">{translate("employee_platform")}</h1>
            </header>
            <nav>
                <div className="global-actions inline">
                    <Link to="clients" id="clients" className="tab">{translate("clients")}</Link>
                    <Link to="brands" id="brands" className="tab">{translate("brands")}</Link>
                    <Link to="articles" id="articles" className="tab">{translate("articles")}</Link>
                    {props.user.role === "admin" && (
                        <Link to="employees" id="employees" className="tab">{translate("employees")}</Link>
                    )}
                </div>
                <div className="global-actions inline align-right">
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