import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { useSignup } from "../hooks/useSignup";

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

import {
  Loader2,
  Mail,
  Lock,
  User,
  UserPlus,
} from "lucide-react";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { toast } from "sonner";

const queryClient = new QueryClient();

function RegisterFormInner() {
  const { mutate: signup, isPending } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    // VALIDAR SOLO GMAIL
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(data.email)) {
      toast.error("Solo se permiten correos Gmail", {
        description: "Usa una cuenta @gmail.com para registrarte",
        style: {
          background: '#120d0a',
          color: '#fff',
          border: '1px solid #e11d48',
        }
      });
      return;
    }

    signup(data);
  };

  return (
    <Card className="w-[430px] bg-[#0e0a08]/95 border border-[#3d2c1f]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-white overflow-hidden rounded-[32px] backdrop-blur-md">
      
      {/* HEADER */}
      <CardHeader className="flex flex-col items-center space-y-5 pt-12 pb-8">
        <div className="bg-[#1c140e] p-4.5 rounded-2xl border border-[#4a3824]/60 shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
          <UserPlus className="w-10 h-10 text-yellow-500" />
        </div>

        <div className="text-center space-y-2.5">
          <CardTitle className="text-3xl font-bold font-serif leading-tight tracking-tight text-zinc-100">
            Crear Cuenta
          </CardTitle>

          <p className="text-xs text-zinc-400 font-medium max-w-[280px] mx-auto leading-relaxed">
            Únete para gestionar el sistema corporativo y de banquetes.
          </p>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="px-9 pb-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* NOMBRE */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 ml-1">
              Nombre Completo
            </Label>

            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-500 transition-colors z-10" />

              <Input
                {...register("name")}
                placeholder="Tu nombre"
                className="pl-14 bg-[#14100d] border border-[#3d2c1f]/60 h-14 text-zinc-100 rounded-xl text-base focus-visible:ring-1 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>

            {errors.name && (
              <p className="text-xs text-rose-400 font-medium ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 ml-1">
              Correo Electrónico
            </Label>

            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-500 transition-colors z-10" />

              <Input
                {...register("email")}
                type="email"
                placeholder="usuario@gmail.com"
                className="pl-14 bg-[#14100d] border border-[#3d2c1f]/60 h-14 text-zinc-100 rounded-xl text-base focus-visible:ring-1 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>

            {errors.email && (
              <p className="text-xs text-rose-400 font-medium ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
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
              <p className="text-xs text-rose-400 font-medium ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 ml-1">
              Confirmar Contraseña
            </Label>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-500 transition-colors z-10" />

              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className="pl-14 bg-[#14100d] border border-[#3d2c1f]/60 h-14 text-zinc-100 rounded-xl text-base focus-visible:ring-1 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>

            {errors.confirmPassword && (
              <p className="text-xs text-rose-400 font-medium ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* BOTÓN */}
          <div className="pt-3">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold h-14 rounded-xl text-sm uppercase tracking-widest shadow-[0_6px_25px_rgba(234,179,8,0.15)] transition-all active:scale-[0.99] border-none disabled:bg-zinc-800 disabled:text-zinc-500"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Registrarme"
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="bg-[#0b0806] border-t border-[#3d2c1f]/30 p-0 m-0">
        <div className="w-full py-6 flex justify-center items-center">
          <p className="text-xs text-zinc-400 font-medium">
            ¿Ya tienes cuenta?
            <a
              href="/login"
              className="text-yellow-500 font-bold hover:text-yellow-400 transition-colors ml-1 underline underline-offset-4"
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </CardFooter>

    </Card>
  );
}

export function RegisterForm() {
  return (
    <QueryClientProvider client={queryClient}>
      <RegisterFormInner />
    </QueryClientProvider>
  );
}