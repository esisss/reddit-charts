import { ToggleGroup } from "radix-ui";
import "./PostSortingFilter.css";

type SortOption = "hot" | "new" | "top" | "rising" | "best";

interface PostSortingFilterProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
  options: SortOption[];
}

export const PostSortingFilter = ({
  value,
  onValueChange,
  options,
}: PostSortingFilterProps) => {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(value: SortOption) => value && onValueChange(value)}
      className="toggle-group flex flex-row justify-center md:justify-between min-w-[300px]"
      aria-label="Sort posts by"
    >
      {options.map((option) => (
        <ToggleGroup.Item
          value={option}
          className="toggle-group-item"
          title={`Sort posts by ${option}`}
          key={option}
        >
          {option}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};
