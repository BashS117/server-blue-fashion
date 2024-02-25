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
                success:"https://distribuidoramundoramirez.vercel.app/",
                failure:"https://distribuidoramundoramirez.vercel.app/",
                pending:"https://distribuidoramundoramirez.vercel.app/",
            },
            auto_return:"approved",
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
app.listen(port,()=>{
    console.log(`el servidor esta corriendo en el puerto ${port}`);
})