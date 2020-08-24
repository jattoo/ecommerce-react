'use strict';

//stripe
const Stripe = require('stripe')('sk_test_SQnd2OU8zsYO2bua4Tn8PaGW00uPuGkAnP');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */




module.exports = {
/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */


 /**
 * Order.js controller
 *
 * @return {Object}
 */
    create: async (ctx) => {
        //destructure our order request body
        const { address, postalCode, city, amount, brews, token, country} = ctx.request.body;
       //console.log('address: ', address);
        //send the charge to stripe
        const charge = await Stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            description: `order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
            source: token
        });
   
        //Create order in the database
        const orders = await strapi.services.order.add({
            user: ctx.state.user._id,
            address,
            amount,
            brews,
            postalCode,
            country,
            city
        });
        return orders
    }
   
};
