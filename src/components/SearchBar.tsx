interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full rounded-full border-2 flex flex-row border-[#ff4400] px-5 py-3">
        <h1 className="mr-2">r/</h1>
        <input
          type="text"
          placeholder="Search"
          value={value}
          onChange={onChange}
          className="w-full active:outline-none focus:outline-none bg-transparent"
        />
      </div>
    </div>
  );
};
