import type { CompiledGraph } from '@langchain/langgraph';
import type { Request, Response } from 'express'
import type { Logger } from 'winston'

export class ChatController {
    private readonly logger: Logger;
    private readonly agent: CompiledGraph<any>

    constructor(agent: CompiledGraph<any>, logger: Logger) {
        this.agent = agent;
        this.logger = logger;
    }

    public streamChat = async (req: Request, res: Response) => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        });
        res.flushHeaders();

        const lastEventId = req.headers['last-event-id'] || 0;
        this.logger.info(`Resuming stream from ID: ${lastEventId}`);

        const stream = await this.agent.stream(
            {
                messages: [{ role: "user", content: req.body.input }]
            },
            {
                streamMode: ['messages'],
                configurable: { thread_id: req.body.threadId }
            });

        for await (const [event, chunk] of stream) {
            let message: StreamMessage;

            switch (chunk[0].type) {
                case 'ai':
                    message = {
                        type: 'ai',
                        payload: { text: chunk[0].content as string }
                    };
                    break;
                case 'tool':
                    message = {
                        type: 'tool',
                        payload: { 
                            name: chunk[0].name as string,
                            result: chunk[0].lc_kwargs
                        }
                    };
                    break;
                default:
                     message = {
                        type: 'ai',
                        payload: { text: "Something wrong with stream!" }
                    };
            }

            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify(message)}\n\n}`)
        }
        res.end();
    }
}