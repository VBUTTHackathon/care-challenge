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
        username:{
          type: 'string'
        },
        firstName:{
          type: 'string'
        },
        lastName:{
          type: 'string'
        },
        fullName:{
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
            return {id: obj.id,
                    username: obj.username,
                    firstName: obj.firstName,
                    lastName: obj.lastName,
                    button: '<input type="button" onClick="pickPartner('+obj.id+')" id="picker" class="btn btn-info picker" value="Pick as a partner">'
            };
        },
        getPartner: function() {
          if(this.duo){
            return Duo.findOne(this.duo)
              .populate('picker')
              .populate('picked')
              .then(function(duo){
                if(duo){
                  return this.id === duo.picker.id ? duo.picked : duo.picker;
                }
                return;
              });
          }
          return;
        }
    }
};
