import Navbar from './Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="w-full sm:h-[700px] relative flex flex-col">
      <main className="w-full flex-1 min-h-0 overflow-y-auto">
        {children}
      </main>
      <div className="h-[68px] shrink-0">
        <Navbar />
      </div>
    </div>
  );
}