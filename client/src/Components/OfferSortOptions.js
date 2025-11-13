import {useTranslation} from "react-i18next";

const OfferSortOptions = ({setSortOpt}) => {
    const [translate, i18n] = useTranslation("global");
    return (
        <select onChange={e => setSortOpt(parseInt(e.target.value))}>
            <option value={0}>-</option>
            <option value={1}>{translate("alphabetically")}</option>
            <option value={2}>{translate("price_ascending")}</option>
            <option value={3}>{translate("price_descending")}</option>
        </select>
    );
}

const sortOffers = (p1, p2, opt) => {
    switch (parseInt(opt)) {
        case 1: return p1.name.localeCompare(p2.name);
        case 2: return parseInt(p1.price) - parseInt(p2.price);
        case 3: return parseInt(p2.price) - parseInt(p1.price);
        default: return parseInt(p2.id) - parseInt(p1.id);
    }
}

export {OfferSortOptions, sortOffers};