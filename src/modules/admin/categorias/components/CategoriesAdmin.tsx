import React, { useEffect, useState } from 'react';
import { categoryService } from '../services/category.service';
import type { Category } from '../interfaces/category.interface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit } from 'lucide-react';

export const CategoriesAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      const newCategory = await categoryService.create({ name, description });
      setCategories([...categories, newCategory]);
      // Limpiar formulario
      setName('');
      setDescription('');
    } catch (error) {
      console.error("Error al crear categoría:", error);
      alert("Hubo un error al crear la categoría.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría? Esto podría afectar a los productos vinculados.')) return;
    
    try {
      await categoryService.delete(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar la categoría.");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Categorías</h2>
        <p className="text-muted-foreground mt-1">Administra las clasificaciones de tu menú.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h3 className="text-xl font-bold text-card-foreground mb-4">Nueva Categoría</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nombre</Label>
                <Input 
                  id="name" 
                  placeholder="Ejemplo: Criollo, Árabe..." 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Descripción (Opcional)</Label>
                <Input 
                  id="description" 
                  placeholder="Breve descripción..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || !name.trim()}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold mt-2"
              >
                {isSubmitting ? 'Creando...' : 'Crear Categoría'}
              </Button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: TABLA DE CATEGORÍAS */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-primary font-semibold w-1/3">Nombre</TableHead>
                  <TableHead className="text-primary font-semibold w-1/2">Descripción</TableHead>
                  <TableHead className="text-primary font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Cargando categorías...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No hay categorías registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id} className="border-border hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-foreground">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {category.description || <span className="italic opacity-50">Sin descripción</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => handleDelete(category.id)}
                            className="bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive h-8 w-8"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </div>
  );
};