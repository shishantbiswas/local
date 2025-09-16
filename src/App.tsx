import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Data />
      </QueryClientProvider>
    </div>
  );
}

function Data(){
  const { data, isLoading, error } = useQuery({
    queryKey: ['lol'],
    queryFn: async () => {
      return fetch('http://localhost:3000/api').then(
        (res) => res.json(),
      );
    },
  });

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>{JSON.stringify(data)}</div>
      )}
    </div>
  );
}