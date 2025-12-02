import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useState} from "react";

import NoPage from "./Components/NoPage"

import Layout from "./Components/Customer/Layout";
import ProductList from "./Components/Customer/ProductList";
import ProductDetails from "./Components/Customer/ProductDetails";
import Purchase from "./Components/Customer/Purchase"    
import ThankYou from "./Components/Customer/ThankYou";
import Login from "./Components/Customer/Login";
import Register from "./Components/Customer/Register";
import Profile from "./Components/Customer/Profile";
import PurchaseHistory from "./Components/Customer/PurchaseHistory";
import CompetitionHistory from "./Components/Customer/CompetitionHistory"
import ProfileEdit from "./Components/Customer/ProfileEdit";
import TournamentList from './Components/Customer/TournamentList';
import TournamentDetails from './Components/Customer/TournamentDetails';
import Review from './Components/Customer/ReviewEdit';
import SignedUp from './Components/Customer/SingedUp';
import ArticleList from './Components/Customer/ArticleList';
import ArticleDetails from './Components/Customer/ArticleDetails'


import EmpLayout from "./Components/Developer/EmpLayout";
import EmpPurchaseHistory from "./Components/Developer/EmpPurchaseHistory";
import CustomerList from "./Components/Developer/CustomerList";
import Home from "./Components/Developer/Home";
import EmpLogin from "./Components/Developer/EmpLogin";
import Articles from './Components/Developer/Articles';
import ArticleEdit from './Components/Developer/ArticleEdit';
import Comments from './Components/Developer/Comments';
import Brands from './Components/Developer/Brands';
import BrandsProducts from './Components/Developer/BrandsProducts'
import BrandsEvents from './Components/Developer/BrandsEvents'
import Employees from './Components/Developer/Employees';
import EmployeeEdit from './Components/Developer/EmployeeEdit';
import EmployeesEditProfile from './Components/Developer/EditProfile'
import ClientParticipation from './Components/Developer/ClientParticipations';
import ClientOrders from './Components/Developer/ClientOrders';


import BrandRegister from "./Components/Brand/BrandRegister"
import BrandLogin from "./Components/Brand/BrandLogin";
import BrandLayout from "./Components/Brand/BrandLayout"
import BrandProductList from "./Components/Brand/ProductList"
import BrandProductEdit from "./Components/Brand/ProductEdit"
import BrandProductVariant from "./Components/Brand/ProductVariant"
import BrandEventList from "./Components/Brand/EventList"
import BrandEventEdit from "./Components/Brand/EventEdit"
import Participants from './Components/Brand/Participants';
import BrandOrders from './Components/Brand/Orders'
import BrandOrderEdit from './Components/Brand/OrderEdit'
import BrandReviews from './Components/Brand/Reviews'
import BrandProfile from './Components/Brand/BrandProfile';





function App() {
    const [user, setUser] = useState({});
    const [language, setLanguage] = useState('pl');
    const [searched, setSearched] = useState('')

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout setLanguage={setLanguage} user={user} setSearched={setSearched} setUser={setUser}/>}>
                    <Route path="login" element={<Login setUser={setUser}/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route index element={<ProductList searched={searched} setSearched={setSearched}/>}/>
                    <Route path=":offerId" element={<ProductDetails user={user}/>}/>
                    <Route path='purchase/:offerID/:variantID' element={<Purchase user={user}/>}/>
                    <Route path='review/:productID' element={<Review user={user}/>}/>
                    <Route path='tournament' element={<TournamentList searched={searched}/>}/>
                    <Route path='tournament/:eventID' element={<TournamentDetails user={user}/>}/>
                    <Route path='article' element={<ArticleList searched={searched} setSearched={setSearched}/>}/>
                    <Route path='article/:articleID' element={<ArticleDetails user={user}/>}/>
                    <Route path="thankyou" element={<ThankYou/>}/>
                    <Route path="signedUp" element={<SignedUp/>}/>
                    <Route path="profile" element={<Profile user={user}/>}>
                        <Route path="purchases" element={<PurchaseHistory user={user}/>}/>
                        <Route path="competition" element={<CompetitionHistory user={user}/>}/>
                    </Route>
                    <Route path="profile/edit" element={<ProfileEdit user={user}/>}/>
                    
                </Route>

                <Route path="/brandregister" element={<BrandRegister/>}/>
                <Route path="/brandlogin" element={<BrandLogin setUser={setUser}/>}/>
                <Route path='/brand' element={<BrandLayout setLanguage={setLanguage} user={user} setUser={setUser}/>}>
                    <Route index element={<Home user={user}/>}/>
                    <Route path="products" element={<BrandProductList user={user}/>}/>
                    <Route path="products/:productID" element={<BrandProductEdit user={user}/>}/>
                    <Route path='productVariant/:productID' element={<BrandProductVariant user={user}/>}/>
                    <Route path='productReviews/:productID' element={<BrandReviews/>}/>
                    <Route path='orders' element={<BrandOrders user={user}/>}/>
                    <Route path='orders/:orderID' element={<BrandOrderEdit/>}/>
                    <Route path='events' element={<BrandEventList user={user}/>}/>
                    <Route path='events/:eventID' element={<BrandEventEdit user={user}/>}/>
                    <Route path='events/participants/:eventID' element = {<Participants user={user}/>}/>
                    <Route path='profile' element = {<BrandProfile user={user}/>}/>
                </Route>

                <Route path="/emplogin" element={<EmpLogin setUser={setUser}/>}/>
                <Route path="/emp" element={<EmpLayout setLanguage={setLanguage} user={user} setUser={setUser}/>}>
                    <Route index element={<Home user={user}/>}/>

                    
                    <Route path="clients" element={<CustomerList/>}/>
                    <Route path="clients/orders/:clientID" element={<ClientOrders/>}/>
                    <Route path="clients/participations/:clientID" element={<ClientParticipation/>}/>
                    

                    <Route path='brands'>
                        <Route index element={<Brands/>}/>
                        <Route path='products/:brandID' element={<BrandsProducts/>}/>
                        <Route path='events/:brandID' element={<BrandsEvents/>}/>
                    </Route>

                    <Route path='employees' element={<Employees user={user}/>}/>
                    <Route path='employees/new' element={<EmployeeEdit/>}/>
                    <Route path='employees/edit/:developerID' element={<EmployeesEditProfile user={user}/>}/>

                    <Route path='articles' element={<Articles user={user}/>}/>
                    <Route path='articles/:articleID' element={<ArticleEdit user={user}/>}/>
                    <Route path='articles/comments/:articleID' element={<Comments/>}/>
                    
                    </Route>

                    

                <Route path="*" element={<NoPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
