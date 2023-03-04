import axios from "axios"; 

const API_Instance = axios.create({
  baseURL : `${process.env.API_URL}/`
});

export default API_Instance;