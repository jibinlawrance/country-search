import { React, useEffect, useRef, useState, } from 'react'
import axios from 'axios';
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import thousandSeperator from '../../constants/thousandSeperator'
import LazyLoad from 'react-lazyload';

function HomePage({toggleDarkMode}) {

    const [filterOpen, setFilterOpen] = useState(false);
    const [filterLabel, setFilterLabel] = useState('Filter by Region');
    const [countries, setCountries] = useState([]);
    const [updatedCountries, setUpdatedCountries] = useState([]);
    const [countrySearch, setCountrySearch] = useState('');
  
  
    const toggleFilter = () => {
      setFilterOpen((prevVal) => !prevVal)
    };
  
    const updateFilterLabel = (label) => {
      setFilterLabel(() => label)
      setFilterOpen(false)
      setCountrySearch(() => '')
    }
  
    const handleCountrySearch = (e) => {
      updateCountryList(e.target.value)
      setCountrySearch(e.target.value)
    }
  
    const updateCountryList = (inputVal) => {
      if(inputVal){
        setUpdatedCountries(() => (
          countries.filter( ele => (
            ele.name.common.toLowerCase().includes(inputVal.toLowerCase())
          ))
        ));
      } else {
        setUpdatedCountries([]);
      }
    }
  
    const dropDownRef = useRef();
  
    const filterRegion = ["Africa", "America", "Asia", "Europe", "Oceania", "All"]
  
    useEffect(() => {
      const handleClick = (e) => {
        if (!dropDownRef.current.contains(e.target)) {
          setFilterOpen(false)
        }
      };
      window.addEventListener("click", handleClick);
  
      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener("click", handleClick);
      };
    }, [filterOpen]);
  
    useEffect(() => {
      axios.get('https://restcountries.com/v3.1/all')
        .then(response => {
          setCountries(response.data);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }, []);
  
    useEffect(() => {
      if(filterLabel !== 'Filter by Region' && filterLabel !== 'All'){
        axios.get(`https://restcountries.com/v3.1/region/${filterLabel}`)
        .then(response => {
          setCountries(response.data);
          // console.log(response.data);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });      
      }else if(filterLabel === 'All'){
        axios.get(`https://restcountries.com/v3.1/all`)
        .then(response => {
          setCountries(response.data);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
      }
    }, [filterLabel])
  
    const cardTemplate = (countryArr) => (
      <div className="flex flex-wrap gap-4">
      { countryArr.map((country, index) => (
          <Link to={'/details'} state={{ country: country }} key={index} className="w-full flex flex-col min-[568px]:w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)] shadow-[0_0_15px_rgb(0,0,0,0.1)] rounded-md overflow-hidden">
            <LazyLoad >
              <img src={country.flags.png} alt={country.flags.alt} className="w-full aspect-video object-cover" />
            </LazyLoad>
            <div className="dark:bg-[#2b3743] dark:text-white p-5 pb-6 font-Nunito bg-white shadow-inner h-full">
              <h1 className="font-bold text-lg mb-4">{country.name.common}</h1>
              <p><span className="font-semibold">Population:</span> {thousandSeperator(country.population)}</p>
              <p><span className="font-semibold">Region:</span> {country.region}</p>
              <p><span className="font-semibold">Capital:</span> {country.capital?.map((ele, index, arr) => `${ele}${index != arr.length-1 ? ', ':''}`)}</p>
            </div>
          </Link>
        ))}  
      </div>
    )    
  
    return (
    <>
      <Header toggleDarkMode={toggleDarkMode}/>
      <main className="dark:bg-[#202d36] min-h-[calc(100vh-68px)]">
        <div className="max-w-[1320px] mx-auto py-12 px-5">
          <div className="flex justify-between flex-wrap mb-12 gap-6">
            <label className="relative block max-w-md w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-6">
                <svg className="h-5 w-5 fill-slate-300" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <span className="sr-only">Search</span>
              <input
                type="text"
                name="search"
                className="dark:bg-[#2b3743] dark:text-white block bg-white font-Nunito font-semibold w-full rounded-md py-4 pl-16 pr-6 shadow-[0_0_15px_rgb(0,0,0,0.1)] placeholder:text-slate-400 focus:outline-none sm:text-sm"
                placeholder="Search for a country..."
                onChange={handleCountrySearch}
                value={countrySearch}
              />
            </label>
            <div
              ref={dropDownRef}
              className="dark:bg-[#2b3743] dark:text-white max-w-[200px] w-full font-Nunito font-semibold leading-none w-full rounded-md shadow-[0_0_15px_rgb(0,0,0,0.1)] relative cursor-pointer"
            >
              <div
                className="flex justify-between items-center p-4"
                onClick={toggleFilter}
              >
                <div className="fliter-label-text">{filterLabel}</div>
                <ChevronDownIcon
                  className={`-mr-1 h-5 w-5 text-gray-400 ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </div>
              <ul
                className={`dark:bg-[#2b3743] dark:text-white absolute w-full rounded-md shadow-[0_0_15px_rgb(0,0,0,0.1)] top-[calc(100%+5px)] left-0 overflow-hidden ${
                  !filterOpen ? "hidden" : ""
                }`}
              >
                {
                  filterRegion.map((ele,index) => (
                    <li 
                      key={index} 
                      className="dark:bg-[#2b3743] dark:text-white dark:hover:bg-[#202d36cf] py-3 px-4 first:pt-4 last:pb-4 bg-white hover:bg-gray-100"
                      onClick={() => updateFilterLabel(ele)}
                      >
                      {ele}
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
            { 
              updatedCountries.length ? 
                cardTemplate(updatedCountries)
              :            
              countries.length ? 
                cardTemplate(countries)
              : 
              "loding..."
            }
        </div>
      </main>
    </>
  )
}

export default HomePage