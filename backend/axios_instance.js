import axios from "axios"; 
import config from "../config.js";

console.log('in instance', config.API_URL)
const API_Instance = axios.create({
  baseURL : `${config.API_URL}/`
});

export default API_Instance;