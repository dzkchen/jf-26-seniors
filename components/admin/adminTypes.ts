export type PrivateSurveyDoc = {
  id: string;
  grade11Avg?: number;
  grade12Preparedness?: number;
  sem1MidtermAvg?: number;
  sem1FinalAvg?: number;
  sem2MidtermAvg?: number;
  avgStudyTime?: number;
  allNighters?: number;
  exerciseFreq?: number;
  avgSleepTime?: number;
  avgScreenTime?: number;
  procrastinationFreq?: number;
  stressLevelSem1?: number;
  stressLevelSem2?: number;
  cohortFriendliness?: number;
  peerSupportLevel?: number;
  burnoutLevel?: number;
  clubsCount?: number;
  collegesAppliedCount?: number;
  intendedField?: string;
  favouriteCourse?: string;
  mostUsefulCourse?: string;
  mostDifficultCourse?: string;
  cohortDescriptionWords?: string;
  biggestHelpSucceeding?: string;
  redoGrade12Reflections?: string;
  adviceForG12s?: string;
  collegesAppliedList?: string;
};

export type PublicProfileDoc = {
  id: string;
  firstName?: string;
  lastName?: string;
  university?: string;
  major?: string;
  quote?: string;
  instagramHandle?: string;
  linkedinUrl?: string;
  isApproved?: boolean;
};

export const CSV_HEADERS = [
  "id",
  "grade11Avg",
  "grade12Preparedness",
  "sem1MidtermAvg",
  "sem1FinalAvg",
  "sem2MidtermAvg",
  "avgStudyTime",
  "allNighters",
  "exerciseFreq",
  "avgSleepTime",
  "avgScreenTime",
  "procrastinationFreq",
  "stressLevelSem1",
  "stressLevelSem2",
  "cohortFriendliness",
  "peerSupportLevel",
  "burnoutLevel",
  "clubsCount",
  "collegesAppliedCount",
  "favouriteCourse",
  "mostUsefulCourse",
  "mostDifficultCourse",
  "intendedField",
  "collegesAppliedList",
  "cohortDescriptionWords",
  "biggestHelpSucceeding",
  "redoGrade12Reflections",
  "adviceForG12s",
] as const;

type GridField =
  | { label: string; key: keyof PrivateSurveyDoc }
  | { label: string; keys: [keyof PrivateSurveyDoc, keyof PrivateSurveyDoc] };

export const RESPONSE_GRID_FIELDS: GridField[] = [
  { label: "Grade 11 avg:", key: "grade11Avg" },
  { label: "G12 preparedness (1–5):", key: "grade12Preparedness" },
  { label: "Sem1 midterm/final:", keys: ["sem1MidtermAvg", "sem1FinalAvg"] },
  { label: "Sem2 midterm:", key: "sem2MidtermAvg" },
  { label: "Study hrs / day (avg):", key: "avgStudyTime" },
  { label: "All nighters:", key: "allNighters" },
  { label: "Exercise / week:", key: "exerciseFreq" },
  { label: "Sleep hrs / night:", key: "avgSleepTime" },
  { label: "Screen hrs / day:", key: "avgScreenTime" },
  { label: "Procrastination (1–5):", key: "procrastinationFreq" },
  { label: "Stress Sem1 (1–5):", key: "stressLevelSem1" },
  { label: "Stress Sem2 (1–5):", key: "stressLevelSem2" },
  { label: "Cohort friendliness (1–5):", key: "cohortFriendliness" },
  { label: "Peer support (1–5):", key: "peerSupportLevel" },
  { label: "Burnout (1–5):", key: "burnoutLevel" },
  { label: "Clubs/teams count:", key: "clubsCount" },
  { label: "Applications submitted:", key: "collegesAppliedCount" },
  { label: "Fav course:", key: "favouriteCourse" },
  { label: "Most useful:", key: "mostUsefulCourse" },
  { label: "Most difficult:", key: "mostDifficultCourse" },
  { label: "Intended field:", key: "intendedField" },
];

export const RESPONSE_LONG_FIELDS: { label: string; key: keyof PrivateSurveyDoc }[] = [
  { label: "Cohort in 1–2 words:", key: "cohortDescriptionWords" },
  { label: "Biggest thing that helped:", key: "biggestHelpSucceeding" },
  { label: "If you could redo G12:", key: "redoGrade12Reflections" },
  { label: "Advice for incoming G12s:", key: "adviceForG12s" },
];
