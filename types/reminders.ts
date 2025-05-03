export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  completed: boolean;
  noteId?: string;
}