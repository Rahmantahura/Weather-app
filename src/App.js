import React, { useState, useEffect, useCallback } from 'react';

// Keeping API Key as you had it
const API_KEY = "d0f4be59bdef1b44e117cc4aa681858c"

// --- FIX 1: Defined ForecastCard as a proper, functional component with its necessary return JSX. ---
// This component correctly ACCEPTS the props (day, icon, max, min).
function ForecastCard ({ day, icon, max, min }) {
    // The icon URL logic is correct.
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    return (
        // Added minimal, functional structure to ensure it renders correctly
        <div className="flex flex-col items-center justify-center p-2 bg-white rounded-2xl shadow-lg transition-shadow duration-300 min-w-[100px] hover:bg-[#e5e7eb] cursor:pointer">
            <span className="text-sm font-semibold text-gray-500">{day}</span>
            {/* The icon prop is correctly used here */}
            <img src={iconUrl} alt="Weather icon" className="w-12 h-12 my-1" />
            <div className="flex flex-col items-center">
                {/* The max/min props are correctly used here */}
                <span className="text-lg font-bold text-gray-900">{max}°C</span>
                <span className="text-xs text-gray-400">{min}°C</span>
            </div>
        </div>
    );
}
// --- END FIX 1 ---

// The SearchBar component handles the input and the search button
// It correctly ACCEPTS the state value (city) and handler functions (handleCityChange, handleSearch)
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
        className="p-3 w-full pl-10 pr-40 text-black text-sm font-semibold bg-transparent focus:outline-none focus:ring-2 focus:ring-[#fee25c]"
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

  // === State Management (Correctly owned by App) ===
  const [city, setCity] = useState(''); 
  const [weatherData, setWeatherData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isError, setIsError] = useState(null); 
  const [searchTrigger, setSearchTrigger] = useState(0) // State to trigger fetch on button click
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dailyForecast, setDailyForecast] = useState([])

  // Data processing function (logic untouched)
  const weeklyData = useCallback((data) => {
    const groupedByDate = data.list.reduce((basket, item) => {
      const dateKey = item.dt_txt.split(' ')[0]
      if(!basket[dateKey]) {
        basket[dateKey] = []
      }
      basket[dateKey].push(item);
      return basket;
    }, {})
    const finalDailyForecasts = Object.keys(groupedByDate).map((dateKey) => {
      const dayForecasts = groupedByDate[dateKey];

      const maxTemp = Math.max(...dayForecasts.map(f => f.main.temp_max))
      const minTemp = Math.min(...dayForecasts.map(f => f.main.temp_min))

      const representativeForecast = dayForecasts[3] || dayForecasts[0];
      const icon = representativeForecast.weather[0].icon

      const date = new Date(dateKey);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        day: dayName,
        icon: icon,
        max: Math.round(maxTemp), // Rounding for display
        min: Math.round(minTemp), // Rounding for display
      };
    });

    setDailyForecast(finalDailyForecasts)

  },[setDailyForecast]);

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

  // === Effect Hook for Data Fetching (logic untouched) ===
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
        weeklyData(data)
      } catch (error) {
        setIsError(error.message);
        setWeatherData(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Execute the fetch function when searchTrigger changes
    fetchWeatherData();
    
  }, [searchTrigger, city, weeklyData]) // Added dependencies for useEffect and useCallback

  useEffect (() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timerId)
  }, [])


  const currentForecast = weatherData && weatherData.list && weatherData.list[0] ? weatherData.list[0] : null


  

  // === Render Section ===
 return (
    <div className="bg-[#d6d7db] flex items-start justify-start p-10 sm:p-8 font-sans h-screen w-screen">
      <div className="bg-white min-w-screen max-w-md rounded-l-lg px-[50px] py-[21px] h-full">
        
        <header className=" bg-transparent flex justify-start items-center w-auto p-full">
          <SearchBar
            city={city} 
            handleCityChange={handleCityChange} 
            handleSearch={handleSearch}
          />
        </header>
        
        {/* Main Content Area for Data, Loading, or Error */}
        <div className=" bg-white text-center text-gray-700 flex flex-col items-start justify-start w-full flex-grow">

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
            <div className="flex flex-col bg-white w-auto h-full">
              
              {/* Temperature and Icon */}
              <div className="flex items-start">
                <img 
                  src={`https://openweathermap.org/img/wn/${currentForecast.weather?.[0]?.icon}@2x.png`} 
                  alt={currentForecast.weather[0].description}
                  className="w-64 h-64"
                />
              </div>
              <div className='flex flex-col justify-start items-start'>
              <p className="pb-1 text-6xl font-light text-black-800">
                  {Math.round(currentForecast?.main?.temp ?? 0)}°C
                </p>
                <div className='flex space-x-1'>
                <span className='text-black-900 font-semibold text-lg'>{currentTime.toLocaleDateString('en-US', {weekday:'long'})},</span>
                <span className='text-[#c0c0c0] font-semibold text-lg pb-10 '>{currentTime.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false})}</span></div>
                <p className="text-sm capitalize text-black-500 font-medium pb-1">
                {currentForecast?.weather[0].description}
              </p>
              <p className="text-sm capitalize text-black-500 font-medium pb-1">Rain - {Math.round((currentForecast.pop ?? 0) * 100)}%</p>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl shadow-lg">
    <img 
         
        alt="Aesthetic City Skyline"
        className="w-full h-32 object-cover" // Ensure it covers the space and clips if necessary
    />
</div>

            </div>
          )}

          {/* 4. Default Message */}
          {!isLoading && !isError && !currentForecast && (
            <div className='h-full flex items-center justify-center'>
            <p className="text-gray-500 p-8">Welcome! Enter a city above and hit search.</p>
            </div>
          )}

        </div>
      </div>
      <div className="bg-[#f7f6f9] w-screen h-full rounded-r-lg">
        <header className="flex items-center justify-between p-5">
          <div><h2 className="font-semibold text-lg">Day Outlook</h2></div>
          <div className='flex items-center justify-center gap-x-5'>
          <button className="p-2 rounded-full hover:bg-black hover:text-white">℃</button>
          <button className="p-2 rounded-full hover:bg-black hover:text-white">°F</button>
          <button className="p-2 rounded-full hover:bg-black hover:text-white h-auto w-auto"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class='size-5'>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>
</button>
</div>
        </header>

        
        {/* --- FIX 2: Corrected the map logic to properly render ForecastCard components. --- */}
        {dailyForecast.length > 0 && (
          <div className="flex items-center justify-center p-2">
            <div className="flex justify-center flex-nowrap space-x-8 overflow-x-auto pb-4 w-full">
            {dailyForecast.map((daySummary, index) => (
              // Props are correctly PASSED DOWN from the mapped item to the ForecastCard component
              <ForecastCard
                key={index}
                day={daySummary.day}
                icon={daySummary.icon} 
                max={daySummary.max} 
                min={daySummary.min} 
              />
            ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
export default App;
