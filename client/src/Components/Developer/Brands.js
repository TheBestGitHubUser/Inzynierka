import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import SearchBar from "../SearchBar";
import {useTranslation} from "react-i18next";

const Brands = () => {
    const [translate, i18n] = useTranslation("global");
    const [brands, setBrands] = useState([]);
    const [searched, setSearched] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/getBrands")
            .then(res => res.json())
            .then(data => {
                setBrands(data
                    .filter(c => c.User.name.includes(searched) || c.email.includes(searched) || c.id+''===searched)
                )
            });
    }, [searched]);

    const deleteCustomer = (customerId) => {
        if (window.confirm(translate("user_delete_confirm")) === true) {
            fetch("http://localhost:3001/deleteUser/" + customerId, {method: "DELETE"})
        }
    }

    const Brands = brands.map(brand => {
        return (
            <tbody key={brand.id}>
            <tr>
                <th>{brand.id}</th>
                <td>{brand.User.name}</td>
                <td>{brand.User.email}</td>
                <td>{brand.nipNumber}</td>
                <td><Link to={'products/'+brand.id}>{translate("products")}</Link></td>
                <td><Link to={'events/' + brand.id}>{translate("events")}</Link></td>
                <td><a onClick={() => deleteCustomer(brand.User.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    });

    return (
        <div className="center container">
            <h1>{translate("brands")}</h1>
            <SearchBar setSearched={setSearched}/><br/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("name")}</th>
                    <th>{translate("e-mail")}</th>
                    <th>nip</th>
                    <th>{translate("products")}</th>
                    <th>{translate("events")}</th>       
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {Brands}
            </table>
        </div>
    );
}

export default Brands;