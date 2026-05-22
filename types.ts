export interface NumberRuleGroup {
  id: string;
  rangeName: string;
  rangeArm: string;
  introduction: string;
  rules: {
    title: string;
    details: string;
    examples: { digits: number; spanish: string; armPhonetic: string; armTranslation: string }[];
  }[];
}

export interface QuickFact {
  title: string;
  explanation: string;
  note?: string;
}

export interface GameScore {
  gameId: string;
  gameName: string;
  highScore: number;
}
