import { useEffect, useState } from "react";
import { DiaryEntry } from "./types";
import diaryService from "./services/diaryService";
import DiaryList from "./components/DiaryList";
import DiaryForm from "./components/DiaryForm";

function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    diaryService.getAll().then((diaries) => {
      setEntries(diaries);
    });
  }, []);

  return (
    <>
      <DiaryForm setEntries={setEntries} />
      <DiaryList diaries={entries} />
    </>
  );
}

export default App;
