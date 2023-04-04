const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require('bcrypt');
const saltRounds = 10;

//para consultar todos os dados
router.get('/', (req, res, next) => {
  const perPage = parseInt(req.query.perPage) || 10;
  const page = parseInt(req.query.page) || 1;

  if (isNaN(perPage) || isNaN(page) || perPage <= 0 || page <= 0) {
    return res.status(400).send({
      mensagem: 'Parâmetros inválidos',
      cliente: []
    });
  }

  mysql.getConnection((error, conn) => {
    const offset = (page - 1) * perPage;
    conn.query(
      `SELECT * FROM \`cliente\` LIMIT ${perPage} OFFSET ${offset}`,
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          });
        }
        res.status(200).send({
          mensagem: "Aqui está a lista de clientes!",
          cliente: resultado
        });
      }
    );
  });
});

//para consultar um determinado cadastro
router.get('/:id',(req,res,next)=>{
    const id = req.params.id;
    mysql.getConnection((error,conn)=>{
      conn.query(
        "SELECT * FROM `cliente` where id_cliente=?",[id],
        (error,resultado,field)=>{
          conn.release();
          if(error){
           return res.status(500).send({
              error:error,
              response:null
            })
          }
          res.status(200).send({
            mensagem:"aqui é a lista de usuários!!!!",
            cliente:resultado
          
          })
        }
        )
   })  

});


// para enviar dados para salvar no banco
router.post('/', (req, res) => {
   const { nome, cpf, email,  contato, veiculo, placa } = req.body;
   const sql = `INSERT INTO cliente (nome, cpf, email, contato, veiculo, placa) 
   VALUES (?, ?, ?, ?, ?, ?)`;

       const parametros = [nome, cpf, email, contato, veiculo, placa];
        mysql.getConnection((error, conn) => {
          conn.query(sql, parametros, (error, resultado, field) => {
            conn.release();
            if (error) {
              console.log('Erro ao cadastrar cliente: ', error);
              return res.status(500).send({
               mensagem: 'Erro ao cadastrar cliente',
               error: error,
            });
           }
           console.log('Cliente cadastrado com sucesso!');
         res.status(201).send({
           mensagem: 'Cadastro criado com sucesso!',
             cliente: resultado.insertId,
           });
         });
       });
    
 });    


// para enviar dados para alterar no banco

router.patch('/',(req,res,next)=>{
     let msg=[];
     let i=0;
     const {id,nome,email,contato,veiculo,placa,cpf}=req.body;


if(i==0){
  mysql.getConnection((error,conn)=>{
    conn.query(
      "update cliente set nome=?,email=?,contato=?,veiculo=?,placa=?,cpf=? where id_cliente=?",
      [nome,email,contato, veiculo, placa, cpf,id],
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(201).send({
          mensagem:"Cadastro alterado com sucesso!!!!",
        
        })
       }
      )
    })        
}else{
            res.status(400).send({
            mensagem:msg,  
      }) 
}
    

})
router.delete('/',(req,res,next)=>{
  const {id} = req.body;
  // let dadosdeletados=cliente.filter(value=>value.id==id);
  // let listacliente=cliente.filter(value=>value.id!=id);
  mysql.getConnection((error,conn)=>{
    conn.query(
      `DELETE FROM cliente WHERE id_cliente=${id}`,
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(200).send({
          mensagem:"cadastro deletado com sucesso!!!!",
      
        
        })
      }
      )
 }) 
})
module.exports = router;

