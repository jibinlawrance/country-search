import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";
import thousandSeperator from '../../constants/thousandSeperator'

function DetailsPage({toggleDarkMode}) {
  
  let { state } = useLocation();
  let languages = state.country.languages;
  let borderCountries = state.country.borders;

  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    const fetchCountryData = async () => {
      const countryData = [];
  
      for (const ele of borderCountries) {
        try {
          const response = await axios.get(`https://restcountries.com/v3.1/alpha/${ele}`);
          countryData.push(response.data[0]);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
  
      setCountryList(countryData);
    };
  
    if (borderCountries?.length > 0) {
      fetchCountryData();
    }
  }, [borderCountries]);  
  

  return (
    <>
      <Header toggleDarkMode={toggleDarkMode} />
      <main className="dark:bg-[#202d36] min-h-[calc(100dvh-68px)]">
        <div className="max-w-[1320px] mx-auto py-12 px-5">
          <Link to={'/'} className="dark:bg-[#2b3743] dark:text-white inline-flex gap-1 items-center px-6 py-2 shadow-[0_0_10px_rgb(0,0,0,0.2)] text-sm font-Nunito font-semibold rounded-md leading-none">
            <ArrowLongLeftIcon className="w-5 stroke-1" />
            Back
          </Link>
          <div className="dark:text-white mt-12 md:flex justify-between items-center">
            <div className="mb-6 md:mb-0 md:w-[calc((100%-60px)/2)]">
              <img src={state.country.flags.png} alt={state.country.flags.alt} className="max-w-full m-auto" />
            </div>
            <div className="md:w-[calc((100%-60px)/2)]">
                <h1 className="font-bold text-2xl mb-4 leading-none">{state.country.name.common}</h1>
                <div className="md:flex md:justify-between">
                  <div className="md:w-[calc((100%-20px)/2)]">
                    <p className="mb-2"><span className="font-semibold">Native Name:</span> {Object.values(state.country.name.nativeName)[0].common}</p>
                    <p className="mb-2"><span className="font-semibold">Population:</span> {thousandSeperator(state.country.population)}</p>
                    <p className="mb-2"><span className="font-semibold">Region:</span> {state.country.region}</p>
                    <p className="mb-2"><span className="font-semibold">Sub Region:</span> {state.country.subregion}</p>
                    <p className="mb-2"><span className="font-semibold">Capital:</span> {state.country.capital?.map((ele, index, arr) => `${ele}${index != arr.length-1 ? ', ':''}`)}</p>
                  </div>
                  <div className="md:w-[calc((100%-20px)/2)]">
                    <p className="mb-2"><span className="font-semibold">Top Level Domain:</span> {state.country.tld?.map( ele => ele )}</p>
                    <p className="mb-2"><span className="font-semibold">Currencies:</span> {Object.values(state.country.currencies)[0].name}</p>
                    <p className="mb-2"><span className="font-semibold">Languages:</span> {Object.keys(languages).map((ele, index, arr) => `${languages[ele]}${index != arr.length-1 ? ', ':''}`)}</p>
                  </div>                
                </div>
                { 
                  countryList.length ? 
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 mt-6">
                    <p className="font-semibold min-w-fit">Border Countries:</p>
                    <div className="flex gap-2 flex-wrap">
                      {countryList.map((ele,index) => (
                        <Link key={index} to={'/details'} state={{ country: ele }} className="dark:bg-[#2b3743] inline-flex gap-1 items-center px-6 py-2 shadow-[0_0_5px_rgb(0,0,0,0.1)] text-sm font-Nunito font-semibold rounded-md leading-none">{ele.name.common}</Link>
                      ))}
                    </div>
                  </div> : ''
                }
            </div>
          </div>
        </div>
      </main>    
    </>
  )
}

export default DetailsPage