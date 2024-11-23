# modern-nodejs-api-rest-app
A project developed at the module about API REST of NodeJs 


## Install the App and run the server
- Run: 
- `npm install` 
- Then
- `npm run dev`

## To run the Migrate
- To create the file
- `npm run knex -- migrate:make create-transactions` 

- To run the file
- `npm run knex -- migrate:latest`

- To rollback the changes
- `npm run knex --migrate:rollback `

## RF (requesitos funcionais)
- [x] O usuário deve poder criar uma nova transação;
- [ ] O usuário deve poder obter um resumo da sua conta;
- [x] O usuário deve poder listar todas transações que já ocorreram;
- [x] O usuário deve poder visualizar uma transação única;
# RN (requisitos nao funcionais)
- [x] A transação pode ser do tipo crédito que somará ao valor total, ou débito subtrairá;
- [ ] Deve ser possível identificarmos o usuário entre as requisições;
- [ ] O usuário só pode visualizar transações o qual ele criou;
