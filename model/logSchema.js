const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    level: String,
    message: String,
    resourceId: String,
    timestamp: { type: Date },
    traceId: String,
    spanId: String,
    commit: String,
    metadata: {
        parentResourceId: String
    }
    // Add more fields as needed
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;
