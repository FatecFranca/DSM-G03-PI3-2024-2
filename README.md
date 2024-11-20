# **DSM-G03-PI3-2024-2**

Projeto Integrador desenvolvido pelos alunos do curso de **Desenvolvimento de Software Multiplataforma (DSM)** da **Fatec Franca** – Semestre 2024/2. Este projeto consiste em uma aplicação web interativa e funcional voltada para a **gestão de veículos, peças e históricos de manutenção**.

---

## **Descrição do Projeto**

O **DSM-G03-PI3-2024-2** é uma plataforma web desenvolvida para facilitar o gerenciamento de veículos e seus componentes, incluindo peças e históricos de manutenção. O sistema também permite o cadastro de usuários com controle de acesso seguro, garantindo uma experiência personalizada para cada cliente.

A aplicação utiliza tecnologias modernas e segue as melhores práticas de desenvolvimento web para oferecer confiabilidade e eficiência.

> **Demonstração do projeto (YouTube): [Assista aqui](https://www.youtube.com/watch?v=6QO9hqfEfqE)**  
> **Explore a aplicação funcional:**  
> - [Página Inicial](https://fatecfranca.github.io/DSM-G03-PI3-2024-2/front-end/index)  
> - [Login](https://fatecfranca.github.io/DSM-G03-PI3-2024-2/front-end/login)  
> - [Cadastro](https://fatecfranca.github.io/DSM-G03-PI3-2024-2/front-end/signup)  
> - [Veículos](https://fatecfranca.github.io/DSM-G03-PI3-2024-2/front-end/vehicles)  
> - [Peças](https://fatecfranca.github.io/DSM-G03-PI3-2024-2/front-end/parts)  
> - [Histórico de Manutenção](https://fatecfranca.github.io/DSM-G03-PI3-2024-2/front-end/historico)  

---

## **Funcionalidades**

### **1. Gerenciamento de Veículos**
- Permite o cadastro, edição e exclusão de veículos.
- Dados coletados incluem: marca, modelo, ano, placa, cor, quilometragem, Renavam, status e observações.
- Exibição de veículos cadastrados em um grid interativo.
- Ação de exclusão com confirmação e atualização da lista automaticamente.

### **2. Gerenciamento de Peças**
- Cadastro e visualização de peças relacionadas aos veículos.

### **3. Histórico de Manutenção**
- Registro e visualização de manutenções realizadas em veículos cadastrados.

### **4. Cadastro e Login de Usuários**
- Formulário para criação de conta com validação de campos e confirmação de senha.
- Campos para cadastro: nome, CPF, e-mail, celular, endereço completo (logradouro, número, complemento, bairro, município, UF, CEP) e data de nascimento.
- Integração com API para persistência dos dados.

### **5. Controle de Sessão**
- Armazenamento do ID do usuário logado via `localStorage` para autenticação e personalização.

---

## **Tecnologias Utilizadas**

- **Frontend:**  
  - HTML5, CSS3 e JavaScript  
  - Framework: Vue.js  

- **Backend:**  
  - Node.js  
  - Prisma ORM  
  - Banco de Dados: MongoDB  

- **Outras Ferramentas:**  
  - GitHub Pages (para hospedagem do front-end)  
  - NPM (gerenciamento de pacotes)  
  - Docker (para ambientes de desenvolvimento consistentes)  

---

## **Como Executar o Projeto**

### **Pré-requisitos**
- **Node.js** (versão 16 ou superior)  
- **MongoDB** (configurado e rodando localmente ou em um serviço remoto)

### **Passo a Passo**

1. Clone este repositório:
   ```bash
   git clone https://github.com/FatecFranca/DSM-G03-PI3-2024-2.git
   ```

2. Acesse o diretório do projeto:
   ```bash
   cd DSM-G03-PI3-2024-2
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Configure o arquivo `.env` com as variáveis de ambiente:
   ```
   DATABASE_URL=mongodb://<user>:<password>@localhost:27017/<database>
   ```

5. Execute as migrações do banco de dados:
   ```bash
   npx prisma generate dev
   ```

6. Inicie o servidor:
   ```bash
   npm start
   ```

7. Acesse o sistema no navegador:
   ```
   http://localhost:3000
   ```

---

## **Autores**

O projeto foi desenvolvido por:

- **[Danilo B. Ribeiro]** – [GitHub](#) | [LinkedIn](#)  
- **[Gustavo Moreira]** – [GitHub](#) | [LinkedIn](#)  
- **[Thiago D. Resende]** – [GitHub](https://github.com/ThiagoResende88) | [LinkedIn](https://www.linkedin.com/in/thiago-resende-6a1ba9148/) 
- **[Thiago D. Resende]** – [GitHub](#) | [LinkedIn](#)  

---

## **Licença**

Este projeto está licenciado sob a [MIT License](./LICENSE). Consulte o arquivo para mais informações.
