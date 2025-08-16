import Navbar from './Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="w-full h-[100dvh] sm:h-[700px] relative">
      <main className="w-full">
        {children}
      </main>
      <Navbar />
    </div>
  );
}