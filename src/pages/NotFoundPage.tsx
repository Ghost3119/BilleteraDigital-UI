import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Oops, página no encontrada</h1>

      <button onClick={() => navigate("/inicio")}>
        Volver al Inicio
      </button>
    </div>
  );
}