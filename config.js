import { ENV, API_URL, PORT } from "@env";
import Constants from "expo-constants";

const { manifest } = Constants;
if (ENV == 'production')
    url = API_URL;
else
    url = `http://${manifest.debuggerHost.split(':').shift()}:`;

export default {
    API_URL: url,
    PORT,
  };