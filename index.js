const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const Log = require('./model/logSchema');

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });


// API endpoint to save log data
app.post('/api/store', async (req, res) => {
  try {
      const logData = req.body;
      console.log('Received log data:', logData);

      const newLog = new Log(logData);
      const savedLog = await newLog.save();

      res.status(201).json(savedLog);
  } catch (error) {
      console.error('Error saving log:', error);
      res.status(500).json({ error: 'Error saving log' });
  }
});


app.get('/api/filter', async (req, res) => {
  try {
      const { level, message, resourceId, timestamp, traceId, spanId, commit,parentResourceId } = req.query;

      let query = {};

      if (level) {
          query.level = level;
      }
      if (message) {
          query.message = message;
      }
      if (resourceId) {
          query.resourceId = resourceId;
      }
      if (timestamp) {
          query.timestamp = timestamp; // Assuming timestamp is in 'YYYY-MM-DD' format
      }
      if (traceId) {
          query.traceId = traceId;
      }
      if (spanId) {
          query.spanId = spanId;
      }
      if (commit) {
        query.commit = commit;
    }
      if (parentResourceId) {
          query['metadata.parentResourceId'] = parentResourceId;
      }

      const logs = await Log.find(query);
      res.status(200).json(logs);
  } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ error: 'Error fetching logs' });
  }
});


 // Import Log model

// Express route to fetch logs between timestamps
app.get('/api/time', async (req, res) => {
    try {
        const { startTime, endTime } = req.query;

        const logs = await Log.find({
            timestamp: {
                $gte: new Date(startTime), // Greater than or equal to start time
                $lte: new Date(endTime),   // Less than or equal to end time
            },
        });

        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Error fetching logs' });
    }
});


const PORT=process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);