import React from 'react'
import Strapi from 'strapi-sdk-javascript/build/main';
import { Box, Heading, Text, Image, Card, Button, Mask, IconButton } from 'gestalt'
import { ScaleLoader } from 'react-spinners';
import { Link } from 'react-router-dom'
import { calculatePrice, setCart, getCart } from '../utils'
//api url
const apiUrl = process.env.API_URL || 'http://localhost:1337';
// strapi contstructor
const strapi = new Strapi(apiUrl);

class Brews extends React.Component{
    state={
        brews: [],
        brand: '',
        loadingBrands: true,
        cartItems: []
    }

    async componentDidMount(){
        //console.log(this.props.match.params.brandId);
        try {
            const res = await strapi.request('POST', '/graphql', {
                data: {
                    query : `query {
                        brand(id: "${this.props.match.params.brandId}"){
                          _id
                          name
                          brews{
                            _id
                            name
                            description
                            image{url}
                            price
                          }
                        }
                      }`
                }
            })
            //console.log(res)
            this.setState({
                brews: res.data.brand.brews,
                brand: res.data.brand.name,
                loadingBrands: false,
                cartItems: getCart()
            })
        } catch (error) {
            console.error(error)
        }
    }

    //adding items to cart
    addtoCart = (brew) => {
        //confirm item is not already added
        const alreadyInCart = this.state.cartItems.findIndex(item => item._id === brew._id);
        if(alreadyInCart === -1){
            const updatedItems = this.state.cartItems.concat({
                ...brew,
                quantity: 1
            });
            this.setState({cartItems: updatedItems}, () => setCart(updatedItems));
        } else { //if item exists not, then add it
            const updatedItems = [ ...this.state.cartItems];
            updatedItems[alreadyInCart].quantity += 1; 
            this.setState({
                cartItems: updatedItems
            }, () => getCart(updatedItems));
        }
    }

    //removing an item from the cart
    removeItemFromCart = (itemToRemoveId) => {
        //collect the ones that does not equal to the removing item
        const filteredItems = this.state.cartItems.filter(item => item._id !== itemToRemoveId)
        this.setState({ cartItems: filteredItems}, () => setCart(filteredItems))
    }


    render(){
        //destructuring
        const {brand, brews, loadingBrands, cartItems} = this.state
        return(
            <Box
                marginTop={4}
                display="flex"
                justifyContent="center"
                alignItems="start"
                dangerouslySetInlineStyle={{
                    __style: {
                        flexWrap: 'wrap-reverse'
                    }
                }}
            >
                {/* Brews Section */}
                <Box display="flex" direction="column" alignItems="center">
                    {/* Brews Heading */}
                    <Box margin={2}>
                        <Heading color="orchid" size="lg">{brand}</Heading>
                    </Box>
                    {/* Brews */}
                    <Box
                        dangerouslySetInlineStyle={{
                            __style: {
                                backgroundColor: '#ffffff'
                            }
                        }}
                        wrap
                        shape="rounded"
                        display="flex"
                        justifyContent="center"
                        padding={4}
                    >
                        
                        {brews.map(brew => (
                            <Box 
                            margin={2}
                            paddingY={2}
                            width={210}
                            key={brew._id}
                          >
                            <Card
                              
                              image={
                                <Box height={250} width={200}>
                                  <Image 
                                    fit="cover"
                                    alt="Brand Image"
                                    naturalHeight={1}
                                    naturalWidth={1}
                                    src={`${apiUrl}${brew.image.url}`}/>
                                </Box>
                              }
                            >
                              {/**texts on the card */}
                              <Box 
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                direction="column"
                              >
                                  <Box marginBottom={2}>
                                    <Text bold size="xl">{ brew.name}</Text>
                                  </Box>
                                  <Box  margin={2} padding={2} justifyContent="center">
                                    <Text bold color="pine">{ brew.description}</Text>
                                  </Box>
                                  <Text bold color="orchid">${brew.price}</Text>
                                  <Box marginTop={2}>
                                        <Text size="xl">
                                        <Button onClick={()=>this.addtoCart(brew)} color="red" text="Add to Cart"/>
                                        </Text>
                                  </Box>
                              </Box>
                            </Card>
                          </Box>
                        ))}
                    </Box>
                </Box>
                
                {/*Loader */}
                <Box
                    position="fixed"
                    dangerouslySetInlineStyle={{
                        __style: {
                            bottom: 300,
                            left: '50%',
                            transform: "translateX(-50%)"
            
                        }
                    }}>
                    {loadingBrands && <ScaleLoader />}
                </Box>
                
                {/*User Carts */}
                <Box alignSelf="end" marginTop={2} marginLeft={8} >
                    <Mask shape="rounded" wash>
                        <Box display="flex" direction="column" alignItems="center" padding={2}>
                            {/* User Heading */}
                                <Heading align="center" size="sm">Cart</Heading>
                                {/*different colors based on cartitem contents */}
                                <Text color={cartItems.length === 0 ? "watermelon" : 'blue'} italic >
                                    {cartItems.length} items selected
                                </Text>
                                {/* Cart Items  */}
                                {cartItems.map(item => (
                                    <Box key={item._id} display="flex" alignItems="center">
                                        <Text color="blue">
                                            {item.name} x {item.quantity} - ${(item.quantity * item.price).toFixed(2)}
                                        </Text>
                                        <IconButton 
                                            accessibilityLabel="Remove"
                                            icon="remove"
                                            size="md"
                                            iconColor="red"
                                            onClick={() => this.removeItemFromCart(item._id)}
                                        />
                                    </Box>
                                ))}



                                <Box display="flex" alignItems="center" justifyContent="center"
                                direction="column">
                                    <Box margin={2}>
                                        {cartItems.length === 0 && (
                                            <Text  color="red">Please select some items</Text>
                                        )}
                                    </Box>
                                    <Text color="blue" size="lg">Total: {calculatePrice(cartItems)}</Text>
                                    {/*make spacing */}
                                    <Box margin={4}>
                                        <Text >
                                            <Link to="/checkout">Checkout</Link>
                                        </Text>
                                    </Box>
                                </Box>

                        </Box>
                    </Mask>
                </Box>
            </Box>
            
        )
    }
}

export default Brews