"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/firebase.config";
import { useAuth } from "@/components/auth/AuthProvider";
import { doc, setDoc, updateDoc } from "firebase/firestore";

const surveySchema = z.object({
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

type SurveyFormValues = z.infer<typeof surveySchema>;

const steps = [
  { id: 1, label: "Profile & Academics" },
  { id: 2, label: "Habits & Wellbeing" },
  { id: 3, label: "Post-Secondary & Reflection" },
  { id: 4, label: "Review & Submit" },
] as const;

type FieldName = keyof SurveyFormValues;

const stepFieldGroups: Record<number, FieldName[]> = {
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

export function MultiStepSurveyForm() {
  const { user } = useAuth();
  const router = useRouter();
  const methods = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      university: "",
      major: "",
      quote: "",
      instagramHandle: "",
      linkedinUrl: "",
      gender: "",
      ethnicity: "",
      religion: "",
      originalHomeSchool: "",
      specializedPrograms: "",
      grade11Avg: 0,
      grade12Preparedness: 3,
      sem1MidtermAvg: 0,
      sem1FinalAvg: 0,
      sem2MidtermAvg: 0,
      favouriteCourse: "",
      mostUsefulCourse: "",
      mostDifficultCourse: "",
      avgStudyTime: 0,
      allNighters: 0,
      exerciseFreq: 0,
      avgSleepTime: 7,
      avgScreenTime: 0,
      procrastinationFreq: 3,
      stressLevelSem1: 3,
      stressLevelSem2: 3,
      cohortFriendliness: 3,
      peerSupportLevel: 3,
      burnoutLevel: 3,
      clubsCount: 0,
      specificClubs: "",
      intendedField: "",
      collegesAppliedCount: 0,
      collegesAppliedList: "",
      cohortDescriptionWords: "",
      biggestHelpSucceeding: "",
      redoGrade12Reflections: "",
      adviceForG12s: "",
      gladCameToFraser: "",
    },
    mode: "onChange",
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [draftSavedMessage, setDraftSavedMessage] = useState<string | null>(
    null
  );

  const draftKey =
    typeof window !== "undefined" && user
      ? `jfss_survey_draft_${user.uid}`
      : null;

  useEffect(() => {
    if (!user || !draftKey) return;
    try {
      const raw = window.localStorage.getItem(draftKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<SurveyFormValues>;
      methods.reset({ ...methods.getValues(), ...parsed });
    } catch {

    }
  }, [user, draftKey, methods]);

  useEffect(() => {
    if (!user || !draftKey) return;
    const id = window.setInterval(() => {
      const values = methods.getValues();
      try {
        window.localStorage.setItem(draftKey, JSON.stringify(values));
      } catch {

      }
    }, 15000);
    return () => window.clearInterval(id);
  }, [user, draftKey, methods]);

  const nextStep = async () => {
    const fields = stepFieldGroups[step] ?? [];
    const valid = fields.length ? await methods.trigger(fields) : true;
    if (!valid) return;
    setStep((s) => Math.min(4, s + 1));
  };

  const saveDraft = () => {
    if (!draftKey) return;
    const values = methods.getValues();
    try {
      window.localStorage.setItem(draftKey, JSON.stringify(values));
      setDraftSavedMessage("Saved locally. You can safely come back later.");
    } catch {
      setDraftSavedMessage(
        "Unable to save draft locally (storage is full or disabled)."
      );
    }
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = async (values: SurveyFormValues) => {
    if (!user) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const uid = user.uid;

      const {
        firstName,
        lastName,
        university,
        major,
        quote,
        instagramHandle,
        linkedinUrl,
        gender,
        ethnicity,
        religion,
        originalHomeSchool,
        specializedPrograms,
        grade11Avg,
        grade12Preparedness,
        sem1MidtermAvg,
        sem1FinalAvg,
        sem2MidtermAvg,
        favouriteCourse,
        mostUsefulCourse,
        mostDifficultCourse,
        avgStudyTime,
        allNighters,
        exerciseFreq,
        avgSleepTime,
        avgScreenTime,
        procrastinationFreq,
        stressLevelSem1,
        stressLevelSem2,
        cohortFriendliness,
        peerSupportLevel,
        burnoutLevel,
        clubsCount,
        specificClubs,
        intendedField,
        collegesAppliedCount,
        collegesAppliedList,
        cohortDescriptionWords,
        biggestHelpSucceeding,
        redoGrade12Reflections,
        adviceForG12s,
        gladCameToFraser,
      } = values;

      await setDoc(
        doc(db, "public_profiles", uid),
        {
          firstName,
          lastName,
          university,
          major,
          quote: quote || "",
          instagramHandle: instagramHandle || "",
          linkedinUrl: linkedinUrl || "",
          isApproved: false,
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "private_survey", uid),
        {
          gender,
          ethnicity,
          religion,
          originalHomeSchool,
          specializedPrograms,
          grade11Avg,
          grade12Preparedness,
          sem1MidtermAvg,
          sem1FinalAvg,
          sem2MidtermAvg,
          favouriteCourse,
          mostUsefulCourse,
          mostDifficultCourse,
          avgStudyTime,
          allNighters,
          exerciseFreq,
          avgSleepTime,
          avgScreenTime,
          procrastinationFreq,
          stressLevelSem1,
          stressLevelSem2,
          cohortFriendliness,
          peerSupportLevel,
          burnoutLevel,
          clubsCount,
          specificClubs: specificClubs || "",
          intendedField,
          collegesAppliedCount,
          collegesAppliedList: collegesAppliedList || "",
          cohortDescriptionWords,
          biggestHelpSucceeding,
          redoGrade12Reflections,
          adviceForG12s,
          gladCameToFraser,
        },
        { merge: true }
      );

      await updateDoc(doc(db, "users", uid), {
        hasCompletedSurvey: true,
      });

      setSubmitSuccess(true);
      router.replace("/thanks");
    } catch (e) {
      console.error(e);
      setSubmitError(
        "Something went wrong while submitting. Please try again, and contact david @zkc.david if it persists."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full max-w-3xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-2 text-sm font-medium text-muted-foreground">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-1 ${step === s.id ? "text-primary" : ""
                  }`}
              >
                <span className="inline-flex size-6 items-center justify-center rounded-full border text-xs">
                  {s.id}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Step {step} of {steps.length}
          </span>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {step === 1 && <StepProfileAndAcademics />}
          {step === 2 && <StepHabitsAndWellbeing />}
          {step === 3 && <StepPostSecondaryAndReflection />}
          {step === 4 && <ReviewStep />}
        </motion.div>

        <div className="space-y-2 text-left">
          {draftSavedMessage && (
            <p className="text-xs text-muted-foreground">{draftSavedMessage}</p>
          )}
          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}
          {submitSuccess && (
            <p className="text-sm text-emerald-600">
              Your time capsule has been submitted. Thank you!
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={saveDraft}
            disabled={submitting}
          >
            Save for later
          </Button>
          {step < 4 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function TextField({
  name,
  label,
  helper,
  type = "text",
}: {
  name: FieldName;
  label: string;
  helper?: string;
  type?: string;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1 text-left">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {helper && !error && (
        <p className="text-xs text-muted-foreground">{helper}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
}: {
  name: FieldName;
  label: string;
  options: { value: string; label: string }[];
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1 text-left">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <select
        {...register(name)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function NumberField({
  name,
  label,
  helper,
  min,
  max,
}: {
  name: FieldName;
  label: string;
  helper?: string;
  min?: number;
  max?: number;
}) {
  return (
    <TextField
      name={name}
      label={label}
      helper={helper ?? (min !== undefined && max !== undefined ? `Range ${min}-${max}` : undefined)}
      type="number"
    />
  );
}

function TextAreaField({
  name,
  label,
  helper,
}: {
  name: FieldName;
  label: string;
  helper?: string;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1 text-left">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <textarea
        rows={3}
        {...register(name)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
      />
      {helper && !error && (
        <p className="text-xs text-muted-foreground">{helper}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const COLLEGE_OPTIONS = [
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

function CollegesCheckboxGroup() {
  const { watch, setValue } = useFormContext<SurveyFormValues>();
  const current = (watch("collegesAppliedList") ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  const toggle = (label: (typeof COLLEGE_OPTIONS)[number]) => {
    const exists = current.includes(label);
    const next = exists
      ? current.filter((v) => v !== label)
      : [...current, label];
    setValue("collegesAppliedList", next.join(", "));
  };

  return (
    <div className="space-y-2 text-left">
      <p className="text-sm font-medium text-foreground">
        What colleges/universities did you apply to?
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {COLLEGE_OPTIONS.map((label) => {
          const checked = current.includes(label);
          return (
            <label
              key={label}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                className="size-4 rounded border border-input"
                checked={checked}
                onChange={() => toggle(label)}
              />
              <span>{label}</span>
            </label>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        You can select multiple schools. We store them as a comma-separated list.
      </p>
    </div>
  );
}

function StepProfileAndAcademics() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#15375c]">
        Staying Connected Card
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField name="firstName" label="First name" />
        <TextField name="lastName" label="Last name" />
        <TextField name="university" label="University" />
        <TextField name="major" label="Intended major/program" />
        <TextField
          name="quote"
          label="Grad quote (optional)"
          helper="Max 100 characters."
        />
        <TextField
          name="instagramHandle"
          label="Instagram (optional)"
          helper="@handle"
        />
        <TextField
          name="linkedinUrl"
          label="LinkedIn URL (optional)"
          helper="Include https://"
        />
      </div>

      <h2 className="text-lg font-semibold text-[#15375c]">Demographics</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField name="gender" label="Gender" />
        <TextField name="ethnicity" label="Ethnicity" />
        <TextField name="religion" label="Religion" />
        <SelectField
          name="originalHomeSchool"
          label="Is John Fraser your original home school?"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        <SelectField
          name="specializedPrograms"
          label="Are you in specialized programs?"
          options={[
            { value: "none", label: "None" },
            { value: "shsm", label: "SHSM" },
            { value: "ap", label: "AP" },
            { value: "both", label: "Both SHSM and AP" },
          ]}
        />
      </div>

      <h2 className="text-lg font-semibold text-[#15375c]">
        Academic Background
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <NumberField
          name="grade11Avg"
          label="Grade 11 average"
          min={0}
          max={100}
        />
        <NumberField
          name="grade12Preparedness"
          label="How prepared did you feel for Grade 12 (1–5)"
          min={1}
          max={5}
        />
        <NumberField
          name="sem1MidtermAvg"
          label="Semester 1 midterm average"
          min={0}
          max={100}
        />
        <NumberField
          name="sem1FinalAvg"
          label="Semester 1 final average"
          min={0}
          max={100}
        />
        <NumberField
          name="sem2MidtermAvg"
          label="Semester 2 midterm average"
          min={0}
          max={100}
        />
        <TextField
          name="favouriteCourse"
          label="Favourite Grade 12 course (name + code)"
        />
        <TextField
          name="mostUsefulCourse"
          label="Most useful course (name + code)"
        />
        <TextField
          name="mostDifficultCourse"
          label="Most difficult course (name + code)"
        />
      </div>
    </div>
  );
}

function StepHabitsAndWellbeing() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#15375c]">
        Lifestyle & Habits
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <NumberField
          name="avgStudyTime"
          label="Average time spent studying per day (hours)"
          min={0}
          max={12}
        />
        <NumberField
          name="allNighters"
          label="How many all nighters did you pull?"
          min={0}
        />
        <NumberField
          name="exerciseFreq"
          label="Exercise frequency per week"
          min={0}
          max={7}
        />
        <NumberField
          name="avgSleepTime"
          label="Average sleep time per school night (hours)"
          min={4}
          max={12}
        />
        <NumberField
          name="avgScreenTime"
          label="Average screen time per day (hours)"
          min={0}
          max={18}
        />
        <NumberField
          name="procrastinationFreq"
          label="How often did you procrastinate? (1–5)"
          min={1}
          max={5}
        />
      </div>

      <h2 className="text-lg font-semibold text-[#15375c]">Wellbeing</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <NumberField
          name="stressLevelSem1"
          label="Average stress level – Semester 1 (1–5)"
          min={1}
          max={5}
        />
        <NumberField
          name="stressLevelSem2"
          label="Average stress level – Semester 2 (1–5)"
          min={1}
          max={5}
        />
        <NumberField
          name="cohortFriendliness"
          label="How friendly is our cohort? (1–5)"
          min={1}
          max={5}
        />
        <NumberField
          name="peerSupportLevel"
          label="How supported did you feel by friends/peers? (1–5)"
          min={1}
          max={5}
        />
        <NumberField
          name="burnoutLevel"
          label="How burnt out do you feel? (1–5)"
          min={1}
          max={5}
        />
        <NumberField
          name="clubsCount"
          label="Clubs/teams you were involved in (count)"
          min={0}
        />
        <TextField
          name="specificClubs"
          label="What clubs/teams were you in?"
        />
      </div>
    </div>
  );
}

function StepPostSecondaryAndReflection() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#15375c]">
        Post-secondary Plans
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          name="intendedField"
          label="What field are you going into?"
          options={[
            { value: "Agriculture & Natural Resources", label: "Agriculture & Natural Resources" },
            { value: "Architecture & Built Environment", label: "Architecture & Built Environment" },
            { value: "Trades", label: "Trades" },
            { value: "Creative & Performing Arts", label: "Creative & Performing Arts" },
            { value: "Gap", label: "Gap" },
            { value: "Law & Governance", label: "Law & Governance" },
            { value: "Education", label: "Education" },
            { value: "Health & Medical Fields", label: "Health & Medical Fields" },
            { value: "Social Sciences", label: "Social Sciences" },
            { value: "Arts & Humanities", label: "Arts & Humanities" },
            { value: "Business & Economics", label: "Business & Economics" },
            { value: "Engineering", label: "Engineering" },
            { value: "Science", label: "Science" },
            { value: "Technology & Mathematics", label: "Technology & Mathematics" },
          ]}
        />
        <NumberField
          name="collegesAppliedCount"
          label="How many colleges/universities did you apply to?"
          min={0}
        />
      </div>
      <CollegesCheckboxGroup />

      <h2 className="text-lg font-semibold text-[#15375c]">Reflection</h2>
      <div className="space-y-4">
        <TextField
          name="cohortDescriptionWords"
          label="Describe our cohort in 1–2 words"
        />
        <TextAreaField
          name="biggestHelpSucceeding"
          label="Biggest thing that helped you succeed in Grade 12"
        />
        <TextAreaField
          name="redoGrade12Reflections"
          label="If you could redo Grade 12, what would you do?"
        />
        <TextAreaField
          name="adviceForG12s"
          label="Do you have any advice for incoming Grade 12s?"
        />
        <SelectField
          name="gladCameToFraser"
          label="Are you glad you came to Fraser?"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
      </div>
    </div>
  );
}

function ReviewStep() {
  const { getValues } = useFormContext<SurveyFormValues>();
  const values = getValues();

  return (
    <div className="text-left space-y-6 text-sm">
      <div>
        <h2 className="text-lg font-semibold text-[#15375c]">
          Staying Connected Card
        </h2>
        <ul className="mt-2 space-y-1">
          <li>
            <strong>Name:</strong> {values.firstName} {values.lastName}
          </li>
          <li>
            <strong>University:</strong> {values.university}
          </li>
          <li>
            <strong>Intended major/program:</strong> {values.major}
          </li>
          <li>
            <strong>Grad quote:</strong> {values.quote || "—"}
          </li>
          <li>
            <strong>Instagram:</strong> {values.instagramHandle || "—"}
          </li>
          <li>
            <strong>LinkedIn:</strong> {values.linkedinUrl || "—"}
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[#15375c]">Demographics</h2>
        <ul className="mt-2 space-y-1">
          <li>
            <strong>Gender:</strong> {values.gender}
          </li>
          <li>
            <strong>Ethnicity:</strong> {values.ethnicity}
          </li>
          <li>
            <strong>Religion:</strong> {values.religion}
          </li>
          <li>
            <strong>John Fraser original home school:</strong>{" "}
            {values.originalHomeSchool}
          </li>
          <li>
            <strong>Specialized programs:</strong> {values.specializedPrograms}
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[#15375c]">
          Academics & Habits
        </h2>
        <ul className="mt-2 space-y-1">
          <li>
            <strong>Grade 11 average:</strong> {values.grade11Avg}
          </li>
          <li>
            <strong>Preparedness for Grade 12 (1–5):</strong>{" "}
            {values.grade12Preparedness}
          </li>
          <li>
            <strong>Sem 1 midterm / final:</strong> {values.sem1MidtermAvg} /{" "}
            {values.sem1FinalAvg}
          </li>
          <li>
            <strong>Sem 2 midterm:</strong> {values.sem2MidtermAvg}
          </li>
          <li>
            <strong>Favourite course:</strong> {values.favouriteCourse}
          </li>
          <li>
            <strong>Most useful course:</strong> {values.mostUsefulCourse}
          </li>
          <li>
            <strong>Most difficult course:</strong> {values.mostDifficultCourse}
          </li>
          <li>
            <strong>Avg study time (hrs/day):</strong> {values.avgStudyTime}
          </li>
          <li>
            <strong>All nighters:</strong> {values.allNighters}
          </li>
          <li>
            <strong>Exercise / week:</strong> {values.exerciseFreq}
          </li>
          <li>
            <strong>Avg sleep (hrs/night):</strong> {values.avgSleepTime}
          </li>
          <li>
            <strong>Avg screen time (hrs/day):</strong> {values.avgScreenTime}
          </li>
          <li>
            <strong>Procrastination (1–5):</strong>{" "}
            {values.procrastinationFreq}
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[#15375c]">Wellbeing</h2>
        <ul className="mt-2 space-y-1">
          <li>
            <strong>Stress level Sem 1 (1–5):</strong> {values.stressLevelSem1}
          </li>
          <li>
            <strong>Stress level Sem 2 (1–5):</strong> {values.stressLevelSem2}
          </li>
          <li>
            <strong>Cohort friendliness (1–5):</strong>{" "}
            {values.cohortFriendliness}
          </li>
          <li>
            <strong>Peer support (1–5):</strong> {values.peerSupportLevel}
          </li>
          <li>
            <strong>Burnout (1–5):</strong> {values.burnoutLevel}
          </li>
          <li>
            <strong>Clubs/teams count:</strong> {values.clubsCount}
          </li>
          <li>
            <strong>Clubs/teams:</strong> {values.specificClubs || "—"}
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[#15375c]">
          Post-secondary & Reflection
        </h2>
        <ul className="mt-2 space-y-1">
          <li>
            <strong>Field:</strong> {values.intendedField}
          </li>
          <li>
            <strong>Schools applied to (count):</strong>{" "}
            {values.collegesAppliedCount}
          </li>
          <li>
            <strong>Schools list:</strong>{" "}
            {values.collegesAppliedList || "—"}
          </li>
          <li>
            <strong>Cohort in 1–2 words:</strong>{" "}
            {values.cohortDescriptionWords}
          </li>
          <li>
            <strong>Biggest help in Grade 12:</strong>{" "}
            {values.biggestHelpSucceeding}
          </li>
          <li>
            <strong>If you could redo Grade 12:</strong>{" "}
            {values.redoGrade12Reflections}
          </li>
          <li>
            <strong>Advice for incoming Grade 12s:</strong>{" "}
            {values.adviceForG12s}
          </li>
          <li>
            <strong>Glad you came to Fraser:</strong>{" "}
            {values.gladCameToFraser}
          </li>
        </ul>
      </div>
    </div>
  );
}

