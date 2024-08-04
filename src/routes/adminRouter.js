const express = require('express')
const router = express.Router()
const admController = require('../controllers/admController')

function f_adminAuth(req, res, next) { 
    if(req.session.user != undefined){
        next()
    }else{
        res.render('./Admin/login')
    }
 }

console.log('LOADED ROUTE ----> admin')


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ROTAS DO ADMINISTRATOR
// ----> LOGIN E LOGOUT ✅
router.get('/admLogin', admController.admLogin)
router.get('/admHome', admController.admHome)
router.post('/admAuth', admController.admAuth)
router.get('/logoutAdm', admController.logoutAdm)
router.get('/verificar', admController.verificar)
/////////////////////////////////////////////////////////////////////////
/*//*/ // ROTAS TEMPORARIAS ✅                                //////////
/*//*/    router.get('/admRegister', admController.adminRegister)    //
/*//*/    router.post('/cadAdm', admController.cadAdmin)            //
/////////////////////////////////////////////////////////////////////


// ----> GESTAO DE INSTITUICOES ✅
router.get('/adminstituicoes', admController.adminstituicoes)
router.post('/verInstituicao', admController.verInstituicao)
router.post('/cadastrarInst', admController.cadastrarInst)
router.get('/editarInst/:id', admController.editarInst)
router.get('/adm_eliminar_inst/:id', admController.adm_eliminar_inst)
router.post('/admSaveedit_Inst', admController.admSaveedit_Inst)

// ----> GESTAO DE CURSOS ✅
router.get('/adm_addcurso_inst/:id', admController.adm_addcurso_inst)
router.post('/admCadastrarCurso', admController.admCadastrarCurso)
router.post('/adm_eliminar_curso', admController.adm_eliminar_curso)
router.post('/adm_edit_curso', admController.adm_edit_curso)
router.post('/admUpdateCurso', admController.admUpdateCurso)
router.post('/admUpdateCurso_grade', admController.admUpdateCurso_grade)
router.post('/adm_ver_curso', admController.adm_ver_curso)
// ----> GESTAO DE BIBLIOTECA ✅


router.get('/adm_biblioteca', admController.adm_biblioteca)   
router.get('/adm_elim_livro/:id', admController.adm_elim_livro)
router.post('/adm_add_livro', admController.adm_add_livro)
router.get('/adm_edit_livro/:id', admController.adm_edit_livro)
router.get('/instit', admController.instit)
router.post('/adm_update_livro', admController.adm_update_livro)
router.get('/admBiblioteca', admController.admBiblioteca)
router.post('/adm_update_livro_pdf', admController.adm_update_livro_pdf)
router.post('/admverLivro', admController.admverLivro)




// -----> GESTAO DE CONTAS EXISTENTES ❌
router.get('/conta', admController.conta)
router.get('/solicitarConta', admController.solicitarConta)
router.post('/enviarSolicitacao', admController.enviarSolicitacao)
router.post('/authConta', admController.authConta)
router.get('/logoutConta', admController.logoutConta)
router.post('/conta_eliminar_curso', admController.conta_eliminar_curso)
router.post('/conta_editar_curso', admController.conta_editar_curso)
router.post('/contaUpdateCurso_grade', admController.contaUpdateCurso_grade)
router.post('/contaUpdateCurso', admController.contaUpdateCurso)
router.post('/conta_ver_curso', admController.conta_ver_curso)
router.post('/contaCadastrarCurso', admController.contaCadastrarCurso)

// -----> GESTAO DE SOLICITACOES DE CONTAS ❌

// -----> GESTAO E EMISSAO DE NOTIFICACOES ❌
router.get('/ver_emitir_notificacao', admController.ver_emitir_notificacao)

router.get('/perfil', admController.perfil)

module.exports = router;