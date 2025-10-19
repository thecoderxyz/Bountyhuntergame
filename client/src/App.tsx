import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Import 'SlotMachine' WITHOUT curly braces {}
import SlotMachine from "./components/SlotMachine";
import "@fontsource/inter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/*
        FIX 1: This is the main page layout.
        - 'h-screen': Fills the entire screen.
        - 'flex flex-col': Creates a vertical layout.
      */}
      <div className="relative min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 flex flex-col">

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+CjwvZz4KPC9nPgo8L3N2Zz4=')] repeat"></div>
        </div>

        {/*
          FIX 2: The Header is "pinned" to the top.
          - 'flex-shrink-0': Prevents it from shrinking.
        */}
        <header className="relative z-10 text-center py-3 sm:py-4 md:py-6 px-2 flex-shrink-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-100 drop-shadow-lg tracking-wider">
            BOUNTY HUNTER
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 mt-1 sm:mt-2 drop-shadow">
            Provably Fair Wild West Slots
          </p>
        </header>

        {/*
          FIX 3: The Main content area holds the slot machine.
          - 'flex-grow': Fills all remaining vertical space.
          - 'overflow-y-auto': Makes *only this area* scrollable.
          - 'items-start': Aligns the slot machine to the top (no vertical centering).
          THIS IS WHAT STOPS THE PAGE JUMP.
        */}
        <main className="relative z-10 flex-grow overflow-y-auto flex items-start justify-center px-2 sm:px-4 pb-4 sm:pb-6 md:pb-8">
          <SlotMachine />
        </main>
      </div>
    </QueryClientProvider>
  );
}

// Use 'export default' to match the import
export default App;