export interface ProjectConfig {
  /** Display name used in emails and response messages. */
  name: string;
  /** Relative or absolute path to the brochure PDF that is emailed to leads. */
  brochurePath: string;
  /** Optional override for internal lead-notification recipient. */
  internalNotifyEmail?: string;
}

/**
 * To add a new project: add one entry here and drop the brochure PDF in /server/assets/.
 * No other files need to change.
 */
const registry: Record<string, ProjectConfig> = {
  aurora: {
    name: "Aurora",
    brochurePath: "./assets/aurora-brochure.pdf",
  },
};

export function getProject(rawName: string): ProjectConfig {
  const key = rawName.toLowerCase();
  return (
    registry[key] ?? {
      name: rawName,
      brochurePath: `./assets/${key}-brochure.pdf`,
    }
  );
}

export function knownProjectNames(): string[] {
  return Object.values(registry).map((p) => p.name);
}
