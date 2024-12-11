import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/', 
    withCredentials: true, 
});

function remove_user_data_and_redirect() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Handles 401 errors, tries to refresh the token, if it does not work, redirects to login
api.interceptors.response.use(
    response => {
        return response;
    }, 
    async error => {
        if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
            error.config.__isRetryRequest = true;
            if(localStorage.getItem('user') == null) {
                remove_user_data_and_redirect();
            }

            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            if (accessToken) {
                const tokenExpiration = JSON.parse(atob(accessToken.split('.')[1])).exp;
                const currentTime = Math.floor(Date.now() / 1000);  // Current time in seconds
    
                if (tokenExpiration < currentTime) {
                    try {
                        const response = await api.post('/token/refresh/', {
                            refresh: refreshToken,
                        });
    
                        localStorage.setItem('accessToken', response.data.access);
                        localStorage.setItem('refreshToken', response.data.refresh);
                        error.config.headers['Authorization'] = `Bearer ${response.data.access}`;
                    } catch (error) {
                        remove_user_data_and_redirect();
                    }
                } else {
                    error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                error.config.__isRetryRequest = true;
                
                return api(error.config);
            }
        } else if(error.response.status === 401) {
            remove_user_data_and_redirect();
        }
        return error;
    }
);

export default api;
