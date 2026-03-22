import type { User } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase.config";

import type { SurveyFormValues } from "./surveyConstants";

/* blah blah blah */
export async function submitSurvey(values: SurveyFormValues, user: User) {
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
}

