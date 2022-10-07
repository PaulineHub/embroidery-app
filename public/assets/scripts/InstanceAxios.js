import TokenStorage from "./TokenStorage.js";

// get token of the user logged
const tokenStorage = new TokenStorage();
const token = tokenStorage.getLocalStorage()[0];

// create instance of an axios request with authorization in headers
const reqInstanceAuth = axios.create({});

reqInstanceAuth.interceptors.request.use(config => ({
    ...config,
    headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
    }
}))

export default reqInstanceAuth;
