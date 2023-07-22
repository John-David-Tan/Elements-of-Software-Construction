import React, { useContext } from 'react';
import "./hotelsList.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import Search from "../../components/search/Search";
import useFetch from "../../hooks/useFetch";
import FetchSearch from '../../hooks/FetchSearch';
import destdata from "../../dest.json";
import MultiRangeSlider from "../../components/multiRangeSlider/MultiRangeSlider";
import { SearchContext } from '../../context/SearchContext';


const HotelsList = () => {
  const {uid, dest_id, date, guests, lang, currency, partner_id,} = useContext(SearchContext);

  //again go see how to use use States and useLocation()
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const setDate = useState(date)
  const [hotelNameFilter, setHotelNameFilter] = useState("");
 
  //@John-David-Tan this for u to edit
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(2500);

  const handlePriceRangeChange = ({ min, max }) => {
    setMin(min);
    setMax(max);
  };

  
  //JDs filter search for facilities ==========================================
  const [wifiChecked, setWifiChecked] = useState(false);
  const [poolChecked, setPoolChecked] = useState(false);

  //this happens when u click the checkbox
  const handleWifiChange = () => {
    setWifiChecked(!wifiChecked);
  };

  //this happens when u click the checkbox
  const handlePoolChange = () => {
    setPoolChecked(!poolChecked);
  };

  //this is to call the backend which calls an external api. refer to server/routes/hotels.js and also server/server.js
  useEffect( () => {
    setLoading(true);
    try {
        // const sDate = format(date[0].startDate,"yyyy-MM-dd");
        // const eDate = format(date[0].endDate,"yyyy-MM-dd");
        fetch(`/api/hotels/prices?destination_id=${dest_id}&checkin=2023-10-07&checkout=2023-10-08&lang=${lang}&currency=${currency}&guests=${guests}&partner_id=${partner_id}`)
        .then(
            response => response.json()
        ).then(data => {
            setData(data);
            console.log("data", data)

        });
    } catch (err) {
      console.log(' use effect error');
    }
    setLoading(false);
    
    }, [])
  

  //this is for the search bar on the hotels results page @John-David-Tan this for u to edit
  const handleClick  = () => {
    console.log("location ,destination ", location, " ", destination);
    console.log(destination, date[0].startDate, date[0].endDate, openDate[0], options);
  };


  const sortBySearchRank = (hotelA, hotelB) => {
    // Check if both hotels have searchRank
    if (hotelA.searchRank !== undefined && hotelB.searchRank !== undefined) {
      return hotelB.searchRank - hotelA.searchRank; // Sort in descending order
    } else if (hotelA.searchRank === undefined && hotelB.searchRank !== undefined) {
      return 1; // hotelA has no searchRank, so move it to the end
    } else if (hotelA.searchRank !== undefined && hotelB.searchRank === undefined) {
      return -1; // hotelB has no searchRank, so move it to the end
    } else {
      return 0; // Both hotels have no searchRank, keep their order unchanged
    }
  };
  
  
  // Filter the hotels based on the current min and max prices
  const filteredHotels = data.filter((hotel) => {
    // Check if hotel name contains the filter input (case-insensitive)
    const isNameFiltered =
  hotel.name &&
  (hotelNameFilter.trim() === "" || hotel.name.toLowerCase().includes(hotelNameFilter.trim().toLowerCase()));

  
    // Check if hotel price is within the filter range
    const isPriceFiltered =
      hotel.price !== undefined && hotel.price >= min && hotel.price <= max;
  
    // Return true if both name and price filters match or if both filters are not applied

    return (isNameFiltered && isPriceFiltered) ;
  });


  const sortedHotels = filteredHotels.sort(sortBySearchRank);
  console.log("sorted", sortedHotels)

  return (
    <div>
      <Navbar />

      <Header type="list" />

      <div className="listContainer">

        <div className="listWrapper">

          <div className="listSearch">

            <h1 className="lsTitle">Search</h1>

            <div className="lsItem">
              <label>Destination</label>
              <input placeholder={destination} type="text" />
            </div>

            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "yyyy-MM-dd" //this is the dates that will open up when u click
              )} to ${format(date[0].endDate, "yyyy-MM-dd")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>

            <div className="lsItem">
              <label>Options</label>

              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                  />
                </div>
              </div>
            </div>
            <button //this is the search enginer at the side
            onClick={handleClick}>Search</button>
          </div>


          <div className="listFilter">
            <h1 className="lsTitle">Filter</h1>
            <div className="lsItem">
            <label>Hotel</label>
            <input placeholder="Hotel"
                type="text"
                value={hotelNameFilter}
                onChange={(e) => setHotelNameFilter(e.target.value)}
            />
          </div>


          <div className="lsItem">
            <label>Price Range</label>
            <div className="priceRangeSlider">
              <MultiRangeSlider
                min={0}
                max={2500}
                onChange={handlePriceRangeChange}
              /> 
            </div>
          </div>
          </div>
          
          
        </div>

        <div className="listResult">
          {loading ? 
            (<p className='hotelLoading'>Loading</p>) // over here is how u get a dynamic list of items, i will need to change to a load more button for now it loads 531 results which is p damn long
            : (sortedHotels.length > 0 ? (
            sortedHotels.map((item) => <Search item={item} key={item.id} />)
          ) : (
            <p className='hotelAvail'>No available hotels</p>
        ))}
        </div>


      </div>
    </div>
  );
};

export default HotelsList;