"use client";

import { useFormContext } from "react-hook-form";

import {
  COLLEGE_OPTIONS,
  FieldName,
  SurveyFormValues,
} from "./surveyConstants";

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
      helper={
        helper ?? (min !== undefined && max !== undefined
          ? `Range ${min}-${max}`
          : undefined)
      }
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

function CollegesCheckboxGroup() {
  const { watch, setValue } = useFormContext<SurveyFormValues>();
  const current = (watch("collegesAppliedList") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const toggle = (label: (typeof COLLEGE_OPTIONS)[number]) => {
    const exists = current.includes(label);
    const next = exists ? current.filter((v) => v !== label) : [...current, label];
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

export function StepProfileAndAcademics() {
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

export function StepHabitsAndWellbeing() {
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

export function StepPostSecondaryAndReflection() {
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
            {
              value: "Agriculture & Natural Resources",
              label: "Agriculture & Natural Resources",
            },
            {
              value: "Architecture & Built Environment",
              label: "Architecture & Built Environment",
            },
            { value: "Trades", label: "Trades" },
            {
              value: "Creative & Performing Arts",
              label: "Creative & Performing Arts",
            },
            { value: "Gap", label: "Gap" },
            { value: "Law & Governance", label: "Law & Governance" },
            { value: "Education", label: "Education" },
            {
              value: "Health & Medical Fields",
              label: "Health & Medical Fields",
            },
            { value: "Social Sciences", label: "Social Sciences" },
            { value: "Arts & Humanities", label: "Arts & Humanities" },
            { value: "Business & Economics", label: "Business & Economics" },
            { value: "Engineering", label: "Engineering" },
            { value: "Science", label: "Science" },
            {
              value: "Technology & Mathematics",
              label: "Technology & Mathematics",
            },
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

export function ReviewStep() {
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

