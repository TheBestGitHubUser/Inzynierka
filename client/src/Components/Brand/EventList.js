import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import SearchBar from "../SearchBar";
import {useTranslation} from "react-i18next";

const EventList = (props) => {
    const [events, setEvents] = useState([]);
    const [translate, i18n] = useTranslation("global");
    const [searched, setSearched] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/brandGetEvents/"+ props.user.id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setEvents(data
                    .filter(o => o.name.includes(searched))
                )
            })
            .catch(err => alert(translate("operation_unsuccessful")));
    }, []);

    const deleteOffer = (eventID) => {
        if (window.confirm(translate("offer_delete_confirm")) === true) {
            fetch("http://localhost:3001/deleteEvent/" + eventID, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
            })
                .catch(err => alert(translate("operation_unsuccessful")));
        }
    }

    const offerList = events.map((event) => {
        return (
            <tbody key={event.id}>
            <tr>
                <th>{event.id}</th>
                <td>{event.name}</td>
                <td>{event.description}</td>
                <td>{new Date(event.date).toLocaleString()}</td>
                <td>{event.city}</td>
                <td>{event.status}</td>
                <td><Link to={"/brand/events/participants/"+event.id}>{translate("participants")}</Link></td>
                <td><Link to={"/brand/events/"+event.id}>{translate("edit")}</Link></td>
                <td><a onClick={() => deleteOffer(event.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    });

    return (
        <div className="center container">
            <h1>{translate("events")}</h1>
            <SearchBar setSearched={setSearched}/><br/>
            <Link id="new" to="new">{translate("add_event")}</Link><br/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("name")}</th>
                    <th>{translate("description")}</th>
                    <th>{translate("time")}</th>
                    <th>{translate("city")}</th>
                    <th>{translate("status")}</th>
                    <th>{translate("participants")}</th>
                    <th>{translate("edit")}</th>
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {offerList}
            </table>
        </div>
    );
};

export default EventList;