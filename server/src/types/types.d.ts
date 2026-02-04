type StreamMessage =
    | {
        type: 'ai';
        payload: { text: string };
    }
    | {
        type: 'toolCall:start';
        payload: { name: string; args: Record<string, any> }
    }
    | {
        type: 'tool';
        payload: { name: string; result: Record<string, any> }
    }