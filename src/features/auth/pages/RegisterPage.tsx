import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[430px] bg-white rounded-2xl shadow-sm border border-gray-100 px-7 py-8">
        <RegisterForm />
      </div>
    </div>
  );
}
