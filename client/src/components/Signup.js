import React from 'react'
import { Container, Box, Heading, Text, TextField, Button } from 'gestalt'
import Strapi from 'strapi-sdk-javascript/build/main';
import ToastMessage from "./ToastMessage";
import { setToken } from './../utils/index'

//api url
const apiUrl = process.env.API_URL || 'http://localhost:1337';
// strapi constructor
const strapi = new Strapi(apiUrl);




class Signup extends React.Component{
    state = {
        cartItem: [],
        username: '',
        password: '',
        email: '',
        firstname: '',
        lastname: '',
        toast: false,
        toastMessage: '',
        loading: false
    }

    //handlechange function
    handleChange = ({ event, value }) => {
        event.persist()
        this.setState({ 
            [event.target.name]: value
        })
    }
    
    //redirect function
    redirectUser = path => this.props.history.push(path);

    //handle submit
    handleSubmit = async event => {
        event.preventDefault();
        const { username, email, password, firstname, lastname} = this.state;
        //validation empty forms
        if(this.isFormEmpty(this.state)){
            this.showToast('Kindly complete all fields')
            return;
        }
        //signup a user here
        try {
            //set loading - true
            this.setState({ loading: true})
            //make request to register user with strapi
            const res = await strapi.register(username, email, password, lastname, firstname)
            //set loading - false
            this.setState({ loading: false})
            //put token (to manage user session) in local storage
            setToken(res.jwt)
            console.log("res: ",res)
            //redirect user to home page
            this.redirectUser('/')
        } catch (error) {
            //set loading - false
            this.setState({ loading: false})
            // show error message with toast message
            this.showToast(error.message)
        }
    }

    //returns true if any this values are empty
    isFormEmpty = ({ username, email, password, firstname, lastname}) => {
        return !username || !email || !password || !firstname || !lastname;
    }

    //showtoast
    showToast = toastMessage => {
        this.setState({toast: true, toastMessage}) 
        //set the message to a time interval
        setTimeout(() => this.setState({ toast: false, toastMessage: ""}),5000);
    } 

    render(){
        const {toastMessage, toast, loading} = this.state;
        return(
            <Container>
                <Box
                    dangerouslySetInlineStyle={{
                        __style: {
                            backgroundColor: '#fcba03'
                        }
                    }}
                    margin={4}
                    padding={4}
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                >
                    {/*Signu form */}
                    <form 
                        onSubmit={this.handleSubmit}
                        style={{
                            display: "inlineBlock",
                            textAlign: "center",
                            maxWidth: 450
                        }}
                    >
                        <Box
                            display="flex"
                            marginBottom={2}
                            direction="column"
                            alignItems="center"
                        >
                             {/*Signu form  Heading*/}
                            <Heading color="midnight">CREATE ACCOUNT</Heading>
                            <Text italic color="orchid"> Sign up to order some presents! All fields required</Text>
                        </Box>
                        {/* FirstName*/}
                        <TextField 
                            id="firstname"
                            type="text"
                            name="firstname"
                            placeholder="firstname... *"
                            onChange={this.handleChange}
                        />
                        {/* LastName*/}
                        <TextField 
                            id="lastname"
                            type="text"
                            name="lastname"
                            placeholder="lastname... *"
                            onChange={this.handleChange}
                        />
                        {/*Username input fields*/}
                        <TextField 
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Username... *"
                            onChange={this.handleChange}
                        />
                         {/*email fields*/}
                         <TextField 
                            id="email"
                            type="email"
                            name="email"
                            placeholder="johnDoe@example.com *"
                            onChange={this.handleChange}
                        />
                        {/*password input fields*/}
                        <TextField 
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password... *"
                            onChange={this.handleChange}
                        />
                        <Box marginTop={2} paddingY={2}>
                            <Button  disabled={loading} color="blue" text="SUBMIT" type="submit"/>
                        </Box>
                    </form>
                </Box>
                <ToastMessage show={toast} message={toastMessage} />
            </Container>
        )
    }
}

export default Signup