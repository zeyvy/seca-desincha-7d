import { useMemo, useState } from "react";
import { ArrowLeft, Check, Lock, Ruler, Target, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

type TrackingProps = {
  data: any;
  accessStatus: "pending" | "approved" | "cancelled" | "refunded" | "locked";
  onBack: () => void;
  onCheckout: () => void;
};

const days = Array.from({ length: 30 }, (_, index) => ({
  day: index + 1,
  mission: [
    "Planeje sua rotina de amanhã em três passos.",
    "Beba água em pequenos intervalos durante o dia.",
    "Faça uma refeição sem distrações.",
    "Registre como está sua energia hoje.",
    "Separe dez minutos para movimento leve.",
  ][index % 5],
  workout: ["Marcha parada", "Agachamento com apoio", "Ponte de glúteos", "Passo lateral", "Flexão na parede"][index % 5],
}));

export default function Tracking({ data, accessStatus, onBack, onCheckout }: TrackingProps) {
  const [completed, setCompleted] = useState<number[]>([]);
  const [measure, setMeasure] = useState({ weight: "", waist: "", abdomen: "", hip: "" });
  const [records, setRecords] = useState<Array<typeof measure & { date: string }>>([]);
  const progress = Math.round((completed.length / 30) * 100);

  const nextDay = useMemo(() => Math.min(30, completed.length + 1), [completed]);

  if (accessStatus !== "approved") {
    return (
      <Shell onBack={onBack}>
        <div className="mx-auto max-w-xl px-5 py-16 text-center">
          <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-6 text-3xl font-semibold">SEU ACOMPANHAMENTO ESTÁ BLOQUEADO</h1>
          <p className="mt-4 text-muted-foreground">
            Continue sua jornada por mais 30 dias e desbloqueie seu acompanhamento completo.
          </p>
          <div className="mx-auto mt-8 max-w-sm space-y-3 text-left">
            {["Registro de progresso", "Evolução das medidas", "Histórico", "Hábitos", "Jornada de 30 dias"].map((item) => (
              <p key={item} className="flex gap-3 rounded-lg bg-muted p-3 text-sm">
                <Check className="h-4 w-4 text-primary" /> {item}
              </p>
            ))}
          </div>
          {accessStatus === "pending" && (
            <p className="mt-5 text-sm text-muted-foreground">
              Estamos aguardando a confirmação do pagamento.
            </p>
          )}
          <Button asChild className="mt-8">
            <a
              href="https://pay.kirvano.com/47b6b2f7-c9b6-48b0-b38d-13c7ae1ce776"
              target="_blank"
              rel="noreferrer"
            >
              DESBLOQUEAR ACOMPANHAMENTO
            </a>
          </Button>
          <Button variant="ghost" className="mt-3 block w-full" onClick={onBack}>Voltar para a Home</Button>
        </div>
      </Shell>
    );
  }

  const completeNextDay = () => {
    setCompleted((current) => current.includes(nextDay) ? current : [...current, nextDay]);
  };

  const saveMeasurement = () => {
    if (!Object.values(measure).some(Boolean)) return;
    setRecords((current) => [
      ...current,
      { ...measure, date: new Date().toLocaleDateString("pt-BR") },
    ]);
    setMeasure({ weight: "", waist: "", abdomen: "", hip: "" });
  };

  return (
    <Shell onBack={onBack}>
      <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge variant="secondary">CORPO EM FOCO — 30 DIAS</Badge>
            <h1 className="mt-3 text-3xl font-semibold">MEU ACOMPANHAMENTO</h1>
          </div>
          <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" /> Home</Button>
        </div>

        <Card className="mt-8 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-end justify-between">
              <div><p className="text-sm text-muted-foreground">Progresso</p><p className="mt-1 text-3xl font-semibold">{completed.length} de 30 dias</p></div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <Progress className="mt-5" value={progress} />
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            ["DIAS CONCLUÍDOS", completed.length],
            ["TREINOS CONCLUÍDOS", completed.length],
            ["MISSÕES CONCLUÍDAS", completed.length],
            ["CHECKLISTS CONCLUÍDOS", completed.length],
          ].map(([label, value]) => <Card key={String(label)}><CardContent className="p-5"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></CardContent></Card>)}
        </div>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold"><Target className="h-5 w-5 text-primary" /> JORNADA CORPO EM FOCO</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {days.map((item) => {
              const available = item.day <= nextDay;
              const done = completed.includes(item.day);
              return <Card key={item.day} className={!available ? "opacity-60" : ""}><CardContent className="p-5"><div className="flex items-center justify-between"><p className="font-semibold">DIA {item.day}</p>{done ? <Check className="h-4 w-4 text-primary" /> : available ? <Badge variant="outline">LIBERADO</Badge> : <Lock className="h-4 w-4 text-muted-foreground" />}</div><p className="mt-3 text-sm text-muted-foreground">{item.mission}</p><p className="mt-3 text-xs text-primary">Treino: {item.workout}</p>{available && !done && <Button className="mt-4 w-full" size="sm" onClick={completeNextDay}>CONCLUIR DIA {item.day}</Button>}</CardContent></Card>;
            })}
          </div>
        </section>

        <section className="mt-10">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Ruler className="h-5 w-5 text-primary" /> MINHAS MEDIDAS</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-4">
                {(["weight", "waist", "abdomen", "hip"] as const).map((field) => <Input key={field} placeholder={{ weight: "Peso", waist: "Cintura", abdomen: "Abdômen", hip: "Quadril" }[field]} value={measure[field]} onChange={(event) => setMeasure({ ...measure, [field]: event.target.value })} />)}
              </div>
              <Button className="mt-4" variant="outline" onClick={saveMeasurement}>SALVAR REGISTRO</Button>
              {records.length > 0 && <div className="mt-5 space-y-2">{records.map((record) => <div key={record.date} className="rounded-lg bg-muted p-3 text-sm"><strong>{record.date}</strong> · Peso {record.weight || "—"} · Cintura {record.waist || "—"} · Abdômen {record.abdomen || "—"} · Quadril {record.hip || "—"}</div>)}</div>}
            </CardContent>
          </Card>
        </section>

        <Card className="mt-6">
          <CardHeader><CardTitle>MEUS HÁBITOS</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {["Alimentação organizada", "Água", "Movimento", "Treino", "Missão do dia"].map((habit) => <label key={habit} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"><input type="checkbox" className="h-4 w-4 accent-[--color-primary]" />{habit}</label>)}
          </CardContent>
        </Card>
      </main>
    </Shell>
  );
}

function Shell({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
  return <div className="min-h-screen bg-background text-foreground">{children}<footer className="border-t border-border/70 py-8"><div className="mx-auto max-w-5xl px-5 text-xs text-muted-foreground"><button onClick={onBack} className="underline">Voltar</button> · Fotos: Pexels.</div></footer></div>;
}