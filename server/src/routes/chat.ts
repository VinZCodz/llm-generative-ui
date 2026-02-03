import express from 'express'
import logger from '../config/logger.ts'
import { ChatController as ChatController } from '../controllers/ChatController.ts'
import { SelectQueryGuard } from "../utils/SelectQueryGuard.ts";
import { initTools } from "../tools.ts";
import { llm } from "../model.ts"
import { SYSTEM_PROMPT } from "../prompt.ts"
import { ExpenseService } from '../services/ExpenseService.ts';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as expense from '../db/schema/expenses.ts';
import * as client from "../db/client.ts";
import { MemorySaver } from '@langchain/langgraph';
import { expenseAgentGraphBuilder } from '../expenseAgent.ts';

const expenseService = new ExpenseService(
    client.db as unknown as LibSQLDatabase<typeof expense>,
    client.roDB as unknown as LibSQLDatabase<typeof expense>,
    new SelectQueryGuard()
);

const agent = expenseAgentGraphBuilder({ llm, tools: initTools(expenseService), systemPrompt: SYSTEM_PROMPT })
    .compile({ checkpointer: new MemorySaver() });

const router = express.Router()

const chatController = new ChatController(agent, logger)

router.post('/stream', chatController.streamChat)

export default router