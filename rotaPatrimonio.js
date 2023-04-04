const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

let patrimonio=
[
  {
      "id":1,
      "nome":"Caneta"
  },
  {
      "id":2,
      "nome":"Lápis",
  },
  {
      "id":3,
      "nome":"Grafite"
  },
  {
      "id":4,
      "nome":"Envelope"
  },
  {
      "id":5,
      "nome":"Fichário"
  },
  {
      "id":6,
      "nome":"Camputador"
  },
  {
      "id":7,
      "nome":"Mesa"
  },
  {
      "id":8,
      "nome":"Carro"
  },
  {
      "id":9,
      "nome":"Moto"
  }
  
]


//para consultar todos os dados
router.get('/',(req,res,next)=>{
       
    res.status(200).send({
        mensagem:"aqui é a lista de patrimônio!!!!",
        patrimonio:patrimonio
      })
})
//para consultar um determinado cadastro
router.get('/:id',(req,res,next)=>{
    const id = req.params.id;
    let listapatrimonio=patrimonio.filter(value=>value.id==id);
    res.status(200).send({
        mensagem:`aqui é a lista de um patrimônio com id:${id}`,
        patrimonio:listapatrimonio
      })
})
// para enviar dados para salvar no banco
router.post('/',(req,res,next)=>{
      let msg=[];
      let i=0;
          
          const patrimonio={
            nome : req.body.nome,
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
                    patrimonioCriado:patrimonio 
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
     const {id,nome}=req.body;
     const array_alterar = [{
           id:id,
           nome:nome
     }]
      for(let i=0; i<patrimonio.length; i++){
          if(patrimonio.indexOf(patrimonio[i])===id){
            patrimonio[i]=array_alterar;
             console.log(array_alterar);
          }
      }

     if(nome.length<3){
      msg.push({mensagem:"campo com menos de 3 caracteres!"})
      i++;
    } 
if(i==0){
            res.status(201).send({
            mensagem:"Dados Alterados!",
            dados:patrimonio
           
             });        
}else{
            res.status(400).send({
            mensagem:msg,  
      }) 
}
    

})
router.delete('/:id',(req,res,next)=>{
  const {id} = req.params;
  let dadosdeletados=patrimonio.filter(value=>value.id==id);
  let listapatrimonio=patrimonio.filter(value=>value.id!=id);
  res.status(201).send({
    mensagem:"Dados deletados com sucesso",
    dadosnovos:listapatrimonio,
    deletados:dadosdeletados
  })
})
module.exports = router;

