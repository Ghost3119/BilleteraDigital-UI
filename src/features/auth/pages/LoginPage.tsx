import LoginForm from '../components/LoginForm';

/**
 * LoginPage — public route rendered at /login.
 *
 * Layout mirrors the mockup:
 *  - Off-white (#F5F5F5) full-screen background
 *  - White card centred vertically with generous padding
 *  - Max-width of 430px (mobile viewport width from the mockup)
 *  - Rounded corners and a subtle shadow
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[430px] bg-white rounded-2xl shadow-sm border border-gray-100 px-7 py-8">
        <LoginForm />
      </div>
    </div>
  );
}
