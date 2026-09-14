import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDate(iso: string): string {
  return format(new Date(iso), "d MMMM yyyy", { locale: fr });
}

export function formatDateShort(iso: string): string {
  return format(new Date(iso), "d MMM yyyy", { locale: fr });
}
