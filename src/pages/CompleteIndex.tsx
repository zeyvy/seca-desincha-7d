import { useEffect, useMemo, useState } from "react";
import logo from "@/assets/uploads/3718.png";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Droplets,
  Dumbbell,
  Flame,
  Lock,
  Mail,
  Menu,
  Play,
  Ruler,
  Sparkles,
  Target,
  Trophy,
  Utensils,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Tracking from "@/components/Tracking";

type Screen =
  | "email"
  | "welcome"
  | "tutorial"
  | "upsell"
  | "home"
  | "day"
  | "workout"
  | "complete"
  | "tracking";

type AccessStatus = "pending" | "approved" | "cancelled" | "refunded" | "locked";

type Exercise = {
  id: string;
  name: string;
  instructions: string[];
  breathing: string;
  dosage: string;
  rest: string;
  care: string;
  easier: string;
  visual: string;
};

type Meal = {
  type: string;
  name: string;
  ingredients: string;
  preparation: string;
  substitutions: string;
};

type Day = {
  title: string;
  objective: string;
  mission: string;
  checklist: string[];
  meals: Meal[];
  exercises: string[];
};

const photos = {
  meals:
    "https://images.pexels.com/photos/8844564/pexels-photo-8844564.jpeg?auto=compress&cs=tinysrgb&w=1600",
  movement:
    "https://images.pexels.com/photos/6516232/pexels-photo-6516232.jpeg?auto=compress&cs=tinysrgb&w=1600",
  tracker:
    "https://images.pexels.com/photos/7947851/pexels-photo-7947851.jpeg?auto=compress&cs=tinysrgb&w=1600",
  checklist:
    "https://images.pexels.com/photos/8850721/pexels-photo-8850721.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const exerciseLibrary: Record<string, Exercise> = {
  marcha: {
    id: "marcha",
    name: "Marcha parada",
    instructions: [
      "Fique em pé, com os pés afastados na largura dos quadris.",
      "Eleve um joelho de cada vez, movimentando os braços naturalmente.",
      "Mantenha o tronco alto e pouse o pé com suavidade.",
    ],
    breathing: "Respire de forma contínua, sem prender o ar.",
    dosage: "45 segundos",
    rest: "20 segundos",
    care: "Mantenha um ritmo confortável e reduza a altura dos joelhos se necessário.",
    easier: "Marche lentamente segurando o encosto de uma cadeira.",
    visual: photos.movement,
  },
  agachamento: {
    id: "agachamento",
    name: "Agachamento",
    instructions: [
      "Fique em pé com os pés aproximadamente na largura dos quadris.",
      "Leve o quadril para trás e flexione os joelhos com controle.",
      "Desça até onde conseguir manter os pés firmes e volte empurrando o chão.",
    ],
    breathing: "Inspire na descida e expire na subida.",
    dosage: "10 a 15 repetições",
    rest: "30 a 45 segundos",
    care: "Os joelhos acompanham a direção dos pés; não force a amplitude.",
    easier: "Use uma cadeira firme como apoio.",
    visual:
      "https://images.pexels.com/photos/8846092/pexels-photo-8846092.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  apoio: {
    id: "apoio",
    name: "Agachamento com apoio",
    instructions: [
      "Fique atrás de uma cadeira firme e apoie levemente as mãos.",
      "Leve o quadril para trás, mantendo o peito confortável.",
      "Volte à posição inicial sem puxar o corpo pelos braços.",
    ],
    breathing: "Inspire ao descer e expire ao subir.",
    dosage: "12 repetições",
    rest: "30 segundos",
    care: "Confira se a cadeira está estável antes de começar.",
    easier: "Diminua a amplitude do movimento.",
    visual: photos.movement,
  },
  ponte: {
    id: "ponte",
    name: "Ponte de glúteos",
    instructions: [
      "Deite de costas, flexione os joelhos e apoie os pés no chão.",
      "Contraia suavemente o abdômen e eleve o quadril.",
      "Pause no alto e desça devagar, sem jogar o peso na lombar.",
    ],
    breathing: "Expire ao elevar o quadril e inspire ao descer.",
    dosage: "12 a 15 repetições",
    rest: "30 segundos",
    care: "Faça uma elevação confortável, mantendo os ombros apoiados.",
    easier: "Eleve apenas alguns centímetros.",
    visual: photos.movement,
  },
  panturrilha: {
    id: "panturrilha",
    name: "Elevação de panturrilha",
    instructions: [
      "Fique em pé próximo a uma parede ou cadeira.",
      "Eleve os calcanhares lentamente, ficando na ponta dos pés.",
      "Desça com controle até apoiar toda a planta dos pés.",
    ],
    breathing: "Expire ao subir e inspire ao descer.",
    dosage: "15 repetições",
    rest: "30 segundos",
    care: "Evite balançar o corpo para ganhar impulso.",
    easier: "Faça o movimento sentado.",
    visual: photos.movement,
  },
  lateral: {
    id: "lateral",
    name: "Passo lateral",
    instructions: [
      "Fique em pé com os joelhos levemente flexionados.",
      "Dê dois passos para um lado e depois retorne.",
      "Mantenha os pés apontados para frente e o tronco estável.",
    ],
    breathing: "Respire naturalmente durante os passos.",
    dosage: "40 segundos",
    rest: "20 segundos",
    care: "Use passos pequenos para manter o equilíbrio.",
    easier: "Faça apenas um passo para cada lado.",
    visual: photos.movement,
  },
  joelhos: {
    id: "joelhos",
    name: "Elevação de joelhos",
    instructions: [
      "Fique em pé com o abdômen levemente ativo.",
      "Eleve um joelho até uma altura confortável.",
      "Alterne os lados mantendo o apoio estável.",
    ],
    breathing: "Expire ao elevar o joelho.",
    dosage: "30 segundos",
    rest: "20 segundos",
    care: "Não compense inclinando o tronco para trás.",
    easier: "Toque o pé à frente em vez de elevar o joelho.",
    visual: photos.movement,
  },
  polichinelo: {
    id: "polichinelo",
    name: "Polichinelo sem salto",
    instructions: [
      "Comece com os pés juntos e os braços ao lado do corpo.",
      "Abra um pé por vez enquanto eleva os braços.",
      "Retorne ao centro sem saltar.",
    ],
    breathing: "Respire continuamente no seu próprio ritmo.",
    dosage: "40 segundos",
    rest: "20 segundos",
    care: "Faça movimentos menores se sentir impacto.",
    easier: "Movimente apenas os braços e alterne os pés.",
    visual: photos.movement,
  },
  afundo: {
    id: "afundo",
    name: "Afundo com apoio",
    instructions: [
      "Fique ao lado de uma parede ou cadeira.",
      "Leve uma perna para trás e flexione os dois joelhos.",
      "Empurre o chão para voltar e alterne o lado.",
    ],
    breathing: "Inspire ao descer e expire ao retornar.",
    dosage: "8 repetições por lado",
    rest: "40 segundos",
    care: "Mantenha o joelho da frente alinhado ao pé.",
    easier: "Faça um passo curto e desça pouco.",
    visual: photos.movement,
  },
  parede: {
    id: "parede",
    name: "Flexão na parede",
    instructions: [
      "Apoie as mãos na parede na altura do peito.",
      "Caminhe alguns centímetros para trás.",
      "Flexione os cotovelos aproximando o peito da parede e empurre.",
    ],
    breathing: "Inspire ao aproximar e expire ao empurrar.",
    dosage: "10 a 12 repetições",
    rest: "30 segundos",
    care: "Mantenha o corpo alinhado, sem deixar o quadril cair.",
    easier: "Fique mais perto da parede.",
    visual: photos.movement,
  },
  bird: {
    id: "bird",
    name: "Bird dog",
    instructions: [
      "Fique em quatro apoios, com mãos sob os ombros.",
      "Estenda uma perna e o braço oposto sem girar o quadril.",
      "Volte ao centro e troque os lados.",
    ],
    breathing: "Expire ao estender e inspire ao retornar.",
    dosage: "8 repetições por lado",
    rest: "30 segundos",
    care: "Mantenha a coluna neutra e mova devagar.",
    easier: "Estenda somente uma perna ou um braço por vez.",
    visual: photos.movement,
  },
  deadbug: {
    id: "deadbug",
    name: "Dead bug simplificado",
    instructions: [
      "Deite de costas com os joelhos flexionados.",
      "Leve os braços para cima e toque o chão com um calcanhar.",
      "Retorne e alterne o lado, mantendo a lombar confortável.",
    ],
    breathing: "Expire ao afastar o calcanhar e inspire ao voltar.",
    dosage: "10 repetições alternadas",
    rest: "30 segundos",
    care: "Não deixe a lombar arquear excessivamente.",
    easier: "Mantenha os braços apoiados ao lado do corpo.",
    visual: photos.movement,
  },
  prancha: {
    id: "prancha",
    name: "Prancha com joelhos apoiados",
    instructions: [
      "Apoie antebraços e joelhos no chão.",
      "Alinhe ombros, quadril e joelhos.",
      "Ative o abdômen e mantenha a posição sem prender a respiração.",
    ],
    breathing: "Respire lentamente durante toda a posição.",
    dosage: "20 a 30 segundos",
    rest: "30 segundos",
    care: "Pare se perder o alinhamento ou sentir dor.",
    easier: "Faça por 10 segundos e descanse.",
    visual: photos.movement,
  },
  abdominal: {
    id: "abdominal",
    name: "Abdominal curto",
    instructions: [
      "Deite de costas com os joelhos flexionados.",
      "Apoie as mãos nas coxas e eleve levemente os ombros.",
      "Desça controlando o movimento, sem puxar o pescoço.",
    ],
    breathing: "Expire ao subir e inspire ao descer.",
    dosage: "10 repetições",
    rest: "30 segundos",
    care: "Mantenha o queixo afastado do peito.",
    easier: "Faça somente uma contração pequena.",
    visual: photos.movement,
  },
  quadril: {
    id: "quadril",
    name: "Extensão de quadril em quatro apoios",
    instructions: [
      "Fique em quatro apoios com a coluna confortável.",
      "Eleve uma perna flexionada, levando a sola do pé ao teto.",
      "Desça sem apoiar completamente e repita.",
    ],
    breathing: "Expire ao elevar e inspire ao descer.",
    dosage: "10 repetições por lado",
    rest: "30 segundos",
    care: "Evite girar o quadril ou arquear a lombar.",
    easier: "Eleve a perna somente alguns centímetros.",
    visual: photos.movement,
  },
  superman: {
    id: "superman",
    name: "Superman alternado",
    instructions: [
      "Deite de barriga para baixo com braços estendidos.",
      "Eleve um braço e a perna oposta alguns centímetros.",
      "Desça e alterne os lados com movimento controlado.",
    ],
    breathing: "Expire ao elevar e inspire ao retornar.",
    dosage: "8 repetições por lado",
    rest: "30 segundos",
    care: "Não force a altura; mantenha o pescoço neutro.",
    easier: "Eleve apenas um membro por vez.",
    visual: photos.movement,
  },
};

const dayMeals = (day: number): Meal[] => {
  const menus: Meal[][] = [
    [
      ["CAFÉ DA MANHÃ", "Iogurte com aveia e banana", "1 pote de iogurte natural, 2 colheres de aveia e 1 banana em rodelas.", "Misture tudo e finalize com canela.", "Troque o iogurte por leite ou bebida vegetal e a banana por mamão."],
      ["ALMOÇO", "Arroz, feijão, frango e salada", "3 colheres de arroz, 1 concha pequena de feijão, 1 filé de frango e salada à vontade.", "Grelhe o frango e monte o prato com metade de vegetais.", "Troque frango por ovos, peixe ou grão-de-bico."],
      ["LANCHE", "Maçã com castanhas", "1 maçã e 1 pequena porção de castanhas.", "Lave a fruta e consuma com as castanhas.", "Use pera ou banana e sementes."],
      ["JANTAR", "Omelete de legumes", "2 ovos, tomate, cenoura ralada e folhas.", "Misture os ovos, junte os legumes e cozinhe em fogo baixo.", "Troque os ovos por frango desfiado ou tofu."],
    ],
    [
      ["CAFÉ DA MANHÃ", "Tapioca com ovo", "1 tapioca média, 2 ovos mexidos e tomate.", "Prepare a tapioca e recheie com os ovos e tomate.", "Use pão integral ou cuscuz."],
      ["ALMOÇO", "Bowl de arroz e carne", "Arroz, carne moída, abóbora cozida e folhas.", "Refogue a carne e sirva com os acompanhamentos.", "Troque carne por lentilha ou frango."],
      ["LANCHE", "Iogurte com mamão", "1 pote de iogurte natural e 1 fatia de mamão.", "Corte o mamão e misture ao iogurte.", "Use fruta da estação."],
      ["JANTAR", "Sopa de legumes com frango", "Abóbora, cenoura, chuchu, frango desfiado e temperos.", "Cozinhe os legumes, bata parte deles e acrescente o frango.", "Use lentilha ou ovos no lugar do frango."],
    ],
    [
      ["CAFÉ DA MANHÃ", "Aveia com maçã", "3 colheres de aveia, leite e 1 maçã picada.", "Aqueça o leite com aveia e junte a maçã.", "Use banana ou pera."],
      ["ALMOÇO", "Peixe, batata e salada", "1 filé de peixe, 1 batata média e salada colorida.", "Asse o peixe e a batata com pouco óleo.", "Use frango, ovos ou grão-de-bico."],
      ["LANCHE", "Cenoura e homus", "1 cenoura em palitos e 3 colheres de homus.", "Corte a cenoura e sirva com homus.", "Use pepino ou tomate."],
      ["JANTAR", "Cuscuz com ovos", "1 porção de cuscuz, 2 ovos e folhas.", "Prepare o cuscuz e sirva com ovos mexidos.", "Use arroz ou batata."],
    ],
    [
      ["CAFÉ DA MANHÃ", "Pão integral com ricota", "2 fatias de pão integral, ricota e tomate.", "Monte o sanduíche com ricota temperada.", "Use queijo branco ou pasta de grão-de-bico."],
      ["ALMOÇO", "Frango, mandioca e legumes", "Frango grelhado, mandioca cozida e legumes.", "Cozinhe a mandioca e grelhe o frango.", "Troque mandioca por batata ou arroz."],
      ["LANCHE", "Banana com aveia", "1 banana e 1 colher de aveia.", "Amasse ou consuma em rodelas.", "Use maçã ou mamão."],
      ["JANTAR", "Salada completa com atum", "Folhas, tomate, cenoura, milho e 1 lata de atum.", "Escorra o atum e misture aos vegetais.", "Use ovos ou frango."],
    ],
    [
      ["CAFÉ DA MANHÃ", "Vitamina de banana", "1 banana, leite e 2 colheres de aveia.", "Bata os ingredientes até ficar cremoso.", "Use mamão ou morango."],
      ["ALMOÇO", "Lentilha com arroz", "1 concha de lentilha, arroz e legumes refogados.", "Aqueça a lentilha e sirva com os demais itens.", "Use feijão ou grão-de-bico."],
      ["LANCHE", "Fruta com iogurte", "1 fruta e 1 pote de iogurte natural.", "Misture ou consuma separadamente.", "Use leite ou kefir."],
      ["JANTAR", "Crepioca de frango", "1 ovo, 2 colheres de tapioca e frango desfiado.", "Misture ovo e tapioca, cozinhe e recheie.", "Use queijo branco ou legumes."],
    ],
    [
      ["CAFÉ DA MANHÃ", "Cuscuz com queijo", "1 porção de cuscuz e 1 fatia de queijo branco.", "Cozinhe o cuscuz e sirva com o queijo.", "Use ovo ou ricota."],
      ["ALMOÇO", "Prato colorido com ovos", "2 ovos, arroz, feijão e três tipos de vegetais.", "Prepare os ovos e monte o prato com variedade.", "Use frango, peixe ou tofu."],
      ["LANCHE", "Pera e sementes", "1 pera e 1 colher de sementes.", "Consuma juntos.", "Use maçã e castanhas."],
      ["JANTAR", "Legumes salteados com frango", "Frango em tiras, abobrinha, cenoura e cebola.", "Salteie tudo em uma panela até dourar.", "Use tofu ou grão-de-bico."],
    ],
    [
      ["CAFÉ DA MANHÃ", "Torrada com abacate e ovo", "2 torradas, 1/4 de abacate e 1 ovo.", "Amasse o abacate, coloque nas torradas e finalize com ovo.", "Use ricota ou homus."],
      ["ALMOÇO", "Arroz, feijão e peixe", "Arroz, feijão, peixe assado e salada.", "Asse o peixe com limão e ervas.", "Use frango, ovos ou lentilha."],
      ["LANCHE", "Iogurte com fruta", "Iogurte natural e fruta picada.", "Misture e consuma fresco.", "Use vitamina com aveia."],
      ["JANTAR", "Creme de abóbora", "Abóbora, cenoura, cebola e frango desfiado.", "Cozinhe, bata os legumes e acrescente o frango.", "Use lentilha ou ovos."],
    ],
  ];

  return menus[day - 1].map(([type, name, ingredients, preparation, substitutions]) => ({
    type,
    name,
    ingredients,
    preparation,
    substitutions,
  }));
};

const days: Day[] = [
  {
    title: "Dia 1 — Organização",
    objective: "Começar a jornada organizando alimentação, ambiente e rotina.",
    mission: "Organize hoje o ambiente e os horários que você pretende seguir durante a jornada.",
    checklist: ["Separei um horário para o treino", "Organizei minhas refeições do dia", "Separei água para acompanhar minha rotina", "Completei minha missão", "Realizei o treino"],
    meals: dayMeals(1),
    exercises: ["marcha", "agachamento", "parede", "ponte", "panturrilha"],
  },
  {
    title: "Dia 2 — Prato",
    objective: "Criar refeições mais organizadas e evitar improvisação.",
    mission: "Monte suas refeições seguindo a estrutura apresentada no aplicativo.",
    checklist: ["Fiz meu café da manhã", "Organizei almoço e jantar", "Bebi água ao longo do dia", "Completei a missão", "Fiz o treino"],
    meals: dayMeals(2),
    exercises: ["marcha", "apoio", "lateral", "bird", "ponte"],
  },
  {
    title: "Dia 3 — Movimento",
    objective: "Incluir movimento de forma simples dentro da rotina.",
    mission: "Complete o treino do dia respeitando seu próprio ritmo.",
    checklist: ["Organizei minha alimentação", "Bebi água", "Fiz o aquecimento", "Completei o treino", "Registrei minha conclusão"],
    meals: dayMeals(3),
    exercises: ["marcha", "joelhos", "agachamento", "parede", "prancha"],
  },
  {
    title: "Dia 4 — Rotina",
    objective: "Continuar a jornada sem complicar.",
    mission: "Identifique um momento do dia em que você costuma sair da rotina e prepare uma estratégia simples para esse momento.",
    checklist: ["Segui minha organização alimentar", "Bebi água", "Fiz minha missão", "Completei o treino", "Registrei meu progresso"],
    meals: dayMeals(4),
    exercises: ["lateral", "afundo", "ponte", "bird", "panturrilha"],
  },
  {
    title: "Dia 5 — Consistência",
    objective: "Manter o que já foi construído.",
    mission: "Faça hoje o básico bem feito.",
    checklist: ["Segui minha alimentação planejada", "Bebi água", "Evitei pular o momento do treino", "Completei minha missão", "Fiz o treino"],
    meals: dayMeals(5),
    exercises: ["polichinelo", "apoio", "deadbug", "quadril", "parede"],
  },
  {
    title: "Dia 6 — Medidas",
    objective: "Registrar sua jornada e observar sua evolução.",
    mission: "Registre seus dados e observe como você está se sentindo ao longo da jornada.",
    checklist: ["Registrei minhas medidas", "Organizei minha alimentação", "Bebi água", "Completei o treino", "Completei minha missão"],
    meals: dayMeals(6),
    exercises: ["marcha", "agachamento", "afundo", "superman", "prancha"],
  },
  {
    title: "Dia 7 — Continuidade",
    objective: "Concluir a primeira jornada e preparar os próximos passos.",
    mission: "Complete o último dia e organize como pretende continuar cuidando da sua rotina.",
    checklist: ["Completei minha alimentação planejada", "Bebi água", "Fiz o treino final", "Registrei meu progresso", "Completei os 7 dias"],
    meals: dayMeals(7),
    exercises: ["marcha", "lateral", "agachamento", "ponte", "prancha"],
  },
];

const initialState = {
  email: "",
  tutorialDone: false,
  completedDays: [] as number[],
  checklist: {} as Record<number, boolean[]>,
  mission: {} as Record<number, boolean>,
  workout: {} as Record<number, boolean>,
  mealsViewed: {} as Record<number, boolean>,
  measurements: [] as { date: string; weight: string; waist: string; abdomen: string; hip: string; photo?: string }[],
};

const STORAGE_KEY = "seca-desincha-state";
const CORPO_FOCO_CHECKOUT_URL =
  import.meta.env.VITE_CORPO_FOCO_CHECKOUT_URL ||
  "https://pay.kirvano.com/47b6b2f7-c9b6-48b0-b38d-13c7ae1ce776";

function getSafeStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;

    const storage = window.localStorage;
    const testKey = "__seca_desincha_storage_test__";

    storage.setItem(testKey, "1");
    storage.removeItem(testKey);

    return storage;
  } catch {
    // O Preview pode usar um documento sandboxed sem allow-same-origin.
    // Nesse caso, o aplicativo continua funcionando em memória.
    return null;
  }
}

function loadState() {
  const storage = getSafeStorage();

  if (!storage) {
    return { ...initialState };
  }

  try {
    const saved = storage.getItem(STORAGE_KEY);

    return {
      ...initialState,
      ...(saved ? JSON.parse(saved) : {}),
    };
  } catch {
    return { ...initialState };
  }
}

function saveState(state: typeof initialState) {
  const storage = getSafeStorage();

  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // O Preview continua utilizável mesmo sem persistência disponível.
  }
}

export default function CompleteIndex() {
  const [data, setData] = useState<typeof initialState>(() => loadState());
  const [screen, setScreen] = useState<Screen>(() => {
    const saved = loadState();
    return saved.email ? "home" : "email";
  });
  const [tutorial, setTutorial] = useState(0);
  const [selectedDay, setSelectedDay] = useState(1);
  const [workoutStep, setWorkoutStep] = useState(0);
  const [showSubs, setShowSubs] = useState(false);
  const [menu, setMenu] = useState(false);
  const [measure, setMeasure] = useState({ weight: "", waist: "", abdomen: "", hip: "", photo: "" });
  const [email, setEmail] = useState("");
  const [accessStatus, setAccessStatus] = useState<AccessStatus>("locked");

  useEffect(() => {
    saveState(data);
  }, [data]);

  // Acesso pago nunca é liberado pelo frontend, pelo localStorage ou pelo
  // retorno do checkout. O backend deve responder somente com o status real
  // registrado pelo webhook do gateway.
  useEffect(() => {
    if (!data.email) return;

    let cancelled = false;

    const refreshAccess = async () => {
      try {
        const response = await fetch(
          `/api/user-access?email=${encodeURIComponent(data.email)}&product_id=corpo_foco_30d`,
          { headers: { Accept: "application/json" } },
        );

        if (!response.ok) return;

        const result = (await response.json()) as { status?: AccessStatus };
        if (!cancelled && result.status) {
          setAccessStatus(result.status);
        }
      } catch {
        // O endpoint é opcional no Preview. Sem confirmação do backend,
        // o conteúdo pago permanece bloqueado.
      }
    };

    refreshAccess();
    const interval = window.setInterval(refreshAccess, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [data.email]);

  const day = days[selectedDay - 1];
  const checks = data.checklist[selectedDay] || Array(5).fill(false);
  const checkedCount = checks.filter(Boolean).length;
  const dayReady = checkedCount === 5 && data.mission[selectedDay] && data.workout[selectedDay] && data.mealsViewed[selectedDay];
  const unlocked = Math.min(7, (data.completedDays.length || 0) + 1);
  const overall = Math.round((data.completedDays.length / 7) * 100);

  const updateData = (patch: Partial<typeof data>) =>
    setData((current) => ({ ...current, ...patch }));

  const saveEmail = () => {
    if (!email.trim() || !email.includes("@")) return;
    updateData({ email: email.trim() });
    setScreen("welcome");
  };

  const toggleCheck = (index: number) => {
    const next = [...checks];
    next[index] = !next[index];
    updateData({ checklist: { ...data.checklist, [selectedDay]: next } });
  };

  const saveMeasurement = () => {
    if (!measure.weight && !measure.waist && !measure.abdomen && !measure.hip) return;
    updateData({
      measurements: [
        ...data.measurements,
        { ...measure, date: new Date().toLocaleDateString("pt-BR") },
      ],
    });
    setMeasure({ weight: "", waist: "", abdomen: "", hip: "", photo: "" });
    const next = [...checks];
    next[0] = true;
    updateData({ checklist: { ...data.checklist, [selectedDay]: next } });
  };

  const finishDay = () => {
    if (!dayReady) return;
    const completed = data.completedDays.includes(selectedDay)
      ? data.completedDays
      : [...data.completedDays, selectedDay];
    updateData({ completedDays: completed });
    setScreen(selectedDay === 7 ? "complete" : "home");
  };

  if (screen === "email") {
    return (
      <Shell>
        <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-5 py-12">
          <Brand />
          <Badge variant="secondary" className="mt-10 w-fit">SECA & DESINCHA 7D</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight">BEM-VINDA AO 7D SECA & DESINCHA</h1>
          <p className="mt-4 text-muted-foreground">Antes de começar, informe seu melhor e-mail para salvar seu progresso e acessar sua jornada.</p>
          <label className="mt-8 text-sm font-medium" htmlFor="email">Digite seu e-mail</label>
          <Input id="email" type="email" className="mt-2 h-12" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" />
          <Button className="mt-5 h-12 w-full" onClick={saveEmail} disabled={!email.includes("@")}>CONTINUAR <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </Shell>
    );
  }

  if (screen === "welcome") {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-12 text-center sm:py-20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"><Sparkles /></div>
          <h1 className="mt-7 text-4xl font-semibold tracking-tight">Seu acesso está liberado.</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">Durante os próximos 7 dias, você terá uma jornada guiada com alimentação organizada, missões diárias, treinos curtos e acompanhamento do seu progresso.</p>
          <div className="mt-12 grid gap-3 sm:grid-cols-7">
            {["Organização", "Alimentação", "Movimento", "Rotina", "Consistência", "Medidas", "Continuidade"].map((item, index) => (
              <div key={item} className="rounded-xl border border-border p-3"><span className="text-xs text-primary">0{index + 1}</span><p className="mt-2 text-xs font-medium">{item}</p></div>
            ))}
          </div>
          <Button size="lg" className="mt-10" onClick={() => setScreen("tutorial")}>COMEÇAR MINHA JORNADA <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </Shell>
    );
  }

  if (screen === "tutorial") {
    const tutorials = [
      ["1. ENTRE NA JORNADA", "Todos os dias você encontrará uma nova etapa. Complete as tarefas do dia antes de avançar."],
      ["2. COMPLETE O CHECKLIST", "Cada dia possui pequenas tarefas. Marque cada uma conforme for concluindo."],
      ["3. SIGA A ALIMENTAÇÃO", "Confira as refeições do dia, as opções e as substituições disponíveis."],
      ["4. FAÇA O TREINO", "Você encontrará o treino do dia com cada exercício explicado passo a passo."],
      ["5. ACOMPANHE SEU PROGRESSO", "Registre suas medidas e veja sua evolução durante a jornada."],
    ];
    return (
      <Shell>
        <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-lg flex-col justify-center px-5 py-12">
          <Badge variant="secondary" className="w-fit">COMO USAR O APP</Badge>
          <div className="mt-8 flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-muted">
            <img src={[photos.meals, photos.movement, photos.tracker, photos.movement, photos.tracker][tutorial]} alt="" className="h-full w-full object-cover opacity-80" />
          </div>
          <p className="mt-8 text-sm text-primary">{tutorial + 1} DE 5</p>
          <h1 className="mt-2 text-3xl font-semibold">{tutorials[tutorial][0]}</h1>
          <p className="mt-4 leading-7 text-muted-foreground">{tutorials[tutorial][1]}</p>
          <Button className="mt-10 h-12" onClick={() => tutorial < 4 ? setTutorial(tutorial + 1) : (updateData({ tutorialDone: true }), setScreen("upsell"))}>
            {tutorial < 4 ? "PRÓXIMO" : "ENTENDI. VAMOS COMEÇAR"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Shell>
    );
  }

  if (screen === "workout") {
    const exercise = exerciseLibrary[day.exercises[workoutStep]];
    const last = workoutStep === day.exercises.length - 1;
    return (
      <Shell>
        <div className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
          <Button variant="ghost" onClick={() => setScreen("day")}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o dia</Button>
          <p className="mt-8 text-sm font-medium text-primary">EXERCÍCIO {workoutStep + 1} DE 5</p>
          <h1 className="mt-2 text-3xl font-semibold">{exercise.name}</h1>
          <p className="mt-2 text-muted-foreground">Treino do {day.title}</p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-muted">
            <img src={exercise.visual} alt={exercise.name} className="h-56 w-full object-cover" />
          </div>
          <Card className="mt-6">
            <CardContent className="space-y-5 p-6">
              <div><h2 className="font-semibold">Como fazer</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{exercise.instructions.map((item) => <li key={item}>{item}</li>)}</ol></div>
              <Separator />
              <div className="grid gap-3 sm:grid-cols-3"><Info label="Faça" value={exercise.dosage} /><Info label="Descanso" value={exercise.rest} /><Info label="Respiração" value={exercise.breathing} /></div>
              <div className="rounded-xl bg-muted/60 p-4 text-sm"><strong>Cuidados:</strong> {exercise.care}<br /><strong>Versão mais fácil:</strong> {exercise.easier}</div>
            </CardContent>
          </Card>
          <Button className="mt-6 h-12 w-full" onClick={() => {
            if (last) {
              updateData({ workout: { ...data.workout, [selectedDay]: true } });
              setScreen("day");
            } else setWorkoutStep(workoutStep + 1);
          }}>
            {last ? "TREINO CONCLUÍDO ✓" : "CONCLUÍ. PRÓXIMO EXERCÍCIO"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Shell>
    );
  }

  if (screen === "day") {
    return (
      <Shell>
        <div className="mx-auto max-w-4xl px-5 py-8 sm:py-12">
          <Button variant="ghost" onClick={() => setScreen("home")}><ArrowLeft className="mr-2 h-4 w-4" /> Minha jornada</Button>
          <div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><Badge variant="secondary">DIA {selectedDay} DE 7</Badge><h1 className="mt-3 text-3xl font-semibold">{day.title}</h1><p className="mt-2 text-muted-foreground">{day.objective}</p></div>
            <Progress className="w-full sm:w-40" value={(checkedCount / 5) * 100} />
          </div>

          <section className="mt-8">
            <SectionTitle icon={<Target className="h-5 w-5" />} title="Checklist de hoje" />
            <Card className="mt-4"><CardContent className="space-y-3 p-5">
              {day.checklist.map((item, index) => <label key={item} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${checks[index] ? "border-primary/30 bg-primary/5" : "border-border"}`}><Checkbox checked={!!checks[index]} onCheckedChange={() => toggleCheck(index)} /><span className={checks[index] ? "text-muted-foreground line-through" : "text-sm font-medium"}>{item}</span>{checks[index] && <Check className="ml-auto h-4 w-4 text-primary" />}</label>)}
              <p className="pt-2 text-sm text-muted-foreground">{checkedCount} de 5 concluídos {checkedCount === 5 && "• Checklist completo ✓"}</p>
            </CardContent></Card>
          </section>

          <section className="mt-10">
            <SectionTitle icon={<Utensils className="h-5 w-5" />} title="Alimentação do dia" />
            <Card className="mt-4 overflow-hidden"><img src={photos.meals} alt="Alimentação saudável" className="h-40 w-full object-cover" /><CardContent className="space-y-5 p-5">
              {day.meals.map((meal) => <div key={meal.type} className="border-b border-border pb-5 last:border-0 last:pb-0"><p className="text-xs font-semibold tracking-widest text-primary">{meal.type}</p><h3 className="mt-1 font-semibold">{meal.name}</h3><p className="mt-2 text-sm text-muted-foreground"><strong>Ingredientes:</strong> {meal.ingredients}</p><p className="mt-1 text-sm text-muted-foreground"><strong>Preparo:</strong> {meal.preparation}</p><button className="mt-2 flex items-center text-sm font-medium text-primary" onClick={() => setShowSubs(!showSubs)}>VER SUBSTITUIÇÕES <ChevronDown className="ml-1 h-4 w-4" /></button>{showSubs && <p className="mt-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">{meal.substitutions}</p>}</div>)}
              <Button variant={data.mealsViewed[selectedDay] ? "secondary" : "outline"} onClick={() => updateData({ mealsViewed: { ...data.mealsViewed, [selectedDay]: true } })}>{data.mealsViewed[selectedDay] ? "ALIMENTAÇÃO VISUALIZADA ✓" : "MARCAR ALIMENTAÇÃO COMO VISTA"}</Button>
            </CardContent></Card>
          </section>

          <section className="mt-10">
            <SectionTitle icon={<Dumbbell className="h-5 w-5" />} title="Treino de hoje" />
            <Card className="mt-4"><CardContent className="p-5"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Treino em casa</h3><p className="mt-1 text-sm text-muted-foreground">Até 20 minutos • aquecimento, 5 exercícios e finalização.</p></div><Badge variant={data.workout[selectedDay] ? "secondary" : "outline"}>{data.workout[selectedDay] ? "CONCLUÍDO" : "PENDENTE"}</Badge></div><div className="mt-5 grid gap-2 sm:grid-cols-5">{day.exercises.map((id, index) => <div key={id} className="rounded-lg bg-muted p-3 text-center text-xs">{index + 1}. {exerciseLibrary[id].name}</div>)}</div><Button className="mt-5 w-full sm:w-auto" onClick={() => { setWorkoutStep(0); setScreen("workout"); }}><Play className="mr-2 h-4 w-4" /> {data.workout[selectedDay] ? "REFAZER TREINO" : "COMEÇAR TREINO"}</Button></CardContent></Card>
          </section>

          {selectedDay === 6 && <MeasurementCard measure={measure} setMeasure={setMeasure} save={saveMeasurement} history={data.measurements} />}
          <section className="mt-10"><SectionTitle icon={<Sparkles className="h-5 w-5" />} title="Missão do dia" /><Card className="mt-4"><CardContent className="p-5"><p className="text-muted-foreground">{day.mission}</p><Button variant={data.mission[selectedDay] ? "secondary" : "outline"} className="mt-5" onClick={() => updateData({ mission: { ...data.mission, [selectedDay]: !data.mission[selectedDay] } })}>{data.mission[selectedDay] ? "MISSÃO CONCLUÍDA ✓" : "MARCAR MISSÃO COMO CONCLUÍDA"}</Button></CardContent></Card></section>

          <Card className="mt-10 border-primary/20"><CardContent className="p-5"><p className="text-sm text-muted-foreground">{dayReady ? "Tudo pronto para avançar." : "Complete o checklist, veja a alimentação, faça o treino e conclua a missão para liberar este botão."}</p><Button className="mt-4 w-full" size="lg" disabled={!dayReady} onClick={finishDay}>CONCLUIR DIA <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card>
        </div>
      </Shell>
    );
  }

  if (screen === "complete") {
    return <Shell><div className="mx-auto max-w-2xl px-5 py-16 text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground"><Trophy className="h-10 w-10" /></div><p className="mt-8 text-sm font-semibold tracking-widest text-primary">JORNADA FINALIZADA</p><h1 className="mt-3 text-4xl font-semibold">VOCÊ CONCLUIU OS 7 DIAS</h1><div className="mx-auto mt-8 grid max-w-md gap-3 text-left">{["7 dias concluídos", "Treinos realizados", "Missões concluídas", "Progresso registrado"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl bg-muted p-4"><Check className="h-5 w-5 text-primary" />{item}</div>)}</div><p className="mt-8 text-muted-foreground">Agora você pode continuar sua jornada.</p><Button size="lg" className="mt-8" onClick={() => setScreen("upsell")}>VER MEU PROGRESSO <ArrowRight className="ml-2 h-4 w-4" /></Button></div></Shell>;
  }

  if (screen === "upsell") {
    if (accessStatus === "approved") {
      setScreen("tracking");
      return null;
    }

    return (
      <Shell>
        <main className="mx-auto max-w-4xl px-5 py-12 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary">PRÓXIMA JORNADA</Badge>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              VOCÊ JÁ DEU O PRIMEIRO PASSO.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Agora você pode continuar sua jornada por mais 30 dias.
            </p>
          </div>

          <Card className="mx-auto mt-10 max-w-2xl overflow-hidden border-primary/20 shadow-sm">
            <div className="bg-primary p-8 text-primary-foreground">
              <p className="text-sm font-medium tracking-widest opacity-80">
                CORPO EM FOCO
              </p>
              <h2 className="mt-2 text-3xl font-semibold">30 DIAS</h2>
              <p className="mt-3 max-w-lg opacity-90">
                Uma jornada guiada para continuar sua rotina dentro do mesmo aplicativo.
              </p>
            </div>
            <CardContent className="p-6 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "30 dias de jornada guiada",
                  "Treinos curtos",
                  "Missões diárias",
                  "Organização da rotina",
                  "Registro de progresso",
                  "Acompanhamento da jornada",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-muted/60 p-4 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-6 text-muted-foreground">
                Depois dos 7 dias, você não precisa começar do zero. Continue dentro do mesmo aplicativo.
              </p>
              {accessStatus === "pending" && (
                <p className="mt-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                  Estamos aguardando a confirmação do pagamento. O acompanhamento continuará bloqueado até a aprovação do gateway.
                </p>
              )}
              <Button
                className="mt-6 h-12 w-full"
                size="lg"
                onClick={() => window.open(CORPO_FOCO_CHECKOUT_URL, "_blank", "noopener,noreferrer")}
              >
                QUERO CONTINUAR POR 30 DIAS
              </Button>
              <Button
                variant="ghost"
                className="mt-3 w-full"
                onClick={() => setScreen("home")}
              >
                CONTINUAR COM O 7D
              </Button>
            </CardContent>
          </Card>
        </main>
      </Shell>
    );
  }

  if (screen === "tracking") {
    return (
      <Tracking
        data={data}
        accessStatus={accessStatus}
        onBack={() => setScreen("home")}
        onCheckout={() => window.open(CORPO_FOCO_CHECKOUT_URL, "_blank", "noopener,noreferrer")}
      />
    );
  }

  return (
    <Dashboard
      data={data}
      overall={overall}
      unlocked={unlocked}
      menu={menu}
      setMenu={setMenu}
      accessStatus={accessStatus}
      onDay={(number) => { setSelectedDay(number); setScreen("day"); }}
      onTracking={() => setScreen("tracking")}
      onUpsell={() => setScreen("upsell")}
    />
  );
}

function Dashboard({ data, overall, unlocked, menu, setMenu, accessStatus, onDay, onTracking, onUpsell }: any) {
  const nextDay = Math.min(7, (data.completedDays.length || 0) + 1);
  return <Shell><header className="border-b border-border/70"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"><Brand /><button className="rounded-lg p-2 sm:hidden" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button><nav className="hidden items-center gap-5 text-sm sm:flex"><span className="text-muted-foreground">{data.email}</span><Button size="sm" onClick={() => onDay(nextDay)}>Continuar jornada</Button></nav></div></header><main className="mx-auto max-w-6xl px-5 py-10 sm:py-14"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Badge variant="secondary">DIA {nextDay} DE 7</Badge><h1 className="mt-3 text-4xl font-semibold">Sua jornada, um passo por vez.</h1><p className="mt-3 text-muted-foreground">Acompanhe suas tarefas, alimentação e movimento.</p></div><div className="w-full sm:w-48"><div className="mb-2 flex justify-between text-sm"><span>Progresso</span><span>{overall}% concluído</span></div><Progress value={overall} /></div></div><Card className="mt-8 overflow-hidden border-primary/20"><CardContent className="grid gap-6 p-6 sm:grid-cols-[1fr_240px] sm:p-8"><div><p className="text-sm font-semibold tracking-widest text-primary">SEU PRÓXIMO PASSO</p><h2 className="mt-3 text-2xl font-semibold">Comece pelo checklist do Dia {nextDay}.</h2><p className="mt-2 text-muted-foreground">Você encontrará alimentação, missão e um treino completo explicado passo a passo.</p><Button className="mt-6" onClick={() => onDay(nextDay)}>CONTINUAR DIA {nextDay} <ArrowRight className="ml-2 h-4 w-4" /></Button></div><img src={photos.tracker} alt="Acompanhamento de progresso" className="h-40 w-full rounded-xl object-cover" /></CardContent></Card><h2 className="mt-12 text-xl font-semibold">SEUS 7 DIAS</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{days.map((day: Day, index: number) => { const n = index + 1; const complete = data.completedDays.includes(n); const available = n <= unlocked; return <button key={day.title} disabled={!available} onClick={() => onDay(n)} className={`rounded-xl border p-5 text-left transition-colors ${complete ? "border-primary/30 bg-primary/5" : available ? "border-border hover:border-primary" : "border-border opacity-60"}`}><div className="flex items-center justify-between"><span className="text-sm font-semibold">DIA {n}</span>{complete ? <Check className="h-4 w-4 text-primary" /> : available ? <span className="text-xs text-primary">LIBERADO</span> : <Lock className="h-4 w-4 text-muted-foreground" />}</div><p className="mt-3 font-medium">{day.title.split(" — ")[1]}</p><p className="mt-1 text-xs text-muted-foreground">{complete ? "CONCLUÍDO" : available ? "Comece quando quiser" : "BLOQUEADO"}</p></button> })}</div>{data.completedDays.length === 7 && <Card className="mt-10 border-primary/20"><CardContent className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold tracking-widest text-primary">PRÓXIMA JORNADA</p><h2 className="mt-2 text-xl font-semibold">{accessStatus === "approved" ? "🔓 SEU ACOMPANHAMENTO ESTÁ LIBERADO ✓" : "🔒 CORPO EM FOCO — 30 DIAS"}</h2><p className="mt-1 text-sm text-muted-foreground">{accessStatus === "approved" ? "Continue sua jornada dentro do acompanhamento." : "Continue sua jornada por mais 30 dias."}</p></div><Button onClick={accessStatus === "approved" ? onTracking : onUpsell}>{accessStatus === "approved" ? "ENTRAR NO ACOMPANHAMENTO" : "DESBLOQUEAR"}</Button></CardContent></Card>}</main></Shell>;
}

function MeasurementCard({ measure, setMeasure, save, history }: any) {
  return <section className="mt-10"><SectionTitle icon={<Ruler className="h-5 w-5" />} title="Registro de medidas" /><Card className="mt-4"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Registre seus dados para acompanhar sua evolução. As informações ficam salvas neste dispositivo.</p><div className="mt-5 grid gap-3 sm:grid-cols-4">{["weight", "waist", "abdomen", "hip"].map((field) => <Input key={field} placeholder={{ weight: "Peso", waist: "Cintura", abdomen: "Abdômen", hip: "Quadril" }[field]} value={measure[field]} onChange={(e) => setMeasure({ ...measure, [field]: e.target.value })} />)}</div><Input className="mt-3" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = () => setMeasure({ ...measure, photo: String(reader.result) }); reader.readAsDataURL(file); } }} /><Button className="mt-4" variant="outline" onClick={save}>SALVAR REGISTRO</Button>{history.length > 0 && <div className="mt-6 space-y-2">{history.map((item: any) => <div key={item.date} className="rounded-lg bg-muted p-3 text-sm"><strong>{item.date}</strong> · Peso {item.weight || "—"} · Cintura {item.waist || "—"} · Abdômen {item.abdomen || "—"} · Quadril {item.hip || "—"}</div>)}</div>}</CardContent></Card></section>;
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return <h2 className="flex items-center gap-2 text-xl font-semibold">{icon}<span>{title}</span></h2>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>;
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={logo}
        alt="Logo 7D Seca & Desincha"
        className="h-10 w-10 object-contain"
      />
      <span className="font-semibold tracking-tight">
        7D <span className="text-primary">Seca & Desincha</span>
      </span>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-8">
          <Brand />
        </div>
      </header>
      {children}
      <footer className="border-t border-border/70 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© 2024 7D Seca & Desincha</span>
          <span>Fotos: Pexels — Yaroslav Shuraev, Polina Tankilevitch, RDNE Stock project, Tara Winstead e Ivan S.</span>
        </div>
      </footer>
    </div>
  );
}