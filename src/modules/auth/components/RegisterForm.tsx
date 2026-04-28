import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { useSignup } from "../hooks/useSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
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
    <Card className="w-[400px] bg-zinc-900 border-zinc-800 text-white shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input {...register("name")} placeholder="Tu nombre" className="bg-zinc-800 border-zinc-700 text-white" />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>
          <div className="space-y-2">
            <Input {...register("email")} placeholder="correo@ejemplo.com" className="bg-zinc-800 border-zinc-700 text-white" />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>
          <div className="space-y-2">
            <Input {...register("password")} type="password" placeholder="Contraseña (mín. 8 caracteres)" className="bg-zinc-800 border-zinc-700 text-white" />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>
          <div className="space-y-2">
            <Input {...register("confirmPassword")} type="password" placeholder="Confirmar contraseña" className="bg-zinc-800 border-zinc-700 text-white" />
            {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
          </div>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Registrarme"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-zinc-800 pt-4">
        <p className="text-sm text-zinc-400">
          ¿Ya tienes cuenta? <a href="/login" className="text-emerald-500 hover:underline">Inicia sesión</a>
        </p>
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