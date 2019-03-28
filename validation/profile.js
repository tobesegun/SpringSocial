const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
    let errors = {};
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';    


   if (!Validator.isLength(data.handle, {
           min: 2,
           max: 30
       })) {
       errors.handle = 'Handle must be at between 2 and 30 characters';
       }
    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'handle field is required';
    }

    if (Validator.isEmpty(data.status)) {
        errors.status = 'Status field is required';
    }
    if (!isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.website = 'Not a valid URL';
        }
    }
    if (!isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid URL';
        }
    }
    if (!isEmpty(data.facbook)) {
        if (!Validator.isURL(data.facbook)) {
            errors.facbook = 'Not a valid URL';
        }
    }
    if (!isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid URL';
        }
    }
   if (!isEmpty(data.twitter)) {
       if (!Validator.isURL(data.twitter)) {
           errors.twitter = 'Not a valid URL';
       }
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}
