import React,{Component} from 'react';
import Aux from '../../hoc/Auxs';
import Button from '../UI/Button/Button';
class OrderSummary extends Component {
    //We check this because the Order Summary is wrapped in the modal ==> only import to update if modal is visible
    //This could be a func component
    componentWillUpdate(){
        console.log('[OrdnerSummary]componentWillUpdate()');
    }
    render(){

        const ingredientSummary = Object.keys(this.props.ingredients)
        .map(igKey => {
        return <li key={igKey}><span style={{textTransform:'capitalize'}}>{igKey}</span>:{this.props.ingredients[igKey]}</li>
        });

    return (
<Aux>
    <h3>Your Order</h3>
    <p>A delicious burger with the following ingredients:</p>
    <ul>{ingredientSummary}</ul>
    <p><strong>Total Price: {new Intl.NumberFormat('de-DE', { 
    style: 'currency', 
    currency: 'EUR'
  }).format(this.props.totalPrice)}</strong>
    </p>
    <p>Continue to Checkout</p>
    <Button btnType="Danger" clicked={this.props.cancel}>CANCEL</Button>
    <Button btnType="Success"clicked={this.props.continue}>CONTINUE</Button>

    </Aux>
    );
}

}
export default OrderSummary;