export const DEFAULT_TOUR_LANGUAGE_IDS = ['bosnian', 'english']

export const TOUR_LANGUAGE_META = {
  bosnian: {
    id: 'bosnian',
    label: 'Bosnian',
    flag: '🇧🇦',
  },
  english: {
    id: 'english',
    label: 'English',
    flag: '🇬🇧',
  },
}

export function getTourLanguages(languageIds = DEFAULT_TOUR_LANGUAGE_IDS) {
  return languageIds
    .map((languageId) => TOUR_LANGUAGE_META[languageId])
    .filter(Boolean)
}
