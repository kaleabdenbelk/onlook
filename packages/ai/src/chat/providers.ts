import {
    LLMProvider,
    MODEL_MAX_TOKENS,
    OPENROUTER_MODELS,
    type InitialModelPayload,
    type ModelConfig,
} from '@onlook/models';
import { assertNever } from '@onlook/utility';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

const DAHL_MODEL = 'MiniMaxAI/MiniMax-M2.7';

export function initModel({
    provider: requestedProvider,
    model: requestedModel,
}: InitialModelPayload): ModelConfig {
    let model: LanguageModel;
    let providerOptions: Record<string, any> | undefined;
    let headers: Record<string, string> | undefined;
    const maxOutputTokens: number = MODEL_MAX_TOKENS[requestedModel];

    switch (requestedProvider) {
        case LLMProvider.OPENROUTER:
            model = getDahlProvider(DAHL_MODEL);
            break;

        default:
            assertNever(requestedProvider);
    }

    return {
        model,
        providerOptions,
        headers,
        maxOutputTokens,
    };
}

function getDahlProvider(model: string): LanguageModel {
    if (!process.env.DAHL_API_KEY) {
        throw new Error('DAHL_API_KEY must be set');
    }

    const dahl = createOpenAI({
        apiKey: process.env.DAHL_API_KEY,
        baseURL: 'https://inference.dahl.global/v1',
    });

    return dahl(model);
}
