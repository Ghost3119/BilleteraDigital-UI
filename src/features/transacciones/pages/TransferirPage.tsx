import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransferencia } from '../../transacciones/hooks/useTransferencia';
import { CUENTA_ID_KEY } from '../../../config/axiosClient';
import type { AxiosError } from 'axios';

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseApiError(error: unknown): string {
  const axiosErr = error as AxiosError<{ error?: string; title?: string }>;
  if (axiosErr?.response?.data?.error) return axiosErr.response.data.error;
  if (axiosErr?.response?.data?.title) return axiosErr.response.data.title;
  return 'Ocurrió un error. Intenta de nuevo.';
}

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
  const cuentaOrigenId = localStorage.getItem(CUENTA_ID_KEY) ?? '';

  const [step, setStep] = useState<Step>('destinatario');

  // Form fields
  const [cuentaDestinoId, setCuentaDestinoId] = useState('');
  const [monto, setMonto]                     = useState('');
  const [descripcion, setDescripcion]         = useState('');

  // Field errors
  const [destinoError, setDestinoError]  = useState('');
  const [montoError, setMontoError]      = useState('');

  const { mutate: transferir, isPending, isError, error, reset, data: resultado } = useTransferencia();

  // ── Validations ─────────────────────────────────────────────────────────────

  function validateDestino(): boolean {
    if (!cuentaDestinoId.trim()) {
      setDestinoError('El ID de cuenta destino es obligatorio.');
      return false;
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(cuentaDestinoId.trim())) {
      setDestinoError('Ingresa un ID de cuenta válido (formato UUID).');
      return false;
    }
    if (cuentaDestinoId.trim().toLowerCase() === cuentaOrigenId.toLowerCase()) {
      setDestinoError('No puedes transferirte a ti mismo.');
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
        cuentaDestinoId: cuentaDestinoId.trim(),
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
              {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(resultado.monto)}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Saldo restante:{' '}
            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(resultado.saldoOrigenResultante)}
          </p>
        </div>
        <button
          onClick={() => navigate('/inicio')}
          className="w-full max-w-[280px] py-3.5 rounded-xl bg-[#1A7A4A] text-white text-sm font-bold uppercase tracking-widest shadow-md shadow-[#1A7A4A]/25 hover:bg-[#145E38] active:scale-[0.98] transition-all"
        >
          Volver al inicio
        </button>
        <button
          onClick={() => {
            setCuentaDestinoId('');
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
      {/* Header */}
      <div className="px-4 pt-8 pb-2">
        <p className="text-xs text-gray-400 uppercase tracking-widest">Billetera Digital</p>
        <h1 className="text-xl font-bold text-gray-900 mt-0.5">Nueva transferencia</h1>
      </div>

      <StepIndicator step={step} />

      <div className="px-4">
        {/* ── Step 1: Destinatario ─────────────────────────────────────────── */}
        {step === 'destinatario' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <div>
              <p className="text-base font-semibold text-gray-800 mb-0.5">¿A quién transferís?</p>
              <p className="text-xs text-gray-400">Ingresa el ID de la cuenta destino</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">ID de cuenta destino</label>
              <input
                type="text"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={cuentaDestinoId}
                onChange={(e) => { setCuentaDestinoId(e.target.value); if (destinoError) setDestinoError(''); }}
                className={[
                  'w-full px-4 py-3 rounded-lg border text-sm text-gray-800 font-mono',
                  'placeholder:text-gray-400 bg-white outline-none transition-colors',
                  destinoError
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-[#1A7A4A] focus:ring-2 focus:ring-[#1A7A4A]/10',
                ].join(' ')}
              />
              {destinoError && <p className="text-xs text-red-500">{destinoError}</p>}
            </div>
            <button
              onClick={handleNextDestino}
              className="w-full py-3.5 rounded-xl bg-[#1A7A4A] text-white text-sm font-bold uppercase tracking-widest shadow-md shadow-[#1A7A4A]/25 hover:bg-[#145E38] active:scale-[0.98] transition-all"
            >
              Continuar
            </button>
          </div>
        )}

        {/* ── Step 2: Monto ────────────────────────────────────────────────── */}
        {step === 'monto' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <div>
              <p className="text-base font-semibold text-gray-800 mb-0.5">¿Cuánto querés enviar?</p>
              <p className="text-xs text-gray-400 font-mono truncate">→ {cuentaDestinoId}</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">Monto (ARS)</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={monto}
                onChange={(e) => { setMonto(e.target.value); if (montoError) setMontoError(''); }}
                className={[
                  'w-full px-4 py-3 rounded-lg border text-sm text-gray-800',
                  'placeholder:text-gray-400 bg-white outline-none transition-colors',
                  montoError
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-[#1A7A4A] focus:ring-2 focus:ring-[#1A7A4A]/10',
                ].join(' ')}
              />
              {montoError && <p className="text-xs text-red-500">{montoError}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">Descripción (opcional)</label>
              <input
                type="text"
                placeholder="Ej: Pago alquiler"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={100}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 bg-white outline-none focus:border-[#1A7A4A] focus:ring-2 focus:ring-[#1A7A4A]/10 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('destinatario')}
                className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                Atrás
              </button>
              <button
                onClick={handleNextMonto}
                className="flex-1 py-3.5 rounded-xl bg-[#1A7A4A] text-white text-sm font-bold uppercase tracking-widest shadow-md shadow-[#1A7A4A]/25 hover:bg-[#145E38] active:scale-[0.98] transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirmar ────────────────────────────────────────────── */}
        {step === 'confirmar' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <div>
              <p className="text-base font-semibold text-gray-800 mb-0.5">Confirmá la transferencia</p>
              <p className="text-xs text-gray-400">Revisá los datos antes de enviar</p>
            </div>

            {/* Summary rows */}
            <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4">
              {[
                { label: 'Destinatario', value: cuentaDestinoId, mono: true },
                {
                  label: 'Monto',
                  value: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(monto)),
                  mono: false,
                },
                { label: 'Descripción', value: descripcion.trim() || 'Transferencia', mono: false },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{row.label}</span>
                  <span className={['text-sm text-gray-800 font-medium break-all', row.mono ? 'font-mono' : ''].join(' ')}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {isError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{parseApiError(error)}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep('monto')}
                disabled={isPending}
                className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                Atrás
              </button>
              <button
                onClick={handleConfirmar}
                disabled={isPending}
                className={[
                  'flex-1 py-3.5 rounded-xl text-white text-sm font-bold uppercase tracking-widest',
                  'transition-all duration-200',
                  isPending
                    ? 'bg-[#1A7A4A]/60 cursor-not-allowed'
                    : 'bg-[#1A7A4A] hover:bg-[#145E38] active:scale-[0.98] shadow-md shadow-[#1A7A4A]/25',
                ].join(' ')}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Enviando…
                  </span>
                ) : (
                  'Confirmar'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
