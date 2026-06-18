import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const SettingsAdmin = () => {
    // Manejamos un estado booleano para el switch
    const [isDark, setIsDark] = useState(true);

    // Al cargar, verificamos qué tema está guardado
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setIsDark(false);
        } else {
            setIsDark(true); // Por defecto lo dejamos en oscuro
        }
    }, []);

    // Función para alternar el switch
    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        
        const newTheme = newIsDark ? "dark" : "light";
        localStorage.setItem("theme", newTheme);

        if (newIsDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
                <p className="text-muted-foreground">Administra las preferencias de tu panel.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Apariencia</CardTitle>
                    <CardDescription>
                        Cambia entre el modo claro y oscuro usando el interruptor.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                        <div className="flex items-center gap-4">
                            {isDark ? (
                                <Moon className="w-6 h-6 text-indigo-400" />
                            ) : (
                                <Sun className="w-6 h-6 text-yellow-500" />
                            )}
                            <div>
                                <p className="font-medium text-base">Modo {isDark ? 'Oscuro' : 'Claro'}</p>
                                <p className="text-sm text-muted-foreground">
                                    El panel se mostrará en tonos {isDark ? 'oscuros' : 'claros'}.
                                </p>
                            </div>
                        </div>
                        
                        {/* Switch / Slider animado con Tailwind */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                                isDark ? 'bg-primary' : 'bg-zinc-300'
                            }`}
                            role="switch"
                            aria-checked={isDark}
                        >
                            <span className="sr-only">Cambiar tema</span>
                            <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                                    isDark ? 'translate-x-7' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};