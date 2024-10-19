import app from "./app.js";

app.listen(process.env.PORT,()=>{
    console.log(`server Running on port ${process.env.PORT}`);
})