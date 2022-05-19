
/* MAIN */

const IS_USER_ROOT = process.getuid ? !process.getuid () : false;

const LIMIT_FILES_DESCRIPTORS = 10000; //TODO: fetch the real limit from the filesystem

const NOOP = () => {};

/* EXPORT */

export {IS_USER_ROOT, LIMIT_FILES_DESCRIPTORS, NOOP};
