import { useState } from "react";
import diaryService from "../services/diaryService";
import { DiaryEntry, Visibility, Weather } from "../types";
import { isAxiosError } from "axios";

type DiaryFormProps = {
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
};

const inline: React.CSSProperties = { display: "inline" };

const DiaryForm = (props: DiaryFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    try {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const newEntry = {
        date: form.date.value,
        visibility: form.visibility.value,
        weather: form.weather.value,
        comment: form.comment.value,
      };
      console.log("creating:", newEntry);
      const createdEntry = await diaryService.create(newEntry);
      form.reset();
      console.log("created:", createdEntry);
      props.setEntries((entries) => entries.concat(createdEntry));
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.response);
        showError(error.response?.data);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          date
          <input type="date" name="date" />
        </div>
        <div>
          visibility
          {Object.values(Visibility).map((v) => (
            <div key={v} style={inline}>
              <input type="radio" id={v} name="visibility" value={v} />
              <label htmlFor={v}>{v}</label>
            </div>
          ))}
        </div>
        <div>
          weather
          {Object.values(Weather).map((v) => (
            <div key={v} style={inline}>
              <input type="radio" id={v} name="weather" value={v} />
              <label htmlFor={v}>{v}</label>
            </div>
          ))}
        </div>
        <div>
          comment
          <input name="comment" />
        </div>
        <button>add</button>
      </form>
    </div>
  );
};

export default DiaryForm;
