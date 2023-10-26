import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment/moment";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaWind } from 'react-icons/fa';
import { WiHumidity } from "react-icons/wi";
import { AiFillEye } from "react-icons/ai";
import { WiBarometer } from "react-icons/wi";
import { BsBuildings } from "react-icons/bs";
import { ImBin } from "react-icons/im";
import { WiThermometer } from "react-icons/wi";
import { FcInfo } from "react-icons/fc";
import './home.css'

const Home = () => {
  const [weather, setWeather] = useState({});
  const [city, setCity] = useState('Mumbai');
  const [units, setUnits] = useState('metric')
  const [weatherType,setWeatherType]=useState('');
  const [weatherIcon,setWeatherIcon]=useState('');
  const [show, setShow] = useState(false);
  const [saveCity,setSaveCity]=useState('');
  const [savedCity,setSavedCity]=useState([]);
  const[forecastData,setForecastData]=useState([]);
  const[loading,setLoading]=useState(false);
  const [lat,setLat]=useState('');
  const [lon,setLon]=useState('');
  const [airPollution,setAirPollution]=useState([]);
  const[quality,setQuality]=useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

  const time = moment(new Date()).format("hh:mm a");




  


  const getCity = async (cityName) => {
    try {
      const response = await axios.get( `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}&appid=bce43df664d0e37ac21144960c9373fe`);
      setWeather(response.data);
      setWeatherType(response.data.weather[0].main)
      setWeatherIcon(response.data.weather[0].icon)
      setLat(response.data.coord.lat)
      setLon(response.data.coord.lon)
      airQuality(lat,lon)
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };


  useEffect(()=>{
   getCity(city);
   savedCities();
   fetchFiveDayForecast(city);
   airQuality(lat,lon);
   
  },[units,saveCity,lat,lon])

  if(!weather){
    return(
      <div>Loading...</div>
    )
  }

  const iconUrl = `https://openweathermap.org/img/w/${weatherIcon}.png`;



  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelcius = currentUnit === 'C';
    button.innerText = isCelcius ? '°F' : '°C'
    setUnits(isCelcius ? 'metric' : 'imperial')
  }

  const setWeatherBackground = (weatherType) => {
    switch (weatherType) {
      case 'Clear':
        return 'clear-sky';
      case 'Clouds':
        return 'cloudy-sky';
        case 'Haze':
        return 'haze-sky';
        case 'Smoke':
          return 'haze-sky';
        case 'Rain':
          return 'rain-sky';
          case 'Drizzle':
          return 'rain-sky';
          case 'Snow':
          return 'snowy-sky';
          case 'Fog':
            return 'fog-sky';
            case 'Mist':
            return 'fog-sky';
      default:
        return 'default-background';
    }
  };



  const weatherBackgroundClass = setWeatherBackground(weatherType);


  const handleSave= async (e)=>{
    const formData={
      saveCity
    };
    try{
      const response= await axios.post('http://localhost:5000/api/saveCity', formData)
       console.log('City saved successfully:', response.data.message);
       setSaveCity('');
    }catch (error) {
      console.error('Error saving city:', error);
    }
  };

  const savedCities= async()=>{
    try{
      const res = await axios.get('http://localhost:5000/api/getSaveCity')
      setSavedCity(res.data);
    

    }catch (error) {
      console.error('Error fetching saved cities:', error);
    }
  }

  const handleDelete= async(cityId)=>{
    try{
    const response=await axios.delete(`http://localhost:5000/api/deleteCity/${cityId}`);
    const text=response.data.message;
    if(text === 'City deleted'){
      savedCities();
    }
    }catch (error) {
      console.error('Error deleting city:', error);
    }
  }

  const handleClick= async(cities)=>{
getCity(cities)
setCity(cities)

  }

  const fetchFiveDayForecast = (place) => {
    setLoading(true);
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${place}&units=${units}&appid=bce43df664d0e37ac21144960c9373fe`

    axios
      .get(apiUrl)
      .then((response) => {
        const dailyForecast = response.data.list.filter((forecast, index, forecasts) => {
          const currentDate = new Date(forecast.dt_txt).getDate();
          const nextDate = index + 1 < forecasts.length ? new Date(forecasts[index + 1].dt_txt).getDate() : null;
          return currentDate !== nextDate;
        });

        setForecastData(dailyForecast);
        setLoading(false);
      })

      .catch((error) => {
        console.error('Error fetching forecast data:', error);
        setLoading(false);
      });
      console.log(forecastData)
  };


const airQuality= async (latitude,longitude)=>{
try{
  const response= await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=bce43df664d0e37ac21144960c9373fe`)
  setQuality(response.data.list[0].main.aqi)
  setAirPollution(response.data)
}catch (error) {
  console.error('Error getting data:', error);
}
}
console.log(airPollution)

  




  return (
    <div className={`bg ${weatherBackgroundClass}`}>
      <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container fluid className="nav">
          <Navbar.Brand >Weather App</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >

            </Nav>
            <div className="input">
           <div className="saved-cities"> <Button variant="primary" onClick={handleShow}><BsBuildings size={25}/></Button></div>
              <input type="text" value={city} placeholder="Enter City..." onChange={(e) => setCity(e.target.value)} >
              </input>
              <Button variant="primary" onClick={()=>{getCity(city);fetchFiveDayForecast(city);airQuality();}}>Search</Button>
              <div className="degree"> <Button variant="primary" onClick={(e) => handleUnitsClick(e)}>°F</Button></div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  
      <div className="name">
        <div > <p>{weather.name}</p></div> <div> {weather.sys ? <p>,{weather.sys.country}</p> : null}</div>

      </div>
      <div className="temperature">
        <div className="temp-icon"><img src={iconUrl}  width={'130px'} alt="icon"></img> </div> <div className="temp-num"> {weather.main ? <p>{parseInt(weather.main.temp)} °{units === 'metric' ? 'C' : 'F'}</p> : null}</div>
      </div>
      <div className="weather-discrip">{weatherType}

        <div className="weather-title">  <p></p></div>
        <div className="time"><p>Updated as of {time}</p></div>
      </div>
      <div className="min-max">
        <div>{weather.main ? <p>{parseInt(weather.main.temp_max)} °{units === 'metric' ? 'C' : 'F'} /</p> : null}</div>
        <div>{weather.main ? <p>{parseInt(weather.main.temp_min)} °{units === 'metric' ? 'C' : 'F'} </p> : null}</div>
      </div>
      <div className="conditions">
        <div className="attributes">{weather.main ? <p>Feels Like <WiThermometer size={28}/> <div className="values">{parseInt(weather.main.feels_like)} °{units === 'metric' ? 'C' : 'F'}</div> </p> : null}</div>
        <div className="attributes">{weather.wind ? <p>Wind Speed <FaWind /> <div className="values">{weather.wind.speed} m/s</div> </p> : null}</div>
        <div className="attributes">{weather.main ? <p>Humidity<WiHumidity size={25} /><div className="values">{weather.main.humidity}%</div> </p> : null}</div>
        <div className="attributes"><p>Visibility <AiFillEye size={20} /><div className="values">{weather.visibility}</div></p></div>
        <div className="attributes">{weather.main ? <p>Air Pressure<WiBarometer size={25} /> <div className="values"> {weather.main.pressure} hPa</div> </p> : null}</div>
        <div className="attributes"><div className="info"><p style={{marginRight:"0px"}}>Air Quality</p><div></div> {['top'].map((placement) => (
        <OverlayTrigger
          key={placement}
          placement={placement}
          overlay={
            <Tooltip id={`tooltip-${placement}`}>
              Air Quality Index: 1= Good, 2= Fair, 3= Moderate, 4= Poor, 5= Very Poor.
            </Tooltip>
          }
        >
        <div className="info-logo">   <a><FcInfo size={18}/></a></div>
        </OverlayTrigger>
      ))}</div><div className="values">{quality}</div></div>
      </div>
      <div className="forecast-heading"><h3>6 Day Forecast</h3></div>
      <div className="days-forecast">
        {forecastData.map((forecast, index) => (
         
          <div key={index} className="forecast-item">
             <div className="forecast-container">
            <div>{new Date (forecast.dt_txt).toLocaleDateString()}</div>
            <div className="forecast-attributes">
            <div><img src={`https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`} alt="Icon" height={90} width={90}></img></div>
            <div className="forecast-data">
            <div>{parseInt(forecast.main.temp_max)}°</div>
            <div>{parseInt(forecast.main.temp_min)}°</div>
            </div>
            </div>
            </div>
          </div>
          
        ))}
      </div>
      <div className="modal">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Cities</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                placeholder="Add City..."
                value={saveCity}
                onChange={(e)=>setSaveCity(e.target.value)}
              />
            </Form.Group>
          </Form>

          <div className="saved-cities">
            {
              savedCity.map((city)=>(
              <div className="city-name" key={city.id}> <a onClick={()=>{handleClick(city.city_name);fetchFiveDayForecast(city.city_name,units);handleClose();}}> <p>{city.city_name}</p></a> <Button variant="primary" onClick={()=>{handleDelete(city.id)}}><ImBin size={21}/></Button></div>
              ))
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      
    </div>

    

    
  )
}
export default Home;