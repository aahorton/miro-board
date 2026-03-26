import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/kit/select";

export type BoardsSortOption =
  | "createdAt"
  | "updatedAt"
  | "lastOpenedAt"
  | "name";

interface BoardsSortSelectProps {
  value: BoardsSortOption;
  onValueChange: (value: BoardsSortOption) => void;
}

export function BoardsSortSelect({
  value,
  onValueChange,
}: BoardsSortSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id="sort" className="w-full">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="lastOpenedAt">By last opened date</SelectItem>
        <SelectItem value="createdAt">By creation date</SelectItem>
        <SelectItem value="updatedAt">By update date</SelectItem>
        <SelectItem value="name">By name</SelectItem>
      </SelectContent>
    </Select>
  );
}
