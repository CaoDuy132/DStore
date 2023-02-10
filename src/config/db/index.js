const mongoose = require('mongoose');
function connect() {
    const uri = 'mongodb://127.0.0.1:27017/education_Nodejs';
    mongoose
        .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log(err));
}
module.exports = { connect };
