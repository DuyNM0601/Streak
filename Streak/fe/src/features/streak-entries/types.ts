export type StreakEntry = {
  id: string;
  userId: string;
  checkInDate: string; // "yyyy-MM-dd"
  currentCount: number;
};

export type SearchStreakEntriesResult = {
  items: StreakEntry[];
  totalCount: number;
};
