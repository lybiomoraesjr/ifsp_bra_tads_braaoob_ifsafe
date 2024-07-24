import { Database } from "./core/Database";
import { PasswordHasher } from "./providers/PasswordHasher";
import { UserRepository } from "./repositories/UserRepository";
import { IUser } from "./models/User";
import { Occurrence } from "./models/Occurrence";
import { env } from "./config/env";

/**
 * Popula o banco com uma "rede" inicial para desenvolvimento: usuários,
 * ocorrências (status variados), comentários e curtidas. Assim, ao logar, já
 * existe um feed realista.
 *
 * É idempotente: garante os usuários (cria se faltar) e só cria ocorrências se
 * ainda não houver nenhuma — restart do container não duplica nem apaga dados.
 * Para recriar do zero: `docker compose down -v` e suba novamente.
 *
 * Rode com: yarn seed
 */
async function seed() {
  const database = new Database(env.mongoUri);
  await database.connect();

  const users = new UserRepository();
  const hasher = new PasswordHasher();

  // Garante um usuário (cria com senha hasheada se ainda não existir).
  const ensureUser = async (
    name: string,
    email: string,
    password: string,
    admin = false
  ): Promise<IUser> => {
    const existing = await users.findByEmail(email);
    if (existing) return existing;
    return users.create({
      name,
      email,
      password: await hasher.hash(password),
      admin,
    });
  };

  const admin = await ensureUser(
    "Administrador",
    "admin@ifsafe.dev",
    "admin123",
    true
  );
  const ana = await ensureUser("Ana Souza", "ana@ifsafe.dev", "senha123");
  const bruno = await ensureUser("Bruno Lima", "bruno@ifsafe.dev", "senha123");
  const carla = await ensureUser("Carla Nunes", "carla@ifsafe.dev", "senha123");

  console.log("✅ Usuários prontos:");
  console.log("   admin@ifsafe.dev / admin123  (admin)");
  console.log("   ana@ifsafe.dev   / senha123");
  console.log("   bruno@ifsafe.dev / senha123");
  console.log("   carla@ifsafe.dev / senha123");

  const alreadySeeded = await Occurrence.countDocuments();
  if (alreadySeeded > 0) {
    console.log(
      `ℹ️  Já existem ${alreadySeeded} ocorrências — pulando criação do feed.`
    );
    await database.disconnect();
    process.exit(0);
  }

  const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/400`;

  const occurrences = [
    {
      title: "Lâmpada queimada no Bloco A",
      description:
        "A lâmpada do corredor do primeiro andar do Bloco A está queimada há dias.",
      image: img("ifsafe-lampada"),
      location: "Bloco A — 1º andar",
      status: "Pendente" as const,
      statusComment: null,
      author: ana._id,
      comments: [
        { author: bruno._id, text: "Passei por lá hoje, continua apagada." },
        { author: admin._id, text: "Vamos encaminhar para a manutenção." },
      ],
      likes: [bruno._id, carla._id],
    },
    {
      title: "Vazamento no banheiro do 2º andar",
      description:
        "Há um vazamento embaixo da pia do banheiro masculino do 2º andar.",
      image: img("ifsafe-vazamento"),
      location: "Bloco B — 2º andar",
      status: "Solucionado" as const,
      statusComment: "Reparo concluído pela equipe de manutenção.",
      author: bruno._id,
      comments: [{ author: ana._id, text: "Obrigada pela rapidez!" }],
      likes: [ana._id, carla._id, admin._id],
    },
    {
      title: "Tomada sem energia na sala de TADS",
      description:
        "As tomadas da fileira da janela na sala de TADS não estão funcionando.",
      image: img("ifsafe-tomada"),
      location: "Laboratório TADS",
      status: "Pendente" as const,
      statusComment: null,
      author: carla._id,
      comments: [],
      likes: [bruno._id],
    },
    {
      title: "Internet instável no laboratório de redes",
      description:
        "A conexão cai com frequência durante as aulas práticas no laboratório.",
      image: img("ifsafe-internet"),
      location: "Laboratório de Redes",
      status: "Pendente" as const,
      statusComment: null,
      author: bruno._id,
      comments: [
        { author: ana._id, text: "Aconteceu na minha aula também." },
        { author: carla._id, text: "+1, atrapalhou a prática." },
        { author: admin._id, text: "Abrindo chamado para a TI." },
      ],
      likes: [ana._id, carla._id],
    },
    {
      title: "Porta de emergência travada",
      description:
        "A porta de emergência próxima à escada não abre pelo lado de dentro.",
      image: img("ifsafe-porta"),
      location: "Bloco A — saída de emergência",
      status: "Cancelado" as const,
      statusComment: "Ocorrência duplicada; tratada em outra solicitação.",
      author: ana._id,
      comments: [],
      likes: [admin._id],
    },
  ];

  await Occurrence.create(occurrences);
  console.log(`✅ ${occurrences.length} ocorrências criadas (com comentários e curtidas).`);

  await database.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Falha no seed:", error);
  process.exit(1);
});
