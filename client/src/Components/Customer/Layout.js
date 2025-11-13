import {Outlet, Link, useNavigate} from "react-router-dom";
import LanguageSelect from "../LanguageSelect";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const Layout = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");

      useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    
    fetch("http://localhost:3001/profileClient", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => {
          props.setUser(data);
      })
      .catch(() =>{localStorage.removeItem("token");
       navigate("/login")});
  }, []);


    return (
        <>
            <header>
                <img src="/logo.png" alt="logo" id="logo" onClick={() => {
                    navigate("/");
                    props.setSearched('');
                }}/>
                <input type="text" id="search-bar" placeholder={translate("search")} onKeyDown={e => {
                    if (e.key === 'Enter') {
                        props.setSearched(e.target.value.toLowerCase());
                    }
                }}/>
            </header>
            <nav>
            <div className="global-actions inline">
                    <Link to="" className="tab">{translate("shop")}</Link>
                    <Link to="tournament" className="tab">{translate("tournaments")}</Link>
                    <Link to="article" className="tab">{translate("article")}</Link>
                </div>
                <div className="global-actions inline align-right">
                    {
                        props.user?.id === undefined || props.user?.id === ''?
                        <button onClick={() => navigate("/login")}>{translate("login")}</button> :
                        <button onClick={() => navigate("/profile")}>{translate("profile")}</button>
                    }
                    {
                        props.user?.id === undefined || props.user?.id === ''?
                        '' :
                        <button onClick={() =>{
                            localStorage.removeItem("token")
                            props.setUser([]);
                            navigate("/")
                        } }>{translate("log_out")}</button>
                    }

                    <LanguageSelect/>
                </div>
            </nav>
            <Outlet/>
        </>
    );
}

export default Layout;