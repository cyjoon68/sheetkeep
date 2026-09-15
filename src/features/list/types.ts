export type CoverKey = "normal" | "large";

export type ExamChoice = {
  choiceId: string;
  label: string;
};

export type ExamQuestion = {
  questionId: string;
  prompt: string;
  choices: ExamChoice[];
};

export type ExamPaper = {
  examId: string;
  title: string;
  year: number;
  coverKey: CoverKey;
  durationMs: number;
  questions: ExamQuestion[];
};

export type ExamPage = {
  items: ExamPaper[];
  nextCursor: string | null;
};

export type ExamCatalogPort = {
  fetchPage: (input: { cursor: string | null; limit: number }) => Promise<ExamPage>;
  getById: (examId: string) => Promise<ExamPaper | null>;
};

export type SheetServerOptions = {
  papers?: ExamPaper[];
  pageSize?: number;
  duplicatePages?: number;
};

export type MergeExamPageResult = {
  papers: ExamPaper[];
  uniqueCount: number;
  nextSeen: Set<string>;
};

export type FetchUntilUniqueResult = {
  papers: ExamPaper[];
  cursor: string | null;
  fetches: number;
};

export type CoverDecoder = {
  markVisible: (examId: string) => void;
  markHidden: (examId: string) => void;
  syncVisible: (examIds: Iterable<string>) => void;
  isDecoding: (examId: string) => boolean;
  decodingCount: () => number;
};

export type Point = {
  x: number;
  y: number;
};
