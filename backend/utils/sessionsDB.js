import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const filePath = path.join(process.cwd(), 'data', 'sessions.json');

function readSessions() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeSessions(sessions) {
  fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2));
}

export function createSession(session) {
  const sessions = readSessions();
  const newSession = {
    id: randomUUID(),
    ...session
  };
  sessions.push(newSession);
  writeSessions(sessions);
  return newSession;
}

export function endSession(sessionId, endTime) {
  const sessions = readSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return null;

  session.endTime = endTime;
  session.durationMinutes = Math.floor(
    (endTime - session.startTime) / 60000
  );

  writeSessions(sessions);
  return session;
}

export function getSessionsByUser(steamId) {
  const sessions = readSessions();
  return sessions.filter(s => s.steamId === steamId);
}

export function getSessionsByGame(steamId, appid) {
  const sessions = readSessions();
  return sessions.filter(
    s => s.steamId === steamId && s.appid === Number(appid)
  );
}
