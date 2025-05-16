"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { testMetadataApi } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestApiPage() {
  const [url, setUrl] = useState("https://example.com");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await testMetadataApi(null, { url });
      setResult(response);
      if (!response.success) {
        setError(response.error || "Unknown error");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      console.error("Test failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Metadata API Test Page</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test the Metadata API</CardTitle>
          <CardDescription>
            Enter a URL to test the metadata extraction API directly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1"
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Testing..." : "Test API"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-8 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[500px]">
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              Status: {result.success ? "Success" : "Failed"}
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 