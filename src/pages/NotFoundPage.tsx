import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe o fue eliminada.</p>

      <button onClick={() => navigate("/inicio")}>
        Regresar al inicio
      </button>
    </div>
  );
}