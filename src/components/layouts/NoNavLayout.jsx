import Navbar from './Navbar';

export default function NavLayout({ children }) {
  return (
    <div className="w-full h-full sm:h-[700px] relative flex flex-col">
      <main className="w-full h-full flex-1 min-h-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}