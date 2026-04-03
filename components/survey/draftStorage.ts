const SURVEY_DRAFT_KEY_PREFIX = "jfss_survey_draft_";

export function getSurveyDraftKey(uid: string) {
  return `${SURVEY_DRAFT_KEY_PREFIX}${uid}`;
}

export function clearSurveyDraft(uid: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getSurveyDraftKey(uid));
}
