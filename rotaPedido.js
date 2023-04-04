const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require('bcrypt');
const saltRounds = 10;

function encriptarSenha(senha) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(senha, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}
function validacaoEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

//para consultar todos os dados
router.get('/', (req, res, next) => {
  const perPage = parseInt(req.query.perPage) || 10;
  const page = parseInt(req.query.page) || 1;

  if (isNaN(perPage) || isNaN(page) || perPage <= 0 || page <= 0) {
    return res.status(400).send({
      mensagem: 'Parâmetros inválidos',
      usuario: []
    });
  }

  mysql.getConnection((error, conn) => {
    const offset = (page - 1) * perPage;
    conn.query(
      `SELECT * FROM \`pedido\` LIMIT ${perPage} OFFSET ${offset}`,
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          });
        }
        res.status(200).send({
          mensagem: "Aqui está a lista de pedidos!",
          usuario: resultado
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
        "SELECT * FROM `pedido` where id_usuario=?",[id],
        (error,resultado,field)=>{
          conn.release();
          if(error){
           return res.status(500).send({
              error:error,
              response:null
            })
          }
          res.status(200).send({
            mensagem:"aqui é a lista de pedidos!!!!",
            usuario:resultado
          
          })
        }
        )
   })  

});
router.post('/logar', (req, res, next) => {

  const { email, senha } = req.body;
  //const senhaEncriptada = bcrypt.hashSync(senha, 10); // Encripta a senha usando o salt de valor 10

  mysql.getConnection((error, conn) => {
    conn.query(
      "SELECT * FROM usuario WHERE email = ? AND senha = ?",
      [email, senha],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          });
        }
         console.table(resultado);
        res.status(200).send({
          mensagem: "Dados do Pedido!",
          usuario: resultado
        });
      }
    );
  });
});
router.post('/logarantigo',(req,res,next)=>{

     const{email,senha}=req.body;
     mysql.getConnection((error,conn)=>{
      conn.query(
        "SELECT * FROM usuario where email like ? and senha like ?",
        [email,senha],
        (error,resultado,field)=>{
          conn.release();
          if(error){
           return res.status(500).send({
              error:error,
              response:null
            })
          }
          res.status(200).send({
            mensagem:"Dados do Pedido!!!!",
            usuario:resultado
          
          })
         }
        )
      })

})
router.post('/', (req, res, next) => {
    let msg = [];
    let i = 0;
    const pedido = {
      quantidade_pedida: req.body.quantidade_pedida,
      id_usuario: req.body.id_usuario,
      cod_produto: req.body.cod_produto,
      data_pedido: req.body.data_pedido,
      obs: req.body.obs,
      flag_baixa: req.body.flag_baixa
    }
    if (pedido.quantidade_pedida <= 0) {
      msg.push({ mensagem: "quantidade pedida inválida!" });
      i++;
    }
    if (pedido.id_usuario <= 0) {
      msg.push({ mensagem: "id do usuário inválido!" });
      i++;
    }
    if (pedido.cod_produto <= 0) {
      msg.push({ mensagem: "código do produto inválido!" });
      i++;
    }
    if (!pedido.data_pedido) {
      msg.push({ mensagem: "data do pedido inválida!" });
      i++;
    }
    if (i == 0) {
      mysql.getConnection((error, conn) => {
        conn.query(
          "INSERT INTO `pedido`(quantidade_pedida, id_usuario, cod_produto, data_pedido, obs, flag_baixa) values(?,?,?,?,?,?)",
          [pedido.quantidade_pedida, pedido.id_usuario, pedido.cod_produto, pedido.data_pedido, pedido.obs, pedido.flag_baixa],
          (error, resultado, field) => {
            conn.release();
            if (error) {
              console.log("passei aqui");
              return res.status(500).send({
                error: error,
                response: null
              });
            }
            res.status(201).send({
              mensagem: "Pedido cadastrado com sucesso!",
              pedido: resultado.insertId
            });
          }
        );
      });
    } else {
      res.status(400).send(msg);
    }
  });
  



// para enviar dados para alterar no banco

router.patch('/:id', (req, res, next) => {
    let msg = [];
    let i = 0;
    const id = req.params.id;
    const pedido = {
      quantidade_pedida: req.body.quantidade_pedida,
      id_usuario: req.body.id_usuario,
      cod_produto: req.body.cod_produto,
      data_pedido: req.body.data_pedido,
      obs: req.body.obs,
      flag_baixa: req.body.flag_baixa
    }
    if (pedido.quantidade_pedida <= 0) {
      msg.push({ mensagem: "quantidade pedida inválida!" });
      i++;
    }
    if (pedido.id_usuario <= 0) {
      msg.push({ mensagem: "id do usuário inválido!" });
      i++;
    }
    if (pedido.cod_produto <= 0) {
      msg.push({ mensagem: "código do produto inválido!" });
      i++;
    }
    if (!pedido.data_pedido) {
      msg.push({ mensagem: "data do pedido inválida!" });
      i++;
    }
    if (i == 0) {
      mysql.getConnection((error, conn) => {
        conn.query(
          "UPDATE `pedido` SET quantidade_pedida = ?, id_usuario = ?, cod_produto = ?, data_pedido = ?, obs = ?, flag_baixa = ? WHERE id = ?",
          [pedido.quantidade_pedida, pedido.id_usuario, pedido.cod_produto, pedido.data_pedido, pedido.obs, pedido.flag_baixa, id],
          (error, resultado, field) => {
            conn.release();
            if (error) {
              console.log("passei aqui");
              return res.status(500).send({
                error: error,
                response: null
              });
            }
            res.status(200).send({
              mensagem: "Pedido atualizado com sucesso!",
              pedido: resultado.insertId
            });
          }
        );
      });
    } else {
      res.status(400).send(msg);
    }
  });
  
  
  router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
      conn.query(
        "DELETE FROM `pedido` WHERE id = ?",
        [id],
        (error, resultado, field) => {
          conn.release();
          if (error) {
            console.log("passei aqui");
            return res.status(500).send({
              error: error,
              response: null
            });
          }
          res.status(200).send({
            mensagem: "Pedido excluído com sucesso!",
            pedido: resultado.insertId
          });
        }
      );
    });
  });
  
module.exports = router;

