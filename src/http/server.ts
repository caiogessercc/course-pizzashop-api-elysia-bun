import { Elysia, t } from "elysia";
import { db } from "../db/connection";
import { usersTable, restaurantsTable } from "../db/schema";

/**
 * Cria o "container" da aplicação HTTP. A partir desta instância:
 * - Configuramos rotas HTTP (GET/POST/PUT/DELETE etc.).
 * - Registramos middlewares/plugins (quando necessário).
 * - Por fim, iniciamos o servidor com `listen`.
 */
const app = new Elysia();

/**
 * GET /
 *
 * Endpoint de healthcheck.
 * Retorna uma string simples indicando que o servidor está respondendo.
 */
app.get("/", () => "Hello World");

/**
 * POST /restaurants
 *
 * Cria um manager (usuário com role = 'manager') e um restaurante associado a esse manager.
 *
 * Fluxo:
 * 1. Extrai dados do `body`.
 * 2. Valida presença de campos obrigatórios (validação básica).
 * 3. Insere o usuário (manager) no banco e obtém o id retornado via .returning()
 * 4. Insere o restaurante referenciando o managerId.
 * 5. Retorna 204 No Content em caso de sucesso.
 *
 * @route POST /restaurants
 * @returns {void} - Resposta sem corpo (204) em sucesso.
 */
app.post("/restaurants", async ({ body, set }) => {
  const { restaurantName, managerName, email, phone } = body

  const [manager] = await db
    .insert(usersTable)
    .values({
      name: managerName,
      email,
      phone,
      role: "manager",
    })
    .returning({ id: usersTable.id });

  await db.insert(restaurantsTable).values({
    name: restaurantName,
    managerId: manager?.id,
  });

  set.status = 204;
},
{
  /**
     * Schema de validação do corpo (body) usando TypeBox.
     *
     * - `t.String()` → campo obrigatório do tipo string.
     * - `t.String({ format: 'email' })` → valida formato de e-mail.
     * - Se algum campo estiver ausente ou inválido, o Elysia retorna
     *   HTTP 400 automaticamente com mensagem descritiva.
     */
  body: t.Object({
    restaurantName: t.String(),
    managerName: t.String(),
    email: t.String({format: 'email'}),
    phone: t.String(),
  }),
});

/**
 * Inicializa o servidor HTTP.
 */
app.listen(3333, () => {
  console.log("Server is running on port 3333");
});