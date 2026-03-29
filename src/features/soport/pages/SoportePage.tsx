import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

// ── Item FAQ ─────────────────────────────────────────────
function FaqItem({ pregunta, respuesta }: { pregunta: string; respuesta: string }) {
  return (
    <div className="py-4 border-b border-gray-50 last:border-0">
      <p className="text-sm font-semibold text-gray-800">{pregunta}</p>
      <p className="text-xs text-gray-500 mt-1">{respuesta}</p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────
export default function SoportePage() {

  function handleSoporte() {
    const mensaje = encodeURIComponent(
      'Hola, necesito ayuda con la aplicación de billetera digital.'
    );
    
    window.open(`https://wa.me/5218441234567?text=${mensaje}`, '_blank');
  }

  return (
    <div className="pb-8">
      <PageHeader title="Soporte" />

      {/* Intro */}
      <div className="mx-4 mt-4">
        <p className="text-sm text-gray-500">
          ¿Necesitas ayuda? Aquí encontrarás respuestas rápidas a preguntas comunes.
        </p>
      </div>

      {/* FAQ */}
      <Card padding="none" className="mx-4 mt-4 px-5">
        <FaqItem
          pregunta="¿Cómo crear una cuenta?"
          respuesta="Presiona 'Registrarse' y completa tus datos personales."
        />
        <FaqItem
          pregunta="¿Cómo transferir dinero?"
          respuesta="Ve a la sección 'Transferir', ingresa los datos y confirma."
        />
        <FaqItem
          pregunta="¿Olvidé mi contraseña?"
          respuesta="Usa la opción 'Recuperar contraseña' en el login."
        />
        <FaqItem
          pregunta="¿Es segura la aplicación?"
          respuesta="Sí, usamos autenticación segura con tokens."
        />
      </Card>

      {/* Contacto */}
      <div className="mx-4 mt-6">
        <Card className="p-5 text-center">
          <p className="text-sm text-gray-600">
            ¿No encontraste lo que buscabas?
          </p>

          <Button
            className="mt-4"
            fullWidth
            onClick={handleSoporte}
          >
            Contactar soporte
          </Button>

          {/* Texto extra */}
          <p className="text-[11px] text-gray-400 mt-2">
            Te responderemos lo antes posible 📩
          </p>
        </Card>
      </div>
    </div>
  );
}