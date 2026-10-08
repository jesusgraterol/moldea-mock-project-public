/* Fixed values for a visual fixture; no environment or credentials are read. */
export const provideFixtureVariables = (): Readonly<Record<string, string>> => ({
  "LOCALE": "en-US",
  "REVIEW_TEAM": "Parcel Desk fixture reviewers"
});

export const provideLocale = (): string => provideFixtureVariables()["LOCALE"]!;
export const provideReviewTeam = (): string => provideFixtureVariables()["REVIEW_TEAM"]!;
