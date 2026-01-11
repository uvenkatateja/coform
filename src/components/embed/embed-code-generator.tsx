"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Code2, Copy, Check } from "lucide-react";

// ============================================
// Types
// ============================================

interface EmbedCodeGeneratorProps {
    formId: string;
    baseUrl: string;
}

interface EmbedConfig {
    width: string;
    height: string;
}

// ============================================
// Main Component
// ============================================

export function EmbedCodeGenerator(props: EmbedCodeGeneratorProps): JSX.Element {
    const { formId, baseUrl } = props;

    const [config, setConfig] = useState<EmbedConfig>({
        width: "100%",
        height: "600",
    });
    const [copied, setCopied] = useState(false);

    const embedUrl = `${baseUrl}/embed/${formId}`;

    function handleCopy(code: string): void {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const iframeCode = generateIframeCode(embedUrl, config);
    const scriptCode = generateScriptCode(embedUrl, formId, config);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Code2 className="h-4 w-4 mr-2" />
                    Embed
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Embed Form</DialogTitle>
                    <DialogDescription>
                        Add this form to any website using the code below.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="width">Width</Label>
                            <Input
                                id="width"
                                value={config.width}
                                onChange={(e) => setConfig({ ...config, width: e.target.value })}
                                placeholder="100% or 500px"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height">Height</Label>
                            <Input
                                id="height"
                                value={config.height}
                                onChange={(e) => setConfig({ ...config, height: e.target.value })}
                                placeholder="600"
                            />
                        </div>
                    </div>

                    <Tabs defaultValue="iframe" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="iframe">iFrame</TabsTrigger>
                            <TabsTrigger value="script">Script</TabsTrigger>
                        </TabsList>

                        <TabsContent value="iframe" className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Simple embed that works everywhere. Just paste this HTML.
                            </p>
                            <CodeBlock code={iframeCode} onCopy={handleCopy} copied={copied} />
                        </TabsContent>

                        <TabsContent value="script" className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Advanced embed with better UX. Auto-resizes to fit content.
                            </p>
                            <CodeBlock code={scriptCode} onCopy={handleCopy} copied={copied} />
                        </TabsContent>
                    </Tabs>

                    <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                            <strong>Direct link:</strong>{" "}
                            <a
                                href={embedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                {embedUrl}
                            </a>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ============================================
// Sub-Components
// ============================================

interface CodeBlockProps {
    code: string;
    onCopy: (code: string) => void;
    copied: boolean;
}

function CodeBlock(props: CodeBlockProps): JSX.Element {
    const { code, onCopy, copied } = props;

    return (
        <div className="relative">
            <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto font-mono">
                {code}
            </pre>
            <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => onCopy(code)}
            >
                {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                ) : (
                    <Copy className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
}

// ============================================
// Code Generators
// ============================================

function generateIframeCode(url: string, config: EmbedConfig): string {
    const heightValue = config.height.includes("px") ? config.height : `${config.height}px`;

    return `<iframe
  src="${url}"
  width="${config.width}"
  height="${heightValue}"
  frameborder="0"
  style="border: none; max-width: 100%;"
></iframe>`;
}

function generateScriptCode(url: string, formId: string, config: EmbedConfig): string {
    const heightValue = config.height.includes("px") ? config.height : `${config.height}px`;

    return `<div id="coform-${formId}"></div>
<script>
  (function() {
    var container = document.getElementById('coform-${formId}');
    var iframe = document.createElement('iframe');
    iframe.src = '${url}';
    iframe.style.width = '${config.width}';
    iframe.style.height = '${heightValue}';
    iframe.style.border = 'none';
    iframe.style.maxWidth = '100%';
    container.appendChild(iframe);
    
    // Listen for form events
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'coform:form_submitted') {
        console.log('Form submitted:', e.data.formId);
      }
    });
  })();
</script>`;
}
