import type { Metadata } from "next";
// Importamos as fontes medievais aqui
import { Cinzel, MedievalSharp } from "next/font/google";
import "./globals.css";
// O Toaster é vital para o feedback do jogo (Avisar que acertou/errou)
import { Toaster } from "@/components/ui/sonner";

// Configuração da Fonte de Títulos (Épica)
const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700", "900"] // Pesos para dar destaque
});

// Configuração da Fonte de Texto (Leitura, mas com estilo antigo)
const medieval = MedievalSharp({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-medieval"
});

export const metadata: Metadata = {
  title: "ENEM Dungeon",
  description: "Gamificação de estudos para o ENEM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Injetamos as variáveis das fontes no HTML
    <html lang="pt-br" className={`${cinzel.variable} ${medieval.variable}`}>
      <body 
        // Fundo bem escuro (slate-950) e texto claro (slate-100)
        className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen selection:bg-purple-500/30"
        suppressHydrationWarning={true}
      >
        {/* Efeito de vinheta (escurecer as bordas da tela) */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]" />
        
        {/* O Jogo em si */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Notificações (Sonner) */}
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}