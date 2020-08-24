import React from 'react';
import { Box, Text, Heading, Image } from 'gestalt';
import { NavLink } from 'react-router-dom'

//UnAuthenticated User View
const UnAuthNav = () => (
    <Box
        height={70}
        color="midnight"
        padding={1}
        shape="roundedBottom"
        display="flex"
        alignItems="center"
        justifyContent="around"
    >
        {/* Signin In Link */}
        <NavLink activeClassName="active" exact to="/signin"> 
            <Text size="xl" color="white">Sign in</Text>
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

        {/* Signup In Link */}
        <NavLink activeClassName="active" exact to="/signup"> 
            <Text size="xl" color="white">Sign up</Text>
        </NavLink>
    </Box>
)

export default UnAuthNav