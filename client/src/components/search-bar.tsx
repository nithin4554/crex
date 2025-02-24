import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <Input
        type="search"
        placeholder="Search matches by team or tournament..."
        value={query}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
}
