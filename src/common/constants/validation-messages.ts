export const VALIDATION_MESSAGES = {
  NAME: {
    IS_STRING: 'Le nom doit être une chaîne de caractères',
    MIN_LENGTH: 'Le nom doit contenir au moins 3 caractères',
    MAX_LENGTH: 'Le nom ne doit pas dépasser 10 caractères',
  },

  DESCRIPTION: {
    IS_STRING: 'La description doit être une chaîne de caractères',
    MIN_LENGTH: 'La description doit contenir au moins 10 caractères',
  },

  STATUS: {
  IS_ENUM: 'Le statut doit être TODO, IN_PROGRESS ou DONE',
},
};