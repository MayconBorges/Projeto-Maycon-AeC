const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sCep = document.querySelector('#m-cep')
const sLogradouro = document.querySelector('#m-logradouro')
const sCidade = document.querySelector('#m-cidade')
const sEstado = document.querySelector('#m-estado')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

sCep.addEventListener('input', function(event) {
    this.value = this.value.replace(/\D/g, '');
});

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sFuncao.value = itens[index].funcao
    sSalario.value = itens[index].salario
    sCep.value = itens[index].cep
    sLogradouro.value = itens[index].logradouro
    sCidade.value = itens[index].cidade
    sEstado.value = itens[index].estado

    id = index
  } else {
    sNome.value = ''
    sFuncao.value = ''
    sSalario.value = ''
    sCep.value = ''
    sLogradouro.value = ''
    sCidade.value = ''
    sEstado.value = ''

  }
  
}

function editItem(index) {

  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>R$ ${item.salario}</td>
    <td>${item.cep}</td>
    <td>${item.logradouro}</td>
    <td>${item.cidade}</td>
    <td>${item.estado}</td>


    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  // Adiciona um ouvinte de evento de entrada ao campo de CEP para buscar automaticamente
  sCep.addEventListener('input', async function(event) {
    // Remove qualquer caractere que não seja número
    this.value = this.value.replace(/\D/g, '');
  
    // Limita o número máximo de dígitos permitidos no campo de CEP
    const maxLength = 8; // Permitindo até 9 dígitos (incluindo o hífen)
    if (this.value.length > maxLength) {
      this.value = this.value.slice(0, maxLength);
    }
  
    // Verifica se o campo de CEP possui 8 ou 9 dígitos para buscar automaticamente
    if (this.value.length >= 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${this.value}/json/`);
        const data = await response.json();
        
        // Verifica se o CEP é válido
        if (!data.erro) {
          // Preenche automaticamente os campos de logradouro, cidade e estado
          sLogradouro.value = data.logradouro || '';
          sCidade.value = data.localidade || '';
          sEstado.value = data.uf || '';
        } else {
          // Se o CEP for inválido, exibe uma mensagem de notificação
          alert('CEP inválido. Por favor, insira um CEP válido.');
          // Limpa os campos de logradouro, cidade e estado
          sLogradouro.value = '';
          sCidade.value = '';
          sEstado.value = '';
        }
      } catch (error) {
        console.error('Erro ao obter informações do CEP:', error);
        alert('Ocorreu um erro ao obter informações do CEP. Por favor, tente novamente.');
      }
    }
  });

  if (edit) {
    // Código para edição aqui
  } else {
    // Código para adicionar um novo item aqui
  }
}

btnSalvar.onclick = async e => {
  
  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '' || sCep.value == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].funcao = sFuncao.value
    itens[id].salario = sSalario.value
    itens[id].cep = sCep.value
    itens[id].logradouro = sLogradouro.value
    itens[id].cidade = sCidade.value
    itens[id].estado = sEstado.value

  } else {
    // Obter informações do CEP usando a API do ViaCEP
    try {
      const response = await fetch(`https://viacep.com.br/ws/${sCep.value}/json/`);
      const data = await response.json();
      
      // Verifica se o CEP é válido
      if (data.erro) {
        alert('CEP inválido. Por favor, insira um CEP válido.');
        return;
      }
      
      // Adiciona informações do endereço ao formulário
      sLogradouro.value = data.logradouro;
      sCidade.value = data.localidade;
      sEstado.value = data.uf;

      // Atualiza os atributos value dos inputs correspondentes no HTML
      document.getElementById('m-logradouro').value = data.logradouro;
      document.getElementById('m-cidade').value = data.localidade;
      document.getElementById('m-estado').value = data.uf;

      // Adiciona o novo item ao array de itens
      itens.push({'nome': sNome.value, 'funcao': sFuncao.value, 'salario': sSalario.value, 'cep': sCep.value, 'logradouro': data.logradouro, 'cidade': data.localidade, 'estado': data.uf});
    } catch (error) {
      console.error('Erro ao obter informações do CEP:', error);
      alert('Ocorreu um erro ao obter informações do CEP. Por favor, tente novamente.');
      return;
    }
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()


function togglePasswordVisibility(inputId) {
  var passwordInput = document.getElementById(inputId);
  var passwordIcon = passwordInput.nextElementSibling.querySelector("i");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordIcon.classList.remove("bxs-lock-alt");
    passwordIcon.classList.add("bxs-lock-open-alt");
  } else {
    passwordInput.type = "password";
    passwordIcon.classList.remove("bxs-lock-open-alt");
    passwordIcon.classList.add("bxs-lock-alt");
  }
}



function exportToCSV() {
  // Obtém os dados da tabela
  const rows = document.querySelectorAll('table tbody tr');

  // Cria um array para armazenar as linhas do CSV
  const csv = [];

  // Adiciona o cabeçalho ao CSV
  csv.push(['Nome', 'Função', 'Salário', 'CEP', 'Logradouro', 'Cidade', 'Estado']);

  // Itera sobre as linhas da tabela e adiciona os dados ao array CSV
  rows.forEach(row => {
    const rowData = [];
    row.querySelectorAll('td').forEach(cell => {
      rowData.push(cell.innerText);
    });
    csv.push(rowData);
  });

  // Converte o array CSV em uma string CSV
  const csvContent = csv.map(row => row.join(',')).join('\n');

  // Cria um elemento <a> para baixar o arquivo CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'clientes.csv');
  document.body.appendChild(link);

  // Clica no link para iniciar o download
  link.click();

  // Remove o elemento <a> do DOM
  document.body.removeChild(link);
}