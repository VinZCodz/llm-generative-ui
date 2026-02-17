type StreamMessage =
    | {
        id: string
        type: 'ai';
        payload: { text: string };
    }
    | {
        id: string
        type: 'toolCall:start';
        payload: { name: string; args: Record<string, any> }
    }
    | {
        id: string
        type: 'tool';
        payload: { name: string; result: Record<string, any> }
    }
    | {
        id: string
        type: 'user';
        payload: { text: string; }
    }