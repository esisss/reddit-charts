import * as ToggleGroup from "@radix-ui/react-toggle-group";
import "./PostSortingFilter.css";

type SortOption = "hot" | "new" | "top" | "rising" | "best";

interface PostSortingFilterProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
}

export const PostSortingFilter = ({
  value,
  onValueChange,
}: PostSortingFilterProps) => {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(value: SortOption) => value && onValueChange(value)}
      className="toggle-group"
      aria-label="Sort posts by"
    >
      <ToggleGroup.Item
        value="hot"
        className="toggle-group-item"
        title="Hot posts"
      >
        Hot
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="new"
        className="toggle-group-item"
        title="New posts"
      >
        New
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="top"
        className="toggle-group-item"
        title="Top posts"
      >
        Top
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="rising"
        className="toggle-group-item"
        title="Rising posts"
      >
        Rising
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="best"
        className="toggle-group-item"
        title="Best posts"
      >
        Best
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
