import { create } from 'zustand';
import type { Blip } from '.';

type RadarState = {
  currentBlip?: Blip;
  highlightedBlip?: Blip;
  selectBlip: (blip?: Blip) => void;
  highlightBlip: (blip?: Blip) => void;
};

export const useRadarStore = create<RadarState>((set) => ({
  currentBlip: undefined,
  highlightedBlip: undefined,
  selectBlip: (blip) => set({ currentBlip: blip }),
  highlightBlip: (blip) => set({ highlightedBlip: blip }),
}));
