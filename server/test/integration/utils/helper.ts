import type { StructuredTool } from 'langchain';
import { tools } from '../tools/tools.setup.ts';

export const getTool = (toolName: string) => {
    const tool = tools.find(t => t.name === toolName) as StructuredTool;
    
    if (!tool) throw new Error(`${toolName} tool not found!`);

    return tool;
}