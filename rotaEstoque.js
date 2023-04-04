const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;
//20.03.2023 FEITO A ROTA ESTOQUE
//para consultar todos os dados
router.get('/', (req, res, next) => {
  const perPage = parseInt(req.query.perPage) || 10;
  const page = parseInt(req.query.page) || 1;

  if (isNaN(perPage) || isNaN(page) || perPage <= 0 || page <= 0) {
    return res.status(400).send({
      mensagem: 'Parâmetros inválidos',
      estoque: []
    });
  }

  mysql.getConnection((error, conn) => {
    const offset = (page - 1) * perPage;
    conn.query(
      `SELECT * FROM \`estoque\`
      inner Join produto on estoque.produto=produto.id_produto
      LIMIT ${perPage} OFFSET ${offset}`,
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          });
        }
        res.status(200).send({
          mensagem: "Aqui está a lista do Estoque!",
          estoque: resultado  
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
      "SELECT * FROM `estoque` where id_estoque=?",[id],
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(200).send({
          mensagem:"apenas um item do estoque!!!!",
          estoque:resultado
        
        })
      }
      )
 })
})
// para enviar dados para salvar no banco
router.post('/',(req,res,next)=>{
      let msg=[];
      let i=0;
          
          
          const estoque={
            id_estoque : req.body.id_estoque,
            quantidade: req.body.quantidade,
            produto: req.body.produto
           }

          if(estoque.quantidade<1){
              msg.push(
                {mensagem:"Vazio!"}
                )
              i++;
            } 
        if(i==0){
          mysql.getConnection((error,conn)=>{
            conn.query(
              "INSERT INTO `estoque`(id_estoque, quantidade, produto) values(?,?,?)",
              [id_estoque,quantidade,produto],
              (error,resultado,field)=>{
                conn.release();
                if(error){
                 return res.status(500).send({
                    error:error,
                    response:null
                  })
                }
                res.status(201).send({
                  mensagem:"Estoque criado sucesso!!!!",
                  usuario:resultado.insertId
                
                })
               }
              )
            })       
        }else{
                    res.status(400).send({
                    mensagem:msg,  
              }) 
        }
            
        }
      
      
);

router.patch('/',(req,res,next)=>{
     let msg=[];
     let i=0;
     const {id,id_estoque, quantidade, produto}=req.body;
     const array_alterar = [{
           id:id,
           nome:nome
     }]


     if(quantidade<1){
      msg.push({mensagem:"Valor invalido!"})
      i++;
    }

if(i==0){
  mysql.getConnection((error,conn)=>{
    conn.query(
      "update estoque set  id_estoque=?,quantidade=?, produto=?, where id_estoque=?",
      [id_estoque,quantidade,produto,id],
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(201).send({
          mensagem:"Estoque alterado com sucesso!!!!",
        
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
router.delete('/:id',(req,res,next)=>{
  const {id} = req.params;
  mysql.getConnection((error,conn)=>{
    conn.query(
      `DELETE FROM estoque WHERE id_estoque=${id}`,
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(200).send({
          mensagem:"Item do Estoque deletado com sucesso!!!!",
      
        
        })
      }
      )
 })
})
module.exports = router;

