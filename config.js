import Constants from "expo-constants";

const { manifest } = Constants;

if (Constants.expoConfig.extra && Constants.expoConfig.extra.APP_ENV === 'production'){
    url = process.env.API_PROD_URL;
    console.log('production');
} else{
    url = `http://${manifest.debuggerHost.split(':').shift()}:${process.env.PORT}`;
    console.log("development");
}
export default {
    API_URL: url
}