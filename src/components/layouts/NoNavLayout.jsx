import Navbar from './Navbar';

export default function NoNavLayout({ children }) {
  return (
    <div className="w-full h-full xs:h-[667px] relative flex flex-col">
      <main className="w-full h-full flex-1 min-h-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}