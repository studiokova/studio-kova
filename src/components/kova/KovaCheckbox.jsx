import PropTypes from "prop-types";

export default function KovaCheckbox({ checked, onChange, children, id, color = "var(--sauge-fonce)" }) {
  return (
    <label
      htmlFor={id}
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        style={{
          width: "18px",
          height: "18px",
          accentColor: "var(--cuivre)",
          marginTop: "2px",
          flexShrink: 0,
          cursor: "pointer",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          lineHeight: "1.5",
          color,
        }}
      >
        {children}
      </span>
    </label>
  );
}

KovaCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  color: PropTypes.string,
};
