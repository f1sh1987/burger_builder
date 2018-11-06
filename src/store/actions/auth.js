import * as actionTypes from './actionsTypes';
import axios from 'axios';

export const authStart = () => {
    return{
        type: actionTypes.AUTH_START
    }
}


export const authFail = (error) => {
    return{
        type: actionTypes.AUTH_FAIL,
        error:error
    }
}


export const authSuccess = (authData) => {
    return{
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    }
}

//async code

export const auth = (email, password, isSignup) => {
return dispatch => {
    dispatch(authStart());
    const authData = {
        email: email,
        password: password,
        returnSecureToken: true
    };
    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAn9PPe0AXnXSky-Os-EFiZONBUhVAWE4I';
    if(!isSignup){
        url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAn9PPe0AXnXSky-Os-EFiZONBUhVAWE4I';
    }
    axios.post(url, authData)
    .then(response => {
        console.log(response);
        dispatch(authSuccess(response.data))

    })
    .catch(err => {
        console.log(err);
        dispatch(authFail(err));
    });
};
}