import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MAX_EMPTY_UNIQUE_FETCHES, PAGE_SIZE } from "./constants";
import { createCoverDecoder } from "./cover-decoder";
import { fetchUntilUnique } from "./fetch-until-unique";
import type { CoverDecoder, ExamCatalogPort, ExamPaper } from "./types";

export const useExamList = ({ catalog }: { catalog: ExamCatalogPort }): {
  papers: ExamPaper[];
  loading: boolean;
  loadMore: () => Promise<void>;
  decoder: CoverDecoder;
} => {
  const [papers, setPapers] = useState<ExamPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const seenIds = useRef(new Set<string>());
  const cursor = useRef<string | null>(null);
  const loadingRef = useRef(false);
  const hasMore = useRef(true);
  const decoder = useMemo(() => createCoverDecoder(), []);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore.current) {
      return;
    }
    loadingRef.current = true;
    setLoading(true);
    const result = await fetchUntilUnique({
      catalog,
      seenIds: seenIds.current,
      cursor: cursor.current,
      limit: PAGE_SIZE,
      maxFetches: MAX_EMPTY_UNIQUE_FETCHES,
    });
    result.papers.forEach((paper) => seenIds.current.add(paper.examId));
    cursor.current = result.cursor;
    hasMore.current = result.cursor !== null;
    setPapers((current) => [...current, ...result.papers]);
    loadingRef.current = false;
    setLoading(false);
  }, [catalog]);

  useEffect(() => {
    void loadMore();
  }, [loadMore]);

  return {
    papers,
    loading,
    loadMore,
    decoder,
  };
};
