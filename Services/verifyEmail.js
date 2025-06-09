require('dotenv').config();
const axios = require('axios');

async function verifyEmail(email) {
    const url = `https://api.zerobounce.net/v2/validate?api_key=${process.env.EMAIL_VALIDATION_API_KEY}&email=${email}`;

    try {
        const response = await axios.get(url);
        const { status, sub_status } = response.data;
        
        if (status === 'valid') {
            console.log('Email is valid!');
            return true;
        } else {
            console.log(`Email is invalid. Status: ${status}, Sub-status: ${sub_status}`);
            return false;
        }
    } catch (error) {
        if (error.response) {
            console.error('Error with response from ZeroBounce:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return false;
    }
}

module.exports = verifyEmail;