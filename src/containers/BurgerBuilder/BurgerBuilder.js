import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler';

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
            ingredients: null,
            totalPrice: 4,
            purchaseable: false,
            purchasing: false,
            loading:false,
            error:false
        }
    }

    componentDidMount(){
        //get Routing Information about history & match but just for component that were directly routed therefore we need withRouter(Burger.js)
        console.log(this.props);
        axios.get('https://react-my-burger-ca53c.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({
                ingredients: {
                salad:response.data.salad,
                bacon:response.data.bacon,
                cheese:response.data.cheese,
                meat:response.data.meat
                }
            });
        })
        .catch(error => {this.setState({error:error})});
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
  
const queryParams = [];
for(let i in this.state.ingredients) {
    queryParams.push(encodeURIComponent(i)+'=' +encodeURIComponent(this.state.ingredients[i]))
}
queryParams.push('price='+this.state.totalPrice);
const queryString = queryParams.join('&');
this.props.history.push({
    pathname: '/checkout',
    search: '?'+ queryString
});
}


    render() {
        //copy object
              const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key]= disabledInfo[key] <=0
        }
            let orderSummary = null;
            

            let burger = this.state.error? <p>Ingredients can't be loaded</p>:<Spinner/>;

            //check if ingredients are loaded
            if(this.state.ingredients) {
             burger = (
                <Aux>
            <Burger ingredients={this.state.ingredients}/>
            <BuildControls ingredientAdded={this.addIngredientHandler} ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            
            price={this.state.totalPrice}
            purchaseable={this.state.purchaseable}
            ordered={this.purchaseHandler}
            />
            </Aux>
            );
            orderSummary = <OrderSummary 
            ingredients={this.state.ingredients} 
            cancel={this.purchaseCancelHandler}
            continue={this.purchaseContinueHandler}
            totalPrice={this.state.totalPrice}
            />
           
        }
        if(this.state.loading){
            orderSummary = <Spinner/>
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

export default withErrorHandler(BurgerBuilder, axios);