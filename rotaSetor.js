const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;
//17.03.2023 FEITO A ROTA SETOR
//para consultar todos os dados
router.get('/', (req, res, next) => {
  const perPage = parseInt(req.query.perPage) || 10;
  const page = parseInt(req.query.page) || 1;

  if (isNaN(perPage) || isNaN(page) || perPage <= 0 || page <= 0) {
    return res.status(400).send({
      mensagem: 'Parâmetros inválidos',
      setor: []
    });
  }

  mysql.getConnection((error, conn) => {
    const offset = (page - 1) * perPage;
    conn.query(
      `SELECT * FROM \`setor\` LIMIT ${perPage} OFFSET ${offset}`,
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          });
        }
        res.status(200).send({
          mensagem: "Aqui está a lista de setores!",
          setor: resultado
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
      "SELECT * FROM `setor` where id_setor=?",[id],
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(200).send({
          mensagem:"Lista de setores!!!!",
          setor:resultado
        
        })
      }
      )
 })
})
// para enviar dados para salvar no banco
router.post('/',(req,res,next)=>{

       
            const nome_setor =req.body.nome_setor
      

          mysql.getConnection((error,conn)=>{
            conn.query(
              "INSERT INTO `setor`(nome_setor) values(?)",
              [nome_setor],
              (error,resultado,field)=>{
                conn.release();
                if(error){
                 return res.status(500).send({
                    error:error,
                    response:null
                  })
                }
                res.status(201).send({
                  mensagem:"Cadastro criado sucesso!!!!",
                  usuario:resultado.insertId
                
                })
               }
              )
            })       
        }
  
        
      
      
);

router.patch('/',(req,res,next)=>{

     const {id,nome_setor}=req.body;

  mysql.getConnection((error,conn)=>{
    conn.query(
      "update setor set nome_setor=? where id_setor=?",
      [nome_setor,id],
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(201).send({
          mensagem:"setor alterado com sucesso!!!!",
        
        })
       }
      )
    })      
 

})
router.delete('/:id',(req,res,next)=>{
  const {id} = req.params;
  mysql.getConnection((error,conn)=>{
    conn.query(
      `DELETE FROM setor WHERE id_setor=${id}`,
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(200).send({
          mensagem:"setor deletado com sucesso!!!!",
      
        
        })
      }
      )
 })
})
module.exports = router;

