"use client";

import { useCallback } from "react";

export function useGameSound() {
  
  const play = useCallback((soundName: 'hit' | 'miss' | 'win' | 'gameover') => {
    // Verifica se está no navegador
    if (typeof window !== 'undefined') {
      try {
        const audio = new Audio(`/sfx/${soundName}.mp3`);
        audio.volume = 0.4; // 40% de volume para não estourar o ouvido
        audio.play().catch((err) => {
          // Ignora erros de "autoplay blocked" comuns em navegadores
          console.warn("Áudio bloqueado pelo navegador:", err);
        });
      } catch (error) {
        console.error("Erro ao tocar som:", error);
      }
    }
  }, []);

  return {
    playHit: () => play('hit'),
    playMiss: () => play('miss'),
    playWin: () => play('win'),
    playGameOver: () => play('gameover'),
  };
}