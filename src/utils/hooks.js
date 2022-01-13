import { useLocation } from 'react-router-dom';
import { useFetch } from 'use-http';

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const useStoryJson = (id) => {
  const cacheBust = Date.now().toString(36);
  return useFetch(`/stories/story-${id}.json?_c=${cacheBust}`, {}, []);
};
