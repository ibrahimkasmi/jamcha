// src/features/notfound/screens/NotFoundScreen.tsx
import { NotFoundCard } from "../components/NotFoundCard/NotFoundCard";

// No memo - simple static screen
export const NotFoundScreen = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
    <NotFoundCard />
  </div>
);
