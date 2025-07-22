
export interface Correction {
  rule: string;
  originalFragment: string;
  correctedFragment: string;
  explanation: string;
}

export type MessageSender = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text?: string;
  correction?: Correction;
  isCorrectionCard?: boolean;
  isLastCorrection?: boolean;
}
