import {useTranslation} from "react-i18next";

const PurchaseSortOptions = ({setSortOpt}) => {
    const [translate, i18n] = useTranslation("global");
    return (
        <select onChange={e => setSortOpt(parseInt(e.target.value))}>
            <option value={0}>{translate("alphabetically")}</option>
            <option value={1}>{translate("price_descending")}</option>
            <option value={2}>{translate("price_ascending")}</option>
            <option value={3}>{translate("newest_first")}</option>
            <option value={4}>{translate("oldest_first")}</option>
        </select>
    );
}

const sortPurchases = (p1, p2, opt) => {
    switch (opt) {
        case 1: return p2.price - p1.price;
        case 2: return p1.price - p2.price;
        case 3: return Date.parse(p2.createdAt) - Date.parse(p1.createdAt);
        case 4: return Date.parse(p1.createdAt) - Date.parse(p2.createdAt);
        default: return p1.Product.name.localeCompare(p2.Product.name);
    }
}

export {PurchaseSortOptions, sortPurchases};