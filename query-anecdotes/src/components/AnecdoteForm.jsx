import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote, voteAnecdote } from "../requests";
import {
  createNotification,
  useNotificationDispatch,
} from "../NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
      createNotification(
        `added '${newAnecdote.content}'`,
        notificationDispatch
      );
    },
    onError: () => {
      createNotification(
        `too short anecdote, must have length 5 or more`,
        notificationDispatch
      );
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
