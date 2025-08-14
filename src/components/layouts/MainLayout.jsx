import Navbar from './Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="w-full h-[100dvh] md:h-[800px] relative">
      <main className="w-full">
        {children}
      </main>
      <Navbar />
    </div>
  );
}