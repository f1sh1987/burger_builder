import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import {withRouter} from 'react-router-dom';
import Input from '../../../components/UI/Input/Input';
import {connect} from 'react-redux';
class ContactData extends Component{
    state = {
       orderForm:{        
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder:'Your Name'
                },
                value: '',
                validation: {
                    required:true
                },
                valid: false,
                touched:false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder:'Your Street'
                },
                value: '',
                validation: {
                    required:true
                },
                valid: false,
                touched:false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder:'Your ZIP Code'
                },
                value: '',
                validation: {
                    required:true,
                    minLength:5,
                    maxlength:5
                },
                valid: false,
                touched:false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder:'Your Country'
                },
                value: '',
                validation: {
                    required:true
                },
                valid: false,
                touched:false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder:'Your E-Mail'
                },
                value: '',
                validation: {
                    required:true
                },
                valid: false,
                touched:false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options:[
                        {value:'fastest', displayValue: 'Fastest'},
                        {value:'cheapeast', displayValue: 'Cheapest'}
                ]
                },
                value: '',
                validation:{},
                valid: true
            },
          
       },
       formIsValid:false,
        loading:false
    }

    orderHandler = (event) => {
        // prevent sending a request and reload page
        event.preventDefault();

             this.setState({loading:true});
    const formData ={};
    for (let formElementIdentifier in this.state.orderForm){
        formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
    }
    const order = {
        ingredients: this.props.ings,
        price: this.props.price,
        orderData:formData
        
    }
    axios.post('/orders.json', order)
    .then(response =>   {
        this.setState({loading:false})
    this.props.history.push('/');
    })
    
    .catch(error =>this.setState({loading:false}));

    }

    checkValidity (value, rules) {
        let isValid=true;
        if(rules.required) {
            isValid = value.trim() !== '' &&isValid;
        }

        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if(rules.maxLength) {
            isValid = value.length <= rules.maxLength &&isValid
        }
        return isValid;
    }

    inputChangedHandler = (event, InputIdentifier) => {
    const updatedOrderForm = {
     ...this.state.orderForm
 };
 //deeply clone the object f.e. country/street etc.
    const updatedFormElement = {
        ...updatedOrderForm[InputIdentifier]
    };
    updatedFormElement.value=event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedOrderForm[InputIdentifier] = updatedFormElement;
   
    let formIsValid = true;
    for(let InputIdentifier in updatedOrderForm) {
        formIsValid  = updatedOrderForm[InputIdentifier].valid &&formIsValid;
    }

    console.log(formIsValid);
  
    
this.setState({orderForm:updatedOrderForm, formIsValid:formIsValid});

}
    
    render(){
        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id:key,
                config:this.state.orderForm[key]
            });
        }
        let form = (<form onSubmit={this.orderHandler}>
                    {formElementsArray.map(formElement => (
                <Input 
                     elementType={formElement.config.elementType}
                     elementConfig={formElement.config.elementConfig}
                     value={formElement.config.value}
                     key= {formElement.id}
                     invalid={!formElement.config.valid}
                     shouldValidate={formElement.config.validation}
                     touched={formElement.config.touched}
                     changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
            ))}
          <Button btnType="Success" disabled={!this.state.formIsValid}clicked={this.orderHandler}>ORDER</Button>
            </form>);
        if(this.state.loading) {
            form = <Spinner/>
        }
        return(
        <div className={classes.ContactData}>
            <h4>Enter your Contact Data</h4>
            {form}
        </div>
        )
    }

    
}
const mapStateToProps = state =>{
    return{
    ings:state.ingredients,
    price:state.totalPrice
    }
}

export default connect(mapStateToProps)(withRouter(ContactData));