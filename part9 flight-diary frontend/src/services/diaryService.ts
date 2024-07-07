import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = `http://localhost:3000`;
const diaryUrl = `${baseUrl}/api/diaries`;

const getAll = async (): Promise<DiaryEntry[]> => {
  const res = await axios.get<DiaryEntry[]>(diaryUrl);
  return res.data;
};

const create = async (entry: NewDiaryEntry): Promise<DiaryEntry> => {
  const res = await axios.post<DiaryEntry>(diaryUrl, entry);
  return res.data;
};

export default { getAll, create };
