import { z } from "zod";

export const surveySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  university: z.string().min(1, "University is required"),
  major: z.string().min(1, "Intended major/program is required"),
  quote: z
    .string()
    .max(100, "Quote must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  instagramHandle: z.string().optional().or(z.literal("")),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  // Demographics
  gender: z.string().min(1, "Selection is required"),
  ethnicity: z.string().min(1, "Selection is required"),
  religion: z.string().min(1, "Selection is required"),
  originalHomeSchool: z.string().min(1, "Selection is required"),
  specializedPrograms: z.string().min(1, "Selection is required"),

  // Academic background
  grade11Avg: z.coerce.number().min(0).max(100),
  grade12Preparedness: z.coerce.number().min(1).max(5),
  sem1MidtermAvg: z.coerce.number().min(0).max(100),
  sem1FinalAvg: z.coerce.number().min(0).max(100),
  sem2MidtermAvg: z.coerce.number().min(0).max(100),
  favouriteCourse: z.string().min(1, "Required"),
  mostUsefulCourse: z.string().min(1, "Required"),
  mostDifficultCourse: z.string().min(1, "Required"),

  // Lifestyle & habits
  avgStudyTime: z.coerce.number().min(0).max(12),
  allNighters: z.coerce.number().min(0),
  exerciseFreq: z.coerce.number().min(0).max(7),
  avgSleepTime: z.coerce.number().min(4).max(12),
  avgScreenTime: z.coerce.number().min(0).max(18),
  procrastinationFreq: z.coerce.number().min(1).max(5),

  // Wellbeing
  stressLevelSem1: z.coerce.number().min(1).max(5),
  stressLevelSem2: z.coerce.number().min(1).max(5),
  cohortFriendliness: z.coerce.number().min(1).max(5),
  peerSupportLevel: z.coerce.number().min(1).max(5),
  burnoutLevel: z.coerce.number().min(1).max(5),
  clubsCount: z.coerce.number().min(0),
  specificClubs: z.string().optional().or(z.literal("")),

  // Post-secondary plans
  intendedField: z.string().min(1, "Field is required"),
  collegesAppliedCount: z.coerce.number().min(0),
  collegesAppliedList: z.string().optional().or(z.literal("")),

  // Reflection
  cohortDescriptionWords: z.string().min(1, "Required"),
  biggestHelpSucceeding: z.string().min(1, "Required"),
  redoGrade12Reflections: z.string().min(1, "Required"),
  adviceForG12s: z.string().min(1, "Required"),
  gladCameToFraser: z.string().min(1, "Required"),
});

export type SurveyFormValues = z.infer<typeof surveySchema>;

export const steps = [
  { id: 1, label: "Profile & Academics" },
  { id: 2, label: "Habits & Wellbeing" },
  { id: 3, label: "Post-Secondary & Reflection" },
  { id: 4, label: "Review & Submit" },
] as const;

export type FieldName = keyof SurveyFormValues;

export const stepFieldGroups: Record<number, FieldName[]> = {
  1: [
    "firstName",
    "lastName",
    "university",
    "major",
    "quote",
    "instagramHandle",
    "linkedinUrl",
    "gender",
    "ethnicity",
    "religion",
    "originalHomeSchool",
    "specializedPrograms",
    "grade11Avg",
    "grade12Preparedness",
    "sem1MidtermAvg",
    "sem1FinalAvg",
    "sem2MidtermAvg",
    "favouriteCourse",
    "mostUsefulCourse",
    "mostDifficultCourse",
  ],
  2: [
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
    "specificClubs",
  ],
  3: [
    "intendedField",
    "collegesAppliedCount",
    "collegesAppliedList",
    "cohortDescriptionWords",
    "biggestHelpSucceeding",
    "redoGrade12Reflections",
    "adviceForG12s",
    "gladCameToFraser",
  ],
  4: [],
};

export const COLLEGE_OPTIONS = [
  "UBC",
  "McGill",
  "University of Alberta",
  "US School",
  "University of Toronto",
  "University of Waterloo",
  "McMaster",
  "Western (UWO)",
  "Queen's",
  "University of Ottawa",
  "York",
  "TMU",
  "University of Guelph",
  "Carleton",
  "Wilfrid Laurier",
  "Other",
] as const;

