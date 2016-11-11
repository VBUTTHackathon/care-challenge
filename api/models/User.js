/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        email:{
          type: 'string'
        },
        firstName:{
          type: 'string'
        },
        lastName:{
          type: 'string'
        },
        isAdmin:{
          type: 'boolean',
          defaultsTo: false
        },
        state: {
            type: 'string',
            enum: ['none','chose','chosen','confirmed'],
            defaultsTo: 'none'
        },
        duo: {
            model: 'duo'
        },
        toJSON: function() {
            var obj = this.toObject();
            return {
                    email:obj.email,
                    firstName:obj.firstName,
                    lastName:obj.lastName};
        }
    }
};
