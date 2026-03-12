import { Outlet } from 'react-router-dom';
import BottomNav from '../components/ui/BottomNav';

/**
 * AppLayout — authenticated shell.
 * Renders the current child route in a scrollable <main> and a persistent
 * bottom navigation bar via the shared <BottomNav> component.
 * Max-width 430px to match the mobile mockup viewport.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex justify-center overflow-x-hidden">
      <div className="relative w-full max-w-[430px] flex flex-col min-h-screen bg-[#F5F5F5] overflow-x-hidden">

        {/* Page content — scrollable, leaves room for the fixed tab bar */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[72px]">
          <Outlet />
        </main>

        <BottomNav />

      </div>
    </div>
  );
}
