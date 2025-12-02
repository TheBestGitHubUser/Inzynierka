import {Link, Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";

const Profile = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");

    useEffect(() => {
        if (props.user.id === undefined && !localStorage.getItem('token'))
            navigate("/login");
    }, []);

    return (
        <div className="center container">
            <h1>{props.user.User?.name}</h1>
            <strong>email:</strong>{props.user.User?.email}<br/>
            <Link to={"edit"}>{translate("edit_profile")}</Link><br/><br/>
            <button onClick={() => navigate("purchases")}>{translate("user_purchases")}</button>
            <button onClick={() => navigate("competition")}>{translate("user_tournaments")}</button><br/>
            <Outlet/>
        </div>
    );
}

export default Profile;