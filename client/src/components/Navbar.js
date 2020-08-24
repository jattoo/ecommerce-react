import React from 'react';
import { withRouter } from 'react-router-dom';
import { getToken } from './../utils/index'
import { clearToken, clearCart } from './../utils/index'
import AuthNAv from './Navbars/AuthNAv'
import UnAuthNav from './Navbars/UnAuthNav'

class  Navbar extends React.Component {

    handleSignout = () => {
        console.log('signing out')
        //clear token
        clearToken()
        //clean cart
        clearCart()
        //redirect to home page
        this.props.history.push('/')
    }

    
    //check first if we have a token in localstorage
    render () {
    return getToken() !== null ?  
    <AuthNAv handleSignout={this.handleSignout} /> : <UnAuthNav />
        
}

}

export default withRouter(Navbar)