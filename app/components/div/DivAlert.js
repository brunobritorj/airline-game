export default function DivAlert({ kind, title, message }) {
  return (
    <div className={`alert alert-${kind} alert-dismissible fade show`} role="alert">
      <strong>{title}</strong> {message}
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  );
}
