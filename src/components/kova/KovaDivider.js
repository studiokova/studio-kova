// spacing: margin vertical en px (défaut 36)
export default function KovaDivider({ spacing = 36 }) {
  return <hr className="kova-divider" style={{ margin: `${spacing}px 0` }} />;
}
