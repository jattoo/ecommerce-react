import React from 'react'
import { Container, Box, Heading, Text, TextField } from 'gestalt'
import { Elements, StripeProvider, injectStripe, CardElement } from 'react-stripe-elements'
import Strapi from 'strapi-sdk-javascript/build/main';
import ConfirmationModal from './ConfirmationModal'
import ToastMessage from "./ToastMessage";
import { getCart, calculatePrice, clearCart, calculateAmount} from  './../utils/index'
import { withRouter } from 'react-router-dom'

//api url
const apiUrl = process.env.API_URL || 'http://localhost:1337';
// strapi constructor
const strapi = new Strapi(apiUrl);


class _CheckOutForm extends React.Component{
    state= {
        cartItems: [],
        address: '',
        postalCode: '',
        city: '',
        country: '',
        confirmationEmailAddress: '',
        toast: false,
        loading: false,
        toastMessage: '',
        orderProcessing: false,
        modal: false
    }


    //component did mount
    componentDidMount() {
        this.setState({
            cartItems: getCart()
        })
    }




    //handlechange function
    handleChange = ({ event, value }) => {
        event.persist()
        this.setState({ 
            [event.target.name]: value
        })
    }

    //handle submit
    handleConfirmOrder = async event => {
        event.preventDefault();
        //validation empty forms
        if(this.isFormEmpty(this.state)){
            this.showToast('Kindly complete all fields')
            return;
        }
        //to show the modal 
        this.setState({
            modal: true
        })
    }

    //returns true if any this values are empty
    isFormEmpty = ({ address, postalCode, city, country, confirmationEmailAddress }) => {
        return !address || !postalCode || !city || !confirmationEmailAddress || !country;
    }

    //showtoast
    showToast = (toastMessage, redirect = false ) => {
        this.setState({toast: true, toastMessage}) 
        //set the message to a time interval
        setTimeout(() => this.setState({ toast: false, toastMessage: ""},
            //if true redirect to 'redirect' argument, redirect home
         () => redirect && this.props.history.push('/')
        ),5000);
    } 

    //handler order confirmation modal
    handleSubmitOrder = async () => {
        const { cartItems, city, address, postalCode, country} = this.state;

        //create amount variable
        const amount = calculateAmount(cartItems);

        //process our order
        this.setState({ orderProcessing: true});
        let token;
        try {
            console.log('create-token: ', this.props.stripe)
            //create stripe token
            const res = await this.props.stripe.createToken();
            console.log('create-token: ', res)
            token = res.token.id;
            //create order with strapi sdk( make request to backend)
            await  strapi.createEntry('orders', {
                amount,
                brews: cartItems,
                city,
                postalCode,
                address,
                country,
                token
            });
            //set orderprocessing to false & set the modal to false(to hide it)
            this.setState({ orderProcessing: false, modal: false });
            
            //clear all the user cart after the purchase
            clearCart();
            //show message of successful purchase
            this.showToast('Your order have been successfully submitted!', true);
        }catch(error){
            // set order processing to false if error occurs
            this.setState({ orderProcessing: false, modal: false });
            // show an error toast
            this.showToast(error.message);
        }
    }

    //close modal function
    closeModal = () => this.setState({
        modal: false
    })
    render(){
        //destructuring
        const {toast, toastMessage, cartItems, modal, orderProcessing } = this.state
        return(
            <Container>
            <Box
                color="darkWash"
                margin={4}
                padding={4}
                shape="rounded"
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
            >
                {/*Checkout form  Heading*/}
                <Heading color="navy">CHECKOUT</Heading>
                {cartItems.length > 0 ? 
                <React.Fragment>
                    {/*User Cart*/}
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        marginTop={2}
                        marginBottom={6}
                    >
                        <Text color="darkGray" italic>{cartItems.length} items for checkout</Text>
                        <Box padding={2}>
                            {cartItems.map(item => (
                                <Box key={item._id} padding={1}>
                                    <Text color="midnight" >
                                        {item.name} x {item.quantity} - ${item.quantity * item.price}
                                    </Text>
                                </Box>
                            ))}
                        </Box>
                            <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
                    </Box>
                    {/*Checkout form */}
                    <form 
                    onSubmit={this.handleConfirmOrder}
                    style={{
                        display: "inlineBlock",
                        textAlign: "center",
                        maxWidth: 450
                    }}
                >
                    

                    {/* SHIPPING ADDRESS */}
                    <TextField 
                        id="address"
                        type="text"
                        name="address"
                        placeholder="Shipping Address"
                        onChange={this.handleChange}
                    />
                    {/* POSTAL CODE*/}
                    <TextField 
                        id="postalCode"
                        type="number"
                        name="postalCode"
                        placeholder="Postal Code"
                        onChange={this.handleChange}
                    />
                    {/*City fields*/}
                    <TextField 
                        id="city"
                        type="text"
                        name="city"
                        placeholder="City"
                        onChange={this.handleChange}
                    />
                    {/*Country fields*/}
                    <TextField 
                        id="country"
                        type="text"
                        name="country"
                        placeholder="Country"
                        onChange={this.handleChange}
                    />
                     {/*email fields*/}
                     <TextField 
                        id="confirmationEmailAddress"
                        type="email"
                        name="confirmationEmailAddress"
                        placeholder="Confirmation Email Address"
                        onChange={this.handleChange}
                    />
                    {/* Credit Card Elements */}
                    <CardElement id="stripe__input" onReady={input => input.focus()}/>

                    <button id="stripe__button" type="submit">Submit</button>
                </form>
                </React.Fragment>
                :
                (
                //Default text to user if user cart have no items
                <Box color="darkWash" shape="rounded" padding={4}>
                    <Heading align="center" color="watermelon" size="xs"> Your Cart Is Empty</Heading>
                    <Text align="center" italic color="green"> Add some items!</Text>
                </Box>
                )}
            </Box>
            {/*Confirmation Modal */}
            {modal && (
                <ConfirmationModal 
                    orderProcessing={orderProcessing} 
                    cartItems={cartItems} 
                    closeModal={this.closeModal}
                    handleSubmitOrder={this.handleSubmitOrder}
                />
            )}
            <ToastMessage show={toast}  message={toastMessage}/>
        </Container>
        )
    }
}

// checkout form
const CheckOutForm = withRouter(injectStripe(_CheckOutForm));

// checkout
const Checkout = () => (
    <StripeProvider apiKey="api_keys_here">
        <Elements>
            <CheckOutForm />
        </Elements>
    </StripeProvider>
)

export default Checkout