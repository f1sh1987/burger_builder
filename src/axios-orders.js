import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-ca53c.firebaseio.com/'
});
export default instance;