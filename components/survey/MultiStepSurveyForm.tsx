"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  SurveyFormValues,
  stepFieldGroups,
  steps,
  surveySchema,
} from "./surveyConstants";
import {
  ReviewStep,
  StepHabitsAndWellbeing,
  StepPostSecondaryAndReflection,
  StepProfileAndAcademics,
} from "./SurveySteps";
import { clearSurveyDraft, getSurveyDraftKey } from "./draftStorage";
import { submitSurvey } from "./surveySubmit";

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
      ? getSurveyDraftKey(user.uid)
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
      await submitSurvey(values, user);
      clearSurveyDraft(user.uid);
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
        onSubmit={(e) => e.preventDefault()}
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
              Your survey has been submitted. Thank you!
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
          <Button
            type="button"
            onClick={nextStep}
            style={{ display: step < 4 ? undefined : "none" }}
          >
            Next
          </Button>
          <Button
            type="button"
            onClick={() => methods.handleSubmit(onSubmit)()}
            disabled={submitting}
            style={{ display: step === 4 ? undefined : "none" }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
