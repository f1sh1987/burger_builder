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


export const authSuccess = (token, userId) => {
    return{
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}

export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        },expirationTime*1000);
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
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn))

    })
    .catch(err => {
        console.log(err);
        dispatch(authFail(err.response.data.error));
    });
};
};

export const setAuthRedirectPath = (path) => {
    return{
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}