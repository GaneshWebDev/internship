const mongoose=require('mongoose');
async function connectDB(){
    try {
        const db=await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log('connected to DataBase');
    } catch (error) {
        console.log(error);
    }
}
module.exports=connectDB;