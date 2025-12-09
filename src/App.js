import React, { useState } from 'react'
import { IoIosSunny } from "react-icons/io";
import { BsCloudRainFill } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { FaCloud } from "react-icons/fa";
import { BsCloudSnowFill } from "react-icons/bs";
import { IoThunderstormSharp } from "react-icons/io5";
import { BsCloudFog2Fill } from "react-icons/bs";
import { BiDroplet } from "react-icons/bi";
import { FaGlassWater } from "react-icons/fa6";
import { FaWind } from "react-icons/fa";
import axios from "axios";

const popularCities = [
  "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad",
  "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Visakhapatnam", "Indore", "Thane",
  "Bhopal", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad",
  "Meerut", "Rajkot", "Kochi", "Coimbatore", "Guwahati", "Chandigarh", "New York", "Los Angeles", "Chicago", "Toronto", "Vancouver", "Mexico City",
  "Buenos Aires", "Sao Paulo", "Rio de Janeiro", "London", "Manchester", "Paris",
  "Berlin", "Rome", "Madrid", "Barcelona", "Lisbon", "Amsterdam", "Vienna", "Zurich",
  "Prague", "Warsaw", "Moscow", "Istanbul", "Dubai", "Doha", "Cairo", "Johannesburg",
  "Cape Town", "Nairobi", "Tokyo", "Osaka", "Seoul", "Bangkok", "Singapore", "Hong Kong",
  "Beijing", "Shanghai", "Sydney", "Melbourne"
]

function App() {

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const [suggestions, setSuggestions] = useState([])
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null)

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setCity(val);
    if (val.length > 0) {
      const matches = popularCities.filter((c) => c.toLowerCase().startsWith(val.toLowerCase())).slice(0, 8);
      setSuggestions(matches);
    } else {
      setSuggestions([])
    }
  }

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear": return <IoIosSunny size={80} stroke="1.5" />;
      case "Clouds": return <FaCloud size={80} stroke="1.5" />;
      case "Rain":
      case "Drizzle": return <BsCloudRainFill size={80} stroke="1.5" />;
      case "Snow": return <BsCloudSnowFill size={80} stroke="1.5" />;
      case "Thunderstorm": return <IoThunderstormSharp size={80} stroke="1.5" />;
      case "Mist":
      case "Fog": return <BsCloudFog2Fill size={80} stroke="1.5" />;
    }
  }

  // const getWeatherData = async (cityName = city) => {
  //   const selectedCity = popularCities.find((c) => c.toLowerCase() === cityName.toLowerCase());
  //   if (!selectedCity) {
  //     alert("please select a valid city name!!!")
  //     return;
  //   }
  //   try {
  //     const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}`);
  //     setWeatherData(res.data)
  //     console.log(res.data);
  //     setCity("");
  //     setSuggestions([]);
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }

  const getWeatherData = async (cityName = city) => {
    const trimmedCity = cityName.trim();

    if (!trimmedCity) {
      alert("Please enter a city name!");
      return;
    }

    try {
      // units=metric gives temp in °C directly
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          trimmedCity
        )}&appid=${apiKey}&units=metric`
      );

      setWeatherData(res.data);
      console.log(res.data);
      setSuggestions([]);
      
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        alert("City not found. Please check the spelling.");
      } else {
        alert("Something went wrong. Try again.");
      }
    }
  };


  const handleSuggestionsClick = (suggestion) => {
    setCity(suggestion);
    getWeatherData(suggestion);
  }

  return (
    <div className="relative px-4 min-h-screen flex items-center justify-center bg-weather-gradient text-gray-900">
      <div className='max-w-5xl w-full shadow-2xl p-8 bg-weather-gradient backdrop-blur-sm rounded-2xl space-y-6 border-white/20'>
        {/* header */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-4 relative'>
          <h1 className='font-bold text-4xl text-slate-800 tracking-wide'>
            Weather Now
          </h1>
          <div className='w-full md:w-auto relative'>
            <div className='flex items-center space-x-3'>
              <input type="text"
                placeholder='Enter a city'
                value={city}
                onChange={handleSearchChange}
                className='px-4 py-2 w-full bg-white/20 placeholder-black/30 text-black border-2 border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-weather-gradient' />
              <button className='p-3 cursor-pointer' onClick={() => getWeatherData()}>
                <IoSearch size={28} className="text-slate-700" />
              </button>
            </div>

            {
              suggestions.length > 0 &&
              <ul className="absolute z-10 w-full bg-white text-black mt-2 rounded-xl overflow-hidden shadow-md max-h-48 overflow-y-auto">
                {
                  suggestions.map((s, index) => (
                    <li key={index} onClick={() => handleSuggestionsClick(s)} className="px-4 py-2 hover:bg-purple-100 cursor-pointer">
                      {s}
                    </li>
                  ))
                }
              </ul>
            }
          </div>
        </div>

        {/* weather display */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-weather-gradient backdrop-blur-sm rounded-xl p-6 shadow-xl space-y-4 md:space-y-0">
          <div className="space-y-2 text-center md:text-left">

            <div className="flex items-start justify-center md:justify-start space-x-2">
              {weatherData && weatherData.main && (
                <>
                  <h2 className="text-7xl md:8xl text-slate-800 font-bold">
                    {Math.round(weatherData.main.temp)}
                  </h2>
                  <span className="text-3xl md:text-5xl text-slate-700 font-bold">°C</span>
                </>
              )}
            </div>

            {weatherData?.weather && (
              <h3 className="text-slate-800 text-xl md:text-2xl font-medium">
                {`${weatherData.name}, ${weatherData.sys.country}`}
              </h3>
            )}

            {weatherData?.name && (
              <h4 className="text-slate-800 text-lg md:text-xl capitalize">
                {weatherData.weather[0].main}
              </h4>
            )}
          </div>

          <div className="text-slate-700">
            {weatherData?.weather
              ? getWeatherIcon(weatherData.weather[0].main)
              : getWeatherIcon("Mist")}
          </div>
        </div>


        {/* info boxes */}
        {/* <div className="grid grid-col-2 md:grid-cols-4 gap-4 text-slate-800">
          <WeatherBox icon={<BiDroplet size={34} />} title={"Humidity"} value={`${weatherData.main.humidity}%`} />
          <WeatherBox icon={<FaGlassWater size={34} />} title={"Pressure"} value={`${weatherData.main.pressure} pHa`} />
          <WeatherBox icon={<FaWind size={34} />} title={"Wind"} value={`${weatherData.wind.speed} km/h`} />
          <WeatherBox icon={<IoIosSunny size={34} />} title={"FeelsLike"} value={`${Math.round(weatherData.main.temp)} °C`} />
        </div> */}
        <div className="grid grid-col-2 md:grid-cols-4 gap-4 text-slate-800">
          <WeatherBox
            icon={<BiDroplet size={34} />}
            title="Humidity"
            value={weatherData ? `${weatherData.main.humidity}%` : "—"}
          />
          <WeatherBox
            icon={<FaGlassWater size={34} />}
            title="Pressure"
            value={weatherData ? `${weatherData.main.pressure} hPa` : "—"}
          />
          <WeatherBox
            icon={<FaWind size={34} />}
            title="Wind"
            value={weatherData ? `${Math.round(weatherData.wind.speed * 3.6)} km/h` : "—"}
          />
          <WeatherBox
            icon={<IoIosSunny size={34} />}
            title="Feels Like"
            value={weatherData ? `${Math.round(weatherData.main.feels_like)}°C` : "—"}
          />
        </div>


      </div>
    </div>
  )
}

const WeatherBox = ({ icon, title, value }) => {
  return (
    <div className="backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-col items-center space-y-2 border border-slate-500 hover:scale-105 transition-transform">
      <div className="text-slate-700">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}

export default App;

