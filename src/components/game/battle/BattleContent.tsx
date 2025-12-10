import { Monster } from "@/types/game";
import { Scroll, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BattleContentProps {
  monster: Monster;
}

export function BattleContent({ monster }: BattleContentProps) {
  return (
    <div className="p-6 md:p-8 bg-[#151412] relative">
      <div className="bg-parchment p-6 md:p-10 rounded-sm shadow-xl relative transform md:-rotate-1 hover:rotate-0 transition-transform duration-500">
        
        {/* Selo de Cera */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-900 border-2 border-red-700 shadow-lg z-20 flex items-center justify-center">
          <div className="w-4 h-4 bg-red-950 rounded-full opacity-50" />
        </div>

        {/* Marca d'água */}
        <div className="absolute top-4 right-4 text-[#8b4513] opacity-20">
           <Scroll className="w-12 h-12" />
        </div>

        {/* Texto da Questão - AGORA LEGÍVEL (Sans Serif) */}
        <div className="
          prose prose-stone max-w-none 
          
          /* MUDANÇA AQUI: font-sans para leitura fácil */
          prose-p:font-sans prose-p:text-black 
          prose-p:text-lg md:prose-p:text-xl 
          prose-p:leading-relaxed prose-p:font-medium
          
          /* Mantemos os títulos Medievais/Cinzel para dar o clima */
          prose-headings:text-[#3f1d0b] prose-headings:font-[family-name:var(--font-cinzel)] prose-headings:font-black
          
          prose-strong:text-[#4a0404] prose-strong:font-bold
          prose-img:border-4 prose-img:border-[#57534e] prose-img:rounded-sm prose-img:shadow-md
          prose-table:border prose-table:border-[#57534e] prose-th:bg-[#d6d3d1] prose-th:p-3 prose-td:p-3 prose-td:text-lg
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {monster.fullText}
          </ReactMarkdown>
        </div>

        {/* Imagem Opcional */}
        {monster.imageUrl && (
          <div className="mt-8 border-4 border-[#57534e]/50 p-2 bg-white/40 rounded shadow-inner rotate-1 group">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={monster.imageUrl} 
                alt="Imagem da questão"
                className="w-full h-auto object-contain max-h-[400px] mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded text-white">
                <ImageIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}