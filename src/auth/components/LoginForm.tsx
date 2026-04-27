import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react"; // Para el estado de carga

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulamos la llamada a NestJS por 2 segundos
    setTimeout(() => {
      setLoading(false);
      alert('¡Vista previa! En el futuro, esto te logueará con NestJS.');
    }, 2000);
  };

  return (
    <Card className="w-[350px] border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Iniciar Sesión</CardTitle>
        <CardDescription className="text-zinc-400">Panel de Super Admin v0.1</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-zinc-300">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@miproyecto.com" 
              required 
              className="bg-zinc-900 border-zinc-700 text-zinc-100 focus-visible:ring-cyan-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-zinc-300">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              className="bg-zinc-900 border-zinc-700 text-zinc-100 focus-visible:ring-cyan-500"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-cyan-600 text-zinc-950 hover:bg-cyan-500 font-semibold" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validando...
              </>
            ) : (
              'Ingresar al Panel'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}