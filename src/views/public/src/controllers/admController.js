const connection = require('../database/database')
const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const express = require('express')
const session = require('express-session')
var multer = require('multer');
var fs = require('fs')
const path = require("path");
const app = express();

const dataFormatada = require('../helpers/dataAtual')
const { error } = require('console')




//FUNCAO PARA CRIPOGRAFIA BCRYPT JS
const encrypt = (textpPlain) => {
    const hash = bcrypt.hash(textpPlain, 10)
    return hash
}

app.use(session({
    secret: "QUALQUERCOISA", 
    resave: true,
    saveUninitialized: true
}))

function gerarCodigoAleatorio() {
    const tamanhoCodigo = 10; // Tamanho do código que deseja gerar
    const caracteres = '123456789ABCDEFGHIJabcdefghijklmnopqrstuvwxyzxKLMNOPQRSTUVWXYZ'; // Caracteres permitidos para gerar o código
    let codigo = '';
  
    for (let i = 0; i < tamanhoCodigo; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length)); // Adiciona um caractere aleatório ao código
    }
  
    return codigo;
  }
  
  
  
  let  codigoAleatorio = "G-" + gerarCodigoAleatorio();
  
  console.log(codigoAleatorio)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// AUTENTICACAO DO ADMINISTRADOR ✅💭
exports.admLogin = async(req, res)=>{
    //connection.query('')
    let mensagem = false
    res.render('./Admin/mirror-login-form', { mensagem})
}
    
exports.verificar = async(req, res)=>{
    res.send(req.session.loggedin)
}

//auth admin
exports.admAuth = async(req, res)=> {
    const {password, user} = req.body
    connection.query(`SELECT *FROM administrador WHERE nomeUsuario ='${user}' and senha='${password}'`, (error, results)=> {
        if(results.length == 1){
            req.session.loggedin = true
            connection.query('SELECT *FROM instituicao INNER JOIN provincia ON instituicao.idProvincia = provincia.id', (error, results)=> {
                if(error) throw error
                connection.query('select *from provincia', (error, provincias)=> {
                    res.render('./Admin/index', {instituicoes:results, provincias, alert_2: true})
                })
            })
        }else{
            let mensagem = true
            res.render('./Admin/mirror-login-form', {mensagem})

        }
    })
}

exports.logoutAdm = async(req, res)=>{
    let mensagem = false
    req.session.loggedin = false
    res.render('./Admin/mirror-login-form',{mensagem})
}

//logoutConta
exports.logoutConta = async(req, res)=>{
    req.session.loggedin = false
    res.render('./Instituicao/login')
    
}


//Biblioteca ADm mg
exports.admBiblioteca = async(req, res)=> {
        res.redirect('/admLogin')    
}



//New Admin
exports.adminRegister = async(req, res)=> {
    res.render('./Admin/register')
}

exports.cadAdmin = async(req, res)=> {
    const {nomeCompleto, nomeUsuario, password} = req.body
    const passWordHash = await encrypt(password)
    await connection.query(`INSERT INTO administrador VALUES(NULL, '${nomeCompleto}', '${nomeUsuario}', '${passWordHash}')`, (error, result)=>{
        if(error) throw error
        res.send('Cadastro com sucesso...'+nomeCompleto+"|"+nomeUsuario+"|"+passWordHash)
    })
       
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////// GESTAO DE INSTITUICOES - ADMINISTRADOR DO SISTEMA - CRUD ✅
exports.admHome = async(req, res) =>{ 
    if(!req.session.loggedin){
        res.redirect('/admLogin')
    }else{
        connection.query('SELECT *FROM instituicao INNER JOIN provincia ON instituicao.idProvincia = provincia.id', (error, results)=> {
            if(error) throw error
            connection.query('select *from provincia', (error, provincias)=> {
                res.render('./Admin/index', {instituicoes:results, provincias, alert_2: true})
            })
        })
    }
}


//// ----> LISTAR TODAS INSTITUICOEES ✅
exports.adminstituicoes = async(req, res) =>{
    req.session.loggedin = true
    req.session.user_Name
    sql = `SELECT *FROM instituicao INNER JOIN provincia ON instituicao.idProvincia = provincia.id`
    connection.query(sql, (error, results)=> {
        connection.query('select *from provincia', (error, provincias)=> {
            if(error) throw error
            res.render('./Admin/instituicoes', {instituicoes: results, provincias, user: req.session.user_Name})
        })
    })
}

///// ----> VER UMA INSTITUICAO EM PARTICULAR ✅
exports.verInstituicao = async(req, res)=> {
    req.session.loggedin = true
    const {id} = req.body
    sql = `select *from curso right join instituicao on curso.idInstituicao = instituicao.idInstituicao inner join provincia on instituicao.idProvincia = provincia.id  where instituicao.idInstituicao = ${id}`
    connection.query(sql, (error, instituicoes)=>{
        if(error) throw error
        res.render('./Admin/verInstituicao', {instituicoes})
    })
}


///// ----> ADICIONAR UMA NOVA INSTITUICAO ✅
exports.cadastrarInst = async(req, res) => {
    req.session.loggedin = true
    req.session.user_Name
    const {nomeInstituicao, sigla_acronomo, tipo, provincia, telefone, endereco, telefone2, site} = req.body;
    sql = `insert into instituicao values(null, '${nomeInstituicao}', '${sigla_acronomo}', '${tipo}', '${endereco}', '${site}', '${telefone}', '${telefone2}', ${provincia})`
    await connection.query(sql, (error, results)=> {
        if(error){
            res.redirect('/admHome')
        }
        res.redirect('/admHome')
    })
    
}
///// ----> EDITAR UMA INSTITUICAO EM PARTICULAR ✅
exports.adm_editar_inst = async(req, res)=>{
    const id = req.body.id
    sql1 = `select *from instituicao inner join provincia on instituicao.idProvincia = provincia.id where instituicao.idInstituicao = ${id}`
    sql2 = `select *from provincia`
    connection.query(sql1, (error, instituicao)=> {
        if (error) throw error
        connection.query(sql2, (error, provincias)=> {
            if (error) throw error
            res.render('./Admin/edit_inst', {instituicao, provincias})
        })
    })
}
///// ----> CONFIRMAR EDICAO DE INSTITUICAO ✅
exports.admSaveedit_Inst = async(req, res)=> {
   req.session.loggedin = true
   var  {nomeInstituicao, nomeInstituicao_altern, sigla_acronomo, sigla_acronomo_altern, tipo, idProvincia, telefone1, telefone1_altern, endereco, endereco_altern, telefone2, telefone2_altern, site_oficial, site_oficial_altern, idInstituicao} = req.body
   if (nomeInstituicao == ''){
        nomeInstituicao = nomeInstituicao_altern
   }else  if(sigla_acronomo == ''){
     sigla_acronomo = sigla_acronomo_altern
   }else if(telefone1 == ''){
      telefone1 = telefone1_altern
   }else if(telefone2 == ''){
      telefone2 = telefone2_altern
   }else if(endereco == ''){
      endereco = endereco_altern
   }else if(site_oficial == ''){
       site_oficial = site_oficial_altern
   }

   sql = `update instituicao set nomeInstituicao = '${nomeInstituicao}', sigla_acronomo = '${sigla_acronomo}', tipo = '${tipo}', endereco = '${endereco}', site_oficial = '${site_oficial}', telefone1 = '${telefone1}', telefone2 = '${telefone2}', idProvincia = ${idProvincia} where idInstituicao = ${idInstituicao}`
   await connection.query(sql, (error, result)=> {
        if(error) throw error
        res.redirect('/adminstituicoes')
   })

}
//

///// ----> EXCLUIR UMA INSTITUICAO ✅
exports.adm_eliminar_inst = async(req, res)=>{
    req.session.loggedin = true
    const {id} = req.body
    sql = `delete from instituicao where idInstituicao = ${id}`
    await connection.query(sql, (error, result)=>{
        if(error) throw error
        res.redirect('/adminstituicoes')
    })
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ADMIN GESTAO DE CURSOS  - CRUD ✅   ////////////////


///// ----> ADICIONAR UMA NOVO CURSO ✅
exports.adm_addcurso_inst = async(req, res)=> {
    req.session.loggedin = true
    const {id, sigla_acronomo, nomeInstituicao} = req.body
    //res.send(id+" "+sigla_acronomo+" "+nomeInstituicao)
    res.render('./Admin/adm_addcurso_inst', {id, sigla_acronomo, nomeInstituicao})
}

///// ----> CONFIRMAR CADASTRO DE CURSO ✅

// Defina uma variável para armazenar o caminho do arquivo
var filePath = null;

// Verifica se a pasta já foi criada
fs.stat('./public/uploads', function(err, stats) {
  if (err) {
    // Cria a pasta se ela não existir
    fs.mkdir('./public/uploads', function(err) {
      if (err) {
        console.log(err.stack);
      } else {
        console.log('Pasta "uploads" criada com sucesso.');
      }
    });
  } else { 
    console.log('Pasta "uploads" já existe.');
  }
});

var fileName = null; 

// ...

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    var ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    fileName = file.fieldname + '-' + gerarCodigoAleatorio() + ext;
    var filePath = './public/uploads/' + fileName;
    callback(null, fileName);
  }
}); 

exports.admCadastrarCurso = async(req, res) => {
    req.session.loggedin = true
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        if (err) {
            return res.end("Erro ao fazer upload do arquivo.");
        }
        const {id, curso, duracao} = req.body
        sql = `insert into curso values(null, '${curso}', ${duracao}, '${fileName}', ${id})`
        connection.query(sql, (error, result)=> {
            sql2 = `select *from curso join instituicao on curso.idInstituicao = instituicao.idInstituicao inner join provincia on instituicao.idProvincia = provincia.id  where instituicao.idInstituicao = ${id}`
            console.log()
            connection.query(sql2, (error, instituicoes)=>{
                if(error) throw error
                res.render('./Admin/verInstituicao', {instituicoes})
            })
        })
    })    
}

exports.contaCadastrarCurso = async(req, res) => {
    req.session.loggedin = true
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        if (err) {
            return res.end("Erro ao fazer upload do arquivo.");
        }
        const {id, idConta, curso, duracao, descricao} = req.body
        sql = `insert into curso values(null, '${curso}', ${duracao}, '${fileName}' ,'${descricao}', ${id})`
        connection.query(sql, (error, result)=> {
            sql2 = `SELECT *FROM containstituicao INNER JOIN instituicao ON containstituicao.idInstituicao = instituicao.idInstituicao INNER JOIN curso ON curso.idInstituicao = containstituicao.idInstituicao WHERE containstituicao.idInstituicao = ${id} order by idConta desc`   
            connection.query(sql2, (error, instituicoes)=>{
                if(error) throw error
                res.render('./Instituicao/index', {instituicoes}) 
            })
        })
     
        

        
    })    
}




exports.adm_ver_curso = async(req, res) => {
    req.session.loggedin = true
    const {idCurso, idInstituicao} = req.body
    sql = `select *from curso right join instituicao on curso.idInstituicao = instituicao.idInstituicao inner join provincia on instituicao.idProvincia = provincia.id  where instituicao.idInstituicao = ${idInstituicao} AND idCurso=${idCurso}`
    connection.query(sql, (error, instituicoes)=>{
        if(error) throw error
        res.render('./Admin/adm_ver_curso', {instituicoes})
    })
}


exports.conta_ver_curso = async(req, res) => {
    req.session.loggedin = true
    const {idCurso, idConta} = req.body
    console.log(idCurso)
    console.log(idConta)
    sql = `SELECT *FROM	containstituicao INNER JOIN instituicao ON containstituicao.idInstituicao = instituicao.idInstituicao INNER JOIN curso ON curso.idInstituicao = containstituicao.idInstituicao WHERE idConta = ${idConta} AND idCurso = ${idCurso}`
    connection.query(sql, (error, instituicoes)=>{
        if(error) throw error
        console.log(instituicoes[0])
        res.render('./Instituicao/conta_ver_curso', {instituicoes})
    })
}     

///// ----> EXCLUIR CURSO ✅
exports.adm_eliminar_curso = async(req, res) => {
    req.session.loggedin = true
    const {id, idInstituicao} = req.body
    sql = `delete from curso where idCurso = ${id}`
    connection.query(sql, (error, result)=> {
        sql2 = `select *from curso right join instituicao on curso.idInstituicao = instituicao.idInstituicao inner join provincia on instituicao.idProvincia = provincia.id  where instituicao.idInstituicao = ${idInstituicao}`
        connection.query(sql2, (error, instituicoes)=>{
            if(error) throw error
            res.render('./Admin/verInstituicao', {instituicoes})
        })
    })
}


exports.conta_eliminar_curso = async(req, res) => {
    req.session.loggedin = true
    const {idConta, idCurso} = req.body
    sql = `delete from curso where idCurso = ${idCurso}`
    connection.query(sql, (error, result)=> {
        sql2 = `SELECT *FROM 	containstituicao 	INNER JOIN instituicao ON containstituicao.idInstituicao = instituicao.idInstituicao INNER JOIN curso ON curso.idInstituicao = containstituicao.idInstituicao WHERE idConta = ${idConta} order by idConta desc`   
        connection.query(sql2, (error, instituicoes)=>{
            if(error) throw error
            res.render('./Instituicao/index', {instituicoes})
        })
    })
}



///// ----> EDITAR CURSO ✅
exports.adm_editar_curso = async(req, res) => {
    req.session.loggedin = true
    const {idCurso, idInstituicao} = req.body
    sql = `select *from curso inner join instituicao on curso.idInstituicao = instituicao.idInstituicao where curso.idCurso = ${idCurso} and instituicao.idInstituicao = ${idInstituicao}`
    connection.query(sql, (error, instituicao)=>{
        if(error) throw error
        res.render('./Admin/adm_editcurso', {instituicao})
    })
}

///// ----> CONFIRMAR EDICACAO DO CURSO ✅
exports.admUpdateCurso = async(req, res) =>{
    req.session.loggedin = true
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        if (err) {
            return res.end("Erro ao fazer upload do arquivo.");
        }
        var {idInstituicao, idCurso, curso_altern, curso, duracao_altern, duracao, descricao_altern, descricao, area} = req.body
        if(curso != '' && duracao != '' && descricao != ''){
            sql = `update curso set nome = '${curso}', duracao = ${duracao} where idCurso = ${idCurso}`
        }else if(curso == '' && duracao != '' && descricao != ''){
            sql = `update curso set nome = '${curso_altern}', duracao = ${duracao} where idCurso = ${idCurso}`
        }else if(curso == '' && duracao == '' && descricao != ''){
            sql = `update curso set nome = '${curso_altern}', duracao = ${duracao_altern} where idCurso = ${idCurso}`
     
        }else if(curso == '' && duracao == '' && descricao == ''){
            sql = `update curso set nome = '${curso_altern}', duracao = ${duracao_altern} where idCurso = ${idCurso}`
     
        }else if(curso != '' && duracao == '' && descricao != ''){
            sql = `update curso set nome = '${curso}', duracao = ${duracao_altern} where idCurso = ${idCurso}`
     
        }
        else if(curso == '' && duracao != '' && descricao == ''){
            sql = `update curso set nome = '${curso_altern}', duracao = ${duracao} where idCurso = ${idCurso}`
     
        }else if(curso != '' && duracao != '' && descricao == ''){
            sql = `update curso set nome = '${curso}', duracao = ${duracao} where idCurso = ${idCurso}`
     
        }
        
        console.log(area)
        connection.query(sql, (error, results)=>{ 
            sql = `select *from curso right join instituicao on curso.idInstituicao = instituicao.idInstituicao inner join provincia on instituicao.idProvincia = provincia.id  where instituicao.idInstituicao = ${idInstituicao}`
            connection.query(sql, (error, instituicoes)=>{
                if(error) throw error
                res.render('./Admin/verInstituicao', {instituicoes})
            })
        })
    })    
}



///// ----> conta EDITAR CURSO ✅
exports.conta_editar_curso = async(req, res) => {
    req.session.loggedin = true
    const {idConta, idCurso, idInstituicao} = req.body
    sql = `select *from curso inner join instituicao on curso.idInstituicao = instituicao.idInstituicao where curso.idCurso = ${idCurso} and instituicao.idInstituicao = ${idInstituicao}`
    connection.query(sql, (error, instituicao)=>{
        if(error) throw error
        res.render('./Instituicao/conta_editCurso', {instituicao})
    })
}

///// ----> CONFIRMAR EDICACAO DO CURSO ✅
exports.contaUpdateCurso = async(req, res) =>{
    req.session.loggedin = true
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        if (err) {
            return res.end("Erro ao fazer upload do arquivo.");
        }
        var {idConta, idCurso, curso_altern, curso, duracao_altern, duracao, descricao_altern, descricao} = req.body
        if(curso == ''){
            curso = curso_altern
        }else if(duracao == ''){
            duracao = duracao_altern
        }else if(descricao == ''){
            descricao = descricao_altern
        }
        
        sql = `update curso set nome = '${curso}', duracao = ${duracao}, descricao = '${descricao}' where idCurso = ${idCurso}`
        connection.query(sql, (error, results)=>{ 
            sql2 = `SELECT *FROM 	containstituicao 	INNER JOIN instituicao ON containstituicao.idInstituicao = instituicao.idInstituicao INNER JOIN curso ON curso.idInstituicao = containstituicao.idInstituicao WHERE idConta = ${idConta} order by idConta desc`   
            connection.query(sql2, (error, instituicoes)=>{
                if(error) throw error
                res.render('./Instituicao/index', {instituicoes})
            })
        })
    })    
}



exports.contaUpdateCurso_grade = async(req, res) =>{
    req.session.loggedin = true
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        if (err) {
            return res.end("Erro ao fazer upload do arquivo.");
        }
        var {idConta, idCurso} = req.body
        console.log(fileName)
        sql1 = `update curso set gradeCurricular = '${fileName}' where idCurso = ${idCurso}`;
        connection.query(sql1, (error, results)=>{ 
            sql2 = `SELECT *FROM 	containstituicao 	INNER JOIN instituicao ON containstituicao.idInstituicao = instituicao.idInstituicao INNER JOIN curso ON curso.idInstituicao = containstituicao.idInstituicao WHERE idConta = ${idConta} order by idConta desc`   
            connection.query(sql2, (error, instituicoes)=>{
                if(error) throw error
                res.render('./Instituicao/index', {instituicoes})
            })
        })
    })    
}



exports.admUpdateCurso_grade = async(req, res) =>{
   // req.session.loggedin = true
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        if (err) {
            return res.end("Erro ao fazer upload do arquivo.");
        }
        var {idInstituicao, idCurso} = req.body
        console.log(fileName)
        sql1 = `update curso set gradeCurricular = '${fileName}' where idCurso = ${idCurso}`;
        connection.query(sql1, (error, results)=>{ 
            sql = `select *from curso right join instituicao on curso.idInstituicao = instituicao.idInstituicao inner join provincia on instituicao.idProvincia = provincia.id  where instituicao.idInstituicao = ${idInstituicao}`
            connection.query(sql, (error, instituicoes)=>{
                if(error) throw error
                res.render('./Admin/verInstituicao', {instituicoes})
            })
        })
    })    
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// GESTAO DA BIBLIOTECA ADMIN ✅



////// ---> LISTAR MATERIAIS ✅
exports.adm_biblioteca = async(req, res)=>{
    req.session.loggedin = true
    sql = `select *from material_didactico`
    connection.query(sql, (error, livros)=> {
        if(error) throw error
        res.render('./Admin/adm_biblioteca', {livros})
    })
}


////// ---> EXCLUIR LIVROS ✅
exports.adm_elim_livro = async(req, res)=>{
    req.session.loggedin = true
    const {idLivro} = req.body
    sql = `delete from material_didactico where idMaterial = ${idLivro}`
    connection.query(sql, (error, result)=>{
        sql2 = `select *from material_didactico`
        connection.query(sql2, (error, livros)=> {
            if(error) throw error
            res.render('./Admin/adm_biblioteca', {livros})
        }) 
    })
}

////// ---> EDITAR MATERIAL ✅
exports.adm_edit_livro = async(req, res)=> {
    req.session.loggedin = true
    const {idLivro} = req.body
    sql = `select *from material_didactico where idMaterial = ${idLivro}`
    connection.query(sql, (error, livro)=> {
        if(error) throw error
        res.render('./Admin/adm_edit_livro', {livro})
    })
}
////// ---> CONFIRMAR EDICAO DO MATERIAL ✅
exports.adm_update_livro = async(req, res)=> {
    req.session.loggedin = true
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        if (err) {
            return res.end("Erro ao fazer upload do arquivo.");
        }
        var {titulo_altern, titulo, autor_altern, autor, descricao_altern, descricao, idLivro, categoria} = req.body
        console.log(categoria)
        if(titulo == ''){
            titulo = titulo_altern
        }else if(descricao == ''){
            descricao = descricao_altern
        }
        sql1 = `update material_didactico set titulo = '${titulo}', autor = '${autor}', descricao = '${descricao}', categoria = '${categoria}'  where idMaterial = ${idLivro}`
        connection.query(sql1, (error, result)=> {
            if(error) throw error
            res.redirect('/adm_biblioteca') 
        })
    })    
}



exports.adm_update_livro_pdf = async(req, res)=> {
    req.session.loggedin = true
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        if (err) {
            return res.end("Erro ao fazer upload do arquivo.");
        }
        var {idLivro} = req.body
        sql1 = `update material_didactico set caminho = '${fileName}' where idMaterial = ${idLivro}`
        connection.query(sql1, (error, result)=> {
            if(error) throw error
            res.redirect('/adm_biblioteca')
        })
    })    
}


////// ---> ADICIONAR LIVRO ✅
exports.adm_add_livro = async(req, res)=> {
    req.session.loggedin = true
    //fileName
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        if (err) {
            return res.end("Erro ao fazer upload do arquivo.");
        }
        const {titulo, autor, editora, descricao, categoria} = req.body
        
        sql = `insert into material_didactico values(null, '${titulo}', '${autor}', '${descricao}', '${editora}', null, '${dataFormatada}', '${fileName}', '${categoria}')`
        connection.query(sql, (error, result)=> {
            if(error) throw error
            res.redirect('/adm_biblioteca')
        })
    })
}


 

exports.admverLivro = async(req, res)=> {
    req.session.loggedin = true
    const {idLivro} = req.body
    sql = `SELECT *from material_didactico WHERE idMaterial=${idLivro}`
        connection.query(sql, (error, result)=> {
            if(error) throw error
            //res.send(idLivro)
            res.render('./Admin/admverLivro', {livro: result})
        })
}
  


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////// ---> LER NOTIFICACAO ❌
exports.ver_emitir_notificacao = async(req, res) => {
    req.session.loggedin = true
    sql = `SELECT descricao, "ADMINISTRADOR", dataNotificacao FROM notificacao JOIN administrador ON notificacao.idAdmin = administrador.idAdmin ORDER BY idNotificacao desc`;
    connection.query(sql, (error, result)=>{
        if(error) throw error
        res.render('./Admin/adm_verNotificoes', {notificacoes: result});
    })
}



////// GESTAO DE SOLICITACOES DE CONTAS ❌
exports.conta = async(req, res) => {
    await res.render('./Instituicao/login')
}


exports.authConta = async(req, res) =>{       
    const {password} = req.body
    try {
        await connection.query(`SELECT *FROM containstituicao WHERE nomeUsuario ='${req.body.user}'`, (error, results)=> {
            const userFound = results[0].nomeUsuario
            const status = results[0].estado
            const id = results[0].idConta
            const authent = async() =>{
                if(results.length == 0 || !(await bcrypt.compare(password, results[0].senha))){
                        req.session.loggedin = false
                        res.send('Erro de Login')
                }else{
                    req.session.loggedin = true
                    req.session.userName = results[0].nomeUsuario
                    sql = `SELECT *FROM 	containstituicao 	INNER JOIN instituicao ON containstituicao.idInstituicao = instituicao.idInstituicao INNER JOIN curso ON curso.idInstituicao = containstituicao.idInstituicao WHERE idConta = ${id} order by idConta desc`
                    await connection.query(sql, (error, instituicoes)=> {
                        if(error) throw error
                        if(instituicoes[0].estado != "Ativo"){
                            res.send(`Estado da conta: ${status} ... Aguardade pela ativacao da Conta`);
                        }else{
                            res.render('./Instituicao/index', {instituicoes, user_Name: req.session.userName})
                        }
                    })
                }
            }
           authent()
        })
    } catch (error) {
            res.send("Erro desconhecido...")
    }

}


exports.solicitarConta = async(req, res) => {
    await connection.query('SELECT *FROM instituicao INNER JOIN provincia ON instituicao.idProvincia = provincia.id order by nomeInstituicao', (error, result)=>{
        if(error) throw error
        res.render('./Instituicao/register', {instituicoes: result})
    })

}   



exports.enviarSolicitacao = async(req, res) => {
    const {instituicao, nomeUsuario, senha} = req.body
    const passWordHash = await encrypt(senha);
    sql = `insert INTO containstituicao VALUES(NULL, '${nomeUsuario}', '${passWordHash}', '${instituicao}', 'Pendente')`;
    await connection.query(sql, (error, result) =>{
        if(error) throw error
        res.render('./Instituicao/login')
    })
}

 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.perfil = async(req, res) =>{
    res.render('/Publico/perfil')
}