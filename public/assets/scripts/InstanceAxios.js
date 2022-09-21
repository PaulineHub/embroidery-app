axios.get(url, config)

export const instance = axios.create({});
instance.interceptors.request.use(config => ({
    ...config,
    headers: {
        ...config.headers,
        Authorization: localStorage.getItem('my_token'),
    }
}))
instance.interceptors.request.use(config => {
    return {
        ...config,
        headers: {
            ...config.headers,
            Authorization: localStorage.getItem('my_token'),
        }
    }
})
