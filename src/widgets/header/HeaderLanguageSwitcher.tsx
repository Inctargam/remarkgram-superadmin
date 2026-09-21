import { FlagRuIcon, FlagUkIcon, Select, type SelectOption } from '@remark-gram/ui-kit'

import styles from './headerLanguageSwitcher.module.css'

export type HeaderLanguage = 'en' | 'ru'

type Props = {
  value: HeaderLanguage
  onValueChange: (value: HeaderLanguage) => void
}

const LANGUAGES = {
  en: { flag: FlagUkIcon, label: 'English', shortLabel: 'EN' },
  ru: { flag: FlagRuIcon, label: 'Russian', shortLabel: 'RU' },
} as const

const LANGUAGE_OPTIONS: SelectOption<HeaderLanguage>[] = [
  { label: LANGUAGES.en.label, value: 'en' },
  { label: LANGUAGES.ru.label, value: 'ru' },
]

export const HeaderLanguageSwitcher = ({ value, onValueChange }: Props) => {
  return (
    <Select
      className={styles.root}
      modal={false}
      options={LANGUAGE_OPTIONS}
      placeholder={`Language: ${LANGUAGES[value].label}`}
      renderOption={({ value: optionValue }) => {
        const language = LANGUAGES[optionValue]
        const Flag = language.flag

        return (
          <span className={styles.optionContent}>
            <Flag className={styles.flag} size={24} />
            <span>{language.label}</span>
          </span>
        )
      }}
      renderValue={(selectedValue) => {
        if (!selectedValue) {
          return null
        }

        const language = LANGUAGES[selectedValue]
        const Flag = language.flag

        return (
          <span className={styles.valueContent}>
            <Flag className={styles.flag} size={24} />
            <span>{language.label}</span>
          </span>
        )
      }}
      triggerClassName={styles.trigger}
      value={value}
      onValueChange={(selectedValue) => {
        if (selectedValue) {
          onValueChange(selectedValue)
        }
      }}
    />
  )
}
