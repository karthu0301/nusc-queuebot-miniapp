
import { TelegramWebApp } from "../components/TelegramWebApp";

// Declare global Telegram WebApp interfaces 
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TelegramWebApp />
    </div>
  );
};

export default Index;
