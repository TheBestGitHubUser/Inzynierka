import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Warning from "../Warning";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";
import {validatePrice} from "../../Utils";

const OfferEdit = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {eventID} = useParams();
    const [event, setEvent] = useState({
        brandID: props.user.id,
        name: '',
        description: '',
        date: '',
        city: '',
        address: '',
        capacityM: '',
        capacityF: '',
        maxCapacity: '',
        status: 'upcoming',
        imgURL: '',
    });
    const [warning, setWarning] = useState('');

    useEffect(() => {
        if (eventID !== 'new') {
            fetch("http://localhost:3001/brand/getEvent/" + eventID, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
                .then(res => res.json())
                .then(data => setEvent(data))
                .catch(err => alert(translate("operation_unsuccessful")));
        
        
            
            }
    }, []);

    if (event.id === null)
        return <NoPage/>

    const acceptChanges = async (eventID) => {
        if (event.name === '') {
            setWarning(translate("enter_name"))
            return;
        }

        if (event.description === '') {
            setWarning(translate("enter_description"))
            return;
        }

        if (event.date === '') {
            setWarning(translate("enter_date"))
            return;
        }

        if (event.city === '') {
            setWarning(translate("enter_city"))
            return;
        }

        if (event.address === '') {
            setWarning(translate("enter_address"))
            return;
        }

        if (event.maxCapacity === '') {
            setWarning(translate("enter_maxCapacity"))
            return;
        }
        
        if (event.imgURL.length <= 0) {
            setWarning(translate("enter_image"))
            return;
        }

        if (eventID === 'new') {
            const promise = fetch("http://localhost:3001/putEvent", {
                method: "PUT",
                headers: {'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(event)
            })
                .then(res => res.json())
                .then(data => data.insertId)
                .catch(err => alert(translate("operation_unsuccessful")));


        } else {
            fetch("http://localhost:3001/postEvent/" + eventID, {
                method: "POST",
                headers: {'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(event)
            })
            
        }

        exit(eventID);
    }

    const exit = (eventID) => {
        if (eventID === 'new')
            navigate("/brand/events");
        else
            navigate("/brand/events");
    }

    return (
        <div className="center container two-columns">
            <h1>{eventID === 'new' ? "Dodaj event" : "Edytuj event"}</h1><br/>
            <div className="form"> 
                <label>{translate("name")}</label><br/>
                <input type="text" defaultValue={event.name} id="name-input" onChange={e => event.name = e.target.value}/><br/>
                <label>{translate("description")}</label><br/>
                <input type="text" defaultValue={event.description} id="description-input" onChange={e => event.description = e.target.value}/><br/>
                <label>{translate("date")}</label><br/>
                <input type="datetime-local" defaultValue={event.date ? new Date(event.date).toISOString().slice(0, 16): ""} id="date-input" onChange={e => event.date = e.target.value}/><br/>
                <label>{translate("city")}</label><br/>
                <input type="text" defaultValue={event.city} id="city-input" onChange={e => event.city = e.target.value}/><br/>
                <label>{translate("address")}</label><br/>
                <input type="text" defaultValue={event.address} id="address-input" onChange={e => event.address = e.target.value}/><br/>
                <label>{translate("maxCapacity")}</label><br/>
                <input type="number" defaultValue={event.maxCapacity} id="maxCapacity-input" onChange={e => event.maxCapacity = e.target.value}/><br/>
                <label>{translate("status")}</label><br/>
                <select
                    id="status-select"
                    value ={event.status}
                    onChange={(e) => setEvent({ ...event, status: e.target.value })}
                >
                    <option value="upcoming">{translate("upcoming")}</option>
                    {eventID!=='new' && (
                      <>
                        <option value="ongoing">{translate("ongoing")}</option>
                        <option value="finished">{translate("finished")}</option>
                      </>
                    )}
                </select><br/>
                <label>{translate("image_url")}</label><br/>
                <input type="text" defaultValue={event.imgURL} id="imgURL-input" onChange={e => {
                    event.imgURL = e.target.value;
                    document.getElementById("box-art").src = e.target.value;
                }}/><br/>

                <img src={event.imgURL} alt="box art" className="large-product-img" id="box-art"/><br/>
                <button onClick={() => acceptChanges(eventID)}>{translate("accept")}</button>
                <button onClick={() => exit(eventID)}>{translate("cancel")}</button>
                <Warning message={warning}/>
            </div>
        </div>
    );
}

export default OfferEdit;