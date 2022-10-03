import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer} from 'react-toastify';
import Explore from './pages/Explore';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Forgot from './pages/Forgot';
import Category from './pages/Category';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import Contact from './pages/Contact';
import EditListing from './pages/EditListing';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore/>}/>
          <Route path='/offers' element={<Offers/>}/>
          <Route path='/category/:categoryName' element={<Category/>}/>
          <Route path='/profile' element={<PrivateRoute/>}> 
            <Route path='/profile' element={<Profile/>} />
          </Route>
          <Route path='/sign-in' element={<SignIn/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/forgot' element={<Forgot/>}/>
          <Route path='/create-listing' element={<CreateListing/>}/>
          <Route path='/edit-listing/:listingId' element={<EditListing/>}/>
          <Route path='/category/:categoryName/:listingId' element={<Listing />} />
          <Route path='/contact/:userId' element={<Contact />} />
          


        </Routes>
        <Navbar/>
      </Router>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default App;
