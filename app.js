const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
app.use(cors());
const bodyParser = require('body-parser');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const rotaUsuarios = require('./routes/rotaUsuario');
const rotaEmpresas = require('./routes/rotaEmpresa');
const rotaPatrimonio = require('./routes/rotaPatrimonio');
const rotaSetor = require('./routes/rotaSetor');
const rotaLotacao = require('./routes/rotaLotacao');
const rotaProduto = require('./routes/rotaProduto');
const rotaFornecedor = require('./routes/rotaFornecedor');
const rotaCategoria = require('./routes/rotaCategoria');
const rotaEstoque = require('./routes/rotaEstoque');
//const rotaPerfil = require('./routes/rotaPerfil');
//const rotaNota = require('./routes/rotaNota');
const rotaCliente = require('./routes/rotaCliente');
const rotaLista = require('./routes/rotaLista');


app.use(function(req,res,next) {

    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept');
    next();

});

app.use("/usuario",rotaUsuarios);
app.use("/empresa",rotaEmpresas);
app.use("/produto",rotaProduto);
app.use("/setor",rotaSetor);
app.use("/lotacao",rotaLotacao);
app.use("/fornecedor",rotaFornecedor);
app.use("/categoria",rotaCategoria);
app.use("/patrimonio",rotaPatrimonio);
app.use("/estoque",rotaEstoque);
app.use("/cliente",rotaCliente);
app.use("/lista",rotaLista);
//app.use("/perfil",rotaPerfil);
//app.use("/nota",rotaNota);


app.use((req,res,next)=>{
      const erro = new Error("Não encontrado!");
      erro.status(404);
      next(erro);
});
app.use((error,req,res,next)=>{
        res.status(error.status || 500);
        return res.json({
            erro:{
                 mensagem:error.message
            }
        })
})

module.exports = app