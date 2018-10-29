import React, {Component} from 'react';
import Aux from '../../hoc/Auxs';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler';
import {connect} from 'react-redux';
import * as burgerBuilderActions from '../../store/actions/index';


class BurgerBuilder extends Component {
    constructor(props){
        super(props);
        this.state = {
            purchasing: false

        }
    }

    componentDidMount(){
       this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients){
       
        const sum = Object.keys(ingredients)
        .map(igKey => {
        return ingredients[igKey];
        })
        .reduce((sum, el) => {
        return sum+el;
        },0);
      console.log(this.props.ings);
       return sum>0
        
        
    }

    purchaseHandler =() => {
        //has to be arrow fkt for using this ..only when using event
        this.setState({purchasing:true});
    }


purchaseCancelHandler = () => {
    this.setState({purchasing:false});
}

purchaseContinueHandler = () => {
  

this.props.history.push('/checkout');
}


    render() {
        //copy object
              const disabledInfo = {
            ...this.props.ings
        };
        for(let key in disabledInfo){
            disabledInfo[key]= disabledInfo[key] <=0
        }
            let orderSummary = null;
            

            let burger = this.props.error? <p>Ingredients can't be loaded</p>:<Spinner/>;

            //check if ingredients are loaded
            if(this.props.ings) {
             burger = (
                <Aux>
            <Burger ingredients={this.props.ings}/>
            <BuildControls ingredientAdded={this.props.onIngredientAdded} ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            
            price={this.props.totalPrice}
            purchaseable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            />
            </Aux>
            );
            orderSummary = <OrderSummary 
            ingredients={this.props.ings} 
            cancel={this.purchaseCancelHandler}
            continue={this.purchaseContinueHandler}
            totalPrice={this.props.totalPrice}
            />
           
        }
      
      
       
        // {salad:true, meat:false,...}
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                  {orderSummary}
                   
                    </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        totalPrice: state.totalPrice,
        error: state.error
    }
}
const mapDispatchtoProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(burgerBuilderActions.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(burgerBuilderActions.removeIngredient(ingredientName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
    }
}

export default connect(mapStateToProps,mapDispatchtoProps)(withErrorHandler(BurgerBuilder,axios));