import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./SearchBox.css";
import { useState } from 'react';


export default function SearchBox({updateInfo}){
    let [city,setCity] = useState("");
    let [error,setError] = useState(false);
    
    let getWeatherInfo = async () => {
        try {
            let response = await fetch(`${process.env.API_URL}?q=${city}&appid=${process.env.API_KEY}`);
            let jsonResponse = await response.json();
            let finalcall = await fetch(`${process.env.APIF_URL}?lat=${jsonResponse[0].lat}&lon=${jsonResponse[0].lon}&appid=${process.env.API_KEY}&units=metric`);
            let jsonFinalcall = await finalcall.json();
            let result = {
                city: city,
                temp: jsonFinalcall.main.temp,
                tempMin: jsonFinalcall.main.temp_min,
                tempMax: jsonFinalcall.main.temp_max,
                humidity: jsonFinalcall.main.humidity,
                feelsLike: jsonFinalcall.main.feels_like,
                weather: jsonFinalcall.weather[0].description,
        }
            console.log(result);
            return result;
        } catch(err) {
            throw(err);
        }
        
    };

    let handleChange = (evt) => {
        setCity(evt.target.value);
    };

    let handleSubmit = async (evt) => {
        try{
            evt.preventDefault();
            let newinfo = await getWeatherInfo(city);
            updateInfo(newinfo);
        }
        catch(err){
            setError(true);
        }
    };

    return(
        <div className="SearchBox">
            <form onSubmit={handleSubmit}><TextField id="city" label="City Name" variant="outlined" required value = {city} onChange={handleChange}/>
            <br></br><br></br>
            <Button variant="contained" type="submit">Search</Button>
            {error && <p style={{color: "red"}}>No such place exists in the system!</p>}
            </form>
        </div>
    );
}