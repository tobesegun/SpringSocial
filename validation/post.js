const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};
    data.tempvid = !isEmpty(data.tempvid) ? data.tempvid : '';


    if (Validator.isEmpty(data.tempvid)) {
        errors.tempvid = 'You need to upload a video';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};