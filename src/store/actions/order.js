import * as actionTypes from './actionsTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    }
};

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
};

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    };
}

//async Action
export const purchaseBurger = (orderData, token) => {
return dispatch => {
    dispatch(purchaseBurgerStart());
    axios.post('/orders.json?auth='+token, orderData)
    .then(response =>   {
        console.log(response.data);
        dispatch(purchaseBurgerSuccess(response.data.name, orderData));
    })
    
    .catch(error => {
        dispatch(purchaseBurgerFail(error));
     });

}
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};

export const fetchOrderStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrderSuccess = (orders) => {
    return{
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    };
};

export const fetchOrderFail = (error) => {
    return{
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        error: error
    };
};

//async action
export const fetchOrders = (token) => {
    return dispatch => {
        dispatch(fetchOrderStart());
        axios.get('/orders.json?auth='+token)
        .then(response=>{
          
            const fetchedOrders = [];
           for(let key in response.data){
               //new object with spread operator with key
            fetchedOrders.push({
                ...response.data[key],
                        id:key
                    });
                           }
            dispatch(fetchOrderSuccess(fetchedOrders));
            
           
        })
        .catch(err=>{
           
            dispatch(fetchOrderFail(err))
        });

    }
}