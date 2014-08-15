/**
* Strimy.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },
        slug: {
            type: 'string',
            unique: true

        },
        songs: {
            collection: 'song',
            via: 'strim'
        },

  },
  beforeCreate: function(values, next) {
      var tmp = values.name.toLowerCase()
                  .replace(/ /g,'-')
                          .replace(/[^\w-]+/g,'');
      values.slug = tmp;
      next();
  }
};

