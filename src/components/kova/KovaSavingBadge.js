// Affiche le badge uniquement si amount > 0
export default function KovaSavingBadge({ amount }) {
  if (!amount || amount <= 0) return null;
  return (
    <span className="kova-saving-badge">
      Vous économisez {amount.toLocaleString("fr-FR")}€
    </span>
  );
}
