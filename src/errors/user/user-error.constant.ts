export const ERROR_USER_NOT_FOUND = 'error.userNotFound';
export const ERROR_USER_CONFLICT = 'error.userConflict';

export const USER_CONSTRAINT_ERRORS: Record<string, string | string[]> = {
  USER_NF_001: ERROR_USER_NOT_FOUND,
  USER_CF_001: ERROR_USER_CONFLICT,
};
