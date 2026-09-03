"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createStaffAccount, type CreateUserState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="gn-button disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? "Creando…" : "Crear cuenta"}
    </button>
  );
}

export function CreateUserForm() {
  const [state, formAction] = useActionState<CreateUserState, FormData>(createStaffAccount, {});

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-3 rounded-xl bg-white p-6 shadow">
      <div className="flex flex-col gap-1">
        <label htmlFor="fullName" className="text-sm font-medium text-[var(--gn-palette-3)]">
          Nombre completo
        </label>
        <input id="fullName" name="fullName" required className="h-10 rounded-lg border border-[#69727d] px-3 text-[15px]" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-[var(--gn-palette-3)]">
          Correo
        </label>
        <input id="email" name="email" type="email" required className="h-10 rounded-lg border border-[#69727d] px-3 text-[15px]" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-[var(--gn-palette-3)]">
          Contraseña temporal
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="h-10 rounded-lg border border-[#69727d] px-3 text-[15px]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="role" className="text-sm font-medium text-[var(--gn-palette-3)]">
          Rol
        </label>
        <select id="role" name="role" defaultValue="worker" className="h-10 rounded-lg border border-[#69727d] px-3 text-[15px]">
          <option value="worker">Trabajador (solo ve reservas)</option>
          <option value="admin">Administrador (acceso total)</option>
        </select>
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-green-700">{state.success}</p> : null}
      <SubmitButton />
    </form>
  );
}
