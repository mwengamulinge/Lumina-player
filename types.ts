
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number; // in seconds
  genre: string;
  audioUrl: string; // Used as the primary source URL for both audio and video
  isLocal?: boolean;
  mediaType?: 'audio' | 'video';
}

export interface AIAnalysis {
  mood: string;
  description: string;
  colorPalette: string[];
  visualPrompt: string;
}
