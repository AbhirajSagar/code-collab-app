import Navbar from '@/components/common/Navbar';
import WorkspaceTabs from '@/components/home/WorkspaceTabs';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background-dark">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 font-extrabold text-4xl sm:text-6xl text-transparent bg-clip-text tracking-tight">
            Code Collab
          </h1>
          <p className="text-muted font-semibold text-lg sm:text-2xl">
            Realtime Peer-to-Peer Collaborative Coding
          </p>
          <p className="text-muted/70 text-xs sm:text-sm max-w-md mx-auto">
            Zero setup required. Create a workspace, share the ID with your team, and start coding together in real-time.
          </p>
        </div>

        <WorkspaceTabs />
      </main>
    </div>
  );
}