import React from 'react';
import { Box, Text, Heading, Image, Button} from 'gestalt';
import { NavLink } from 'react-router-dom'


//Authenticated User View
const AuthNAv = ({handleSignout}) => {
    return (
            <Box
                height={70}
                color="midnight"
                padding={1}
                shape="roundedBottom"
                display="flex"
                alignItems="center"
                justifyContent="around"
            >
                {/* CheckOut Link */}
            <NavLink activeClassName="active" exact to="/checkout"> 
                <Text size="xl" color="white">Checkout</Text>
            </NavLink>


            {/* Title and logo*/}
            <NavLink activeClassName="active" exact to="/">
                <Box display="flex" alignItems="center">
                    <Box height={50} width={50}>
                        <Image 
                            alt="React ecommerce logo"
                            naturalHeight={1}
                            naturalWidth={1}
                            margin={2}
                            src="./icons/logo.svg"
                        />
                    </Box>
                    <Heading size="xs" color="orange">
                        ReactECommerce
                    </Heading>
                </Box>
            </NavLink>

            {/* Sign Out Link */}
            <Button onClick={handleSignout} color="transparent" text="Log Out" inline size="md" />
                
            </Box>
)
}



export default AuthNAv