import { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'
import '../index.css'
import Loading from './loading';

function WeatherApp() {

  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, handleLoading] = useState(false);

  const months = {
    1: "January",
    2: "Februrary",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  }

  const weatherIcons = {
    "rain": 'images/rain.png',
    "cloudy": 'images/clouds.png',
    "partly-cloudy-day": 'images/partial-cloud.png',
    "clear-day": 'images/sun.png',
    "snow": 'images/snowy.png',
  }


  const handleCityChange = (e) => {
    setCity(e.target.value);
  }

  const convertToF = (temp) => {
    return Math.round( (temp * 9/5) + 32 )
  }

  const getDayOfWeek = (date) => {
    const d = new Date(date)
    const daysOfTheWeek = {
      0: 'Monday',
      1: 'Tuesday',
      2: 'Wednesday',
      3: 'Thursday',
      4: 'Friday',
      5: 'Saturday',
      6: 'Sunday',
    }
    let day = d.getDay()
    return daysOfTheWeek[day]
  }

  
  const convertTime = (time) => {
    const date = new Date(time * 1000);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();

    const formattedDate = `${months[month] < 10 ? '0' : ''}${months[month]} ${day < 10 ? '0' : ''}${day}, ${year}`;

    console.log(formattedDate);
    return formattedDate

  }

  
  const getWeatherData = (selectedCity = 'tampa') => {
    handleLoading(true);
    axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city?city:selectedCity}?unitGroup=metric&key=DSXF4X68F6S6MBDAAMYY38ZT5&contentType=json`)
    .then((response) => {
      setWeatherData(response.data);
      console.log(response.data);
      handleLoading(false);
    }).catch((err) => {
      console.log("We could not find any weather data on this city", err)
    })
  }

  useEffect(() => {
    getWeatherData()
  }, [])

  return (
    <>
      <div className="flex h-[700px] bg-cover bg-no-repeat justify-center bg-[url('./images/weather-background.jpg')]">
        <div className="relative h-full w-full rounded-3xl shadow-md overflow-hidden flex flex-col w-full justify-end">
          <div className="absolute top-10 right-10 flex">
            <input
              className=" bg-gray-200 px-7 py-2 rounded-full focus:border-transparent focus:outline-none"
              type="text"
              placeholder="type a city..."
              value = {city}
              onChange={handleCityChange}
            ></input>

            {loading && (
              <Loading />
            )}
            {!loading && (
              <button className="pl-7" onClick={getWeatherData}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            )}
            
          </div>
          {weatherData && (
            <div className="absolute top-10 left-10 text-white font-bold">
              <div className="text-[20px]">{weatherData.resolvedAddress}</div>
              <div className="text-[100px]">{convertToF(weatherData.currentConditions.temp)} ° F</div>
              <div className="text-[20px]">{getDayOfWeek(weatherData.days[0].datetime)}</div>
              <div className="text-[20px]">{convertTime(weatherData.currentConditions.datetimeEpoch)}</div>
              <div>{weatherData.days[0].conditions}</div>
              <div className="flex mt-20 gap-x-10 w-full">
                <div>Humidity: {weatherData.currentConditions.humidity} %</div>
                <div>Precipitation: {weatherData.days[0].precipprob ?? 0} %</div>
                <div>High: {convertToF(weatherData.days[0].tempmax)}° F</div>
                <div>Low: {convertToF(weatherData.days[0].tempmin)}° F</div>
              </div>
            </div>
          )}
            <div className=" flex justify-between gap-x-5 mb-20 mx-5 ">
              {weatherData && (
                weatherData.days.slice(0, 7).map((day, index) => {
                  return <div className=" p-3 flex-col shadow-lg w-[150px] h-[150px]" key={index}>
                      <div className=" pb-2 text-lg font-bold">{getDayOfWeek(day.datetime)}</div>
                      <img src={weatherIcons[day.icon]} className="h-10 w-10"></img>
                      <div className="text-sm pt-4">High: {convertToF(day.tempmax)}°</div>
                      <div className="text-sm">Low: {convertToF(day.tempmin)}°</div>
                  </div>
                })
              )}
            </div>
        </div>
      </div>
    </>
  )
}

export default WeatherApp