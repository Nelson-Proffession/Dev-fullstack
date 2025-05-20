const express = require("express")
const cors = require("cors");
const mysql = require("mysql");
const bodyParse = require("body-parser");
const app = express()
const session = require("express-session")
const path = require('path')
const bcrypt = require('bcrypt');
const { error } = require("console");
app.use(cors({origin:'http://localhost:5173',
methods:["POST","DELETE","UPDATE","GET"],
credentials:true
}));

app.use(session({
secret:"uwayodavid",
resave:false,
saveUninitialized:false,
cookie:{secure:false}
}));
app.use (bodyParse.urlencoded({extended:true}));
app.use(bodyParse.json());
const db = mysql.createConnection({
host:"localhost",
user:"root",
password:'',
database:"final"
})

db.connect(err=>{
if(err){
console.log('you are not connected to database');

}
else{
console.log('you are conncted to database');

}

app.post('/register',(req , res)=>{
const {username , email, password} = req.body;
const hashpassword = bcrypt.hashSync(password,10)
const sql = 'INSERT into users (username,email,password) values(?,?,?)';
db.query(sql,[username,email,hashpassword],(err,data)=>{
if(!err){   zzzzzv
res.status(200).send({
status:200,
data:data,
message:"you are registed"
})
}
else{
res.status(500).send({
status:500,
data:data,
message:"insert fails"

})
}
})

})
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).send({
                data: err,
                status: 500,
                message: "Internal server error"
            });
        }

        if (result.length > 0) {
            const user = result[0];
            try {
                const isPasswordMatch = await bcrypt.compare(password, user.password); // Await inside async function

                if (isPasswordMatch) {
                    req.session.userlogin = true;
                    req.session.userId = user.id;
                    req.session.username = user.username;
                    return res.status(200).send({
                        data: { email: user.email, username: user.username },
                        status: 200,
                        message: "Login successful"
                    });
                } else {
                    return res.status(401).send({
                        status: 401,
                        message: "Invalid email or password"
                    });
                }
            } catch (error) {
                return res.status(500).send({
                    status: 500,
                    message: "Error comparing passwords",
                    error
                });
            }
        } else {
            return res.status(401).send({
                status: 401,
                message: "Invalid email or password"
            });
        }
    });
});

app.get('/logout',(req,res)=>{
req.session.destroy(err=>{
if(err){
return res.send.status(500)({
status:500,
message:"internal serve error",err
})

}
else{
res.status(200).send({
status:200,
message:"logout successfull"
})
}
})
})

app.post('/update/:id',(req,res)=>{
const {id} = req.params
const {productName , productPrice } = req.body
const sql = `UPDATE products SET productName=?, productPrice=? WHERE pid=?`
db.query(sql,[productName,productPrice,id],(err,result)=>{
if(err){
res.status(500).send({
status:500,
message:"internal server error",
error:err
})
}
else{
res.status(200).send({
status:200,
message:"product updated successfully"
})
}
})
}
)   
app.post('/delete/:id',(req,res)=>{
const {id} = req.params
const sql = `DELETE FROM products WHERE pid=?`
db.query(sql,[id],(err,result)=>{
if(err){
res.status(500).send({
status:500,
message:"internal server error",
error:err
})
}
else{
res.status(200).send({
status:200,
message:"product deleted successfully"
})
}
})
}
)
app.post('/addProduct',(req,res)=>{

    if (!req.session.userlogin) {
        return res.status(401).send({
            status: 401,
            message: "Unauthorized: Please log in to add a product"
        });
    }
const userId = req.session.userId



const {productName , productPrice } = req.body

const sql = `insert into products (productName,productPrice,userId) values(?,?,?)`

db.query(sql , [productName,productPrice,userId],(err,result)=>{
if(err){
res.status(500).send({      
status:500,
message:"iternal serve eror",
error:err
})
}
else{
res.status(200).send({
status:200,
data:result,
message:"inserted successsful",result
})
}
})
}
)



app.get('/productid',async(req,res)=>{
   if(!req.session.userlogin){
    return res.status(401).send({
        status:401,
        message:"unauthorized"
    })
    }
    const userId = req.session.userId
    const sql = 'SELECT users.*, products.* FROM users JOIN products ON users.id = products.userId WHERE users.id =  ?'

    // const sql = 'SELECT * from products' 


    db.query(sql,[userId],(err,result)=>{
    if(err){
    res.status(500).send({
    data:err,
    status:500,
    message:"serve error"
    })
    }

    else{
    res.status(200).send({
    product:result,
    status:200,
    
    })
    }
    })

})

app.get('/product',(req,res)=>{
   if(!req.session.userlogin){
    return res.status(401).send({
        status:401,
        message:"unauthorized"
    })
    }
    const sql = 'SELECT products.* FROM products'
    // const sql = 'SELECT * from products' 


    db.query(sql,(err,result)=>{
    if(err){
    res.status(500).send({
    data:err,
    status:500,
    message:"serve error"
    })
    }

    else{
    res.status(200).send({
    product:result,
    status:200,
    
    })
    }
    })

})



app.get('/sumPrice',(req,res)=>{

const sql = 'select SUM(productPrice) as totalPrice from products'
db.query(sql,(err,result)=>{
if(err){    
res.status(500).send({
data:err,   
status:500,
message:"serve error"
})
}
else{
res.status(200).send({
totalPrice:result[0].totalPrice,
status:200,

})
}
}
)
})
app.listen(3000,()=>{
console.log("http://localhost:3000")
})