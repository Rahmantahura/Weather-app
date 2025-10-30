import React, { useState, useEffect, useCallback } from 'react';
import { Gauge, Wind, Sun, Droplets, Eye, Cloud } from 'lucide-react';


const API_KEY = "d0f4be59bdef1b44e117cc4aa681858c"
const IMAGE_URL = "https://images.unsplash.com/photo-1628536250739-06f5353d6364?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fEFlc3RoZXRpYyUyMGNpdHklMjBza3lsaW5lfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"

const formatTime = (timeStamp) => {
const date = new Date(timeStamp * 1000);
return date.toLocaleString('en-US', { hour:'numeric', minute:'numeric', hour12:true});
}

const getHighlightedIcons = (title) => {
switch (title) {
case 'Air Pressure':
return <Gauge className="size-12 text-gray-500" />;

case 'Wind Speed':
return <Wind className="size-12 text-gray-500" />;

case 'Sunrise':
return <Sun className="size-12 text-gray-500" />;

case 'Humidity':
return <Droplets className="size-12 text-gray-500" />;

case 'Visibility':
return <Eye className="size-12 text-gray-500" />;

case 'Cloudiness':
return <Cloud className="size-12 text-gray-500" />;

}
}
function ForecastCard ({ day, icon, max, min }) {
const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

return (
<div className="flex flex-col items-center justify-center p-2 bg-white rounded-2xl shadow-lg transition-shadow duration-300 min-w-[100px] hover:bg-[#e5e7eb] cursor-pointer py-1 shrink-0">
<span className="text-sm font-semibold text-gray-500">{day}</span>
<img src={iconUrl} alt="Weather icon" className="w-12 h-12 my-1" />
<div className="flex flex-col items-center">
<span className="text-lg font-bold text-gray-900">{max}°C</span>
<span className="text-xs text-gray-400">{min}°C</span>
</div>
</div>
);
}

function HighlightCard ({ title, value, details }) {
const IconComponent = getHighlightedIcons(title)
return (
<div className='flex flex-col justify-center items-start bg-white rounded-xl shadow-lg transition duration-300 w-full h-full p-3 pl-5 cursor-pointer hover:bg-[#e5e7eb]'>
<span className="text-lg font-medium text-gray-500 mb-3">{title}</span>
<div className="flex items-center space-x-2 mb-3 ">
{IconComponent}
</div>
<div className="flex items-end space-x-1">
<span className="text-3xl font-semibold text-gray-900 mr-5">{value}<span className="text-3xl font-semibold text-gray-900">{details}</span></span>
</div>
</div>
)
}
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
className="p-3 w-full pl-10 pr-24 text-black text-sm font-semibold bg-transparent focus:outline-none focus:ring-2 focus:ring-[#e5e7eb]"
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

function RainWarning ({ maxRainChance, onClose }) {
return (
<div className='fixed inset-0 z-50 flex bg-black/50 items-center justify-center p-4'>
<div className='bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm relative'>
<button onClick={onClose} className='absolute top-2 right-2 p-1 text-gray-500 hover:text-white p-2 hover:bg-[#e81123]'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" class="size-6">
<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</button>
<h3 className="text-xl font-bold text-red-600 mb-2">Rain Warning !</h3>
<p className="text-sm text-gray-700">
A high probability of rain has been detected in the next 48 hours.
</p>
<div className="mt-4 p-3 bg-red-100 rounded-lg text-center">
<p className="text-2xl font-extrabold text-red-800">
{maxRainChance}% Chance
</p>
</div>
<div className="flex items-center justify-center">
<p className="text-sm text-gray-700 mt-2">(Click on the notification bell to disable this setting)</p>
</div>
</div>
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
const [searchTrigger, setSearchTrigger] = useState(0)
const [currentTime, setCurrentTime] = useState(new Date())
const [dailyForecast, setDailyForecast] = useState([])
const [highlights, setHighlights] = useState([])
const [isNotificationOn, setIsNotificationOn] = useState(true)
const [showRainWarning, setShowRainWarning] = useState(false)
const [maxRainChance, setMaxRainChance] = useState(0)


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
max: Math.round(maxTemp),
min: Math.round(minTemp),
};
});

setDailyForecast(finalDailyForecasts)

},[setDailyForecast]);

// Function to display the highlights area

const highlightData = (data) => {
const currentData = data.list[0];

const Pressure = currentData.main.pressure
const WindSpeed = currentData.wind.speed
const Sunrise = data.city.sunrise
const Humidity = currentData.main.humidity
const Visibility = currentData.visibility
const Cloudiness = currentData.clouds.all

return [
// FIX: Added units for hPa, % for humidity/cloudiness, and cleaned up Wind/Sunrise units
{ title: 'Air Pressure', value: Pressure, details: 'hPa'},
{ title: 'Wind Speed', value: Math.round(WindSpeed * 3.6), details:'Km/h'},
{ title: 'Sunrise', value: formatTime(Sunrise), details: ''}, // formatTime includes AM/PM
{ title: 'Humidity', value: Humidity, details: '%'},
{ title: 'Visibility', value: Math.round(Visibility / 1000), details: 'Km'},
{ title: 'Cloudiness', value: Cloudiness, details: '%'},
]
}

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
setHighlights(highlightData(data))
const nearFutureForecast = data.list.slice(0, 16)
const pops = nearFutureForecast.map(item => item.pop || 0)
const maxPopValue = Math.max(...pops)
const maxChancePercent = Math.round(maxPopValue * 100)
setMaxRainChance(maxChancePercent)
if (isNotificationOn && maxPopValue > 0.5) {
setShowRainWarning(true)
}
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

const toggleNotifications = () => {
setIsNotificationOn(prev => !prev)
if (isNotificationOn) {
setShowRainWarning(false)
}
}

const currentForecast = weatherData && weatherData.list && weatherData.list[0] ? weatherData.list[0] : null

// === Render Section ===
return (
<div className="bg-[#d6d7db] p-4 sm:p-8 font-sans min-h-screen w-full flex flex-col lg:flex-row lg:gap-3 sm:gap-5 lg:h-screen lg:overflow-hidden gap-3">
<div className="bg-white w-full lg:w-[350px] xl:w-[450px] lg:max-w-md rounded-xl lg:rounded-l-xl lg:rounded-r-none p-6 lg:p-8 flex flex-col shrink-0 lg:mb-0 lg:h-full overflow-y-auto ">

<header className=" bg-transparent flex justify-start items-center w-auto p-full">
<SearchBar
city={city}
handleCityChange={handleCityChange}
handleSearch={handleSearch}
/>
</header>

{/* Main Content Area for Data, Loading, or Error */}
<div className=" bg-white text-center text-gray-700 flex flex-col items-start justify-start w-full flex-grow rounded-lg mt-1">

{/* 1. Loading Spinner Conditional */}
{isLoading && (
<div className='flex justify-center items-center space-x-3 text-[#e5e7eb] w-full h-full min-h-[300px]'>
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
<div className='text-red-700 font-semibold p-4 bg-red-100 rounded-xl border border-red-300 overflow-auto
flex items-center justify-center mt-10 w-full break-words'>
<p>{isError}</p>
</div>
)}

{/* 3. Weather Data Display Conditional (The Weather Card) */}
{!isLoading && !isError && currentForecast && (
<div className="flex flex-col bg-white rounded-lg w-full h-full">

{/* Temperature and Icon */}
<div className="flex items-start">
<img
src={`https://openweathermap.org/img/wn/${currentForecast.weather?.[0]?.icon}@2x.png`}
alt={currentForecast.weather[0].description}
className="w-32 h-32 sm:w-64 sm:h-64"
/>
</div>
<div className='flex flex-col justify-start items-start'>
<p className="pb-1 text-5xl sm:text-6xl font-light text-black-800">
{Math.round(currentForecast?.main?.temp ?? 0)}°C
</p>
<div className='flex space-x-1'>
<span className='text-black-900 font-semibold text-base sm:text-lg'>{currentTime.toLocaleDateString('en-US', {weekday:'long'})},</span>
<span className='text-[#c7c7c6] font-semibold text-base sm:text-lg pb-5'>{currentTime.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false})}</span></div>
<p className="text-sm capitalize text-black-500 font-medium pb-1">
{currentForecast?.weather[0].description}
</p>
<p className="text-sm capitalize text-black-500 font-medium pb-1">Rain - {Math.round((currentForecast.pop ?? 0) * 100)}%</p>
</div>
<div className="mt-2 overflow-hidden rounded-xl shadow-lg relative ">
<img src={IMAGE_URL}alt="Aesthetic City Skyline" className="w-full h-32 object-cover" />
<div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/100 to-transparent">
<p className="text-white text-xl font-bold">
{weatherData.city.name}, {weatherData.city.country}
</p>
</div>
</div>

</div>
)}

{/* 4. Default Message */}
{!isLoading && !isError && !currentForecast && (
<div className='h-full flex items-center justify-center w-full'>
<p className="text-gray-500 p-8">Welcome! Enter a city above and hit search.</p>
</div>
)}

</div>
</div>
<div className="bg-[#f7f6f9] w-full h-auto lg:h-full rounded-xl lg:rounded-r-xl lg:rounded-l-none flex-grow overflow-y-auto">
<header className="flex items-center justify-between p-4 sm:px-6 lg:px-10 pt-4">
<div><h2 className="font-semibold text-lg pl-4">Day Outlook</h2></div>
<div className='flex items-center justify-center gap-x-5'>
<button onClick={toggleNotifications}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
className={`size-5 transition-colors ${isNotificationOn ? 'text-black' : 'text-gray-400'}`} >
<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
</svg>

</button>
</div>
</header>{dailyForecast.length > 0 && (
<div className="flex flex-col items-center justify-center mt-0">
<div className="flex justify-center flex-nowrap space-x-4 sm:space-x-6 overflow-x-auto p-4 sm:p-6 lg:px-10 pb-4 py-0 w-full mb-1">{dailyForecast.map((daySummary, index) => (
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
{highlights.length > 0 && (
<div className='p-4 sm:p-3 lg:px-10'>
<h2 className="font-semibold text-xl mb-4">Today's Highlights</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
{highlights.map((item, index) => (
<HighlightCard
key={index}
title={item.title}
value={item.value}
details={item.details}
/>
))}
</div>
</div>
)}

{showRainWarning && (
<RainWarning
maxRainChance={maxRainChance}
onClose={() => setShowRainWarning(false)}
/>
)}
</div>
</div>
);
}
export default App;
