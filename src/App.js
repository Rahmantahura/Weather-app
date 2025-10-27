import React, { useState, useEffect } from 'react';

  const API_KEY = "d0f4be59bdef1b44e117cc4aa681858c"
  const WORKING_IMAGE_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOIAAACKCAYAAADg3YgOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0AdFW82YAAAgAElEQVR4Xu2dzW8UVRbH597vFpA2L+k+NIFGq0b0m5F4E40/gH7Q2n8B5JtQ/BBEH95bJg+v5EAEiQ8SjQJvYqCjB84gHjz6JkgcI7Uo1LgBixcWjNnZ+57X9x89Z9bdufO06x0HuzOzzj27967Wrl23912hUCAQCAQCgUAgEAgEAoFAnw4wXj75xNf00uXz3370pT9+9IMf/fDHP/7xxz/+8R9+9aG/+9Of/vF/+Md/fvSjH/36g48+8t7Hn/r+hx9/9N///f8/9OhHn3zy2Tf+8JufvP/++y984hOf+5V/+5f/5n/+Z97v3bv39+7du/fmn//857/97W9/+9vf/e73v/99n/70pz/98Y9//OMf/vEP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP//i'

// The SearchBar component handles the input and the search button
function SearchBar ({city, handleCityChange, handleSearch }) {
  return (
    // Container for the whole search bar
    <div className='flex items-center w-full max-w-md relative'>
      
      {/* Search Icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2.5} 
        stroke="currentColor" 
        className="absolute left-3 w-5 h-5 text-gray-500 pointer-events-none" // pointer-events-none ensures you can click through
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      
      {/* Input Field */}
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Search for places..."
        className="p-3 w-full pl-10 pr-20 text-black text-sm font-semibold bg-transparent focus:outline-none focus:ring-2 focus:ring-[#fee25c]"
        onKeyDown={(e) => { // Allow search on Enter key press
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      
      <button 
        onClick={handleSearch} 
        className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 text-black text-sm font-medium bg-transparent hover:bg-black hover:text-white rounded-lg"
        aria-label="Search"
      >
        Search
      </button>
    </div>
  )
}

// The main application component
function App() {

  // === State Management ===
  const [city, setCity] = useState(''); 
  const [weatherData, setWeatherData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isError, setIsError] = useState(null); 
  const [searchTrigger, setSearchTrigger] = useState(0) // State to trigger fetch on button click
  const [currentTime, setCurrentTime] = useState(new Date())

  // Function to trigger the API fetch (runs on button click or Enter key)
  const handleSearch = () => {
    if (city.trim() !== '') {
      setSearchTrigger(prev => prev + 1);
    } else {
      // Clear data if user searches on an empty field
      setWeatherData(null);
      setIsError("Please enter a city name to search.");
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    // Clear any previous error when the user starts typing again
    setIsError(null);
  }

  // === Effect Hook for Data Fetching ===
  // This runs ONLY when searchTrigger changes (i.e., when the button is clicked)
  useEffect(() => {
    // Prevent fetch on initial mount and ensure we only proceed if there's a city to search for
    if (searchTrigger === 0 || city.trim() === '') {
        return;
    }

    const fetchWeatherData = async () => {
      setIsLoading(true);
      setIsError(null);
      
      try {
        // Use city.toLowerCase().trim() for reliable API query
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city.toLowerCase().trim()}&appid=${API_KEY}&units=metric`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          // Check for specific 404 (Not Found)
          if (response.status === 404) {
             throw new Error(`City "${city}" not found. Please check spelling.`);
          }
          // Catch any other errors, including 401 (Unauthorized) if the key is bad
          throw new Error('Could not retrieve data. Check API key status or network.');
        }

        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        setIsError(error.message);
        setWeatherData(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Execute the fetch function when searchTrigger changes
    fetchWeatherData();
    
  }, [searchTrigger]) 

  useEffect (() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timerId)
  }, [])


  const currentForecast = weatherData && weatherData.list && weatherData.list[0] ? weatherData.list[0] : null
  

  // === Render Section ===
  return (
    <div className="bg-[#d6d7db] flex items-start justify-start p-3 sm:p-8 font-sans h-screen w-screen">
      <div className="bg-white min-w-screen max-w-md rounded-l-lg md:pr-10 md:pl-5 md:pt-1">
        
        <header className=" bg-transparent flex justify-start items-center w-auto ">
          <SearchBar
            city={city} 
            handleCityChange={handleCityChange} 
            handleSearch={handleSearch}
          />
        </header>
        
        {/* Main Content Area for Data, Loading, or Error */}
        <div className=" bg-white text-center text-gray-700 flex flex-col items-start justify-start max-w-md md:p-5 ">

          {/* 1. Loading Spinner Conditional */}
          {isLoading && (
            <div className='flex justify-center items-center space-x-3 text-[#fee25c]'>
              <svg 
                className="animate-spin h-8 w-8" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className='text-lg font-medium'>Fetching Data...</p>
            </div>
          )}

          {/* 2. Error Message Conditional */}
          {!isLoading && isError && (
            <div className='text-red-700 font-semibold p-4 bg-red-100 rounded-xl border border-red-300'>
              <p>{isError}</p>
            </div>
          )}
          
          {/* 3. Weather Data Display Conditional (The Weather Card) */}
          {!isLoading && !isError && currentForecast && (
            <div className="flex flex-col bg-white w-auto">
              
              {/* Temperature and Icon */}
              <div className="flex items-start">
                <img 
                  src={`https://openweathermap.org/img/wn/${currentForecast.weather[0].icon}@2x.png`} 
                  alt={currentForecast.weather[0].description}
                  className="w-64 h-64"
                />
              </div>
              <div className='flex flex-col justify-start items-start'>
              <p className="pb-1 text-6xl font-light text-black-800">
                  {Math.round(currentForecast.main.temp)}°C
                </p>
                <div className='flex space-x-1'>
                <span className='text-black-900 font-semibold text-lg'>{currentTime.toLocaleDateString('en-US', {weekday:'long'})},</span>
                <span className='text-[#c0c0c0] font-semibold text-lg pb-10 '>{currentTime.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false})}</span></div>
                <p className="text-sm capitalize text-black-500 font-medium pb-1">
                {currentForecast.weather[0].description}
              </p>
              <p className="text-sm capitalize text-black-500 font-medium pb-1">Rain - {Math.round(currentForecast.pop * 100)}%</p>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl shadow-lg">
    <img 
        src={WORKING_IMAGE_URL} 
        alt="Aesthetic City Skyline"
        className="w-full h-32 object-cover" // Ensure it covers the space and clips if necessary
    />
</div>
            </div>
          )}

          {/* 4. Default Message */}
          {!isLoading && !isError && !currentForecast && (
            <p className="text-gray-500 p-8">Welcome! Enter a city above and hit search.</p>
          )}

        </div>
      </div>
      <div className="bg-[#f7f6f9] w-screen rounded-r-lg">
        <header className="flex gap-x-10 items-center justify-between pr-5 pl-5">
          <div><h2 className="font-semibold text-lg">This week</h2></div>
          <div>
          <button className="p-2 rounded-full hover:bg-black hover:text-white">℃</button>
          <button className="p-2 rounded-full hover:bg-black hover:text-white">°F</button>
          <button className="p-2 rounded-full hover:bg-black hover:text-white h-auto w-auto"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>
</button>
</div>
        </header>
        <div className="flex gap-x-2 p-10">
          <div className="bg-white p-5 rounded-lg h-40 w-40 flex flex-col items-center justify-center">
            <p>Mon</p>
            <img></img>
            <p>{Math.round(currentForecast.main.temp)}°C</p>
          </div>
          <div className="bg-white p-5 rounded-lg h-auto w-auto">
            <p>Tue</p>
            <img></img>
            <p>{Math.round(currentForecast.main.temp)}°C</p>
          </div>
          <div className="bg-white p-5 rounded-lg h-auto w-auto">
            <p>Wed</p>
            <img></img>
            <p>{Math.round(currentForecast.main.temp)}°C</p>
          </div>
          <div className="bg-white p-5 rounded-lg h-auto w-auto">
            <p>Thu</p>
            <img></img>
            <p>{Math.round(currentForecast.main.temp)}°C</p>
          </div>
          <div className="bg-white p-5 rounded-lg h-auto w-auto">
            <p>Fri</p>
            <img></img>
            <p>{Math.round(currentForecast.main.temp)}°C</p>
          </div>
          <div className="bg-white p-5 rounded-lg h-auto w-auto">
            <p>Sat</p>
            <img></img>
            <p>{Math.round(currentForecast.main.temp)}°C</p>
          </div>
          <div className="bg-white p-5 rounded-lg h-auto w-auto">
            <p>Sun</p>
            <img></img>
            <p>{Math.round(currentForecast.main.temp)}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;