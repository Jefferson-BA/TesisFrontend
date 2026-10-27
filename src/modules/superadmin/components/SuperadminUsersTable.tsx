// src/modules/superadmin/components/SuperadminUsersTable.tsx

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  Edit2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Shield,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';

import { useSuperadminUsers } from '../hooks/useSuperadminUsers';
import { SuperadminPasswordModal } from './SuperadminPasswordModal';
import type { SuperadminUser, RoleType } from '../types/superadmin.types';

export function SuperadminUsersTable() {
  const {
    filters,
    setFilters,
    users,
    stats,
    meta,
    isLoading,
    isFetching,
    refetch,
    updateRole,
    isUpdatingRole,
    updateStatus,
    isUpdatingStatus,
    updateProfile,
    isUpdatingProfile,
  } = useSuperadminUsers({ limit: 10, offset: 0 });

  const [searchInput, setSearchInput] = useState('');

  // Estados para modal de cambio de rol
  const [roleModalUser, setRoleModalUser] = useState<SuperadminUser | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<RoleType>('admin');

  // Estados para modal de cambio de estado (activo/suspendido)
  const [statusModalUser, setStatusModalUser] = useState<SuperadminUser | null>(null);

  // Estados para modal de edición de datos personales
  const [editProfileUser, setEditProfileUser] = useState<SuperadminUser | null>(null);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput.trim() || undefined, offset: 0 }));
  };

  const handleRoleFilterChange = (val: string) => {
    setFilters((prev) => ({
      ...prev,
      role: val === 'all' ? undefined : (val as RoleType),
      offset: 0,
    }));
  };

  const handleStatusFilterChange = (val: string) => {
    setFilters((prev) => ({
      ...prev,
      isActive: val === 'all' ? undefined : val === 'active',
      offset: 0,
    }));
  };

  const openRoleModal = (user: SuperadminUser) => {
    setRoleModalUser(user);
    setSelectedNewRole(user.role.name === 'admin' ? 'user' : 'admin');
  };

  const handleConfirmRoleChange = async ({
    superadminPassword,
    reason,
  }: {
    superadminPassword: string;
    reason: string;
  }) => {
    if (!roleModalUser) return;
    await updateRole({
      id: roleModalUser.id,
      dto: {
        newRole: selectedNewRole,
        reason,
        superadminPassword,
      },
    });
    setRoleModalUser(null);
  };

  const openStatusModal = (user: SuperadminUser) => {
    setStatusModalUser(user);
  };

  const handleConfirmStatusChange = async ({
    superadminPassword,
    reason,
  }: {
    superadminPassword: string;
    reason: string;
  }) => {
    if (!statusModalUser) return;
    await updateStatus({
      id: statusModalUser.id,
      dto: {
        isActive: !statusModalUser.isActive,
        reason,
        superadminPassword,
      },
    });
    setStatusModalUser(null);
  };

  const openEditModal = (user: SuperadminUser) => {
    setEditProfileUser(user);
    setProfileName(user.name);
    setProfilePhone(user.phone || '');
    setProfileAddress(user.address || '');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProfileUser) return;
    await updateProfile({
      id: editProfileUser.id,
      dto: {
        name: profileName.trim(),
        phone: profilePhone.trim() || undefined,
        address: profileAddress.trim() || undefined,
      },
    });
    setEditProfileUser(null);
  };

  return (
    <div className="space-y-6">
      {/* 📊 Tarjetas de Métricas de Usuarios */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-zinc-900/90 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Superadministradores</CardTitle>
            <ShieldAlert className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              {isLoading ? <Skeleton className="h-8 w-14 bg-zinc-800" /> : stats?.superadmin ?? 0}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Control maestro de plataforma</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/90 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Administradores</CardTitle>
            <ShieldCheck className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-purple-400">
              {isLoading ? <Skeleton className="h-8 w-14 bg-zinc-800" /> : stats?.admin ?? 0}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Gestión operativa del restaurante</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/90 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Clientes / Comensales</CardTitle>
            <Users className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              {isLoading ? <Skeleton className="h-8 w-14 bg-zinc-800" /> : stats?.user ?? 0}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Cuentas regulares de compras</p>
          </CardContent>
        </Card>
      </div>

      {/* 🔍 Barra de Filtros y Búsqueda */}
      <Card className="bg-zinc-900/70 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar por nombre, correo electrónico..."
                  className="pl-9 bg-zinc-950/60 border-zinc-800 text-white placeholder:text-zinc-500 text-sm focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" variant="secondary" className="border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white">
                Buscar
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filtro por Rol */}
              <div className="w-36">
                <Select defaultValue="all" onValueChange={handleRoleFilterChange}>
                  <SelectTrigger className="bg-zinc-950/60 border-zinc-800 text-white">
                    <SelectValue placeholder="Rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Estado */}
              <div className="w-36">
                <Select defaultValue="all" onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="bg-zinc-950/60 border-zinc-800 text-white">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="suspended">Suspendidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isFetching}
                title="Actualizar tabla"
                className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📋 Tabla de Usuarios */}
      <Card className="bg-zinc-900/90 border-zinc-800">
        <CardHeader className="border-b border-zinc-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Directorio de Usuarios y Privilegios
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Asigna privilegios administrativos, activa o suspende cuentas con confirmación obligatoria.
              </CardDescription>
            </div>
            <div className="text-xs text-zinc-500">
              Total registrados: <span className="font-semibold text-zinc-300">{meta?.total ?? 0}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-950/50">
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-400 font-semibold">Usuario</TableHead>
                <TableHead className="text-zinc-400 font-semibold">Rol Actual</TableHead>
                <TableHead className="text-zinc-400 font-semibold">Estado</TableHead>
                <TableHead className="text-zinc-400 font-semibold">Contacto</TableHead>
                <TableHead className="text-zinc-400 font-semibold">Registro</TableHead>
                <TableHead className="text-right text-zinc-400 font-semibold pr-6">Acciones Críticas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-zinc-800">
                    <TableCell><Skeleton className="h-5 w-32 bg-zinc-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 bg-zinc-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 bg-zinc-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28 bg-zinc-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 bg-zinc-800" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto bg-zinc-800" /></TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                    No se encontraron usuarios con los filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => {
                  const roleName = u.role?.name?.toLowerCase();
                  const isUserSuperadmin = roleName === 'superadmin';
                  const isUserAdmin = roleName === 'admin';

                  return (
                    <TableRow key={u.id} className="border-zinc-800/80 hover:bg-zinc-800/40 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            {u.name}
                            {isUserSuperadmin && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-red-500/40 text-red-400 bg-red-950/20">
                                MAESTRO
                              </Badge>
                            )}
                          </span>
                          <span className="text-xs text-zinc-400 flex items-center gap-1">
                            <Mail className="h-3 w-3 text-zinc-500" />
                            {u.email}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {isUserSuperadmin ? (
                          <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 font-medium">
                            Superadmin
                          </Badge>
                        ) : isUserAdmin ? (
                          <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                            Usuario
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        {u.isActive ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge className="bg-zinc-800 text-zinc-400 border border-zinc-700 gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                            Suspendido
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="text-xs text-zinc-400 space-y-0.5">
                          {u.phone ? (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-zinc-500" />
                              <span>{u.phone}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-600 italic">Sin teléfono</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-zinc-500" />
                          {new Date(u.createdAt).toLocaleDateString('es-PE')}
                        </span>
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón Editar Perfil */}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditModal(u)}
                            title="Editar datos"
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          {/* Botón Cambiar Rol */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRoleModal(u)}
                            className="h-8 gap-1.5 text-xs border-purple-500/30 text-purple-400 bg-purple-950/20 hover:bg-purple-900/40"
                          >
                            <Lock className="h-3 w-3" />
                            Cambiar Rol
                          </Button>

                          {/* Botón Suspender / Activar */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openStatusModal(u)}
                            className={`h-8 gap-1.5 text-xs ${
                              u.isActive
                                ? 'border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-900/40'
                                : 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/40'
                            }`}
                          >
                            {u.isActive ? (
                              <>
                                <UserX className="h-3 w-3" />
                                Suspender
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3 w-3" />
                                Activar
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Paginación */}
          {meta && meta.lastPage > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-zinc-800 text-xs text-zinc-400">
              <div>
                Página <span className="text-white font-medium">{meta.page}</span> de{' '}
                <span className="text-white font-medium">{meta.lastPage}</span> ({meta.total} usuarios)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1 || isFetching}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      offset: Math.max(0, (prev.offset || 0) - (prev.limit || 10)),
                    }))
                  }
                  className="border-zinc-800 bg-zinc-950 text-zinc-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.lastPage || isFetching}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      offset: (prev.offset || 0) + (prev.limit || 10),
                    }))
                  }
                  className="border-zinc-800 bg-zinc-950 text-zinc-300"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🔐 MODAL REUTILIZABLE: Confirmación Cambio de Rol */}
      {roleModalUser && (
        <SuperadminPasswordModal
          open={!!roleModalUser}
          onOpenChange={(open) => !open && setRoleModalUser(null)}
          title={`Cambiar Rol de ${roleModalUser.name}`}
          description={`Actualmente cuenta con el rol "${roleModalUser.role.name}". Esta acción recalculará sus permisos globales inmediatamente.`}
          badgeText="Privilegio de Seguridad"
          actionLabel="Autorizar Cambio de Rol"
          variant="amber"
          isLoading={isUpdatingRole}
          onConfirm={handleConfirmRoleChange}
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Selecciona el nuevo rol a asignar:
            </label>
            <Select
              value={selectedNewRole}
              onValueChange={(val) => setSelectedNewRole(val as RoleType)}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                <SelectValue placeholder="Nuevo Rol" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="user">Usuario (Cliente estándar)</SelectItem>
                <SelectItem value="admin">Admin (Gestor de restaurante)</SelectItem>
                <SelectItem value="superadmin">Superadmin (Acceso maestro)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </SuperadminPasswordModal>
      )}

      {/* 🔐 MODAL REUTILIZABLE: Confirmación Suspender / Activar Usuario */}
      {statusModalUser && (
        <SuperadminPasswordModal
          open={!!statusModalUser}
          onOpenChange={(open) => !open && setStatusModalUser(null)}
          title={statusModalUser.isActive ? `Suspender cuenta de ${statusModalUser.name}` : `Reactivar cuenta de ${statusModalUser.name}`}
          description={
            statusModalUser.isActive
              ? 'El usuario perderá acceso inmediato a la plataforma y no podrá iniciar sesión.'
              : 'Se restaurará el acceso del usuario para iniciar sesión y operar con normalidad.'
          }
          badgeText="Estado de Cuenta"
          actionLabel={statusModalUser.isActive ? 'Confirmar Suspensión' : 'Confirmar Reactivación'}
          variant={statusModalUser.isActive ? 'destructive' : 'amber'}
          isLoading={isUpdatingStatus}
          onConfirm={handleConfirmStatusChange}
        />
      )}

      {/* ✏️ MODAL: Edición de Datos Personales (No destructiva) */}
      <Dialog open={!!editProfileUser} onOpenChange={(open) => !open && setEditProfileUser(null)}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" />
              Editar Perfil de Usuario
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Nombre Completo</label>
              <Input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Teléfono</label>
              <Input
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="+51999888777"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Dirección</label>
              <Input
                value={profileAddress}
                onChange={(e) => setProfileAddress(e.target.value)}
                placeholder="Av. Principal 123"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditProfileUser(null)}
                className="border-zinc-800 bg-zinc-900 text-zinc-300"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isUpdatingProfile ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
