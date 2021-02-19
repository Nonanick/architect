import type { SvelteComponent } from 'svelte';
import { writable, Writable } from 'svelte/store';
import type { SVGImageProps } from '../components/SVGImageProps';

const ModalWindows: Writable<ModalWindowProp[]> = writable<ModalWindowProp[]>([]);

export interface ModalWindowProp {
  title: string;
  icon?: string | SVGImageProps;
  windowControls?: ModalWindowControl | ModalWindowControl[],
  draggable?: boolean,
  size?: ModalWindowSize;
  position?: ModalWindowPosition;
  content: typeof SvelteComponent;
  onOpen?: () => void;
  onClose?: () => void;
}

export type ModalWindowControl =
  | 'close'
  | 'maximize'
  | 'minimize'
  | {
    icon: SVGImageProps;
    label: string;
    onClick: () => void;
    onCreate?: (window: HTMLDivElement, content: typeof SvelteComponent) => void;
  };

export type ModalWindowSize =
  | 'fullscreen'
  | 'halfscreen'
  | {
    width: number | string,
    height: number | string
  };

export type ModalWindowPosition =
  | 'center'
  | 'top-center'
  | 'bottom-center'
  | 'left-center'
  | 'right-center'
  | {
    x: string | number;
    y: string | number;
  };

export default {
  subscribe: ModalWindows.subscribe,
  add: (modal: ModalWindowProp) => {
    return modal;
  },
  remove: (modal: ModalWindowProp) => {

  },
  empty : () => {

  }
}