import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransferencia } from '../../transacciones/hooks/useTransferencia';
import { useMisCuentas } from '../../cuentas/hooks/useCuenta';
import { parseApiError } from '../../../utils/parseApiError';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import InputField from '../../../components/ui/InputField';
import AlertBanner from '../../../components/ui/AlertBanner';
import PageHeader from '../../../components/ui/PageHeader';

// ── Step type ─────────────────────────────────────────────────────────────────

type Step = 'destinatario' | 'monto' | 'confirmar' | 'exito';

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
  const steps: Step[] = ['destinatario', 'monto', 'confirmar'];
  const labels = ['Destinatario', 'Monto', 'Confirmar'];
  const current = steps.indexOf(step);

  return (
    <div className="flex items-center justify-center gap-0 my-6 px-4">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={[
            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
            i <= current
              ? 'bg-[#1A7A4A] border-[#1A7A4A] text-white'
              : 'bg-white border-gray-200 text-gray-400',
          ].join(' ')}>
            {i < current ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : i + 1}
          </div>
          <div className="ml-1 mr-1">
            <span className={['text-[10px] font-medium', i <= current ? 'text-[#1A7A4A]' : 'text-gray-400'].join(' ')}>
              {labels[i]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={['w-8 h-0.5 mx-1', i < current ? 'bg-[#1A7A4A]' : 'bg-gray-200'].join(' ')} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── TransferirPage ────────────────────────────────────────────────────────────

export default function TransferirPage() {
  const navigate = useNavigate();
  const { data: cuentas } = useMisCuentas();
  const cuentaOrigenId = cuentas?.[0]?.id ?? '';

  const [step, setStep] = useState<Step>('destinatario');

  // Form fields
  const [destinatario, setDestinatario] = useState('');
  const [monto, setMonto]               = useState('');
  const [descripcion, setDescripcion]   = useState('');

  // Field errors
  const [destinoError, setDestinoError] = useState('');
  const [montoError, setMontoError]     = useState('');

  const { mutate: transferir, isPending, isError, error, reset, data: resultado } = useTransferencia();

  // ── Validations ─────────────────────────────────────────────────────────────

  function validateDestino(): boolean {
    const value = destinatario.trim();
    if (!value) {
      setDestinoError('El destinatario es obligatorio.');
      return false;
    }
    const isEmail   = value.includes('@');
    const isNumeric = /^\d+$/.test(value);
    if (!isEmail && !isNumeric) {
      setDestinoError('Ingresa un email o número de cuenta válido.');
      return false;
    }
    setDestinoError('');
    return true;
  }

  function validateMonto(): boolean {
    const val = parseFloat(monto);
    if (!monto || isNaN(val)) {
      setMontoError('Ingresa un monto válido.');
      return false;
    }
    if (val <= 0) {
      setMontoError('El monto debe ser mayor a cero.');
      return false;
    }
    setMontoError('');
    return true;
  }

  // ── Step handlers ────────────────────────────────────────────────────────────

  function handleNextDestino() {
    if (validateDestino()) setStep('monto');
  }

  function handleNextMonto() {
    if (validateMonto()) setStep('confirmar');
  }

  function handleConfirmar() {
    reset();
    transferir(
      {
        cuentaOrigenId,
        destinatario: destinatario.trim(),
        monto: parseFloat(monto),
        descripcion: descripcion.trim() || 'Transferencia',
      },
      { onSuccess: () => setStep('exito') },
    );
  }

  // ── Success screen ───────────────────────────────────────────────────────────

  if (step === 'exito' && resultado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[#22C55E]/15 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="#22C55E" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">¡Transferencia exitosa!</p>
          <p className="text-sm text-gray-500 mt-1">
            Transferiste{' '}
            <span className="font-semibold text-gray-800">
              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(resultado.monto)}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Saldo restante:{' '}
            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(resultado.saldoOrigenResultante)}
          </p>
        </div>
        <Button variant="primary" fullWidth onClick={() => navigate('/inicio')}>
          Volver al inicio
        </Button>
        <button
          onClick={() => {
            setDestinatario('');
            setMonto('');
            setDescripcion('');
            reset();
            setStep('destinatario');
          }}
          className="text-sm text-[#1A7A4A] hover:underline"
        >
          Hacer otra transferencia
        </button>
      </div>
    );
  }

  // ── Main wizard ──────────────────────────────────────────────────────────────

  return (
    <div className="pb-8">
      <PageHeader title="Nueva transferencia" />

      <StepIndicator step={step} />

      <div className="px-4">
        {/* ── Step 1: Destinatario ─────────────────────────────────────────── */}
        {step === 'destinatario' && (
          <Card padding="md" className="flex flex-col gap-4">
            <div>
              <p className="text-base font-semibold text-gray-800 mb-0.5">¿A quién deseas transferir?</p>
              <p className="text-xs text-gray-400">Ingresa el email o número de cuenta del destinatario</p>
            </div>
            <InputField
              label="Email o número de cuenta"
              type="text"
              placeholder="usuario@email.com o 1234567890"
              value={destinatario}
              onChange={(e) => { setDestinatario(e.target.value); if (destinoError) setDestinoError(''); }}
              error={destinoError}
            />
            <Button variant="primary" fullWidth onClick={handleNextDestino}>
              Continuar
            </Button>
          </Card>
        )}

        {/* ── Step 2: Monto ────────────────────────────────────────────────── */}
        {step === 'monto' && (
          <Card padding="md" className="flex flex-col gap-4">
            <div>
              <p className="text-base font-semibold text-gray-800 mb-0.5">¿Cuánto deseas enviar?</p>
              <p className="text-xs text-gray-400 truncate">→ {destinatario}</p>
            </div>
            <InputField
              label="Monto (MXN)"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={monto}
              onChange={(e) => { setMonto(e.target.value); if (montoError) setMontoError(''); }}
              error={montoError}
            />
            <InputField
              label="Descripción (opcional)"
              type="text"
              placeholder="Ej: Pago de renta"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={100}
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep('destinatario')}>
                Atrás
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleNextMonto}>
                Continuar
              </Button>
            </div>
          </Card>
        )}

        {/* ── Step 3: Confirmar ────────────────────────────────────────────── */}
        {step === 'confirmar' && (
          <Card padding="md" className="flex flex-col gap-4">
            <div>
              <p className="text-base font-semibold text-gray-800 mb-0.5">Confirma la transferencia</p>
              <p className="text-xs text-gray-400">Revisa los datos antes de enviar</p>
            </div>

            {/* Summary rows */}
            <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4">
              {[
                { label: 'Destinatario', value: destinatario },
                {
                  label: 'Monto',
                   value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parseFloat(monto)),
                },
                { label: 'Descripción', value: descripcion.trim() || 'Transferencia' },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{row.label}</span>
                  <span className="text-sm text-gray-800 font-medium break-all">{row.value}</span>
                </div>
              ))}
            </div>

            {isError && <AlertBanner variant="error" message={parseApiError(error)} />}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={isPending}
                onClick={() => setStep('monto')}
              >
                Atrás
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                isLoading={isPending}
                onClick={handleConfirmar}
              >
                {isPending ? 'Enviando…' : 'Confirmar'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
