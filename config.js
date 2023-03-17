import Constants from "expo-constants";

const { manifest } = Constants;

if (process.env.NODE_ENV === 'production')
    url = process.env.API_URL;
else
    url = `http://${manifest.debuggerHost.split(':').shift()}:${process.env.PORT}`;

export default {
    API_URL: url
};