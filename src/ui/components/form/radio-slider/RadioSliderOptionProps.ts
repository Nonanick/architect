export interface RadioSliderOptionProps {
  label: string;
  value: string;
  icon: string;
  active_color?: string | {
    bg: string;
    fg: string;
  };
  option_radius?: string;
};