export interface Country {
  code: string
  dialCode: string
  name: string
  flag: string
  format?: string
}

export const countries: Country[] = [
  {
    code: 'US',
    dialCode: '+1',
    name: 'United States',
    flag: '🇺🇸',
    format: '(...) ...-....',
  },
  {
    code: 'GB',
    dialCode: '+44',
    name: 'United Kingdom',
    flag: '🇬🇧',
    format: '.... ......',
  },
  {
    code: 'CA',
    dialCode: '+1',
    name: 'Canada',
    flag: '🇨🇦',
    format: '(...) ...-....',
  },
  {
    code: 'AU',
    dialCode: '+61',
    name: 'Australia',
    flag: '🇦🇺',
    format: '... ... ...',
  },
  {
    code: 'DE',
    dialCode: '+49',
    name: 'Germany',
    flag: '🇩🇪',
    format: '.... ........',
  },
  {
    code: 'FR',
    dialCode: '+33',
    name: 'France',
    flag: '🇫🇷',
    format: '. .. .. .. ..',
  },
  {
    code: 'JP',
    dialCode: '+81',
    name: 'Japan',
    flag: '🇯🇵',
    format: '.. .... ....',
  },
  {
    code: 'BR',
    dialCode: '+55',
    name: 'Brazil',
    flag: '🇧🇷',
    format: '(..) .....-....',
  },
  {
    code: 'IN',
    dialCode: '+91',
    name: 'India',
    flag: '🇮🇳',
    format: '.....-.....',
  },
  {
    code: 'CN',
    dialCode: '+86',
    name: 'China',
    flag: '🇨🇳',
    format: '...-....-....',
  },
  {
    code: 'RU',
    dialCode: '+7',
    name: 'Russia',
    flag: '🇷🇺',
    format: '(...) ...-..-..',
  },
  {
    code: 'MX',
    dialCode: '+52',
    name: 'Mexico',
    flag: '🇲🇽',
    format: '... ... ....',
  },
  {
    code: 'ZA',
    dialCode: '+27',
    name: 'South Africa',
    flag: '🇿🇦',
    format: '.. ... ....',
  },
  {
    code: 'KR',
    dialCode: '+82',
    name: 'South Korea',
    flag: '🇰🇷',
    format: '..-....-....',
  },
  {
    code: 'IT',
    dialCode: '+39',
    name: 'Italy',
    flag: '🇮🇹',
    format: '... .......',
  },
]
