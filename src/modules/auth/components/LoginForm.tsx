import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Mail, Lock, ChefHat } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

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
      onSuccess: () => {
        toast.success("Inicio de sesión correcto", {
          style: {
            background: '#120d0a',
            color: '#fff',
            border: '1px solid #4a3824',
          }
        });
      },
      onError: () => {
        toast.error("Correo o contraseña incorrectos", {
          style: {
            background: '#120d0a',
            color: '#fff',
            border: '1px solid #e11d48',
          }
        });
      },
    });
  };

  return (
    <Card className="w-[430px] bg-[#0e0a08]/95 border border-[#3d2c1f]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-white overflow-hidden rounded-[32px] backdrop-blur-md">
      {/* Encabezado con branding unificado */}
      <CardHeader className="flex flex-col items-center space-y-5 pt-12 pb-8">
        <div className="bg-[#1c140e] p-4.5 rounded-2xl border border-[#4a3824]/60 shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
          <ChefHat className="w-10 h-10 text-yellow-500" />
        </div>

        <div className="text-center space-y-2.5">
          <CardTitle className="text-3xl font-bold font-serif leading-tight tracking-tight text-zinc-100">
            Acceso Administrativo
          </CardTitle>

          <p className="text-xs text-zinc-400 font-medium max-w-[280px] mx-auto leading-relaxed">
            Ingresa tus credenciales premium para gestionar el sistema corporativo.
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-9 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Input: Correo Electrónico */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 ml-1">
              Correo Electrónico
            </Label>

            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-500 transition-colors z-10" />

              <Input
                {...register("email")}
                placeholder="usuario@deparraspitz.com"
                className="pl-14 bg-[#14100d] border border-[#3d2c1f]/60 h-14 text-zinc-100 rounded-xl text-base focus-visible:ring-1 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>

            {errors.email && (
              <p className="text-xs text-rose-400 font-medium ml-1 flex items-center gap-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Input: Contraseña */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 ml-1">
              Contraseña
            </Label>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-500 transition-colors z-10" />

              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="pl-14 bg-[#14100d] border border-[#3d2c1f]/60 h-14 text-zinc-100 rounded-xl text-base focus-visible:ring-1 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>

            {errors.password && (
              <p className="text-xs text-rose-400 font-medium ml-1 flex items-center gap-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botón de envío dorado premium */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold h-14 rounded-xl text-sm uppercase tracking-widest shadow-[0_6px_25px_rgba(234,179,8,0.15)] transition-all active:scale-[0.99] border-none disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              {isPending ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "ingresar"
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      {/* Footer integrado armónicamente */}
      <CardFooter className="bg-[#0b0806] border-t border-[#3d2c1f]/30 p-0 m-0">
        <div className="w-full py-6 flex justify-center items-center">
          <p className="text-xs text-zinc-400 font-medium">
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              className="text-yellow-500 font-bold hover:text-yellow-400 transition-colors ml-1 underline underline-offset-4"
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

export function LoginForm() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginFormInner />
    </QueryClientProvider>
  );
}