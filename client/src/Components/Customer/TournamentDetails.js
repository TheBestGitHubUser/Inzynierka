import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";

const TournamentDetails = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [signed, setSigned] = useState();
    const [competitorsM, setCompetitorsM] = useState();
    const [competitorsY, setCompetitorsY] = useState();
    const {eventID} = useParams();
    const [event, setEvent] = useState({});

    useEffect(() => {
        fetch("http://localhost:3001/getEvent/" + eventID)
            .then(res => res.json())
            .then(data => setEvent(data))
            .catch(err => alert(translate("connection_error")));
    
        fetch("http://localhost:3001/getParticipation/"+props.user.id+"/" + eventID)
            .then(res => res.json())
            .then(data => {
                if(data.id!==undefined
                ){
                    setSigned(data)
                }
                })
            .catch(err => alert(translate("connection_error")));
        
        fetch("http://localhost:3001/getParticipationM/"+ eventID)
            .then(res => res.json())
            .then(data => setCompetitorsM(data.count))
            .catch(err => alert(translate("connection_error")));

        fetch("http://localhost:3001/getParticipationF/" + eventID)
            .then(res => res.json())
            .then(data => setCompetitorsY(data.count))
            .catch(err => alert(translate("connection_error")));

        
        }, []);

    if (event.id === null)
        return <NoPage/>

    const signup = async () => {


        fetch("http://localhost:3001/putParticipation", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`},
            body: JSON.stringify({
                clientID: props.user.id,
                eventID: eventID,
            })
        })
            .catch(err => alert(translate("operation_unsuccessful")));
        navigate("/signedUp");
    }

    return (
        <div className="center container two-columns">
            <img src={event.imgURL} alt="box art" className="large-product-img"/>
            <div id="product-details">
                <h1>{event.name}</h1><br/>
                <strong>{translate("organizer")}: </strong>{event.Brand?.User?.name || "Brak danych"}<br/>
                <strong>{translate("place")}: </strong>{event.city}, {event.address}<br/>
                <strong>{translate("starting_time")}: </strong>{new Date(event.date).toLocaleString()}<br/><br/>
                <strong>{translate("number_of_competitors")}: </strong><br/>
                <strong>{translate("male")}: </strong>{competitorsM}/{event.maxCapacity}<br/>
                <strong>{translate("female")}: </strong>{competitorsY}/{event.maxCapacity}<br/><br/>
                <strong>{translate("status")}: </strong>{event.status}<br/>
                <strong>{translate("description")}: </strong>{event.description}<br/>
                
                <br></br>
                <button onClick={() => props.user.id === undefined ? navigate("/login") :signup()}
                 disabled = {signed!==undefined || event.status !== 'upcoming' ||
                    (props.user.gender === "M" && competitorsM >= event.maxCapacity) ||
                    (props.user.gender === "F" && competitorsY >= event.maxCapacity)
                 }>
                    {translate("sign_up")}</button><br/>
            
            </div>
        </div>
    );
}

export default TournamentDetails;