/**
 * Image picker shown inside AI chats (MCP App): search bar on top, results grid below.
 * Same components as the admin image search; it searches through the chat (`search_images` tool)
 * and, on click, tells the chat which image to use. Bundled into one HTML file by
 * scripts/build-mcp-apps.ts and served by src/lib/mcp.ts.
 */
import { useState } from "react";
import { createRoot } from "react-dom/client";
import useSWRMutation from "swr/mutation";
import { useApp, type App } from "@modelcontextprotocol/ext-apps/react";
import { ImageSearchBar } from "@/components/molecules/ImageSearchBar";
import { ImageResultsGrid, type UnsplashImage } from "@/components/molecules/ImageResultsGrid";
import type { ImageSearchResult } from "@/lib/services/image-search";

interface SearchArg {
  app: App;
  prompt: string;
  eventName?: string;
}

/** Tell the server what happens in the chat (it hides the app's errors); never shown to the user. */
function report(event: string, detail?: unknown) {
  const text = detail instanceof Error ? `${detail.name}: ${detail.message}` : JSON.stringify(detail);
  fetch(process.env.MCP_LOG_URL!, { method: "POST", mode: "no-cors", body: `${event} ${text ?? ""}` }).catch(() => {});
}

async function searchImages(_key: string, { arg }: { arg: SearchArg }): Promise<ImageSearchResult> {
  const result = await arg.app
    .callServerTool({
      name: "search_images",
      arguments: { prompt: arg.prompt, eventName: arg.eventName },
    })
    .catch((error) => {
      report("search_images call failed", error);
      throw error;
    });
  if (result.isError) {
    report("search_images returned an error", result.content);
    throw new Error("Failed to search images");
  }
  return result.structuredContent as unknown as ImageSearchResult;
}

function ImagePicker() {
  const [prompt, setPrompt] = useState("oil energy industry");
  const [eventName, setEventName] = useState<string>();
  const { trigger, data, error, isMutating } = useSWRMutation("image-search", searchImages);

  const { app } = useApp({
    appInfo: { name: "VAPA image picker", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      // the chat opened the picker: search right away with what it asked for
      app.ontoolinput = ({ arguments: args }) => {
        report("tool input received", args);
        report("host", { info: app.getHostVersion(), capabilities: app.getHostCapabilities() });
        const initialPrompt = typeof args?.prompt === "string" && args.prompt ? args.prompt : "oil energy industry";
        const name = typeof args?.eventName === "string" ? args.eventName : undefined;
        setPrompt(initialPrompt);
        setEventName(name);
        trigger({ app, prompt: initialPrompt, eventName: name });
      };
      app.ontoolresult = (toolResult) => report("tool result received", Object.keys(toolResult));
    },
  });

  const handleSearch = () => {
    if (app && prompt.trim()) trigger({ app, prompt, eventName });
  };

  const handleSelectImage = (image: UnsplashImage) => {
    app?.sendMessage({
      role: "user",
      content: [{ type: "text", text: `Use this image for the event: ${image.url}` }],
    });
  };

  const refinedQuery = data?.query && data.query !== prompt.trim() ? data.query : null;

  return (
    <div className="flex flex-col max-h-[560px] bg-surface-section border border-border-accent-light rounded-xl overflow-hidden">
      <ImageSearchBar
        prompt={prompt}
        onPromptChange={setPrompt}
        onSearch={handleSearch}
        isSearching={isMutating}
        refinedQuery={refinedQuery}
      />
      <ImageResultsGrid
        images={data?.results ?? []}
        isSearching={isMutating}
        hasSearched={!!data || !!error}
        error={!!error}
        onSelectImage={handleSelectImage}
      />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<ImagePicker />);
