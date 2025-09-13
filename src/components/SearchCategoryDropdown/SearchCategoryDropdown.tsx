import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "radix-ui";
import { useSearchStore } from "../../context/useSearchStore";
import "./SearchCategoryDropdown.css";

export const SearchCategoryDropdown = () => {
  const {
    searchCategory,
    setSearchCategory,
    setSearchOpen,
    dropdownOpen,
    setDropdownOpen,
  } = useSearchStore();

  return (
    <DropdownMenu.Root
      open={dropdownOpen}
      onOpenChange={(isOpen) => {
        setDropdownOpen(isOpen);
        setSearchOpen(isOpen);
      }}
    >
      <DropdownMenu.Trigger
        className="dropdown-trigger w-20 relative bg-transparent text-white font-bold cursor-pointer"
        asChild
      >
        <button
          className="text-white flex flex-row items-center justify-center gap-2 active:outline-none focus:outline-none"
          aria-label="Search category"
        >
          <ChevronDownIcon className="chevron w-4 h-4 translate-x-[-8px] text-[#ff4400]" />
          {searchCategory}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="dropdown-content w-fit bg-white text-[#ff4400] font-bold rounded-lg shadow-2xl mt-3 p-2 flex flex-col items-start "
          sideOffset={5}
          align="start"
        >
          <div
            className="absolute -z-0
            w-0 h-0
            border-l-[10px] border-l-transparent
            border-r-[10px] border-r-transparent
            border-b-[10px] border-b-white
            translate-x-[-5px] translate-y-[-16.5px]"
          ></div>
          <DropdownMenu.Item
            onClick={() => {
              setSearchCategory("u/");
            }}
            className="dropdown-item outline-none focus:outline-none py-1 cursor-pointer"
          >
            <span
              className={
                searchCategory === "u/" ? "text-[#ff4400]" : "text-[#ff4400a2]"
              }
            >
              u/ Users
            </span>
            {searchCategory === "u/" && (
              <CheckIcon className="w-4 h-4 translate-x-[6px] -translate-y-[2px] text-[#ff4400] inline" />
            )}
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="w-full h-px my-1 mx-auto bg-gray-200" />
          <DropdownMenu.Item
            onClick={() => {
              setSearchCategory("r/");
            }}
            className="dropdown-item outline-none focus:outline-none py-1 cursor-pointer"
          >
            <span
              className={
                searchCategory === "r/" ? "text-[#ff4400]" : "text-[#ff4400a2]"
              }
            >
              r/ Subreddit
            </span>
            {searchCategory === "r/" && (
              <CheckIcon className="w-4 h-4 translate-x-[6px] -translate-y-[2px] text-[#ff4400] inline" />
            )}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
