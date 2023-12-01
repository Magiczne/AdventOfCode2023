const isNumeric = (value: any): value is number => {
  // Love JS
  return !isNaN(value)
}

const isUpperCase = (value: string): boolean => {
  return value === value.toUpperCase()
}

const isUpperCaseLetter = (value: string): boolean => {
  return value === value.toUpperCase() && value !== value.toLowerCase()
}

export { isNumeric, isUpperCase, isUpperCaseLetter }
