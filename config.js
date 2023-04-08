import Constants from "expo-constants";

const { manifest } = Constants;

if (!Constants.expoConfig.extra)
    console.log("Constants undefined");
else{
    console.log("Constants", Constants.expoConfig.extra.APP_ENV);
}

if (Constants.expoConfig.extra && Constants.expoConfig.extra.APP_ENV === 'production')
    url = process.env.API_URL;
else
    url = `http://${manifest.debuggerHost.split(':').shift()}:${process.env.PORT}`;

export default {
    API_URL: url
};