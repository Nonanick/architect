import type { SVGImageProps } from '../../SVGImageProps';

export interface IconButtonProps {
  label? : string;
  showLabel? : boolean;
  icon : SVGImageProps;
  onClick?: (ev : MouseEvent) => void;
}