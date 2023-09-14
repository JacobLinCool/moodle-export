import debug from "debug";

export const log = debug("moodle-export");

export const ext = (name: string) => log.extend(name);
