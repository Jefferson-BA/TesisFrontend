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
        toast.success("Inicio de sesión correcto");
      },
      onError: () => {
        toast.error("Correo o contraseña incorrectos");
      },
    });
  };

  return (
    <Card className="w-[420px] bg-[#181616] border-none shadow-[0_20px_50px_rgba(0,0,0,1)] text-white overflow-hidden rounded-[45px]">
      <CardHeader className="flex flex-col items-center space-y-6 pt-14 pb-10">
        <div className="bg-[#1c180a] p-5 rounded-[24px] border border-[#3d3112] shadow-lg">
          <ChefHat className="w-12 h-12 text-[#facc15]" />
        </div>

        <div className="text-center space-y-3">
          <CardTitle className="text-[38px] font-serif leading-tight tracking-tight text-zinc-100">
            Acceso
            <br />
            Administrativo
          </CardTitle>

          <p className="text-[14px] text-zinc-500 font-medium">
            Ingresa tus credenciales para gestionar el sistema
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-10 pb-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-3">
            <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 ml-2">
              CORREO ELECTRÓNICO
            </Label>

            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 z-10" />

              <Input
                {...register("email")}
                placeholder="user@test.com"
                className="pl-14 bg-[#edf4ff] border-none h-[65px] text-zinc-900 rounded-[22px] text-lg focus-visible:ring-2 focus-visible:ring-blue-200 transition-all placeholder:text-zinc-400"
              />
            </div>

            {errors.email && (
              <p className="text-xs text-red-500 ml-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 ml-2">
              CONTRASEÑA
            </Label>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 z-10" />

              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="pl-14 bg-[#edf4ff] border-none h-[65px] text-zinc-900 rounded-[22px] text-lg focus-visible:ring-2 focus-visible:ring-blue-200 transition-all"
              />
            </div>

            {errors.password && (
              <p className="text-xs text-red-500 ml-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#eab308] hover:bg-[#facc15] text-black font-black h-[65px] rounded-[22px] text-xl shadow-[0_10px_40px_rgba(234,179,8,0.35)] transition-all active:scale-[0.98] border-none"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Ingresar al Dashboard"
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="bg-[#181616] p-0 m-0 border-none">
        <div className="w-full py-8 flex justify-center items-center">
          <p className="text-[14px] text-zinc-300 font-medium">
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              className="text-[#00df9a] font-bold hover:text-[#05ffa3] transition-colors ml-1"
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