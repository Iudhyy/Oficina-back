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
      `SELECT * FROM \`lista\` LIMIT ${perPage} OFFSET ${offset}`,
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          });
        }
        res.status(200).send({
          mensagem: "Aqui está a lista!",
          lista: resultado
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
      "SELECT * FROM `lista` where id=?",[id],
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(200).send({
          mensagem:"Lista!!!!",
          lista:resultado
        
        })
      }
      )
 })
})
// para enviar dados para salvar no banco
router.post('/', (req, res, next) => {
  
    const {
      id_cliente,
      entrada, previsao, km_entrada, km_saida, os, id_veiculo, marca, ar, alarme, dh_cambio,
      automatico, automatizado, cvt, manual, abs, airbag, qxq, qx2, combustivel,
      estepe, macaco, chave_de_roda, triangulo, antena, vidro_eletrico, trava_eletrica, calotas,
      para_brisa_trincado, radio, corta_corrente, extintor, buzina, protetor_de_carter, chave_segredo,
      tapetes, acendedor, ano, corpredominante, chassis, codmotor, valvulas, cilindros, cilindradas,
      seguro, luzanomalia,placa
    } = req.body;
  
    console.log(req.body)
    mysql.getConnection((error, conn) => {
      conn.query(
        `INSERT INTO lista (id_cliente,entrada, previsao, km_entrada, km_saida, os, id_veiculo, marca, ar, alarme, dh_cambio, automatico, automatizado, cvt, manual, abs, airbag, qxq, qx2, combustivel, estepe, macaco, chave_de_roda, triangulo, antena, vidro_eletrico, trava_eletrica, calotas, para_brisa_trincado, radio, corta_corrente, extintor, buzina, protetor_de_carter, chave_segredo, tapetes, acendedor, ano, corpredominante, chassis, codmotor, valvulas, cilindros, cilindradas, seguro, luzanomalia, placa) 
                    VALUES (?,          ?,          ?,         ?,          ?,     ?,     ?,         ?,    ?,    ?,       ?,         ?,           ?,        ?,     ?,     ?,    ?,     ?,  ?,       ?,         ?,       ?,      ?,                ?,     ?,         ?,              ?,           ?,         ?,                ?,         ?,             ?,      ?,           ?,            ?,            ?,        ?,     ?,         ?,           ?,       ?,          ?,          ?,         ?,       ?,       ?,            ?)`,
        [id_cliente,entrada, previsao, km_entrada, km_saida, os, id_veiculo, marca, ar, alarme, dh_cambio,
          automatico, automatizado, cvt, manual, abs, airbag, qxq, qx2, combustivel,
          estepe, macaco, chave_de_roda, triangulo, antena, vidro_eletrico, trava_eletrica, calotas,
          para_brisa_trincado, radio, corta_corrente, extintor, buzina, protetor_de_carter, chave_segredo,
          tapetes, acendedor, ano, corpredominante, chassis, codmotor, valvulas, cilindros, cilindradas,
          seguro, luzanomalia,placa
        ],
        (error, resultado, field) => {
          conn.release();
          if (error) {
            console.log(error)
            return res.status(500).send({
              error: error,
              response: null
            });
          }
          res.status(201).send({
            mensagem: "Lista atualizada com sucesso!!!!",
            lista: resultado.insertId
          });
        }
      );
    });
  });
  

router.patch('/',(req,res,next)=>{
     let msg=[];
     let i=0;
     const {
      id,
      idcliente,
      entrada, previsao, km_entrada, km_saida, os, id_veiculo, marcar, ar, alarme, dh_cambio,
      automatico, automatizado, cvt, manuel, abs, airbag, qxq, qx2, combustivel,
      estepe, macaco, chave_de_roda, triangulo, antena, vidro_eletrico, trava_eletrica, calotas,
      para_brisa_trincado, radio, corta_corrente, extintor, buzina, protetor_de_carter, chave_segredo,
      tapetes, acendedor, ano, corpredominante, chassis, codmotor, valvulas, cilindros, cilindradas,
      seguro, luzanomalia, placa
    } = req.body;




  mysql.getConnection((error,conn)=>{
    conn.query(
      "UPDATE lista SET  id_cliente=?,entrada=?, previsao=?, km_entrada=?, km_saida=?, os=?, id_veiculo=?, marcar=?, ar=?, alarme=?, dh_cambio=?, automatico=?, automatizado=?, cvt=?, manuel=?, abs=?, airbag=?, qxq=?, qx2=?, combustivel=?, estepe=?, macaco=?, chave_de_roda=?, triangulo=?, antena=?, vidro_eletrico=?, trava_eletrica=?, calotas=?, para_brisa_trincado=?, radio=?, corta_corrente=?, extintor=?, buzina=?, protetor_de_carter=?, chave_segredo=?, tapetes=?, acendedor=?, ano=?, corpredominante=?, chassis=?, codmotor=?, valvulas=?, cilindros=?, cilindradas=?, seguro=?, luzanomalia=?, placa=? WHERE id=?",
      [idcliente,entrada, previsao, km_entrada, km_saida, os, id_veiculo, marcar, ar, alarme, dh_cambio, automatico, automatizado, cvt, manuel, abs, airbag, qxq, qx2, combustivel, estepe, macaco, chave_de_roda, triangulo, antena, vidro_eletrico, trava_eletrica, calotas, para_brisa_trincado, radio, corta_corrente, extintor, buzina, protetor_de_carter, chave_segredo, tapetes, acendedor, ano, corpredominante, chassis, codmotor, valvulas, cilindros, cilindradas, seguro, luzanomalia, placa, id],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          })
        }
        res.status(201).send({
          mensagem: "Lista atualizada com sucesso!!!!",
        })
      }
    )
  })    

})
router.delete('/:id',(req,res,next)=>{
  const {id} = req.params;
  mysql.getConnection((error,conn)=>{
    conn.query(
      `DELETE FROM lista WHERE id=${id}`,
      (error,resultado,field)=>{
        conn.release();
        if(error){
         return res.status(500).send({
            error:error,
            response:null
          })
        }
        res.status(200).send({
          mensagem:"Item deletado com sucesso!!!!",
      
        
        })
      }
      )
 })
})
module.exports = router;

