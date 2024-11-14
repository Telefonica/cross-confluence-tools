export function cleanLogs(logs: string[]) {
  return logs.map((log) => log.replace(/^(\S|\s)*\]/, "").trim());
}
