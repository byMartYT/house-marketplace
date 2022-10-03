import React from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import ListingItem from '../components/ListingItem';

function Profile() {
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userListings, setUserListings] = useState(null);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { email, name } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const qSnap = await getDocs(q);

      let listings = [];

      qSnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setUserListings(listings);
      setLoading(false);
    };

    fetchUserListings();
    // eslint-disable-next-line
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate('/sign-in');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update Displayname in fb
        await updateProfile(auth.currentUser, { displayName: name });

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
        toast.success('User Profile was successfully updated!');
      }
    } catch (error) {
      toast.error('Could not update profile details');
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId));
      const updatedListings = userListings.filter(
        (listing) => listing.id !== listingId
      );
      setUserListings(updatedListings);
      toast.success('Successfully deleted listing');
    }
  };

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button type='button' onClick={onLogout} className='logOut'>
          Logout
        </button>
      </header>
      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details:</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails(!changeDetails);
            }}
          >
            {changeDetails ? 'Done' : 'Edit'}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='name'
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              // eslint-disable-next-line
              disabled={!changeDetails && true}
              value={name}
              onChange={onChange}
            />
            <input
              type='email'
              id='email'
              className='profileName'
              disabled='true'
              value={email}
              onChange={onChange}
            />
          </form>
        </div>

        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='home' />
          <p>Sell or Rent your house</p>
          <img src={arrowRight} alt='Goto' />
        </Link>

        {!loading && userListings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsList'>
              {userListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => navigate(`/edit-listing/${listing.id}`)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
