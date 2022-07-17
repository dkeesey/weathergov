import './App.css';
import React from 'react';

const { useState } = React;

function App() {
  const [lat, setLat] = useState('37.8044');
  const [long, setLong] = useState('-122.2712');
  const [forecast, setForcast] = useState('No forecast available');
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [cityState, setCityState] = useState('Piedmont, CA');
  // const [state, setState] = useState('CA');

  const ForecastTitle = ({ cityState }) => (
    <h2>Today's Forecast in {cityState}</h2>
  );

  const HourlyForecastTitle = ({ cityState }) => (
    <h2>Hourly Forecast in {cityState}</h2>
  );

  const Forecast = ({ forecast }) => (
    <div className="forecast">
      {forecast ? forecast : 'No Forecast Available'}
    </div>
  );

  const HourlyForecast = ({ hourlyForecast }) => {
    console.log('hourly forecast: ', typeof hourlyForecast, hourlyForecast);
    return (
      <>
        <div className="hourlyForecastContainer">
          {hourlyForecast.map((period) => {
            const currentHour = new Date(period.startTime).getHours();
            return (
              <div key={period.number} className="hourlyPeriod">
                <p>
                  <img
                    src={period.icon}
                    alt={period.shortForecast}
                    height={56}
                    width={56}
                  />
                </p>
                <p>
                  {currentHour < 12 //must be expression; if currentHour < 12
                    ? currentHour === 0
                      ? '12AM' //if currentHour is 0, set to 12AM
                      : `${currentHour}AM` //otherwise, set to currentHour AM
                    : currentHour === 12 //if currentHour is 12, set to 12PM
                    ? '12PM' // otherwise, set to currentHour PM
                    : `${currentHour - 12}PM`}
                </p>
                <p>{period.shortForecast}</p>
                <p>
                  {period.temperature}
                  {period.temperatureUnit}
                </p>
              </div>
            );
          })}
        </div>
      </>
    );
  };
  const getWeather = async () => {
    const POINTS_URL = `https://api.weather.gov/points/${lat},${long}`;
    // Step #1 - Get Weather for Lat/Long (use POINTS_URL)
    // Step #2 - Get a response from the resulting "properties.forecast" endpoint
    // Step #3 - Get a response from the resulting "properties.forecastHourly" endpoint
    // Step #4 - Display the data from "properties.periods" returned by #2
    // Step #5 - Display the next 12 hours' forecast data from "properties.periods" returned by #3
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(POINTS_URL, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        fetch(data.properties.forecast)
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
            setForcast(data.properties.periods[0].detailedForecast);
          })
          .catch((error) => console.log('error', error));
        fetch(data.properties.forecastHourly)
          .then((response) => response.json())
          .then((data) => {
            // console.log(
            //   'hourly forecast: ',
            //   Object.values(data.properties.periods.slice(0, 4))
            // );
            let hourlyF = Object.values(data.properties.periods.slice(0, 12));
            setHourlyForecast(hourlyF);
          })
          .catch((error) => console.log('error', error));
      })
      .catch((error) => console.log('error', error));
  };

  const handleLongChange = (event) => {
    setLong(event.target.value);
  };
  const handleLatChange = (event) => {
    setLat(event.target.value);
  };

  return (
    <div className="App">
      <h1>Using Weather.gov public API with React </h1>
      <div className="input">
        <label htmlFor="latitude">Latitude</label>{' '}
        <input value={lat} id="latitude" onChange={handleLatChange} />
      </div>

      <div className="input">
        <label htmlFor="longitude">Longitude</label>{' '}
        <input value={long} id="longitude" onChange={handleLongChange} />
      </div>

      <br />
      <div className="formButton">
        <button onClick={getWeather}>Get the weather?</button>
      </div>
      <div className="weather">
        <ForecastTitle cityState={cityState} />
        <Forecast forecast={forecast} />

        <HourlyForecastTitle cityState={cityState} />
        <HourlyForecast hourlyForecast={hourlyForecast} />
      </div>
    </div>
  );
} // end of App

export default App;
