import { Input } from "@/shared/ui/kit/input";

interface BoardsSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function BoardsSearchInput({ value, onChange }: BoardsSearchInputProps) {
  return (
    <Input
      id="search"
      placeholder="Enter board name..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  );
}
