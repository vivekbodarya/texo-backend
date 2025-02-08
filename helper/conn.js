const mongoose = require('mongoose')

mongoose.set("strictQuery", false);
// MongoDb Connection


mongoose.connect(
    "mongodb+srv://localDev_VB:Vivek_LDev@cluster0.ipsnmse.mongodb.net/texoBitbrains?retryWrites=true&w=majority",
    {
        useUnifiedTopology: true,
    }
).then(() => {
    console.log("Connected to the DB")
}).catch((err) => {
    // console.log(err)
})
