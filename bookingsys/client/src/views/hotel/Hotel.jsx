import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Hotel.css"
import { HotelRoom } from "../../components/hotelRoom/HotelRoom";
import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

const Hotel = () => {
    const location = useLocation();
    console.log('location ', location);
    const id = location.pathname.split("/"[0]);
    console.log(' id ', id[2]);
    const id_f = id[2];
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect( () => {
        setLoading(true);
        try {
          console.log(' use effet on header component for room ' );
             fetch(`/api/hotels/default/${id_f}`)
            .then(
                response => response.json()
            ).then(data => {
                console.log('inside use effect fetch ', data);
                setData(data);
            })
        } catch (err) {
          console.log(' use effect error');
        }
        setLoading(false);
        
        }, [])
        console.log('use effect has collected data ', data);

    const photos = [
        {src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/cc/6b/92/premier-room.jpg?w=1200&h=-1&s=1"},
        {src: "https://q-xx.bstatic.com/xdata/images/hotel/max500/296671071.jpg?k=c83823a117e31ede0486d94d1a686525bdae0c5378b1aa079752fa8da12658f2&o=" },
        {src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/296669707.jpg?k=d429f46f694f300cb1bc9b5118ece25b7604c564f46160a08d4795bee760013f&o=&hp=1"},
        {src: "https://www.marinabaysands.com/content/dam/marinabaysands/hotel/premiere-room/masthead.png"},
        {src: "https://i0.wp.com/www.springtomorrow.com/wp-content/uploads/2022/05/Marina-Bay-Sands-1.jpg?ssl=1"},
        {src: "https://annaeverywhere.com/wp-content/uploads/2014/12/DSC00749.jpg"}
    ];

    const roomListRef = useRef(null);

    const scrollToRoomList = () => {
    roomListRef.current.scrollIntoView({ behavior: 'smooth' });
    };
  return (
    <div>
        <Navbar/>
        <Header type="list"/>
        { loading ? "loading" : (
        <div className="hotelContainer">
            <div className="hotelWrapper">
              <button className="bookNow" onClick={scrollToRoomList}>Book Now</button>
                <h1 className="hotelTitle">
                    {data.name}
                </h1>
                <div className="hotelAddress">
                    <span>{data.address}</span>
                </div>
                <span className="hotelDistance">
                    Excellent location - 500m from center
                </span>
                <span className="hotelPriceHighlight">
                    Book a stay over $114 at this property and get a free airport taxi
                </span>
                <div className="hotelImages">
                    {photos.map(photo=>(
                        <div className="hotelImgWrapper">
                            <img src={photo.src} alt="" className="hotelImg" />
                        </div>
                    ))}
                </div>
                <div className="hotelDetails">
                    <div className="hotelDetailsTexts">
                        <h1 className="hotelTitle">Words Words Words Words Words Words Words</h1>
                        <p className="hotelDesc">
                        {data.description}
                        </p>
                    </div>
                    <div className="hotelDetailsExtra"><h1>
                    Words Words Words Words Words
                        </h1>
                        <span>
                        Words Words Words Words Words Words Words Words Words Words Words Words
                        </span>
                      </div>
                </div>
                <div ref={roomListRef} className="roomList">
                            <HotelRoom/>
                            <HotelRoom/>
                        </div>
            </div>
        </div> ) }
        <Footer/>
    </div>
  )
}

export default Hotel