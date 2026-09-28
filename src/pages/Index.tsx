import { useMemo, useState } from "react";
import logo from "@/assets/uploads/3794.png";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Droplets,
  Flame,
  Menu,
  Moon,
  Sparkles,
  Sun,
  Target,
  Trophy,
  Utensils,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Step = "home" | "quiz" | "result" | "plan";

const questions = [
  {
    title: "Qual é o seu principal objetivo?",
    description: "Vamos personalizar os próximos 7 dias para você.",
    options: [
      ["Desinchar e me sentir mais leve", "leve"],
      ["Reduzir a retenção de líquidos", "liquidos"],
      ["Voltar para uma rotina saudável", "rotina"],
    ],
  },
  {
    title: "Como está sua energia hoje?",
    description: "Não existe resposta certa. Seja sincera com você.",
    options: [
      ["Estou cansada quase todos os dias", "baixa"],
      ["Tenho altos e baixos", "media"],
      ["Tenho bastante energia", "alta"],
    ],
  },
  {
    title: "Como é sua hidratação?",
    description: "A água é uma das maiores aliadas contra o inchaço.",
    options: [
      ["Bebo menos de 4 copos por dia", "pouca"],
      ["Bebo entre 4 e 7 copos", "regular"],
      ["Bebo 8 copos ou mais", "boa"],
    ],
  },
  {
    title: "Quanto tempo você tem por dia?",
    description: "O plano precisa caber na sua vida real.",
    options: [
      ["Até 10 minutos", "10"],
      ["De 10 a 20 minutos", "20"],
      ["Mais de 20 minutos", "30"],
    ],
  },
];

const defaultTasks = [
  { id: 1, label: "Tomar um copo de água ao acordar", icon: Droplets },
  { id: 2, label: "Fazer 10 minutos de movimento leve", icon: Zap },
  { id: 3, label: "Escolher uma refeição com comida de verdade", icon: Utensils },
  { id: 4, label: "Desacelerar 30 minutos antes de dormir", icon: Moon },
];

export default function Index() {
  const [step, setStep] = useState<Step>("home");
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const score = useMemo(() => {
    const base = 62 + answers.filter((answer) => ["boa", "alta", "30"].includes(answer)).length * 8;
    return Math.min(96, base);
  }, [answers]);

  const chooseAnswer = (value: string) => {
    setAnswers((current) => {
      const next = [...current];
      next[question] = value;
      return next;
    });
  };

  const nextQuestion = () => {
    if (question < questions.length - 1) {
      setQuestion((current) => current + 1);
    } else {
      setStep("result");
    }
  };

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.includes(id) ? current.filter((task) => task !== id) : [...current, id],
    );
  };

  const startQuiz = () => {
    setQuestion(0);
    setAnswers([]);
    setStep("quiz");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <button
            className="flex items-center gap-2"
            onClick={() => setStep("home")}
            aria-label="Ir para o início"
          >
            <img
              src={logo}
              alt="Logo 7D Seca & Desincha"
              className="h-9 w-9 object-contain"
            />
            <span className="font-semibold tracking-tight"><span className="text-primary">7D Seca & Desincha</span></span>
          </button>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <button onClick={() => setStep("home")} className="transition-colors hover:text-foreground">Início</button>
            <button onClick={() => setStep("plan")} className="transition-colors hover:text-foreground">Meu plano</button>
            <Button size="sm" onClick={startQuiz}>Começar agora</Button>
          </nav>

          <button
            className="rounded-lg p-2 sm:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-border px-5 py-4 sm:hidden">
            <div className="flex flex-col gap-3 text-sm">
              <button className="text-left" onClick={() => { setStep("home"); setMenuOpen(false); }}>Início</button>
              <button className="text-left" onClick={() => { setStep("plan"); setMenuOpen(false); }}>Meu plano</button>
              <Button onClick={() => { startQuiz(); setMenuOpen(false); }}>Começar agora</Button>
            </div>
          </div>
        )}
      </header>

      {step === "home" && (
        <main>
          <section className="relative overflow-hidden">
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <Badge variant="secondary" className="mb-6 gap-2 px-3 py-1">
                  <Sparkles className="h-3.5 w-3.5" /> Seu recomeço começa aqui
                </Badge>
                <h1 className="max-w-2xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
                  Mais leveza em <span className="text-primary">7 dias.</span>
                </h1>
                <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
                  Um plano simples e possível para diminuir o inchaço, melhorar sua energia e voltar a cuidar de você — sem dietas radicais.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" onClick={startQuiz} className="gap-2">
                    Montar meu plano <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setStep("plan")}>
                    Ver exemplo do dia
                  </Button>
                </div>
                <div className="mt-8 flex items-center gap-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Sem restrições extremas</span>
                  <span className="hidden items-center gap-2 sm:flex"><Check className="h-4 w-4 text-primary" /> 10 min por dia</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-5 rounded-[2rem] bg-primary/10 blur-2xl" />
                <Card className="relative overflow-hidden rounded-[2rem] border-primary/20 shadow-xl">
                  <div className="bg-primary px-6 pb-8 pt-7 text-primary-foreground">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium opacity-80">Seu ritual de hoje</span>
                      <Sun className="h-5 w-5 opacity-80" />
                    </div>
                    <p className="mt-8 text-3xl font-semibold">Comece leve.</p>
                    <p className="mt-1 text-sm opacity-80">Pequenas escolhas, grandes diferenças.</p>
                  </div>
                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Progresso do dia</span>
                      <span className="text-primary">0/4 concluídos</span>
                    </div>
                    <Progress value={0} />
                    {defaultTasks.slice(0, 3).map((task) => {
                      const Icon = task.icon;
                      return (
                        <div key={task.id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-primary"><Icon className="h-4 w-4" /></span>
                          <span className="text-sm">{task.label}</span>
                          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="border-y border-border/70 bg-muted/30">
            <div className="mx-auto grid max-w-6xl gap-5 px-5 py-12 sm:grid-cols-3 sm:px-8">
              {[
                [Droplets, "Hidratação inteligente", "Aprenda a distribuir sua água ao longo do dia."],
                [Utensils, "Comida de verdade", "Sugestões práticas para nutrir sem complicar."],
                [Moon, "Rotina possível", "Hábitos pequenos que cabem na sua agenda."],
              ].map(([Icon, title, text]) => {
                const FeatureIcon = Icon as typeof Droplets;
                return (
                  <div key={String(title)} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm"><FeatureIcon className="h-5 w-5" /></span>
                    <div><h3 className="font-medium">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{String(text)}</p></div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {step === "quiz" && (
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col px-5 py-10 sm:px-8 sm:py-16">
          <button onClick={() => question === 0 ? setStep("home") : setQuestion((current) => current - 1)} className="mb-10 flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <div className="mb-10">
            <div className="mb-3 flex justify-between text-sm text-muted-foreground"><span>Personalizando seu plano</span><span>{question + 1} de {questions.length}</span></div>
            <Progress value={((question + 1) / questions.length) * 100} />
          </div>
          <div className="flex-1">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{questions[question].title}</h1>
            <p className="mt-3 text-muted-foreground">{questions[question].description}</p>
            <div className="mt-8 space-y-3">
              {questions[question].options.map(([label, value]) => (
                <button
                  key={value}
                  onClick={() => chooseAnswer(value)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all hover:border-primary hover:bg-primary/5 ${answers[question] === value ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border"}`}
                >
                  <span className="font-medium">{label}</span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${answers[question] === value ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                    {answers[question] === value && <Check className="h-3 w-3" />}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <Button className="mt-10 w-full sm:w-fit sm:self-end" size="lg" disabled={!answers[question]} onClick={nextQuestion}>
            {question === questions.length - 1 ? "Ver meu resultado" : "Continuar"} <ArrowRight className="h-4 w-4" />
          </Button>
        </main>
      )}

      {step === "result" && (
        <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"><Trophy className="h-8 w-8" /></div>
            <p className="mt-6 text-sm font-medium uppercase tracking-widest text-primary">Seu resultado está pronto</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight">Seu corpo está pedindo um recomeço gentil.</h1>
            <p className="mt-4 text-muted-foreground">Criamos uma jornada de 7 dias focada em hidratação, leveza e constância.</p>
          </div>
          <Card className="mx-auto mt-10 max-w-2xl border-primary/20">
            <CardContent className="grid gap-8 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
              <div>
                <p className="text-sm text-muted-foreground">Índice de leveza estimado</p>
                <div className="mt-2 flex items-end gap-2"><span className="text-6xl font-semibold text-primary">{score}</span><span className="mb-2 text-muted-foreground">/ 100</span></div>
                <Progress className="mt-5" value={score} />
                <p className="mt-4 text-sm leading-6 text-muted-foreground">Você já tem o mais importante: a decisão de começar. Agora vamos transformar isso em passos simples.</p>
              </div>
              <div className="flex items-center justify-center rounded-2xl bg-muted/60 px-8 py-5 text-center"><div><Flame className="mx-auto h-7 w-7 text-primary" /><p className="mt-2 text-2xl font-semibold">7</p><p className="text-xs text-muted-foreground">dias de foco</p></div></div>
            </CardContent>
          </Card>
          <div className="mx-auto mt-8 max-w-2xl">
            <label className="text-sm font-medium" htmlFor="name">Como podemos chamar você? <span className="font-normal text-muted-foreground">(opcional)</span></label>
            <Input id="name" className="mt-2" placeholder="Seu primeiro nome" value={name} onChange={(event) => setName(event.target.value)} />
            <Button className="mt-5 w-full" size="lg" onClick={() => setStep("plan")}>Quero começar meu plano <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </main>
      )}

      {step === "plan" && (
        <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <Badge variant="secondary" className="mb-4">Dia 1 de 7</Badge>
              <h1 className="text-4xl font-semibold tracking-tight">Olá{name ? `, ${name}` : ""}! Vamos começar.</h1>
              <p className="mt-3 text-muted-foreground">Um dia de cada vez. Marque os hábitos conforme concluir.</p>
            </div>
            <Button variant="outline" onClick={startQuiz}>Refazer personalização</Button>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Seu checklist de hoje</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {defaultTasks.map((task) => {
                  const Icon = task.icon;
                  const completed = tasks.includes(task.id);
                  return (
                    <label key={task.id} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${completed ? "border-primary/30 bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                      <Checkbox checked={completed} onCheckedChange={() => toggleTask(task.id)} />
                      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${completed ? "bg-primary text-primary-foreground" : "bg-muted text-primary"}`}><Icon className="h-5 w-5" /></span>
                      <span className={`text-sm font-medium ${completed ? "text-muted-foreground line-through" : ""}`}>{task.label}</span>
                    </label>
                  );
                })}
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <p className="text-sm opacity-80">Progresso de hoje</p>
                  <p className="mt-2 text-4xl font-semibold">{Math.round((tasks.length / defaultTasks.length) * 100)}%</p>
                  <Progress className="mt-4 bg-primary-foreground/20 [&>div]:bg-primary-foreground" value={(tasks.length / defaultTasks.length) * 100} />
                  <p className="mt-4 text-sm opacity-80">{tasks.length === 4 ? "Você conseguiu! Que sensação boa." : `${4 - tasks.length} hábitos restantes para fechar o dia.`}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3"><span className="rounded-lg bg-muted p-2 text-primary"><Droplets className="h-5 w-5" /></span><p className="font-medium">Meta de água</p></div>
                  <Separator className="my-4" />
                  <p className="text-2xl font-semibold">8 copos</p><p className="mt-1 text-sm text-muted-foreground">Espalhe ao longo do dia, sem pressa.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      )}

      <footer className="border-t border-border/70 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2024 7D Seca & Desincha</span>
          <span>Um passo de cada vez, com carinho.</span>
        </div>
      </footer>
    </div>
  );
}
