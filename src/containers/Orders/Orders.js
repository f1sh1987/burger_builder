import React, {Component} from 'react';
import Order from '../../components/Order/Order';
import {connect} from 'react-redux';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component{

 

componentDidMount(){
 //   console.log(this.props.token);
this.props.onFetchOrders(this.props.token, this.props.userId);
}

    render(){
        let orders = <Spinner />;
            if(!this.props.loading) {
orders =             this.props.orders.map(order => (
    <Order key={order.id} ingredients={order.ingredients} price={order.price}/>
))
            }
        return(
            <div>
       {orders}

        </div>
        );
    }

  
}

const mapStateToProps = state => {
    return{
        orders:state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapsDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    }
        
}
export default connect(mapStateToProps, mapsDispatchToProps)(withErrorHandler(Orders, axios));