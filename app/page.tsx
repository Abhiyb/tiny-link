"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Copy, BarChart } from "lucide-react";
import toast from "react-hot-toast";

// Define proper Link type
interface Link {
  code: string;
  url: string;
  clicks: number;
  lastClicked: string | null;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Async fetch inside useEffect properly
  useEffect(() => {
    const loadLinks = async () => {
      try {
        const res = await fetch("/api/links");
        const data = await res.json();
        setLinks(data);
      } catch (err) {
        toast.error("Failed to fetch links");
      } finally {
        setLoading(false);
      }
    };
    loadLinks();
  }, []);

  // Create link
  async function createLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url) {
      toast.error("URL is required");
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create link");
        return;
      }

      toast.success("Short link created!");
      setUrl("");
      setCode("");
      fetchLinks();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setFormLoading(false);
    }
  }

  // Delete link
  async function deleteLink(shortCode: string) {
    try {
      const res = await fetch(`/api/links/${shortCode}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Link deleted");
        fetchLinks();
      } else {
        toast.error("Failed to delete link");
      }
    } catch (err) {
      toast.error("Error deleting link");
    }
  }

  // Copy to clipboard
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!");
  }

  // Reuse fetchLinks for refresh
  async function fetchLinks() {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      toast.error("Failed to fetch links");
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TinyLink Dashboard</h1>

      {/* CREATE FORM */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create a new short link</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createLink} className="flex gap-3 flex-col md:flex-row">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Input
              placeholder="custom-code (optional)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button disabled={formLoading}>
              {formLoading ? "Creating..." : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : links.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No links found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Last Clicked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((l) => (
                  <TableRow key={l.code}>
                    <TableCell>
                      <Badge
                        className="cursor-pointer"
                        onClick={() => copyToClipboard(`${window.location.origin}/${l.code}`)}
                      >
                        {l.code}
                      </Badge>
                    </TableCell>

                    <TableCell className="truncate max-w-xs">
                      <a href={l.url} target="_blank" className="text-blue-600 underline">
                        {l.url}
                      </a>
                    </TableCell>

                    <TableCell>{l.clicks}</TableCell>

                    <TableCell>
                      {l.lastClicked
                        ? new Date(l.lastClicked).toLocaleString()
                        : "Never"}
                    </TableCell>

                    <TableCell className="flex gap-3">
                      <a href={`/code/${l.code}`}>
                        <BarChart className="w-5 h-5 text-blue-600 cursor-pointer" />
                      </a>

                      <Copy
                        className="w-5 h-5 text-gray-600 cursor-pointer"
                        onClick={() => copyToClipboard(`${window.location.origin}/${l.code}`)}
                      />

                      <Trash2
                        className="w-5 h-5 text-red-600 cursor-pointer"
                        onClick={() => deleteLink(l.code)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
