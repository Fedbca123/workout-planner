import Constants from "expo-constants";

const { manifest } = Constants;
//console.log(process.env.ENV);
if (process.env.ENV === 'production')
    url = process.env.API_URL;
else
    url = `http://${manifest.debuggerHost.split(':').shift()}:${process.env.PORT}`;

export default {
    API_URL: url
};