import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useLogin";
import { Loader2, Mail, Lock, ChefHat } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import "../../../styles/globals.css";

const queryClient = new QueryClient();

function LoginFormInner() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () =>
        toast.success("Bienvenido de nuevo 👋", {
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        }),
      onError: () =>
        toast.error("Credenciales incorrectas", {
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--destructive)",
          },
        }),
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card/90 backdrop-blur-xl border border-border/50 rounded-[24px] shadow-2xl p-8 sm:p-10 relative overflow-hidden">
      {/* Luces sutiles de fondo para la tarjeta */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      {/* ── Header ── */}
      <div className="flex flex-col items-center text-center mb-8 relative z-10">
        <div className="w-16 h-16 bg-background border border-border shadow-sm rounded-2xl flex items-center justify-center mb-5 relative">
          <ChefHat className="text-primary w-8 h-8" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
        </div>
        <h2 className="text-2xl font-black text-foreground tracking-tight">
          Iniciar Sesión
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      {/* ── Formulario ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            Correo electrónico
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              {...register("email")}
              type="email"
              placeholder="usuario@deparraspitz.com"
              autoComplete="email"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
          {errors.email && (
            <span className="text-xs font-medium text-destructive ml-1">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            Contraseña
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
          {errors.password && (
            <span className="text-xs font-medium text-destructive ml-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-base tracking-wide hover:opacity-90 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-primary/20"
        >
          {isPending ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              Ingresar al sistema
              <span className="text-xl leading-none ml-1 transition-transform group-hover:translate-x-1">
                →
              </span>
            </>
          )}
        </button>
      </form>

      {/* ── Footer ── */}
      <div className="mt-8 pt-6 border-t border-border/50 text-center relative z-10">
        <p className="text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="font-bold text-foreground hover:text-primary transition-colors underline decoration-border underline-offset-4 hover:decoration-primary"
          >
            Regístrate aquí
          </a>
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
          <Lock className="w-3 h-3" />
          <span>Conexión segura · SSL encriptado</span>
        </div>
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginFormInner />
    </QueryClientProvider>
  );
}