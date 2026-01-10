
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number; // in seconds
  genre: string;
  audioUrl: string;
  isLocal?: boolean;
}

export interface AIAnalysis {
  mood: string;
  description: string;
  colorPalette: string[];
  visualPrompt: string;
}
