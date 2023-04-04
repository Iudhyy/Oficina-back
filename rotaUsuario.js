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
      `SELECT * FROM \`usuario\` LIMIT ${perPage} OFFSET ${offset}`,
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          });
        }
        res.status(200).send({
          mensagem: "Aqui está a lista de usuarios!",
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
        "SELECT * FROM `usuario` where id_usuario=?",[id],
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
          mensagem: "Dados do Usuário!",
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
            mensagem:"Dados do Usuário!!!!",
            usuario:resultado
          
          })
         }
        )
      })

})
router.post('/', (req, res, next) => {
  let msg = [];
  let i = 0;
  const usuario = {
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
    login: req.body.login,
    perfil: req.body.perfil,
    setor: req.body.setor,
    ativo: req.body.ativo
  }
  if (usuario.nome.length < 3) {
    msg.push({ mensagem: "campo com menos de 3 caracteres!" });
    i++;
  }
  if (validacaoEmail(usuario.email) == false) {
    msg.push({ mensagem: "E-mail invalido!" });
    i++;
  }
  if (usuario.senha.length == 0) {
    msg.push({ mensagem: "senha invalida!" });
    i++;
  }
  if (i == 0) {
    // bcrypt.hash(usuario.senha, 10, (error, hash) => {
      // if (error) {
      //   return res.status(500).send({
      //     error: error,
      //     response: null
      //   });
      // }
      // usuario.senha = hash;
      mysql.getConnection((error, conn) => {
        conn.query(
          "INSERT INTO `usuario`(nome,email,senha,login,perfil,setor,ativo) values(?,?,?,?,?,?,?)",
          [usuario.nome, usuario.email, usuario.senha, usuario.login, usuario.perfil, usuario.setor, usuario.ativo],
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
              mensagem: "Cadastro criado sucesso!!!!",
              usuario: resultado.insertId
            });
          }
        );
      });
    // });
  }
});
// para enviar dados para salvar no banco
router.post('/antiga',(req,res,next)=>{

      let msg=[];
      let i=0;
          
          const usuario={
            nome : req.body.nome,
             email : req.body.email,
             senha : req.body.senha,
             login: req.body.login,
             perfil: req.body.perfil,
             setor: req.body.setor,
             ativo: req.body.ativo
          }
          if(usuario.nome.length<3){
              msg.push(
                {mensagem:"campo com menos de 3 caracteres!"}
                )
              i++;
            }
            if(validacaoEmail(usuario.email)==false){
            msg.push({mensagem:"E-mail invalido!"})
              i++;   
            }
            if(usuario.senha.length==0){
              msg.push({mensagem:"senha invalida!"})
              i++;                
            }  
        if(i==0){
          mysql.getConnection((error,conn)=>{
            conn.query(
              "INSERT INTO `usuario`(nome,email,senha,login,perfil,setor,ativo) values(?,?,?,?,?,?,?)",
              [usuario.nome,usuario.email,usuario.senha,usuario.login,usuario.perfil,usuario.setor,usuario.ativo],
              (error,resultado,field)=>{
                conn.release();
                if(error){
                  console.log("passei aqui")
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
       }    
     );


// para enviar dados para alterar no banco

router.patch('/', (req, res, next) => {
  const { id, nome, email, senha, login, perfil, setor, ativo } = req.body;
  const usuarioAtualizado = { id, nome, email, senha, login, perfil, setor, ativo };
  console.table(usuarioAtualizado)


  mysql.getConnection((error, conn) => {
    conn.query(
      "UPDATE usuario SET nome=?, email=?, senha=?, login=?, perfil=?, setor=?, ativo=? WHERE id_usuario=?",
      [nome, email, senha, login, perfil, setor, ativo, id],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          });
        }
        res.status(200).send({ mensagem: "Cadastro de fornecedor atualizado com sucesso!" });
      }
    )
  });
});

router.delete('/',(req,res,next)=>{
  const {id} = req.body;
  // let dadosdeletados=usuario.filter(value=>value.id==id);
  // let listausuario=usuario.filter(value=>value.id!=id);
  mysql.getConnection((error,conn)=>{
    conn.query(
      `DELETE FROM usuario WHERE id_usuario=${id}`,
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

