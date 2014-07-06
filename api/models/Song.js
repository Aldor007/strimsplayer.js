/**
* Songs.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title: {
        type: 'string',
        required: true
    },
    date: {
        type: 'datetime',
        required: true

    },
    user: {
        type: 'string',
        required: true,
    },
    strims_url: {
        type: 'string',
        required: true,
        unique: true
    
    },
    domain: {
        type: 'string',
        required: true
    },
    domain_url: {
        type: 'string',
        required: true
    },
    domain_id: {
        type: 'string',
        required: true
    },
    upvotes: {
        type: 'integer',
        required: true
    },
    downvotes: {
        type: 'integer',
        required: true
    
    },
    strim: {
        model: 'Strim',
        required: true
    }
  }
};

