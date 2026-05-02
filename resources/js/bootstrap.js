import axios from 'axios';

window.axios = axios;
window.axios.defaults.baseURL = '/';
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept-Language'] = localStorage.getItem('locale') ?? 'en';

window.setLocale = (locale) => {
    window.axios.defaults.headers.common['Accept-Language'] = locale;
    localStorage.setItem('locale', locale);
};
