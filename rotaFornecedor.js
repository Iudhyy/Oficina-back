const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

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
      `SELECT * FROM \`fornecedor\` LIMIT ${perPage} OFFSET ${offset}`,
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          });
        }
        res.status(200).send({
          mensagem: "Aqui está a lista de fornecedores!",
          fornecedor: resultado
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
      "SELECT * FROM `fornecedor` where id_fornecedor=?",[id],
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(200).send({
          mensagem:"apenas um fornecedor!!!!",
          fornecedor:resultado
        
        })
      }
      )
 })
})
// para enviar dados para salvar no banco

router.post('/', (req, res) => {
  const { cnpj, razao_social, telefone } = req.body;
  const sql = 'INSERT INTO fornecedor (cnpj, razao_social, telefone) VALUES (?, ?, ?)';
  
  mysql.getConnection((error, conn) => {
    if (error) {
      console.log('Erro ao conectar ao banco de dados: ', error);
      return res.status(500).send({
        mensagem: 'Erro ao cadastrar fornecedor',
        error: error,
      });
    }

    const parametros = [cnpj, razao_social, telefone];
    conn.query(sql, parametros, (error, resultado, field) => {
      conn.release();
      if (error) {
        console.log('Erro ao cadastrar fornecedor: ', error);
        return res.status(500).send({
          mensagem: 'Erro ao cadastrar fornecedor',
          error: error,
        });
      }
      console.log('Fornecedor cadastrado com sucesso!');
      res.status(201).send({
        mensagem: 'Cadastro criado com sucesso!',
        fornecedor: resultado.insertId,
      });
    });
  });
});


router.patch('/',(req,res,next)=>{
      console.log(req.body)
     let msg=[];
     let i=0;
     const {id,razao_social,cnpj,telefone}=req.body;


 
  mysql.getConnection((error,conn)=>{
    conn.query(
      "update fornecedor set cnpj=?, razao_social=?,telefone=? where id_fornecedor=?",
      [cnpj,razao_social,telefone,id],
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(201).send({
          mensagem:"Fornecedor alterado com sucesso!!!!",
        
        })
       }
      )
    })      
})
    
router.delete('/:id',(req,res,next)=>{
  const {id} = req.params;
  mysql.getConnection((error,conn)=>{
    conn.query(
      `DELETE FROM fornecedor WHERE id_fornecedor=${id}`,
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(200).send({
          mensagem:"Fornecedor deletado com sucesso!!!!",
      
        
        })
      }
      )
 })
})
module.exports = router;

