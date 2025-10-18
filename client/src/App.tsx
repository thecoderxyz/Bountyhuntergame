import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SlotMachine } from "./components/SlotMachine";
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
      <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 overflow-x-hidden">
        {/* Wild West Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+CjwvZz4KPC9nPgo8L3N2Zz4=')] repeat"></div>
        </div>

        {/* Saloon Header */}
        <div className="relative z-10 text-center py-3 sm:py-4 md:py-6 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-100 drop-shadow-lg tracking-wider">
            🤠 BOUNTY HUNTER'S CALL 🤠
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-200 mt-1 sm:mt-2 drop-shadow">
            Provably Fair Wild West Slots
          </p>
        </div>

        {/* Main Slot Machine */}
        <div className="flex items-center justify-center px-2 sm:px-4 pb-4 sm:pb-6 md:pb-8">
          <SlotMachine />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
