// Chat API Service for onboarding with profile extraction
// Adapted from HacktheWorld's /api/chat for frontend use

import { GoogleGenAI } from '@google/genai';
import { ChatRequest, ChatResponse, PublicProfile, LifeExperience } from '../../types';
import { PROMPT_ROLE_A, PROMPT_ROLE_B } from './prompts';
import { getAvatarForUser } from '../utils/avatars';

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
  httpOptions: { baseUrl: 'https://cli-proxy.athebear.space' }
});

interface ConversationState {
  turnCount: number;
  savedProfile: PublicProfile['tags'] | null;
}

// In-memory conversation state (per userId)
const conversationStates = new Map<string, ConversationState>();

/**
 * Chat API for onboarding mode
 * Handles profile extraction from AI response
 */
export const onboardingChatApi = async (req: ChatRequest): Promise<ChatResponse> => {
  const { userId, messages } = req;

  // Get or create conversation state
  let state = conversationStates.get(userId);
  if (!state) {
    state = { turnCount: 0, savedProfile: null };
    conversationStates.set(userId, state);
  }

  // Determine mode and system prompt
  let systemPrompt: string;
  if (state.savedProfile) {
    // Mode B: Counseling (after profile saved)
    systemPrompt = PROMPT_ROLE_B.replace('{{USER_PROFILE}}', JSON.stringify(state.savedProfile));
  } else {
    // Mode A: Onboarding (profile extraction)
    systemPrompt = PROMPT_ROLE_A;
  }

  // Convert messages to Gemini format
  const chatHistory = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: msg.content }]
  }));

  const lastMessage = messages[messages.length - 1];

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...chatHistory.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: lastMessage.content }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      }
    });

    const aiRawContent = response.text || '';
    let finalContent = aiRawContent;
    let extractedProfile: PublicProfile | null = null;

    // Debug: log raw AI response
    console.log('[ChatAPI] AI raw response:', aiRawContent);

    // Profile extraction (Mode A only)
    if (!state.savedProfile) {
      const jsonMatch = aiRawContent.match(/```json([\s\S]*?)```/);

      if (jsonMatch && jsonMatch[1]) {
        console.log('[ChatAPI] Found JSON block, attempting to parse...');
        try {
          const parsedData = JSON.parse(jsonMatch[1]);
          console.log('[ChatAPI] Parsed data:', parsedData);
          if (parsedData.user_profile) {
            // Save to state
            state.savedProfile = parsedData.user_profile;
            conversationStates.set(userId, state);

            // Parse life_timeline if present
            const lifeTimeline: LifeExperience[] = [];
            if (parsedData.life_timeline && Array.isArray(parsedData.life_timeline)) {
              parsedData.life_timeline.forEach((item: any, index: number) => {
                lifeTimeline.push({
                  id: `timeline_${Date.now()}_${index}`,
                  title: item.title || '',
                  description: item.description || '',
                  year: item.year || ''
                });
              });
            }

            // Create PublicProfile
            extractedProfile = {
              id: userId,
              name: parsedData.user_profile.name || '探索者',
              avatar: getAvatarForUser(userId),
              avatarPrompt: parsedData.user_profile.avatar_prompt || '',
              tags: {
                role_detail: parsedData.user_profile.role_detail || '',
                location: parsedData.user_profile.location || '',
                experience: parsedData.user_profile.experience || '',
                hassle: parsedData.user_profile.hassle || '',
                goal: parsedData.user_profile.goal || ''
              },
              lifeTimeline
            };

            // Remove JSON block from user-facing content
            finalContent = aiRawContent.replace(jsonMatch[0], '').trim();
            console.log('[ChatAPI] Profile extracted successfully:', extractedProfile);
          }
        } catch (e) {
          console.error('Profile JSON parsing error:', e);
        }
      } else {
        console.log('[ChatAPI] No JSON block found in response');
      }
    }

    // Update turn count
    state.turnCount++;
    conversationStates.set(userId, state);

    return {
      content: finalContent,
      profile: extractedProfile ?? undefined
    };

  } catch (error) {
    console.error('Chat API Error:', error);
    return {
      content: '抱歉，我现在有点状况。让我重新整理一下，你再说一遍好吗？'
    };
  }
};

/**
 * Reset conversation state for a user
 */
export const resetConversationState = (userId: string) => {
  conversationStates.delete(userId);
};

/**
 * Get current conversation state
 */
export const getConversationState = (userId: string): ConversationState | undefined => {
  return conversationStates.get(userId);
};
