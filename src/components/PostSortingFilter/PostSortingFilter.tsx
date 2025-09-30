import { ToggleGroup } from "radix-ui";
import "./PostSortingFilter.css";

type SortOption = "hot" | "new" | "top" | "rising" | "best";

interface PostSortingFilterProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
  options: SortOption[];
  disabled?: boolean;
}

export const PostSortingFilter = ({
  value,
  onValueChange,
  options,
  disabled,
}: PostSortingFilterProps) => {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(value: SortOption) => value && onValueChange(value)}
      className={`toggle-group flex flex-row justify-center md:justify-between min-w-[300px] ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label="Sort posts by"
    >
      {options.map((option) => (
        <ToggleGroup.Item
          value={option}
          className={`toggle-group-item ${disabled ? " cursor-not-allowed" : ""}`}
          title={`Sort posts by ${option}`}
          key={option}
          disabled={disabled}
        >
          {option}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};
