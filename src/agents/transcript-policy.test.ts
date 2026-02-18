import { describe, expect, it } from "vitest";
import { resolveTranscriptPolicy } from "./transcript-policy.js";

describe("resolveTranscriptPolicy", () => {
  it("enables sanitizeToolCallIds for Anthropic provider", () => {
    const policy = resolveTranscriptPolicy({
      provider: "anthropic",
      modelId: "claude-opus-4-5",
      modelApi: "anthropic-messages",
    });
    expect(policy.sanitizeToolCallIds).toBe(true);
    expect(policy.toolCallIdMode).toBe("strict");
  });

  it("enables sanitizeToolCallIds for Google provider", () => {
    const policy = resolveTranscriptPolicy({
      provider: "google",
      modelId: "gemini-2.0-flash",
      modelApi: "google-generative-ai",
    });
    expect(policy.sanitizeToolCallIds).toBe(true);
  });

  it("enables sanitizeToolCallIds for Mistral provider", () => {
    const policy = resolveTranscriptPolicy({
      provider: "mistral",
      modelId: "mistral-large-latest",
    });
    expect(policy.sanitizeToolCallIds).toBe(true);
    expect(policy.toolCallIdMode).toBe("strict9");
  });

  it("disables sanitizeToolCallIds for OpenAI provider", () => {
    const policy = resolveTranscriptPolicy({
      provider: "openai",
      modelId: "gpt-4o",
      modelApi: "openai",
    });
    expect(policy.sanitizeToolCallIds).toBe(false);
    expect(policy.toolCallIdMode).toBeUndefined();
  });

  it("enables validateAnthropicTurns for Moonshot provider", () => {
    const policy = resolveTranscriptPolicy({
      provider: "moonshot",
      modelId: "kimi-k2.5",
      modelApi: "openai-completions",
    });
    expect(policy.validateAnthropicTurns).toBe(true);
    expect(policy.validateGeminiTurns).toBe(false);
  });

  it("enables validateAnthropicTurns for other non-OpenAI openai-completions providers", () => {
    const policy = resolveTranscriptPolicy({
      provider: "zai",
      modelId: "glm-4.7",
      modelApi: "openai-completions",
    });
    expect(policy.validateAnthropicTurns).toBe(true);
  });

  it("disables validateAnthropicTurns for OpenAI provider", () => {
    const policy = resolveTranscriptPolicy({
      provider: "openai",
      modelId: "gpt-4o",
      modelApi: "openai-completions",
    });
    expect(policy.validateAnthropicTurns).toBe(false);
  });

  it("disables validateAnthropicTurns for Google provider (uses validateGeminiTurns instead)", () => {
    const policy = resolveTranscriptPolicy({
      provider: "google",
      modelId: "gemini-2.0-flash",
      modelApi: "google-generative-ai",
    });
    expect(policy.validateAnthropicTurns).toBe(false);
    expect(policy.validateGeminiTurns).toBe(true);
  });
});
