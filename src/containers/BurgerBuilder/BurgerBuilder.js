import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary';

const INGREDIENT_PRICES = {
    salad:0.5,
    bacon: 0.7,
    cheese:0.4,
    meat: 1.3
}


class BurgerBuilder extends Component {
    constructor(props){
        super(props);
        this.state = {
            ingredients: {
                salad: 0,
                bacon: 0,
                cheese: 0,
                meat: 0
            },
            totalPrice: 4,
            purchaseable: false,
            purchasing: false
        }
    }

    updatePurchaseState(ingredients){
       
        const sum = Object.keys(ingredients)
        .map(igKey => {
        return ingredients[igKey];
        })
        .reduce((sum, el) => {
        return sum+el;
        },0);
      
        this.setState({purchaseable: sum>0});
        
        
    }

    purchaseHandler =() => {
        //has to be arrow fkt for using this ..only when using event
        this.setState({purchasing:true});
    }

addIngredientHandler =(type) => {
const oldCount = this.state.ingredients[type];
const updatedCount = oldCount +1;
const updatedIngredients = {
...this.state.ingredients
};
updatedIngredients[type] = updatedCount;
const priceAddition = INGREDIENT_PRICES[type];
const oldPrice = this.state.totalPrice;
const newPrice = oldPrice+priceAddition;
this.setState({
    totalPrice:newPrice,
    ingredients:updatedIngredients
});
this.updatePurchaseState(updatedIngredients);

}

removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount < 0) { 
    return;
    }
    const updatedCount = oldCount -1;
    const updatedIngredients = {
    ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice-priceDeduction;
    this.setState({
        totalPrice:newPrice,
        ingredients:updatedIngredients
    });
    this.updatePurchaseState(updatedIngredients);
   
}
purchaseCancelHandler = () => {
    this.setState({purchasing:false});
}

purchaseContinueHandler = () => {
    alert('You continue');
}


    render() {
        //copy object
        console.log('render');
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key]= disabledInfo[key] <=0
        }
        console.log(disabledInfo);
        // {salad:true, meat:false,...}
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary 
                    ingredients={this.state.ingredients} 
                    cancel={this.purchaseCancelHandler}
                    continue={this.purchaseContinueHandler}
                    totalPrice={this.state.totalPrice}
                    />
                   
                    </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls ingredientAdded={this.addIngredientHandler} ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo}
                
                price={this.state.totalPrice}
                purchaseable={this.state.purchaseable}
                ordered={this.purchaseHandler}
                />
            </Aux>
        );
    }
}

export default BurgerBuilder;