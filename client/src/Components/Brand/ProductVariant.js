import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductVariant = (props) => {
    const { productID } = useParams();
    const [translate] = useTranslation("global");
    const [variants, setVariants] = useState([]);
    const [variant, setVariant] = useState({productID:productID, size: "", stock: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3001/getProductVariants/" + productID)
            .then(res => res.json())
            .then(data => setVariants(data))
            .catch(err => alert(translate("operation_unsuccessful")));
    }, [productID]);

    const canAddVariant = (size) => {
        const hasOneSize = variants.some(v => v.size === "one-size");
        const hasOtherSizes = variants.some(v => v.size !== "one-size");

        if (size === "one-size" && hasOtherSizes) {
            alert(translate("cannot_add_onesize_with_other"));
            return false;
        }
        if (size !== "one-size" && hasOneSize) {
            alert(translate("cannot_add_other_with_onesize"));
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!variant.size || !variant.stock) {
            alert(translate("fill_all_fields"));
            return;
        }

        if (!canAddVariant(variant.size)) return;

        fetch("http://localhost:3001/putProductVariant", {
            method: "PUT",
            headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
             },
            body: JSON.stringify(variant)
        })
            .then(res => {
                navigate(-1); // powrót do listy produktów
            })
            .catch(() => alert(translate("operation_unsuccessful")));
    };

    const handleStockChange = (id, value) => {
    setVariants(prev =>
        prev.map(v => v.id === id ? { ...v, stock: value } : v)
    );
    };

    const deleteVariant = (variantID) => {
        if (window.confirm(translate("variant_delete_confirm")) === true) {
            fetch("http://localhost:3001/deleteVariant/" + variantID, {method: "DELETE",
                headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`
             }
            })
                .catch(err => alert(translate("operation_unsuccessful")));
        }
    }
    const editVariant = (variantID) => {
    const variantToEdit = variants.find(v => v.id === variantID);

    if (!variantToEdit) {
        alert("Variant not found.");
        return;
    }
    
    const newStockValue = variantToEdit.stock;

    if (window.confirm(translate("variant_edit_confirm")) === true) {
        fetch("http://localhost:3001/postVariant/" + variantID,
            {
                method: "Post",
                headers: {'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({stock: newStockValue}) 
            })
            .then(res => {
                alert(translate("operation_successful"));
            })
            .catch(err => alert(translate("operation_unsuccessful")));
    }
}

    const variantList = variants.map((v) => {
            return (
                <tbody>
                    <tr key={v.id}>
                        <td>{v.size}</td>
                        <td>
                            <input id="stock" type ='number' placeholder={translate("stock")} defaultValue={v.stock} 
                            onChange={e => handleStockChange(v.id, e.target.value)}/>
                        </td>
                        <td>
                            <a onClick={() => editVariant(v.id, v.stock)} className="underlined">{translate("edit")}</a>
                        </td>
                        <td>
                            <a onClick={() => deleteVariant(v.id)} className="underlined">{translate("delete")}</a>
                        </td>
                        
                    </tr>
                </tbody>
            );
        });

    return (
        <div className="center container">
            <h1>{translate("add_variant")}</h1>
            <form onSubmit={handleSubmit}>
                <label>{translate("size")}</label><br />
                <input
                    type="text"
                    placeholder="np. M, L, XL, one-size"
                    onChange={e => variant.size = e.target.value}
                /><br />

                <label>{translate("stock")}</label><br/>
                <input
                    type="number"
                    onChange={e => variant.stock = e.target.value}
                /><br/>
                <br/>

                <button type="submit">{translate("add")}</button>
            </form>

            <h3>{translate("existing_variants")}</h3>
            <table>
                <thead>
                    <tr>
                        <th>{translate("size")}</th>
                        <th>{translate("stock")}</th>
                        <th>{translate("edit")}</th>
                        <th>{translate("delete")}</th>
                    </tr>
                </thead>
                {variantList}
            </table>
        </div>
    );
};

export default ProductVariant;