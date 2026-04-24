import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestDocument, RequestEntity } from '../requests/schemas/request.schema';

interface AiEnrichment {
  category: 'billing' | 'support' | 'feedback' | 'general';
  summary: string;
  urgency: 'low' | 'medium' | 'high';
}

const FALLBACK: AiEnrichment = {
  category: 'general',
  summary: 'Unable to generate summary.',
  urgency: 'low',
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly model = 'meta-llama/llama-3.3-70b-instruct:free';

  constructor(
    @InjectModel(RequestEntity.name)
    private readonly requestModel: Model<RequestDocument>,
  ) {}

  async enrichRequest(requestId: string, name: string, email: string, message: string): Promise<void> {
    try {
      const enrichment = await this.callOpenRouter(name, email, message);
      await this.requestModel.findByIdAndUpdate(requestId, {
        category: enrichment.category,
        summary: enrichment.summary,
        urgency: enrichment.urgency,
      });
      this.logger.log(`Enriched request ${requestId} → category: ${enrichment.category}, urgency: ${enrichment.urgency}`);
    } catch (err) {
      this.logger.error(`Failed to enrich request ${requestId}: ${err.message}`);
    }
  }

  private async callOpenRouter(name: string, email: string, message: string): Promise<AiEnrichment> {
    const systemPrompt = `You are a customer support triage assistant. Your job is to analyse incoming user requests and classify them.

You MUST respond with ONLY a valid JSON object — no explanation, no markdown, no code fences, no extra text.

The JSON object must match this exact shape:
{
  "category": "billing" | "support" | "feedback" | "general",
  "summary": "<one concise sentence summarising the request>",
  "urgency": "low" | "medium" | "high"
}

Classification rules:
- category "billing": payment issues, charges, refunds, subscriptions, invoices
- category "support": technical problems, bugs, app not working, login issues
- category "feedback": suggestions, feature requests, compliments, general opinions
- category "general": anything that doesn't fit the above
- urgency "high": user is blocked, lost money, data loss, service completely down
- urgency "medium": partial issue, workaround exists, waiting on something
- urgency "low": informational, suggestions, minor annoyances, compliments

Respond with the JSON object only. No other text.`;

    const userPrompt = `Name: ${name}
Email: ${email}
Message: ${message}`;

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Workflow Engine',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter responded with ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    return this.parseEnrichment(raw);
  }

  private parseEnrichment(raw: string): AiEnrichment {
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      const validCategories = ['billing', 'support', 'feedback', 'general'];
      const validUrgencies = ['low', 'medium', 'high'];

      return {
        category: validCategories.includes(parsed.category) ? parsed.category : FALLBACK.category,
        summary: typeof parsed.summary === 'string' && parsed.summary.trim() ? parsed.summary.trim() : FALLBACK.summary,
        urgency: validUrgencies.includes(parsed.urgency) ? parsed.urgency : FALLBACK.urgency,
      };
    } catch {
      this.logger.warn(`Failed to parse AI response, using fallback. Raw: ${raw}`);
      return FALLBACK;
    }
  }
}