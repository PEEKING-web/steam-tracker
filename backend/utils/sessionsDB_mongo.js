import Session from '../models/Session.js';
import { randomUUID } from 'crypto';

export async function createSession(sessionData) {
  try {
    const sessionId = randomUUID();
    
    const newSession = new Session({
      sessionId,
      steamId: sessionData.steamId,
      appid: sessionData.appid,
      gameName: sessionData.gameName,
      startTime: new Date(sessionData.startTime),
      endTime: sessionData.endTime ? new Date(sessionData.endTime) : null,
      durationMinutes: sessionData.durationMinutes,
      mood: sessionData.mood || 'Neutral',
      notes: sessionData.notes || ''
    });
    
    await newSession.save();
    
    return {
      id: sessionId,
      steamId: sessionData.steamId,
      appid: sessionData.appid,
      gameName: sessionData.gameName,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      durationMinutes: sessionData.durationMinutes,
      mood: sessionData.mood,
      notes: sessionData.notes
    };
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function endSession(sessionId, endTime) {
  try {
    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return null;
    }
    
    session.endTime = new Date(endTime);
    session.durationMinutes = Math.floor((endTime - session.startTime.getTime()) / 60000);
    
    await session.save();
    
    return {
      id: session.sessionId,
      steamId: session.steamId,
      appid: session.appid,
      gameName: session.gameName,
      startTime: session.startTime.getTime(),
      endTime: session.endTime.getTime(),
      durationMinutes: session.durationMinutes,
      mood: session.mood,
      notes: session.notes
    };
  } catch (error) {
    console.error('Error ending session:', error);
    throw error;
  }
}

export async function getSessionsByUser(steamId) {
  try {
    const sessions = await Session.find({ steamId }).sort({ startTime: -1 });
    
    return sessions.map(s => ({
      id: s.sessionId,
      steamId: s.steamId,
      appid: s.appid,
      gameName: s.gameName,
      startTime: s.startTime.getTime(),
      endTime: s.endTime ? s.endTime.getTime() : null,
      durationMinutes: s.durationMinutes,
      mood: s.mood,
      notes: s.notes
    }));
  } catch (error) {
    console.error('Error getting sessions:', error);
    throw error;
  }
}

export async function getSessionsByGame(steamId, appid) {
  try {
    const sessions = await Session.find({ steamId, appid }).sort({ startTime: -1 });
    
    return sessions.map(s => ({
      id: s.sessionId,
      steamId: s.steamId,
      appid: s.appid,
      gameName: s.gameName,
      startTime: s.startTime.getTime(),
      endTime: s.endTime ? s.endTime.getTime() : null,
      durationMinutes: s.durationMinutes,
      mood: s.mood,
      notes: s.notes
    }));
  } catch (error) {
    console.error('Error getting game sessions:', error);
    throw error;
  }
}