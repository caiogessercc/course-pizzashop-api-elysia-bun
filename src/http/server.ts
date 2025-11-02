import { Elysia } from "elysia";

/** 
 * Cria o "container" da aplicação HTTP. A partir desta instância:
 * - Configuramos rotas HTTP (GET/POST/PUT/DELETE etc.).
 * - Registramos middlewares/plugins (quando necessário).
 * - Por fim, iniciamos o servidor com `listen`.
 */
const app = new Elysia()

/**
 * Define uma rota HTTP GET em "/".
 *
 * @summary Endpoint de 'saudação' (Hello World).
 * @route GET /
 * @returns {string} Mensagem simples confirmando que o servidor está respondendo.
 * @example
 * // Requisição:
 * // GET http://localhost:3333/
 * //
 * // Resposta: "Hello World"
 *
 * @description
 * A assinatura `.get(path, handler)` recebe:
 * - `path` {string}: caminho relativo da rota (ex.: "/", "/orders").
 * - `handler` função que processa a requisição e retorna a resposta.
 */
.get("/", () => "Hello World");

/**
 * Inicia o servidor HTTP escutando a porta 3333.
 *
 * @function listen
 * @see https://elysiajs.com/ (documentação Elysia)
 *
 * @param {number} 3333 Porta usada para aceitar conexões.
 * @param {() => void} callback executada após o servidor iniciar com sucesso.
 */
app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
