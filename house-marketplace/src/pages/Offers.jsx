import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Offers() {
  const [listing, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        //GET Reference
        const listingsRef = collection(db, 'listings');

        //Create a query
        const q = query(
          listingsRef,
          where('isOffer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        //Execute query
        const querySnap = await getDocs(q);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not load listings');
        console.log(error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listing && listing.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listing.map((li) => (
                <ListingItem listing={li.data} id={li.id} key={li.id} />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>
          No Listings for
          {params.categoryName === 'rent' ? ' Rent' : ' Sale'}
        </p>
      )}
    </div>
  );
}

export default Offers;
