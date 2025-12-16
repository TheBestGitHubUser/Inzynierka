import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar";
import { useTranslation } from "react-i18next";

const Participants = (props) => {
    const { eventID } = useParams();
    const [event, setEvent] = useState({})
    const [translate] = useTranslation("global");
    const [participations, setParticipations] = useState([]);
    const [searched, setSearched] = useState('');
    const [gender, setGender] = useState('')
    const navigate = useNavigate();

    const loadParticipants = async () => {
      await fetch("http://localhost:3001/getEventParticipants/" + eventID)
        .then(res => res.json())
        .then(data => setParticipations(data
            .filter(o => o.Client?.User?.name.includes(searched))
            .filter(o => o.Client?.gender.includes(gender))
        ))
        .catch(err => console.error(err));
        
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

    };

    useEffect(() => {
        loadParticipants()
    }, [searched,gender,]);

    const handlePlacementChange = (id, value) => {
    setParticipations(prev =>
        prev.map(p => p.id === id ? { ...p, placement: value } : p)
    );
    };

    const deletePlacement = async (id) => {
        if (window.confirm(translate("variant_delete_confirm")) === true) {
            await fetch("http://localhost:3001/deleteParticipation/" + id, {
                method: "DELETE",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`},
            })
                .then(()=>{
                   loadParticipants()
                })
                .catch(err => alert(translate("operation_unsuccessful")));
        }

        
    }
    const editPlacement = (id) => {

    const participationToEdit = participations.find(p => p.id === id);

    if (!participationToEdit) {
        alert("participation not found.");
        return;
    }

    const newPlacementValue = participationToEdit.placement;

    if (window.confirm(translate("placement_edit_confirm")) === true) {
        fetch("http://localhost:3001/postParticipation/" + id,
            {
                method: "Post",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({placement: newPlacementValue}) 
            })
            .catch(err => alert(translate("operation_unsuccessful")));
            
    }
}

    const participationList = participations.map((p) => {
            return (
                <tbody>
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.Client?.User?.name}</td>
                        <td>{p.Client?.gender}</td>
                        <td>
                            <input id="placement" type ='number' defaultValue={p.placement===0?'':p.placement}
                            onChange={e => handlePlacementChange(p.id, e.target.value)}/>
                        </td>
                        <td>
                            {event.status==="upcoming"?"-":<a onClick={() => editPlacement(p.id)} className="underlined">{translate("edit")}</a>}
                        </td>
                        <td>
                            {event.status==="finished"?"-":<a onClick={() => deletePlacement(p.id)} className="underlined">{translate("delete")}</a>}
                        </td>
                        
                    </tr>
                </tbody>
            );
        });

    return (
        <div className="center container">
            <h1>{translate("participants")}</h1>
            <SearchBar setSearched={setSearched}/><br/>
            <select type="text" id="selectGender" onChange={
                e => {var d = document.getElementById("selectGender")
                var value = d.value
                setGender(value)
            }
            } required>
                <option value="" >{translate("all_genders")}</option>
                <option value="M">{translate("male")}</option>
                <option value="F">{translate("female")}</option>
            </select><br/>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>{translate("name")}</th>
                        <th>{translate("gender")}</th>
                        <th>{translate("placement")}</th>
                        <th>{translate("edit")}</th>
                        <th>{translate("delete")}</th>
                    </tr>
                </thead>
                {participationList}
            </table>
        </div>
    );
};

export default Participants;