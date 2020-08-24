//AVOID LOOSING THE CART_KEY
const CART_KEY = 'cart';
//token
const TOKEN_KEY = "jwt";


//function to calculate our price
export const calculatePrice = (items) => {
    return `$${items
        .reduce((acc, item) => acc + item.quantity * item.price, 0)
        .toFixed(2)
    }`
}

//function to calculate our amount for stripe
export const calculateAmount = (items) => {
    return Number(items
        .reduce((acc, item) => acc + item.quantity * item.price, 0)
        .toFixed(2));
}


/*KEEP CART IN STORAGE */
//confirm if we have localstorage and set cart
export const setCart = (value, cartKey = CART_KEY) => {
    if(localStorage){
        localStorage.setItem(cartKey, JSON.stringify(value))
    }
};

//to get the cart key value at all the time
export const getCart = (cartKey = CART_KEY) => {
    if(localStorage && localStorage.getItem(cartKey)){
        return JSON.parse(localStorage.getItem(cartKey));
    }
    return [];
};

//jwt Auto
export const getToken = (tokenKey= TOKEN_KEY) => {
    if(localStorage && localStorage.getItem(tokenKey)){
        return JSON.parse(localStorage.getItem(tokenKey));
    }
    /*if there is no localstorage then return nothing */
    return null;
}


export const setToken = (value, tokenKey= TOKEN_KEY) => {
    if(localStorage){
        localStorage.setItem(tokenKey, JSON.stringify(value))
    }
};

//clear token to sign a user out
export const clearToken = (tokenKey = TOKEN_KEY) => {
    // AGAIN LETS CONFIRM IF LOCALSTORAGE DO EXIST
    if(localStorage){ localStorage.removeItem(tokenKey)}
}

//clear the content of the cart as well
export const clearCart = (cartKey = CART_KEY) => {
    if(localStorage){
        localStorage.removeItem(cartKey)
    }
}