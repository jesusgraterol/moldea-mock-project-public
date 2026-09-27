// a checked-in source with its repository-logical path
export interface IReviewSource {
  path: string;
  markdown: string;
}

// a staff-only observation or question tied to its supporting sources
export interface IAttributedNote {
  text: string;
  sources: string[];
}

// the common review contract; desk-specific contracts narrow the desk identity
export interface IDeskReview {
  audience: 'staff-only';
  desk: 'equipment-support' | 'claims-review' | 'fulfillment-review';
  findings: IAttributedNote[];
  openQuestions: IAttributedNote[];
}
