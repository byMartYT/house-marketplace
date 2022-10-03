import React, { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import Spinner from './Spinner';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Slider() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
      const querySnap = await getDocs(q);

      let listing = [];

      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listing);
      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) return <Spinner />;

  console.log(listings);

  if (listings.length === 0) {
    return <></>;
  }

  return (
    listings && (
      <>
        <p className='exploreHeading'>Recommended</p>

        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          className='swiper-container'
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='swiperSlideDiv'
              >
                <p className='swiperSlideText'>{data.name}</p>
                <p className='swiperSlidePrice'>
                  {data.discountedPrice ?? data.regularPrice} €{' '}
                  {data.type === 'rent' && '/ Month'}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider;
