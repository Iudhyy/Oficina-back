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
      produto: []
    });
  }

  mysql.getConnection((error, conn) => {
    const offset = (page - 1) * perPage;
    conn.query(
      `SELECT * FROM \`produto\` LIMIT ${perPage} OFFSET ${offset}`,
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          });
        }
        res.status(200).send({
          mensagem: "Aqui está a lista de produtos/serviço!",
          produto: resultado  
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
      "SELECT * FROM `produto` where id_produto=?",[id],
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(200).send({
          mensagem:"apenas um produto/serviço!!!!",
          produto:resultado
        
        })
      }
      )
 })
})
// para enviar dados para salvar no banco
router.post('/',(req,res,next)=>{
      let msg=[];
      let i=0;
          
          const produto={
            codigo : req.body.codigo,
            nome_produto: req.body.nome_produto,
            qtd_minima: req.body.qtd_minima,
            unidade : req.body.unidade,
            categoria : req.body.categoria
          }
          if(produto.nome_produto.length<3){
              msg.push(
                {mensagem:"campo com menos de 3 caracteres!"}
                )
              i++;
            } 
        if(i==0){
          mysql.getConnection((error,conn)=>{
            conn.query(
              "INSERT INTO `produto`(codigo,nome_produto,qtd_minima,unidade,categoria) values(?,?,?,?,?)",
              [produto.codigo,produto.nome_produto,produto.qtd_minima,produto.unidade,produto.categoria],
              (error,resultado,field)=>{
                conn.release();
                if(error){
                 return res.status(500).send({
                    error:error,
                    response:null
                  })
                }
                res.status(201).send({
                  mensagem:"Produto/Serviço criado sucesso!!!!",
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

     console.log(req.body)
     const {id,codigo,nome_produto,qtd_minima,unidade,categoria}=req.body;


  mysql.getConnection((error,conn)=>{
    conn.query(
      "update produto set codigo=?, nome_produto=?,qtd_minima=?, unidade=?, categoria=? where id_produto=?",
      [codigo,nome_produto,qtd_minima,unidade,categoria,id],
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(201).send({
          mensagem:"Produto/Serviço alterado com sucesso!!!!",
        
        })
       }
      )
    })      

})
    
router.delete('/:id',(req,res,next)=>{
  const {id} = req.params;  
  mysql.getConnection((error,conn)=>{
    conn.query(
      `DELETE FROM produto WHERE id_produto=${id}`,
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(200).send({
          mensagem:"Produto/Serviço deletado com sucesso!!!!",
      
        
        })
      }
      )
 })
})
module.exports = router;

