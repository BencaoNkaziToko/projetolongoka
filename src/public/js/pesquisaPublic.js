// Este arquivo pode ser usado para adicionar interações do lado do cliente

// Exemplo de código JavaScript para lidar com eventos na página
document.addEventListener('DOMContentLoaded', function() {
    // Captura o elemento input
    const inputNome = document.getElementById('nome')

    // Função para buscar dados no servidor e atualizar a tabela
    const buscarDados = async () => {
      const valorInputNome = inputNome.value;
      try {
        const response = await fetch('/pesquisaPublica', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              nome: valorInputNome
            })
        });
  
        if (response.ok) {
          const dados = await response.json();
          atualizarTabela(dados);
        } else {
          console.error('Erro ao buscar os dados.');
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    // Função para atualizar a tabela com os dados recebidos do servidor
    const atualizarTabela = (dados) => {
      const tabela = document.getElementById('tabela');
      const tbody = tabela.querySelector('tbody');
  
      // Limpa o conteúdo atual da tabela
      tbody.innerHTML = '';
  
      // Verifica se há dados a serem exibidos
      if (dados.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '6');
        td.textContent = 'Nenhum dado encontrado.';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }
  
      // Preenche a tabela com os dados
      dados.forEach((dado) => {
        const tr = document.createElement('tr');
        const tdNome = document.createElement('td');
        
        
        
        tdNome.textContent = dado.nomeInstituicao;
        tdProvincia.textContent = dado.nomeProvincia;
        //tdOpcao.textContent = dado.preco_produto;
        
        
        tr.appendChild(tdNome);
        tr.appendChild(tdProvincia);
        tr.appendChild(tdOpcao);
        
  
        tbody.appendChild(tr);
      });
    };
  
    // Evento para chamar a função de busca quando o valor da input for alterado
    inputNome.addEventListener('input', buscarDados);
  });
  