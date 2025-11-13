import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";

const ClientParticipation = (props) => {
    const [translate, i18n] = useTranslation("global");
    const {clientID} = useParams()
    const [competition, setCompetition] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/getClientParticipation/" + clientID, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => setCompetition(data))
            .catch(err => alert(translate("connection_error")));
    }, []);

     const deleteParticipation = (id) => {

        const currentCompetition = competition.find(c => c.id === id);
        
        if (!currentCompetition) {
        alert(translate("event_not_found"));
        return;
    }

    if (currentCompetition.Event.status !== "upcoming") {
        alert(translate("cannot_cancel_past_event"));
        return;
    }

    if (window.confirm(translate("participation_delete_confirm")) === true) {
        fetch("http://localhost:3001/deleteParticipation/" + id, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
        })
            .catch(err => alert(translate("operation_unsuccessful")));
    }

        
    }

    const competitionList = competition.map((compete) => {
        return (
            <tbody key={compete.key}>
            <tr>
                <td>{compete.id}</td>
                <td>{compete.Event.name}</td>
                <td>{new Date(compete.Event.date).toLocaleString()}</td>
                <td>{compete.Event.status}</td>
                <td>{compete.placement > 0 ? compete.placement : translate("not set")}</td>
                <td><a onClick={() => deleteParticipation(compete.id)} className="underlined">{translate("remove")}</a></td>
            </tr>
            </tbody>
        );
    })

    return (
        <>
            <div className="center container">
                <h3>{translate("user_tournaments")}</h3>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>{translate("name")}</th>
                        <th>{translate("date")}</th>
                        <th>{translate("status")}</th>
                        <th>{translate("placement")}</th>
                        <th>{translate("remove")}</th>
                    </tr>
                    </thead>
                    {competitionList}
                </table>
            </div>
        </>
    )
}

export default ClientParticipation;