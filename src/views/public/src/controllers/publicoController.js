////// AMBIENTE PUBLICO 

const connection = require('../database/database')
///// ---> PAGINA INICIAL✅
exports.publicoPage = async(req, res)=>{
    connection.query('SELECT *FROM provincia', (error, result)=> {
        res.render('Publico/pub', {provincias: result})
    })
    
}

 


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// ---> PESQUISAR DE INSTITUICOES ✅

//// ----> PESQUISAR POR NOME DA INSTTUICAO, CURSO, TIPO DE INSTTUICAO E PROVINCIA ✅
exports.pesquisaPublica = async(req, res)=>{
    const {nome, curso, provincia} = req.body
    //consultas:
    if((nome == "" && curso == "") && (provincia == "vazio" )) {
        res.send('Tudo vazio')
        //connection.query('')

    }
    //pesquisar uma instituicao pelo nome apenas
        else if((nome != "" && curso == "") && (provincia == "vazio" )){
            //res.send('PESQUISAR INSTITUICAO SOMENTE: '+nome)
            connection.query(`SELECT *FROM instituicao INNER JOIN provincia ON instituicao.idProvincia = provincia.id WHERE nomeInstituicao LIKE '%${nome}%'`, (req, results)=>{
                if (err) {
                    console.error('Erro ao executar a consulta no banco de dados: ', err);
                    res.sendStatus(500);
                    return;
                }
                res.json(results);
            })
        }

        else if((nome != "" && curso == "") && (provincia != "vazio" )){
            res.send('PESQUISAR INSTITUICAO SOMENTE: '+nome)
        }

        else if((nome != "" && curso != "") && (provincia == "vazio" )){
            res.send('PESQUISAR INSTITUICAO SOMENTE: '+nome)
        }
    // 

    //todas instituicoes do pais com o curso de Eng.Mecanica em todas as provincias, por ex.
        else if((nome == "" && curso != "") && (provincia == "vazio" )){
            res.send('todas instituicoes de Angola com o curso: '+curso)
        }

    //todas instituicoes de Luanda(ex.) com o curso de Eng.Mecanica em todas as provincias, por ex.
        else if((nome == "" && curso != "") && (provincia != "vazio" )){
            res.send('todas instituicoes de Angola com o curso: '+curso+"Provincia: "+provincia)
        }

}


exports.buscarDados = async(req, res)=>{
    var nomeCurso = req.query.nomeCurso;
    var provincia = req.query.provincia;
    var tipo = req.query.tipo;
    

    console.log(nomeCurso)
    console.log(provincia)  
    console.log(tipo)  
    //tudo vazio nada
    if(nomeCurso != ''  && provincia == 'vazio' && tipo == 'vazio'){
        // apenas curso inserido ---> Engenharia Quimica em toda Angola
        sql1 = `select *from instituicao join curso on instituicao.idInstituicao = curso.idInstituicao inner join provincia on instituicao.idProvincia = provincia.id where curso.nome like '%${nomeCurso}%' order by nomeProvincia`
        connection.query(sql1, (error, results)=>{
            if(error) throw error
            console.log(results)  
            res.json({data: results})
        })  
    
    }else if(nomeCurso == '' && provincia != 'vazio' && tipo == 'vazio'){
        //PROVINCIA APENAS INSERIDA ---> Todas universidades do Zaire
                sql2 = `select *from instituicao inner join provincia on instituicao.idProvincia = id where nomeProvincia like '%${provincia}%' order by nomeProvincia`
                connection.query(sql2, (error, results)=>{
                    if(error) throw error
                    console.log(results) 
                    res.json({data: results})
                })
    }else if(nomeCurso != '' && provincia != 'vazio' && tipo == 'vazio'){
        console.log(nomeCurso)
        console.log(provincia)
        //CURSO INSERIDO E PROVINCIA --->Todas universidades do Zaire com o curso de Engenharia Quimica.
        
        connection.query(`select *from instituicao left join curso on instituicao.idInstituicao = curso.idInstituicao inner join provincia on instituicao.idProvincia = provincia.id where curso.nome like '%${nomeCurso}%' and nomeProvincia = '${provincia}' order by nomeInstituicao`, (error, results)=>{
            if(error) throw error
            console.log(results) 
            res.json({data: results})
        })

    }else if(nomeCurso != '' && provincia == 'vazio' && tipo != 'vazio'){
        console.log(nomeCurso)
        console.log(provincia)
        //CURSO INSERIDO E PROVINCIA --->Todas universidades do Zaire com o curso de Engenharia Quimica.
        connection.query(`select *from instituicao left join curso on instituicao.idInstituicao = curso.idInstituicao inner join provincia on instituicao.idProvincia = provincia.id where curso.nome like '%${nomeCurso}%' and tipo = '${tipo}'  order by tipo`, (error, results)=>{
            if(error) throw error
            console.log(results) 
            res.json({data: results})
        })
    } 
    
    else if(nomeCurso != '' && provincia != 'vazio' && tipo != 'vazio'){
        console.log(nomeCurso)
        console.log(provincia)
        //CURSO INSERIDO E PROVINCIA --->Todas universidades do Zaire com o curso de Engenharia Quimica.
        connection.query(`select *from instituicao join curso on instituicao.idInstituicao = curso.idInstituicao inner join provincia on instituicao.idProvincia = provincia.id where curso.nome like '%${nomeCurso}%' and nomeProvincia = '${provincia}' and tipo = '${tipo} group by nomeInstituicao'`, (error, results)=>{
            if(error) throw error
            console.log(results) 
            res.json({data: results})
        })
    }    
    else if(nomeCurso == '' && provincia == 'vazio' && tipo == 'vazio'){
        console.log(nomeCurso)
        console.log(provincia)
        //CURSO INSERIDO E PROVINCIA --->Todas universidades do Zaire com o curso de Engenharia Quimica.
        
        connection.query(`SELECT * FROM instituicao inner join provincia on instituicao.idProvincia = provincia.id order by nomeProvincia`, (error, results)=>{
            if(error) throw error
            console.log(results) 
            res.json({data: results})
        })
    }
    else if(nomeCurso == '' && provincia != 'vazio' && tipo == 'vazio'){
        console.log(nomeCurso)
        console.log(provincia)
        //CURSO INSERIDO E PROVINCIA --->Todas universidades do Zaire com o curso de Engenharia Quimica.
        
        connection.query(`SELECT * FROM instituicao inner join provincia on instituicao.idProvincia = provincia.id order by nomeProvincia`, (error, results)=>{
            if(error) throw error
            console.log(results) 
            res.json({data: results})
        })
    }
    else if(nomeCurso == '' && provincia != 'vazio' && tipo != 'vazio'){
        console.log(nomeCurso)
        console.log(provincia)
        //CURSO INSERIDO E PROVINCIA --->Todas universidades do Zaire com o curso de Engenharia Quimica.
        
        connection.query(`SELECT * FROM instituicao inner join provincia on instituicao.idProvincia = provincia.id  where nomeProvincia like '%${provincia}%' and tipo = '${tipo}' order by nomeProvincia`, (error, results)=>{
            if(error) throw error
            console.log(results) 
            res.json({data: results})
        })
    }

    else if(nomeCurso == '' && provincia == 'vazio' && tipo != 'vazio'){
        console.log(nomeCurso)
        console.log(provincia)
        //CURSO INSERIDO E PROVINCIA --->Todas universidades do Zaire com o curso de Engenharia Quimica.
        
        connection.query(`SELECT * FROM instituicao inner join provincia on instituicao.idProvincia = provincia.id  where tipo = '${tipo}' order by tipo`, (error, results)=>{
            if(error) throw error
            console.log(results) 
            res.json({data: results})
        })
    }
    
}


exports.getFruits = async(req, res)=>{
    let payload = req.body.payload.trim();
    console.log(payload)
    let sql = `select *from instituicao inner join provincia on instituicao.idProvincia = provincia.id where instituicao.nomeInstituicao like '%${payload}%' or instituicao.sigla_acronomo like '%${payload}%'`;
    connection.query(sql, (error, results)=>{
        if (error) throw error;
        res.send({payload: results});// Envia os resultados como resposta JSON
    })

}  

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////  AMBIENTE PUBLICO
///// ---> BIBLIOTECA ❌
exports.livros = async(req, res)=> {
    let queryLiteratura = `SELECT *FROM material_didactico WHERE categoria='Lituratura'`
    
    let queryArte = `SELECT *FROM material_didactico WHERE categoria='Arte'`
    
    let queryExactas = `SELECT *FROM material_didactico WHERE categoria='Ciências Exactas'`
    let querySociais = `SELECT *FROM material_didactico WHERE categoria='Ciências Sociais'`
    let queryEducacao = `SELECT *FROM material_didactico WHERE categoria='Educação'`
    let queryLinguas = `SELECT *FROM material_didactico WHERE categoria='Línguas & Letras'`
    let queryTecnologia = `SELECT *FROM material_didactico WHERE categoria='Tecnologia'`
    let querySaude = `SELECT *FROM material_didactico WHERE categoria='Saúde'`
    connection.query(queryLiteratura, (error, Literatura)=>{

        connection.query(queryArte, (error, Arte)=>{
           
            connection.query(queryExactas, (error, Exactas)=>{
               
                connection.query(querySociais, (error, Sociais)=>{
                    
                    connection.query(queryEducacao, (error, Educacao)=>{
                        
                        connection.query(queryLinguas, (error, Linguas)=>{
                            
                            connection.query(queryTecnologia, (error, Tecnologia)=>{
                               
                                connection.query(querySaude, (error, Saude)=>{
                                    if (error) throw error;
                                        res.render('Publico/biblioteca', {Literatura, Arte, Exactas, Sociais, Educacao, Linguas, Tecnologia, Saude}
                                    )
                                })  
                            })      
                        })
                    })
                })
            })
        })
    })
}


exports.baixarLivro = async(req, res) =>{
    const {id} = req.body
    queryLivros = `select *from material_didactico where idMaterial = ${id}`
    connection.query(queryLivros, (error, livros)=> {
        res.render('Publico/baixarLivro', {livros});
    })
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.orientacao = async(req, res) =>{
    res.render('Publico/academica')
}




    