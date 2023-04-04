const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

let lotacao=
[
  {
      "id":1,
      "idemp":1,
      "idusu":2,
      "idpat":3,
      "idset":4,
      "lotacao":"2022-08-02"
  },
  {
      "id":2,
      "idemp":1,
      "idusu":3,
      "idpat":4,
      "idset":1,
      "lotacao":"2022-08-01"
  },
  {
      "id":3,
      "idemp":1,
      "idusu":1,
      "idpat":1,
      "idset":1,
      "lotacao":"2022-08-01"
  },
  {
      "id":4,
      "idemp":1,
      "idusu":2,
      "idpat":3,
      "idset":4,
      "lotacao":"2022-08-02"
  },
  {
      "id":5,
      "idemp":1,
      "idusu":2,
      "idpat":3,
      "idset":4,
      "lotacao":"2022-08-02"
  },
  {
      "id":6,
      "nome":"Filipe",
      "email":"filipe@gmail.com",
      "senha":"123"
  },
  {
      "id":7,
      "idemp":1,
      "idusu":1,
      "idpat":1,
      "idset":1,
      "lotacao":"2022-08-02"
  },
  {
      "id":8,
      "idemp":1,
      "idusu":2,
      "idpat":3,
      "idset":4,
      "lotacao":"2022-08-02"
  },
  {
      "id":9,
      "idemp":1,
      "idusu":1,
      "idpat":1,
      "idset":1,
      "lotacao":"2022-08-02"
  }
  
]

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
          mensagem: "Aqui está a lista de lotação!",
          setor: resultado
        });
      }
    );
  });
});

//para consultar um determinado cadastro
router.get('/:id',(req,res,next)=>{
    const id = req.params.id;
    let listalotacao=lotacao.filter(value=>value.id==id);
    res.status(200).send({
        mensagem:`aqui é a lista de uma lotação com id:${id}`,
        lotacao:listalotacao
      })
})
// para enviar dados para salvar no banco
router.post('/',(req,res,next)=>{
      let msg=[];
      let i=0;
          
          const usuario={
            nome : req.body.nome
          }
          if(usuario.nome.length<3){
              msg.push(
                {mensagem:"campo com menos de 3 caracteres!"}
                )
              i++;
            }

        if(i==0){
                    res.status(201).send({
                    mensagem:"Dados Inseridos!",
                    lotacaoCriado:lotacao 
                     });        
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
     const {id,nome,idemp,idpat,idset,idusu}=req.body;
     const array_alterar = [{
           id:id,
           idemp:idemp,
           idpat:idpat,
           idset:idset,
           idusu:idusu
     }]

     if(nome.length<3){
      msg.push({mensagem:"campo com menos de 3 caracteres!"})
      i++;
    }

if(i==0){
            res.status(201).send({
            mensagem:"Dados Alterados!",
            dados:lotacao
           
             });        
}else{
            res.status(400).send({
            mensagem:msg,  
      }) 
}
    

})
router.delete('/:id',(req,res,next)=>{
  const {id} = req.params;
  let dadosdeletados=usuario.filter(value=>value.id==id);
  let listausuario=usuario.filter(value=>value.id!=id);
  res.status(201).send({
    mensagem:"Dados deletados com sucesso",
    dadosnovos:listausuario,
    deletados:dadosdeletados
  })
})
module.exports = router;

