import {BurgerBuilder} from './BurgerBuilder';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});
//Jest https://jestjs.io/docs/en/using-matchers
//Test Suite
describe('<Burger Builder />', () => {
    let wrapper;
    beforeEach(()=>{
   wrapper = shallow(<BurgerBuilder onInitIngredients={()=>{}} />)
    });
    //individual test
    it('should render <BuildControls when receiving ingredients', ()=> {
       wrapper.setProps({ings: {salad:0}});
        expect(wrapper.find(BuildControls)).toHaveLength(1);
    });

});
