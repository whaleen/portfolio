import { useEffect, useState } from "react";
import Papa from "papaparse";
import type { Project } from "@/types/project";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/src/data/projects.csv");
      const text = await response.text();

      Papa.parse<Project>(text, {
        header: true,
        complete: (results) => {
          setProjects(results.data.filter((p) => p.Repo)); // Filter out empty rows
          setLoading(false);
        },
        error: (error: Error) => {
          setError(error.message);
          setLoading(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error, refresh: fetchProjects };
};

export const useFeaturedProjects = () => {
  const { projects, loading, error } = useProjects();
  const featuredProjects = projects.filter((p) => p["Featured Project"] === "yes");
  return { projects: featuredProjects, loading, error };
};

export const useResumeWorthyProjects = () => {
  const { projects, loading, error } = useProjects();
  const resumeWorthy = projects.filter((p) => p["Resume Worthy"] === "yes");
  return { projects: resumeWorthy, loading, error };
};
