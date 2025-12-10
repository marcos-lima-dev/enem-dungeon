import { Monster } from "@/types/game";

interface BattleOptionsProps {
  options: Monster['options'];
  selectedOption: string | null;
  onSelect: (optionId: string, isCorrect: boolean) => void;
}

export function BattleOptions({ options, selectedOption, onSelect }: BattleOptionsProps) {
  return (
    <div className="bg-[#0c0a09] p-6 border-t-4 border-[#292524]">
      <div className="grid gap-3">
        {options.map((opt) => {
          let btnClass = "btn-stone"; 
          let runeClass = "text-stone-500 border-stone-700 bg-[#151412]";

          if (selectedOption !== null) {
            if (opt.isCorrect) {
              btnClass = "btn-stone-correct ring-2 ring-green-400 ring-offset-2 ring-offset-black";
              runeClass = "text-green-200 border-green-500 bg-green-900";
            } else if (selectedOption === opt.id && !opt.isCorrect) {
              btnClass = "btn-stone-wrong opacity-90"; 
              runeClass = "text-red-200 border-red-500 bg-red-900";
            } else {
              btnClass = "btn-stone opacity-40 grayscale"; 
              runeClass = "text-stone-700 border-stone-800 bg-black";
            }
          }

          return (
            <button
              key={opt.id}
              disabled={selectedOption !== null}
              onClick={() => onSelect(opt.id, opt.isCorrect)}
              className={`
                w-full relative flex items-stretch text-left rounded-sm group transition-all duration-300
                ${btnClass}
              `}
            >
              {/* A Letra (A, B, C...) continua Medieval/Runica para estilo */}
              <div className={`
                w-16 flex-shrink-0 flex items-center justify-center border-r-2 font-bold text-2xl rune-box
                transition-colors duration-300 font-[family-name:var(--font-cinzel)]
                ${runeClass}
              `}>
                {opt.id}
              </div>
              
              <div className="p-4 flex-1 flex items-center">
                {/* AQUI ESTÁ A MUDANÇA CRUCIAL:
                   Trocamos 'font-medieval' por 'font-sans'.
                   Aumentamos a legibilidade com 'text-base md:text-lg' e 'leading-relaxed'.
                */}
                <span className="font-sans text-base md:text-lg leading-relaxed text-stone-200 group-hover:text-white transition-colors font-medium">
                  {opt.text}
                </span>
              </div>

              {!selectedOption && (
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay rounded-sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}