import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { useSignup } from "../hooks/useSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Añadido para los títulos de los inputs
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Mail, Lock, User, UserPlus } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function RegisterFormInner() {
  const { mutate: signup, isPending } = useSignup();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    signup(data);
  };

  return (
    <Card className="w-[420px] bg-[#181616] border-none shadow-[0_20px_50px_rgba(0,0,0,1)] text-white overflow-hidden rounded-[45px]">
      <CardHeader className="flex flex-col items-center space-y-6 pt-12 pb-8">
        {/* Icono de Registro con estilo Gold */}
        <div className="bg-[#1c180a] p-5 rounded-[24px] border border-[#3d3112] shadow-lg">
          <UserPlus className="w-12 h-12 text-[#facc15]" />
        </div>
        
        <div className="text-center space-y-2">
          <CardTitle className="text-[38px] font-serif leading-tight tracking-tight text-zinc-100">
            Crear<br/>Cuenta
          </CardTitle>
          <p className="text-[14px] text-zinc-500 font-medium">
            Únete para gestionar el sistema
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-10 pb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre completo */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 ml-2">NOMBRE COMPLETO</Label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 z-10" />
              <Input 
                {...register("name")} 
                placeholder="Tu nombre" 
                className="pl-14 bg-[#edf4ff] border-none h-[60px] text-zinc-900 rounded-[22px] text-lg focus-visible:ring-2 focus-visible:ring-blue-200 placeholder:text-zinc-400" 
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 ml-2">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 ml-2">CORREO ELECTRÓNICO</Label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 z-10" />
              <Input 
                {...register("email")} 
                placeholder="correo@ejemplo.com" 
                className="pl-14 bg-[#edf4ff] border-none h-[60px] text-zinc-900 rounded-[22px] text-lg focus-visible:ring-2 focus-visible:ring-blue-200 placeholder:text-zinc-400" 
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 ml-2">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 ml-2">CONTRASEÑA</Label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 z-10" />
              <Input 
                {...register("password")} 
                type="password" 
                placeholder="••••••••" 
                className="pl-14 bg-[#edf4ff] border-none h-[60px] text-zinc-900 rounded-[22px] text-lg focus-visible:ring-2 focus-visible:ring-blue-200" 
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 ml-2">{errors.password.message}</p>}
          </div>

          {/* Confirmar Password */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 ml-2">CONFIRMAR CONTRASEÑA</Label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 z-10" />
              <Input 
                {...register("confirmPassword")} 
                type="password" 
                placeholder="••••••••" 
                className="pl-14 bg-[#edf4ff] border-none h-[60px] text-zinc-900 rounded-[22px] text-lg focus-visible:ring-2 focus-visible:ring-blue-200" 
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 ml-2">{errors.confirmPassword.message}</p>}
          </div>

          {/* Botón de Registro (Color Esmeralda con Glow) */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-[#eab308] hover:bg-[#eab308] text-black font-black h-[65px] rounded-[22px] text-xl shadow-[0_10px_40px_rgba(0,223,154,0.25)] transition-all active:scale-[0.98]" 
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Registrarme"}
            </Button>
          </div>
        </form>
      </CardContent>

      {/* Footer Gris (Pegado al borde) */}
      <CardFooter className="bg-[#181616] p-0 m-0 border-none">
        <div className="w-full py-8 flex justify-center items-center">
          <p className="text-[14px] text-zinc-300 font-medium">
            ¿Ya tienes cuenta? <a href="/login" className="text-[#facc15] font-bold hover:brightness-110 ml-1">Inicia sesión</a>
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