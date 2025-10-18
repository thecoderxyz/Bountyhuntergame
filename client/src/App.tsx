import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SlotMachine } from "./components/SlotMachine";
import "@fontsource/inter"; // Ensures the font is loaded

// Initialize the React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents refetching when window is refocused
      staleTime: Infinity,       // Data is never considered stale
      retry: false,                // Don't retry failed queries
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/*
        FIX: Removed 'overflow-x-hidden'.
        This is now handled globally and more effectively
        by 'overflow-x: clip' on the #root element in your index.css.
      */}
      <div className="relative min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900">

        {/* Wild West Background Pattern (decorative) */}
        {/* Added pointer-events-none so it cannot be interacted with */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* This is a subtle dot pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+CjwvZz4KPC9nPgo8L3N2Zz4=')] repeat"></div>
        </div>

        {/* Saloon Header */}
        {/* This content is correctly using responsive prefixes (sm:, md:, lg:) */}
        <div className="relative z-10 text-center py-3 sm:py-4 md:py-6 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-100 drop-shadow-lg tracking-wider">
            BOUNTY HUNTER
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 mt-1 sm:mt-2 drop-shadow">
            Provably Fair Wild West Slots
          </p>
        </div>

        {/* Main Slot Machine */}
        {/* Added relative z-10 to ensure it's stacked above the background */}
        <div className="relative z-10 flex items-center justify-center px-2 sm:px-4 pb-4 sm:pb-6 md:pb-8">
          <SlotMachine />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;