import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1. Creamos el cliente fuera del componente para que no se reinicie
const queryClient = new QueryClient();

// 2. Esta es la lógica real de tu formulario (antes se llamaba LoginForm)
function LoginFormInner() {
  const { mutate: login, isPending } = useLogin();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <Card className="w-[350px] bg-zinc-900 border-zinc-800 text-white shadow-2xl">
      <CardHeader>
        <CardTitle>Bienvenido de nuevo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input 
              {...register("email")} 
              placeholder="correo@ejemplo.com" 
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>
          <div className="space-y-2">
            <Input 
              {...register("password")} 
              type="password" 
              placeholder="******" 
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Entrar al Panel"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-zinc-800 pt-4">
        <p className="text-sm text-zinc-400">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-emerald-500 hover:underline font-medium">
            Regístrate aquí
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

// 3. Exportamos el formulario envuelto en su Provider (Esto salva a Astro)
export function LoginForm() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginFormInner />
    </QueryClientProvider>
  );
}