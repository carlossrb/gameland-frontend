import axios from "axios";

/**
 * Config axios
 */
export default axios.create({
    baseURL: "http://localhost:4000",
    responseType: "json",
    timeout: 60*2*1000
});