export type CurrentScores = {
  name: string
  race: string
  class: string
  active_spec_name: string
  active_spec_role: string
  gender: string
  faction: string
  achievement_points: number
  honorable_kills: number
  thumbnail_url: string
  region: string
  realm: string
  last_crawled_at: Date
  profile_url: string
  profile_banner: string
  mythic_plus_scores_by_season: MythicPlusScoresBySeason[]
  statusCode?: number
  error?: string
  message?: string
}


export interface MythicPlusScoresBySeason {
  season: string
  scores: Scores
  segments: Segments
}

export interface Scores {
  all: number
  dps: number
  healer: number
  tank: number
  spec_0: number
  spec_1: number
  spec_2: number
  spec_3: number
}

export interface Segments {
  all: All
  dps: All
  healer: All
  tank: All
  spec_0: All
  spec_1: All
  spec_2: All
  spec_3: All
}

export interface All {
  score: number
  color: string
}
