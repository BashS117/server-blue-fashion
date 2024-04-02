import express from "express";
import cors from "cors";

//SDK de mercado pago
import {MercadoPagoConfig, Preference} from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.accessToken,
});

const app = express();
const  port = process.env.PORT ||3000 ;

app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Soy el server")
});

app.post("/create_preference", async(req,res)=>{
    try{
        const body={
            items:[
               { 
                title: req.body.title,
                quantity: Number(req.body.quantity),
                unit_price: Number(req.body.price),
                
            }
            ],
            back_urls:{
                success:"http://localhost:5173/feedback/",
                failure:"https://blue-fashion.vercel.app/",
                pending:"https://blue-fashion.vercel.app/",
            },
            auto_return:"approved",
            // notification_url: "https://server-distribuidora-mundo-ramirez.vercel.app/webhook"
        };
        const preference = new Preference(client);
        const result = await preference.create({body});

        res.json({
            id:result.id,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            error:"ERROR al crear la preferencia"
        });
        
    }
});
app.post("/webhook",async function(req,res){
    const payment=req.query
    const paymentId=payment['data.id']
    console.log("pay",paymentId)


try {

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`,{
        method:'GET',
        headers:{
            'Authorization': `Bearer ${client.accessToken}`,
            
        }
    });
    if(response.ok){
        const data = await response.json();
        console.log(data);
    }
    res.sendStatus(200);
} catch (error) {
    console.error("ERROR:",error)
    res.sendStatus(500);
}
})


app.listen(port,()=>{
    console.log(`el servidor esta corriendo en el puerto ${port}`);
})