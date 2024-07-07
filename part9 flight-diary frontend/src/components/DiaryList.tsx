import { DiaryEntry } from "../types";

type DiaryListProps = {
  diaries: DiaryEntry[];
};

const DiaryList = (props: DiaryListProps) => {
  return (
    <>
      <h2>Diary entries</h2>
      {props.diaries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          <div>visibility: {entry.visibility}</div>
          <div>weather: {entry.weather}</div>
        </div>
      ))}
    </>
  );
};

export default DiaryList;
